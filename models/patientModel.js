const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { addInstanceMethods } = require('../utils/schemaUtil');

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minLength: [1, 'Full name must contain atleast 1 character'],
      maxLength: [30, 'Fullname must not exceed 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others', 'prefer not to say'],
        message:
          'Gender must be either male, female, others, or prefer not to say',
      },
      required: [true, 'Gender is required'],
      trim: true,
    },
    profilePhoto: String,
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be atleast 8 characters long'],
      select: false,
      trim: true,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        /**
         * Validates if the provided element matches the password.
         *
         * @param {string} el - The element to be compared with the password.
         * @returns {boolean} True if the element matches the password, otherwise false.
         */
        validator: function (el) {
          return this.password === el;
        },
        message: 'Passwords do not match',
      },
      select: false,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'B+', 'O+', 'A-', 'B-', 'O-', 'AB+', 'AB-'],
        message:
          'Blood group must be one of these: A+, B+, O+, A-, B-, O-, AB+, AB-',
      },
      required: [true, 'Blood group is required'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    medicalHistory: [
      {
        type: String,
        trim: true,
      },
    ],
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    currentMedications: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: {
        city: {
          type: String,
          trim: true,
        },
        address: {
          type: String,
          trim: true,
        },
      },
      required: [true, 'Location is required.'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'pending', 'removed'],
        message: 'Status must be either active, pending, or removed.',
      },
      default: 'pending',
      trim: true,
    },
    role: {
      type: String,
      default: 'patient',
      immutable: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    }, //////////////////////////////////////////
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// virtual properties
patientSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  return (
    new Date(Date.now()).getFullYear() -
    new Date(this.dateOfBirth).getFullYear()
  );
});

// instance methods
addInstanceMethods(patientSchema);

// middlewares
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.isNew) this.passwordChangedAt = Date.now() - 1000;
  // Encrypt the password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

patientSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ status: { $ne: 'removed' } });
  next();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
