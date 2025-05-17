const AppError = require('./appError');

const formatTime = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

module.exports.generateAvailableTimeSlots = function (
  schedule,
  appointmentDuration,
) {
  const { from, to } = schedule.hours;
  if (!from || !to)
    throw new AppError('Schedule hours are missing or invalid', 500);

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
