const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Medication must have a name.'],
  },
  dosage: {
    type: String,
    trim: true,

    required: [true, 'Medication must have dosage.'],
  },
  frequency: {
    type: String,
    trim: true,

    required: [true, 'Medication must have frequency'],
  },
  duration: {
    type: Number, // in days
    required: [true, 'Medication must have a duraion'],
    min: [1, 'Duration must be atleast 1 day'],
  },
  instruction: {
    type: String,
    trim: true,
  },
});
const prescriptionSchema = mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required.'],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient is required.'],
    },
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment is required.'],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'expired', 'deleted'],
        message: 'Status must be "active", "expired", or "deleted" ',
      },
      default: 'active',
    },
    medications: {
      type: [medicationSchema],
      validate: {
        validator: function (el) {
          return el.length > 0;
        },
        message: 'Prescription must have atleast one medication.',
      },
    },
  },
  {
    timestamps: true,
    toObjects: { virtuals: true },
    toJSON: { virtuals: true },
  },
);
prescriptionSchema.index(
  { doctor: 1, patient: 1, appointment: 1 },
  { unique: true },
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
