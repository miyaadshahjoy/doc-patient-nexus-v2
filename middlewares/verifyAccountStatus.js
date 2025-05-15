const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.checkAccountEligibility = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.user._id);
    if (!user) return next(new AppError("User doesn't exist.", 404));

    if (!user.emailVerified)
      return next(
        new AppError(
          'Please verify your email before accessing the system',
          401,
        ),
      );
    if (!user.isVerified)
      return next(
        new AppError('Your account is pending approval by an admin', 403),
      );
    if (user.status === 'pending')
      return next(new AppError('Your account is still under review', 403));
    if (user.status === 'removed')
      return next(
        new AppError(
          'Your account has been removed. Please contact support',
          403,
        ),
      );
    next();
  });
