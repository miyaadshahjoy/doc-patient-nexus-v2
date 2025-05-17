const { DateTime } = require('luxon');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const {
  generateAvailableTimeSlots,
} = require('../utils/generateAvailableTimeSlots');

/*
const WEEK_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
*/

exports.checkVisitingHours = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const doctorId = req.params.id;
  if (!date) return next(new AppError('Please provide a date', 400));

  if (!DateTime.fromFormat(date, 'yyyy-MM-dd').isValid)
    return next(new AppError('Invalid date. Please provide a valid date', 400));

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));

  // const dayOfWeek = WEEK_DAYS[new Date(date).getDay()];
  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc').toLowerCase();

  const schedule = doctor.visitingSchedule.find((s) => s.day === dayOfWeek);
  if (!schedule)
    return next(
      new AppError('Doctor is not available on the requested date', 400),
    );
  const appointmentDuration = doctor.appointmentDuration || 60;
  const slots = generateAvailableTimeSlots(schedule, appointmentDuration);

  ///////////////////////////////////////////////////////
  // checking for already booked appointments on the same date

  const bookedApointments = await Appointment.find({ appointmentDate: date });

  // Checking the booked appointments schedule
  const bookedSchedules = bookedApointments.map((a) => [
    a.appointmentSchedule.hours.from,
    a.appointmentSchedule.hours.to,
  ]);
  // FIXME: Time complexity O(n*n) -> Optimize the method here
  const filteredSlots = slots.filter((s) => {
    const isBooked = bookedSchedules.some(
      ([f, t]) => f === s.from && t === s.to,
    );
    return !isBooked;
  });

  res.status(200).json({
    status: 'success',
    message: 'Available visiting time slots retrieved successfully',
    data: {
      date,
      visitingDay: dayOfWeek,
      visitingHours: filteredSlots,
    },
  });
});

exports.bookAppointment = catchAsync(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));
  req.body.doctor = doctor._id;

  const patient = await Patient.findById(req.user._id);
  if (!patient)
    return next(new AppError('No patient exists with this Id', 404));
  req.body.patient = patient._id;

  const date = req.body.appointmentDate;

  // const dayOfWeek = WEEK_DAYS[new Date(date).getDay()];
  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc').toLowerCase();

  const schedule = doctor.visitingSchedule.find((s) => s.day === dayOfWeek);
  if (!schedule)
    return next(
      new AppError('Doctor is not available on the requested date', 400),
    );
  const appointmentDuration = doctor.appointmentDuration || 60;
  const slots = generateAvailableTimeSlots(schedule, appointmentDuration);

  // checking for already booked appointments on the same date

  const bookedApointments = await Appointment.find({ appointmentDate: date });

  // Checking the booked appointments schedule
  const bookedSchedules = bookedApointments.map((a) => [
    a.appointmentSchedule.hours.from,
    a.appointmentSchedule.hours.to,
  ]);

  const filteredSlots = slots.filter((s) => {
    const isBooked = bookedSchedules.some(
      ([f, t]) => f === s.from && t === s.to,
    );
    return !isBooked;
  });
  const requestedSchedule = req.body.appointmentSchedule;

  console.log(filteredSlots, requestedSchedule);

  const slotsAvailable = filteredSlots.some(
    (s) =>
      s.from === requestedSchedule.hours.from &&
      s.to === requestedSchedule.hours.to,
  );
  if (!slotsAvailable)
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
