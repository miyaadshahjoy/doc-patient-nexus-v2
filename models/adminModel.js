const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minLength: [1, 'Full name must contain atleast 1 character'],
      maxLength: [30, 'Fullname must not excedd 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address.'],
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
    role: {
      type: String,
      enum: ['admin', 'super-admin'],
      default: 'admin',
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

// instance methods
adminSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.passwordChangedAfter = function (iat) {
  // console.log(this.passwordChangedAt.getTime() / 1000, iat);
  return this.passwordChangedAt.getTime() / 1000 > iat + 1;
};

adminSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
adminSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
  return verificationToken;
};
// middlewares

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.isNew) this.passwordChangedAt = Date.now() - 1000;
  // Encrypt the password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

adminSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ status: { $ne: 'removed' } });
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
