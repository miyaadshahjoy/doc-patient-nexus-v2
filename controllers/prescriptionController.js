const Prescription = require('../models/prescriptionModel');
const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPrescription = catchAsync(async (req, res, next) => {
  const appointmentId = req.params.id;
  if (!appointmentId)
    return next(new AppError(' Appointment ID is required.', 400));
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(
      new AppError('No appointment found with the provided ID.', 404),
    );

  req.body.doctor = appointment.doctor;
  req.body.patient = appointment.patient;
  req.body.appointment = appointment._id;

  const newPrescription = await Prescription.create(req.body);
  if (!newPrescription) {
    return next(
      new AppError('Internal error. Failed to create prescription.', 500),
    );
  }

  res.status(201).json({
    status: `success`,
    message: 'Prescription created successfully.',
    data: {
      prescription: newPrescription,
    },
  });
});
