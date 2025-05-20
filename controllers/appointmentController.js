const { DateTime } = require('luxon');
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
