const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');

const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const generateJWT = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET_KEY);

// Impl: SIGN UP
exports.signup = (Model) =>
  catchAsync(async (req, res, next) => {
    const newUser = await Model.create(req.body);
    const token = generateJWT(newUser._id, newUser.role);
    res.status(201);
    res.json({
      status: 'success',
      jwt: token,
      data: {
        user: newUser,
      },
    });
  });

exports.signin = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Check if email and password exists
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError('Enter email and password to sign in', 400));
    // 2) Check if email exists and password is correct
    const [user] = await Model.find({ email }).select('+password');

    if (!user || !(await user.correctPassword(password)))
      return next(
        new AppError('Enter correct email and password to sign in', 400),
      );
    // 3) If everything is ok, return jwt token
    const token = generateJWT(user._id, user.role);
    res.status(200);
    res.json({
      status: 'success',
      jwt: token,
      data: {
        user,
      },
    });
  });
// Authentication
exports.protect = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Getting token and check if its there
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer'))
      return next(
        new AppError('Authentication token is missing or malformed.', 401),
      );
    // 2) Verification of token
    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return next(new AppError('Invalid or expired token.', 401));
    }

    if (decoded.role !== Model.modelName.toLowerCase())
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );

    // 3) Check if user still exists
    const user = await Model.findById(decoded.id);

    if (!user)
      return next(
        new AppError('The user associated with this token no longer exists'),
      );
    // 4) Check if user changed password after the token was issued
    if (user.passwordChangedAfter(decoded.iat))
      return next(
        new AppError(
          'Password was changed after the token was issued. Please sign in again.',
          401,
        ),
      );
    req.user = user;
    next();
  });

//   Authorization
exports.restrictTo =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    next();
  };

exports.forgotPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on the posted Email
    const { email } = req.body;
    if (!email) return next(new AppError('Please enter your email.', 400));
    const user = await Model.findOne({ email });
    // console.log(user)
    if (!user)
      return next(new AppError('No user exists with this email.', 400));

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send the reset token to users' email
    const options = {
      to: user.email,
      subject: 'Password reset token (Expires in 10 mins)',
      message: `
      You requested a password reset.\n\n
      Click the link below to reset your password. This link is valid for 10 minutes:\n
      ${process.env.FRONTEND_URL}/reset-password/${resetToken}\n\n
      If you didn’t request this, please ignore this email.
    `,
    };
    try {
      await sendEmail(options);

      res.status(200).json({
        status: 'success',
        message: 'Password reset token sent to your email.',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Please try again later.',
          500,
        ),
      );
    }
  });

exports.resetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm)
      return next(
        new AppError('Please provide password and passwordConfirm', 400),
      );
    if (password !== passwordConfirm)
      return next(new AppError('Passwords do not match', 400));
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // 1) Get user based on the token
    const user = await Model.findOne({ passwordResetToken });
    if (!user || user.passwordResetExpires < Date.now())
      return next(new AppError('Password reset token has expired', 400));
    // 2) If token has not expired, and there is user, set the new password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    // 3) Update changedPasswordAt property for the user
    user.passwordChangedAt = new Date();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // 4) Log the user in, send JWT
    const token = generateJWT(user._id, user.role);
    res.status(200).json({
      status: 'success',
      jwt: token,
      message: 'Password updated successfully.',
    });
  });
