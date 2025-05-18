const { DateTime } = require('luxon');
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const isValidDate = (date) => DateTime.fromFormat(date, 'yyyy-MM-dd').isValid;

const formatTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// Generate all the time slots
const generateTimeSlots = (schedule, appointmentDuration) => {
  const { from, to } = schedule.hours;
  if (!from || !to) throw new Error('Schedule hours are missing or invalid');

  const [startHour, startMin] = from.split(':').map(Number);
  const [endHour, endMin] = to.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const availableMinutes = endMinutes - startMinutes;
  if (availableMinutes < appointmentDuration)
    throw new Error(
      'The appointment duration exceeds available visiting time',
      400,
    );

  const slots = Array.from(
    { length: Math.floor(availableMinutes / appointmentDuration) },
    (_, i) => {
      const slotStart = startMinutes + i * appointmentDuration;
      const slotEnd = slotStart + appointmentDuration - 1;
      return { from: formatTime(slotStart), to: formatTime(slotEnd) };
    },
  );
  return slots;
};

const getBookedSlots = async (date) => {
  const bookedApointments = await Appointment.find({ appointmentDate: date });

  // Checking the booked appointments schedule

  const bookedSlots = bookedApointments.map((a) => [
    a.appointmentSchedule.hours.from,
    a.appointmentSchedule.hours.to,
  ]);
  return bookedSlots;
};

const getAvailableSlots = (slots, bookedSlots) => {
  const now = DateTime.now();

  // Turn booked slot pairs into a Set of "from-to" strings
  const bookedSet = new Set(bookedSlots.map(([from, to]) => `${from}-${to}`));

  return slots.filter((s) => {
    const slotKey = `${s.from}-${s.to}`;
    const isBooked = bookedSet.has(slotKey);

    const slotStartTime = DateTime.fromFormat(s.from, 'HH:mm').set({
      year: now.year,
      month: now.month,
      day: now.day,
    });

    const passedCurrentTime = slotStartTime < now;

    return !isBooked && !passedCurrentTime;
  });
};

exports.checkVisitingHours = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const doctorId = req.params.id;
  if (!date) return next(new AppError('Please provide a date', 400));

  if (!isValidDate(date) || date < DateTime.now().toFormat('yyyy-MM-dd'))
    return next(
      new AppError('Invalid or passed date. Please provide a valid date', 400),
    );

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

  const slots = generateTimeSlots(schedule, appointmentDuration);

  const bookedSlots = await getBookedSlots(date);
  const availableSlots = getAvailableSlots(slots, bookedSlots);

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

  if (!isValidDate(date) || date < DateTime.now().toFormat('yyyy-MM-dd'))
    return next(
      new AppError('Invalid or passed date. Please provide a valid date', 400),
    );

  // const dayOfWeek = WEEK_DAYS[new Date(date).getDay()];
  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc').toLowerCase();

  const schedule = doctor.visitingSchedule.find((s) => s.day === dayOfWeek);
  if (!schedule)
    return next(
      new AppError('Doctor is not available on the requested date', 400),
    );
  const appointmentDuration = doctor.appointmentDuration || 60;

  const slots = generateTimeSlots(schedule, appointmentDuration);

  const bookedSlots = await getBookedSlots(date);
  const availableSlots = getAvailableSlots(slots, bookedSlots);

  const requestedSlot = req.body.appointmentSchedule;
  if (!requestedSlot?.hours?.from || !requestedSlot?.hours?.to) {
    return next(new AppError('Invalid appointment schedule provided', 400));
  }

  const isSlotAvailable = availableSlots.some(
    (s) =>
      s.from === requestedSlot.hours.from && s.to === requestedSlot.hours.to,
  );
  // console.log(isSlotAvailable);
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
