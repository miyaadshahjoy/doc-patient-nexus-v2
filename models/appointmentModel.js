const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'Appointment must be assigned to a doctor'],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'Appointment must have a patient'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    appointmentSchedule: {
      type: {
        day: {
          type: String,
          required: true,
        },
        hours: {
          from: {
            type: String,
            required: [true, 'Provide schedule start time'],
          },
          to: {
            type: String,
            required: [true, 'Provide schedule end time'],
          },
        },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Please provide a reason for the appointment'],
    },
    notes: {
      type: String,
      trim: true,
    },
    consultationType: {
      type: String,
      enum: ['in-person', 'online'],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash'],
    },
  },
  { timestamps: true },
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
