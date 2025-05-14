const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

const generateJWT = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET_KEY);

exports.updatePassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    if (!currentPassword || !password || !passwordConfirm)
      return next(
        new AppError('Please provide current, new and confirm passwords', 400),
      );
    if (password === currentPassword)
      return next(
        new AppError('New password must be different from the current one.'),
      );
    // 1) Get user from the collection
    const user = await Model.findById(req.user._id).select('+password');
    if (!user)
      return next(new AppError('This user does not exist anymore', 400));

    // 2) Check if POSTED current password is correct
    if (!(await user.correctPassword(currentPassword)))
      return next(new AppError('Current password is incorrect', 400));
    // 3) If current password is correct update the password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();
    // 4) Log user in, send JWT
    const token = generateJWT(user._id, user.role);
    res.status(200).json({
      status: 'success',
      jwt: token,
      message: 'Password updated successfully',
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  });

exports.updateCurrentUser = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Block password updates through this route
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          'You cannot update your password through this route. Please use /update-password instead.',
          400,
        ),
      );
    // 2) Fields that should Not be updated by user
    const forbiddenFields = [
      'specialization',
      'experience',
      'education',
      'averageRating',
      'isVerified',
      'status',
      'role',
    ];
    // 3) Filter out forbidden fields from req.body
    const filteredBody = {};
    Object.keys(req.body).forEach((key) => {
      if (!forbiddenFields.includes(key)) {
        filteredBody[key] = req.body[key];
      }
    });
    forbiddenFields.forEach((field) => delete filteredBody[field]);
    // 3) Update user document
    const updatedUser = await Model.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser)
      return next(new AppError('No user exists with this ID', 404));

    res.status(200).json({
      status: 'success',
      message: 'User account updated successfully',
      data: {
        user: updatedUser,
      },
    });
  });

exports.deleteCurrentUser = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.user._id);
    if (!user) return next(new AppError('User does not exist', 400));
    user.status = 'removed';
    await user.save();
    res.status(204).json({
      status: 'success',
      message: 'Your account deleted successfully',
      data: null,
    });
  });

exports.sendEmailVerification = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.user._id);
    if (!user) return next(new AppError('The user does not exist', 400));
    if (user.emailVerified)
      return next(new AppError('Email is already verified', 400));
    console.log(user);
    const verificationToken = user.createEmailVerificationToken();
    await user.save({
      validateBeforeSave: false,
    });
    const url = `${process.env.FRONTEND_URL}/api/v2/doctors/me/verify-email/${verificationToken}`;
    const message = `Click on this link ${url} to verify your email`;
    const emailOptions = {
      to: user.email,
      subject: 'Email verification token (Expires in 10 minutes)',
      message,
    };
    try {
      await sendEmail(emailOptions);
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Please try after some time.',
          500,
        ),
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'Email sent successfully.',
    });
  });

exports.verifyEmail = (Model) =>
  catchAsync(async (req, res, next) => {
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await Model.findOne({
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user)
      return next(
        new AppError('Invalid or expired email verification token', 400),
      );
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully.',
    });
  });
