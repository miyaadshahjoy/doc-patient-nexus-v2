const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { addInstanceMethods } = require('../utils/schemaUtil');

const doctorSchema = new mongoose.Schema(
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
        validator: function (el) {
          return this.password === el;
        },
        message: 'Passwords do not match',
      },
      select: false,
    },
    specialization: [
      {
        type: String,
        required: [true, 'At least one specialization is required'],
        trim: true,
      },
    ],
    experience: {
      type: Number,
      required: [true, 'Experience (in years) is required'],
    },
    education: [
      {
        degree: {
          type: String,
          trim: true,
          required: [true, 'Degree is required in education'],
        },
        institute: {
          type: String,
          trim: true,
          required: [true, 'Institute is required in education'],
        },
      },
    ],
    averageRating: {
      type: Number,
      required: [true, 'Average rating is required'],
      default: 4.5,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: {
          values: ['Point'],
          message: 'Location type must be "Point"',
        },
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Location coordinates are required'],
      },
      city: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
    visitingHours: [
      {
        day: {
          type: String,
          trim: true,
          required: [true, 'Day is required in visiting hours'],
        },
        hours: {
          from: {
            type: Date,
            required: true,
          },
          to: {
            type: Date,
            required: true,
          },
        },
      },
    ],
    availableDays: {
      type: [String],
      required: [true, 'Available days are required'],
    },
    consultationFees: {
      type: Number,
      required: [true, 'Consultation fee is required.'],
    },
    appointmentDuration: {
      type: Number,
      default: 60, // in minutes
    },
    role: {
      type: String,
      default: 'doctor',
      immutable: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    ///////////////////////////////////////////
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
  { timestamps: true },
);

doctorSchema.index({ location: '2dsphere' });

// instance methods
addInstanceMethods(doctorSchema);
// middlewares

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.isNew) this.passwordChangedAt = Date.now() - 1000;
  // Encrypt the password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

doctorSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ status: { $ne: 'removed' } });
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
