const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const generateJWT = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET_KEY);

exports.getCurrentUser = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get logged in user id
    const userId = req.uer._id;
    if (!userId) return next(new AppError('No user found.', 404));
    // 2) Get user from the collection
    const user = await Model.findById(userId);
    if (!user)
      return next(new AppError('This user does not exist anymore', 400));
    if (user.status === 'removed')
      return next(new AppError('This user account has been deleted', 400));
    // 3) Send response
    const resourceName = Model.modelName;
    res.status(200).json({
      status: 'success',
      message: `${resourceName} account fetched successfully.`,
      [resourceName]: {
        user,
      },
    });
  });

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
      'gender',
      'specialization',
      'experience',
      'education',
      'averageRating',
      'isVerified',
      'status',
      'role',
    ];
    // 3) Filter out forbidden fields from req.body
    // TODO: Make this more efficient
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
      return next(new AppError('No user found with this ID.', 404));

    const resourceName = Model.modelName;
    res.status(200).json({
      status: 'success',
      message: 'User account updated successfully',
      data: {
        [resourceName]: updatedUser,
      },
    });
  });

exports.deleteCurrentUser = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.user._id);
    if (!user) return next(new AppError('User does not exist', 400));
    user.status = 'removed';
    await user.save();
    const resourceName = Model.modelName;
    res.status(204).json({
      status: 'success',
      message: ` ${resourceName} account deleted successfully.`,
      data: null,
    });
  });
