const Prescription = require('../models/prescriptionModel');
const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Patient = require('../models/patientModel');

exports.createPrescription = catchAsync(async (req, res, next) => {
  const appointmentId = req.params.id;

  if (!appointmentId)
    return next(new AppError(' Appointment ID is required.', 400));
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(
      new AppError('No appointment found with the provided ID.', 404),
    );
  if (appointment.isPrescribed)
    return next(
      new AppError('Prescription already exists for this appointment.', 400),
    );

  req.body.doctor = appointment.doctor;
  // req.body.patient = appointment.patient;
  req.body.appointment = appointment._id;
  const patient = await Patient.findById(appointment.patient);

  const newPrescription = await Prescription.create(req.body);
  if (!newPrescription) {
    return next(
      new AppError('Internal error. Failed to create prescription.', 500),
    );
  }

  // Add the prescription ID to the patient
  try {
    patient.prescriptions.push(newPrescription._id);
    await patient.save();
  } catch (error) {
    return next(
      new AppError(
        'Internal error. Failed to add prescription to patient.',
        500,
      ),
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
