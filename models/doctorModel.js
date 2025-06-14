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
      maxLength: [30, 'Full name must not exceed 30 characters'],
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
        message: 'Passwords do not match.',
      },
      select: false,
    },
    education: [
      {
        type: {
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
        required: [true, 'Education details are required'],
        validate: {
          validator: function (arr) {
            return arr.length > 0;
          },
          message: 'At least one education detail is required',
        },
      },
    ],
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

    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Average rating must be at least 1'],
      max: [5, 'Average rating must not exceed 5'],
    },
    numRating: {
      type: Number,
      default: 0,
    },
    // location: required

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function (coords) {
            return coords.length === 2; // Ensure it's a pair of coordinates
          },
          message: 'Coordinates must be an array of two numbers',
        },
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
    },

    visitingSchedule: {
      type: [
        {
          day: {
            type: String,
            enum: {
              values: [
                'saturday',
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
              ],
              message: 'Day must be a valid weekday',
            },

            trim: true,
            required: [true, 'Day is required in visiting schedule'],
          },
          hours: {
            from: {
              type: String, //HH:MM
              required: true,
            },
            to: {
              type: String, //HH:MM
              required: true,
            },
          },
        },
      ],
      validate: {
        validator: function (schedule) {
          const days = schedule.map((s) => s.day.toLowerCase());
          const hasDuplicateDays = new Set(days).size !== days.length;
          if (hasDuplicateDays) return false;
          const invalidTimeRange = schedule.some((s) => {
            const [fromHour, fromMin] = s.hours.from.split(':').map(Number);
            const [toHour, toMin] = s.hours.to.split(':').map(Number);

            const fromTotal = fromHour * 60 + fromMin;
            const toTotal = toHour * 60 + toMin;

            return fromTotal >= toTotal;
          });
          if (invalidTimeRange) return false;
          return true;
        },
        message:
          'Each day in the schedule must be unique and "from" time must be before "to" time.',
      },
      required: [true, 'Visiting schedule is required'],
    },

    appointmentDuration: {
      type: Number,
      default: 60, // in minutes
    },
    consultationFees: {
      type: Number,
      required: [true, 'Consultation fee is required.'],
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
      default: 'doctor',
      immutable: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    /////////////////////////////////////////////
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },
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
