const { DateTime } = require('luxon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getAvailableSlots } = require('../services/appointmentService');

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
    client_reference_id: appointmentId,
    line_items: [
      {
        price_data: {
          currency: 'BDT',
          product_data: {
            name: `An appointment with Dr. ${doctor.fullName}`,
            images: [
              'https://videos.openai.com/vg-assets/assets%2Ftask_01jvrtc4m4f609w8c2p9c06398%2F1747810997_img_0.webp?st=2025-05-21T05%3A31%3A58Z&se=2025-05-27T06%3A31%3A58Z&sks=b&skt=2025-05-21T05%3A31%3A58Z&ske=2025-05-27T06%3A31%3A58Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=4Zfi2cct7eDMQruVDr7wDWIqR2PdoKtdFXIaOzxdLzQ%3D&az=oaivgprodscus',
            ],
          },
          unit_amount: doctor.consultationFees * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get(
      'host',
    )}/?appointmentId=${appointmentId}`,
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
