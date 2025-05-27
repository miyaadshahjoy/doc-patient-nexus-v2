const email = require('../utils/email');
const { DateTime } = require('luxon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getAvailableSlots } = require('../services/appointmentService');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.checkVisitingHours = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const doctorId = req.params.id;
  if (!date) return next(new AppError('Please provide a date', 400));

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));

  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc').toLowerCase();
  const availableSlots = await getAvailableSlots(doctor, date);

  res.status(200).json({
    status: 'success',
    message: 'Available visiting time slots retrieved successfully',
    data: {
      date,
      visitingDay: dayOfWeek,
      visitingHours: availableSlots,
    },
  });
});

// Booking appointments
exports.bookAppointment = catchAsync(async (req, res, next) => {
  const doctorId = req.params.id;
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));
  req.body.doctor = doctor._id;

  const patientId = req.user._id;
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient exists with this Id', 404));

  req.body.patient = patient._id;

  const date = req.body.appointmentDate;

  const availableSlots = await getAvailableSlots(doctor, date);

  const requestedSlot = req.body.appointmentSchedule;
  if (!requestedSlot?.hours?.from || !requestedSlot?.hours?.to) {
    return next(new AppError('Invalid appointment schedule provided', 400));
  }
  const isSlotAvailable = availableSlots.some(
    (s) =>
      s.from === requestedSlot.hours.from && s.to === requestedSlot.hours.to,
  );

  if (!isSlotAvailable)
    return next(
      new AppError(
        'Requested appointment schedule is not available. Request for a different time slot',
        400,
      ),
    );
  const appointment = await Appointment.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Appointment created successfully',
    data: {
      appointment,
    },
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked appointment
  const appointmentId = req.params.id;
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment is booked with this Id', 404));
  const doctor = await Doctor.findById(appointment.doctor);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));

  if (appointment.paymentStatus === 'paid')
    return next(
      new AppError('This appointment has already been paid for', 400),
    );
  // 2) Create checkout session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: req.user.email,
    client_reference_id: appointment._id.toString(),
    line_items: [
      {
        price_data: {
          currency: 'BDT',
          product_data: {
            name: `An appointment with Dr. ${doctor.fullName}`,
            images: [
              'https://t3.ftcdn.net/jpg/05/04/25/70/360_F_504257032_jBtwqNdvdMN9Xm6aDT0hcvtxDXPZErrn.jpg',
            ],
          },
          unit_amount: doctor.consultationFees * 100,
        },
        quantity: 1,
      },
    ],

    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: 'http://localhost:3000',
  });
  // 3) Send session as response
  res.status(200).json({
    status: 'success',
    data: {
      session,
    },
  });
});

exports.stripeWebhookHandler = async (req, res, next) => {
  let event;
  try {
    // 1) Verify the stripe signature
    const signature = req.headers['stripe-signature'];
    // 2) Create Event
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);

    console.log(`🎉 Stripe event received. Event: ${event.type}`);
  } catch (err) {
    console.error('❌ Stripe signature verification failed:', err.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid stripe webhook signature',
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.client_reference_id;

    console.log(`✅ Payment succeeded for appointment: ${appointmentId}`);

    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        console.warn(`❌ No appointment found with Id: ${appointmentId}`);
        return res.status(404).json({
          status: 'fail',
          message: 'Appointment not found in the database.',
        });
      }

      appointment.paymentStatus = 'paid';
      appointment.paymentMethod = session.payment_method_types[0] || 'unknown';
      appointment.paymentIntent = session.payment_intent;
      await appointment.save();
      console.log(`🥳 Appointment updated successfully.`);
    } catch (err) {
      console.error(`❌ Failed to update appointment.`, err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal error while updating the appointment status',
      });
    }
  }
  res.status(200).json({
    status: 'success',
    message: 'Webhook received and processed.',
  });
};

exports.cancelAppointment = catchAsync(async (req, res, next) => {
  // 1) Check if the appointment exists with the id
  const appointmentId = req.params.id;
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment exists with this Id', 404));
  // 2) Check if the doctor exists in the DB
  const doctor = await Doctor.findById(appointment.doctor);
  if (!doctor)
    return next(
      new AppError(
        `The doctor assigned to this appointment doesn't exist anymore`,
        404,
      ),
    );
  // 3) Check if the patient exists in the DB

  if (!appointment.patient.equals(req.user._id))
    return next(
      new AppError('You are not authorized to perform this action', 401),
    );
  const patient = await Patient.findById(appointment.patient);
  if (!patient)
    return next(
      new AppError(
        'The patient who booked this appointment does not exist anymore',
        404,
      ),
    );
  // 4) Check if appointment is already cancelled
  if (appointment.status === 'cancelled')
    return next(new AppError('Appointment is already cancelled', 400));
  // 5) Check if appointment is already completed

  if (appointment.status === 'completed')
    return next(new AppError('Appointment is already completed', 400));
  // 6) Check if appointment is confirmed or pending
  if (appointment.status === 'confirmed') {
    // a) check if it is <= 24 hours before the appointment time
    const _24HoursInMillis = 24 * 60 * 60 * 1000;
    console.log(appointment.appointmentDate, new Date(Date.now()));
    if (appointment.appointmentDate.getTime() - Date.now() < _24HoursInMillis)
      return next(
        new AppError(
          'You must cancel the appointment before 24 hours to the appointment time',
          400,
        ),
      );
  }
  // b) Allow cancellation
  // b.1) Trigger refund
  const refund = await stripe.refunds.create({
    payment_intent: appointment.paymentIntent,
  });
  console.log(refund);
  if (refund.status !== 'succeeded')
    return next(new AppError('Refund failed. Try again later', 500));

  // b.2) Notify doctors and patients via email

  try {
    await email({
      to: patient.email,
      subject: 'Appointment payment refund ',
      message: `Hello ${patient.fullName}. Your request for payment refund has been initiated successfully. It might take few days for the refund process to complete.`,
    });
    await email({
      to: doctor.email,
      subject: `Patient requested appointment cancellation`,
      message: `Hello Dr. ${doctor.fullName}. ${patient.fullName} requested to cancel the appointment on ${appointment.appointmentDate} at ${appointment.appointmentSchedule.hours.from} to ${appointment.appointmentSchedule.hours.to}. The request is accepted and a full refund is initiated successfully`,
    });
  } catch (err) {
    throw new Error('Could not send message at this time.', 500);
  }
  // b.3) Mark booked slot as available
  // when the appointment status is updated to cancelled the booked slot will be available automatically

  // b.4) Update appointment status to 'cancelled' in DB
  try {
    appointment.status = 'cancelled';
    await appointment.save();
  } catch (err) {
    throw new Error(
      'Internal error. Appointment status could not be updated.',
      500,
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Appointment cancellation successful',
  });
});
