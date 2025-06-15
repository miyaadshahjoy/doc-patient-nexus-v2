const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema(
  {
    // Parent referencing is changed to child referencing
    // patient: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Patient',
    //   unique: true,
    //   required: [true, 'Patient is required.'],
    // },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    conditions: [
      {
        type: String,
        trim: true,
      },
    ],
    surgeries: [
      {
        type: String,
        trim: true,
      },
    ],
    familyHistory: [
      {
        type: String,
        trim: true,
      },
    ],
    lifestyle: {
      badHabits: {
        type: [String],
        enum: ['smoking', 'alcohol', 'drugs'],
        default: [],
      },
      exercise: {
        type: String,
        enum: ['none', 'light', 'moderate', 'intense'],
      },
    },
    medications: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Prescription',
      },
    ],
    reports: [
      {
        title: {
          type: String,
          trim: true,
          required: [true, 'Report title is required.'],
        },
        fileUrl: {
          type: String,
          trim: true,
          required: [true, 'File URL is required in a report.'],
        },
        issuedBy: {
          type: String,
          trim: true,
          required: [true, 'Issued by is required in a report.'],
        },
        issuedOn: {
          type: Date,
          required: [true, 'IssuedOn is required in a report'],
        },
      },
    ],
  },
  { timestamps: true },
);

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;
