const { DateTime } = require('luxon');
const Appointment = require('../models/appointmentModel');
const AppError = require('../utils/appError');

const formatTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const isValidDate = (date) => DateTime.fromFormat(date, 'yyyy-MM-dd').isValid;
// Generate all the time slots
const generateTimeSlots = (schedule, appointmentDuration) => {
  const { from, to } = schedule.hours;
  if (!from || !to) throw new AppError('Schedule hours are missing or invalid');

  const [startHour, startMin] = from.split(':').map(Number);
  const [endHour, endMin] = to.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const availableMinutes = endMinutes - startMinutes;
  if (availableMinutes < appointmentDuration)
    throw new AppError(
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

const getBookedSlots = async (doctor, date) => {
  const bookedApointments = await Appointment.find({
    doctor,
    appointmentDate: date,
  });

  const bookedSlots = bookedApointments.map((a) => [
    a.appointmentSchedule.hours.from,
    a.appointmentSchedule.hours.to,
  ]);
  return bookedSlots;
};

const getAvailableSlots = async (doctor, date) => {
  if (!isValidDate(date) || date < DateTime.now().toFormat('yyyy-MM-dd'))
    throw new AppError(
      'Invalid or passed date. Please provide a valid date',
      400,
    );

  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc').toLowerCase();

  const schedule = doctor.visitingSchedule.find((s) => s.day === dayOfWeek);
  if (!schedule)
    throw new AppError('Doctor is not available on the requested date', 400);

  const appointmentDuration = doctor.appointmentDuration || 60;

  const slots = generateTimeSlots(schedule, appointmentDuration);

  const bookedSlots = await getBookedSlots(doctor, date);

  const now = DateTime.now();

  // Turn booked slot pairs into a Set of "from-to" strings
  const bookedSet = new Set(bookedSlots.map(([from, to]) => `${from}-${to}`));

  const availableSlots = slots.filter((s) => {
    const slotKey = `${s.from}-${s.to}`;
    const isBooked = bookedSet.has(slotKey);
    let passedCurrentTime = false;
    const slotStartTime = DateTime.fromFormat(s.from, 'HH:mm').set({
      year: now.year,
      month: now.month,
      day: now.day,
    });

    const isToday = DateTime.fromISO(date).hasSame(now, 'day');
    if (isToday) passedCurrentTime = slotStartTime < now;

    return !isBooked && !passedCurrentTime;
  });

  return availableSlots;
};

module.exports = {
  generateTimeSlots,
  getBookedSlots,
  getAvailableSlots,
};
