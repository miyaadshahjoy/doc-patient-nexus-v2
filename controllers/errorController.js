const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid value "${err.value}" for field "${err.path}"`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const [value] = Object.values(err.keyValue);
  const [field] = Object.keys(err.keyValue);
  const message = `Duplicate value "${value} for  field ${field}". You have to use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const { message } = err;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send error message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    //   1) Log error
    console.error('💥 Unhandled Error:', err);

    //   2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);
  else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    // Production error handling
    sendErrorProd(err, res);
  }
};
