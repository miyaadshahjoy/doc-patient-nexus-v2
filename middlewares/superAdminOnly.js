const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  const isSuperAdmin =
    req.user.role === 'super-admin' &&
    req.user.email === process.env.SUPER_ADMIN_EMAIL;
  if (!isSuperAdmin) {
    return next(
      new AppError(
        'Access denied. Only the Super Admin can perform this action',
        403,
      ),
    );
  }
  next();
};
