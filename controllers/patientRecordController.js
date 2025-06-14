const Patient = require('../models/patientModel');
const PatientRecord = require('../models/patientRecordModel');
const Prescription = require('../models/prescriptionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createRecord = catchAsync(async (req, res, next) => {
  // Check if patient ID is provided in the request parameters

  const patientId = req.params.id;
  if (!patientId) return next(new AppError('No patient ID provided.', 400));

  // Check if the request body is empty
  if (!req.body)
    return next(new AppError('No data found in request body.', 400));

  // TODO: Doctors who have no appointment with the patient should not be able to create a record.
  // Check if the user is a doctor and has permission to create a record for the patient

  const existingRecord = await PatientRecord.findOne({ patient: patientId });
  if (existingRecord)
    return next(new AppError('Record already exists for this patient.', 400));

  // Check if the patient exists
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient found with the provided ID.', 404));

  req.body.patient = patientId;
  const prescriptions = await Prescription.find({
    patient: patientId,
    status: 'active',
  });

  const medications = prescriptions.map((p) => p.medications).flat();

  const medicationsIds = medications.map((med) => med._id);
  req.body.medications = medicationsIds;

  const record = await PatientRecord.create(req.body);
  if (!record)
    return next(new AppError('Internal error. Failed to create record.', 500));

  res.status(201).json({
    status: 'success',
    message: 'Patient record created successfully.',
    data: {
      record,
    },
  });
});

exports.uploadRecord = catchAsync(async (req, res, next) => {
  // Check if files are uploaded
  if (!req.file) {
    return next(new AppError('No files uploaded.', 400));
  }
  console.log(req.body);
  if (
    !req.body ||
    !req.body.title ||
    !req.body.issuedBy ||
    !req.body.issuedOn
  ) {
    return next(new AppError('Missing required fields in request body.', 400));
  }
  const patientId = req.params.id;

  if (!patientId) {
    return next(new AppError('No patient ID provided.', 400));
  }
  // Check if the patient exists
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient found with the provided ID.', 404));
  const existingRecord = await PatientRecord.findOne({ patient: patient._id });
  if (!existingRecord)
    return next(new AppError('No record found for this patient.', 404));
  // Add the uploaded file path to the record
  existingRecord.reports.push({
    title: req.body.title,
    fileUrl: req.file.filename,
    issuedBy: req.body.issuedBy,
    issuedOn: req.body.issuedOn,
  });
  const record = await existingRecord.save();

  res.status(201).json({
    status: 'success',
    message: 'Report uploaded successfully.',
    data: {
      record,
    },
  });
});
