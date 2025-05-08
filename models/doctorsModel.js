const mongoose = require('mongoose');
const validator = require('validator');

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: [1, 'Fullname must have atleast 1 character'],
      maxLength: [30, 'Fullname must not exceed 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: validator.isEmail,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'others', 'prefer not to say'],
      required: true,
      trim: true,
    },
    profilePhoto: String,
    password: {
      type: String,
      required: true,
      minLength: [8, 'Password must have atleast 8 characters'],
      select: false,
      trim: true,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: 'Passwords does not match',
      },
    },
    specialization: {
      type: [String],
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    education: [
      {
        degree: { type: String, trim: true },
        institute: { type: String, trim: true },
      },
    ],
    averageRating: {
      type: Number,
      required: true,
      default: 4.5,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      city: String,
      address: String,
    },
    visitingHours: [
      {
        day: { type: String, trim: true },
        hours: {
          from: Date,
          to: Date,
        },
      },
    ],
    availableDays: [String],
    consultationFees: {
      type: Number,
      required: true,
    },
    isVerified: Boolean,
    status: {
      type: String,
      enum: ['active', 'pending', 'removed'],
      default: 'pending',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: Date,
  },
  { timestamps: true },
);

doctorSchema.index({ location: '2dsphere' });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
