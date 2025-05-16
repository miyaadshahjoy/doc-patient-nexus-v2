const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const WEEK_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const isValidISODate = (date) =>
  /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(date));

const formatTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

exports.checkVisitingHours = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const doctorId = req.params.id;
  if (!date) return next(new AppError('Please provide a date', 400));

  if (!isValidISODate(date)) {
    return next(new AppError('Date must be in YYYY-MM-DD format', 400));
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));

  const dayOfWeek = WEEK_DAYS[new Date(date).getDay()];

  const schedule = doctor.visitingSchedule.find((s) => s.day === dayOfWeek);
  if (!schedule)
    return next(
      new AppError('Doctor is not available on the requested date', 400),
    );

  const { from, to } = schedule.hours;
  if (!from || !to)
    return next(new AppError('Schedule hours are missing or invalid', 500));

  const appointmentDuration = doctor.appointmentDuration || 60;

  const [startHour, startMin] = from.split(':').map(Number);
  const [endHour, endMin] = to.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const availableMinutes = endMinutes - startMinutes;
  if (availableMinutes < appointmentDuration)
    return next(
      new AppError(
        'The appointment duration exceeds available visiting time',
        400,
      ),
    );

  const slots = Array.from(
    { length: Math.floor(availableMinutes / appointmentDuration) },
    (_, i) => {
      const slotStart = startMinutes + i * appointmentDuration;
      const slotEnd = slotStart + appointmentDuration - 1;
      return { from: formatTime(slotStart), to: formatTime(slotEnd) };
    },
  );

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
  req.body.doctor = req.params.id;
  req.body.patient = req.user._id;

  const appointment = await Appointment.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Appointment created successfully',
    data: {
      appointment,
    },
  });
});
