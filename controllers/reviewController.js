const Appointment = require('../models/appointmentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

exports.postReview = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError('No review data provided', 400));
  if (!req.body.review || !req.body.rating)
    return next(new AppError('Please provide a review and a rating', 400));

  const appointmentId = req.params.id;
  if (!appointmentId)
    return next(new AppError('Please provide a valid appointment Id', 404));

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment found with provided Id', 404));

  if (!appointment.patient.equals(req.user._id))
    return next(
      new AppError('You are not allowed to post a review here.', 403),
    );

  try {
    const review = await Review.create({
      doctor: appointment.doctor,
      patient: appointment.patient,
      appointment: appointment._id,
      review: req.body.review,
      rating: req.body.rating,
    });
    res.status(201).json({
      status: 'success',
      message: 'Review posted successfully',
      review,
    });
  } catch (err) {
    console.error('❌ Review was not created. Something went wrong.', err);
    return next(
      new AppError(
        'Review could not be posted at this time. Try again later.',
        500,
      ),
    );
  }
});
