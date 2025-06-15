const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

exports.postReview = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError('No review data provided', 400));
  const { review: reviewText, rating } = req.body;

  if (!reviewText || !rating)
    return next(new AppError('Please provide a review text and a rating', 400));

  const appointmentId = req.params.id;
  if (!appointmentId)
    return next(new AppError('Please provide a valid appointment Id', 404));

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment found with provided ID.', 404));

  if (!appointment.patient.equals(req.user._id))
    return next(
      new AppError('You are not allowed to post a review here.', 403),
    );

  if (appointment.status !== 'completed')
    return next(
      new AppError(
        'You can only post a review for completed appointments.',
        400,
      ),
    );

  // Create a session to handle transactions
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await Review.create(
      [
        {
          doctor: appointment.doctor,
          patient: appointment.patient,
          appointment: appointment._id,
          review: reviewText,
          rating,
        },
      ],
      { session },
    );

    // Update the doctor's average rating using a transaction in a static method
    await Review.calcAverageRating(appointment.doctor, session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      message: 'Review posted successfully',
      review: review[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(
      `❌ Failed to create review for appointment: ${appointmentId}`,
      err,
    );
    if (err.code === 11000)
      return next(
        new AppError(
          'You have already posted a review for this appointment.',
          400,
        ),
      );

    return next(
      new AppError(
        'Something went wrong while submitting your review. Please try again shortly or contact support.',
        500,
      ),
    );
  }
});
