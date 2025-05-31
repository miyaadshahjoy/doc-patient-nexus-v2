const mongoose = require('mongoose');
const Doctor = require('./doctorModel');

const reviewSchema = mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor ID is required'],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient ID is required'],
    },
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment ID is required'],
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters long'],
      maxlength: [500, 'Review must not exceed 500 characters.'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must not exceed 5'],
    },
    reply: {
      type: String,
      trim: true,
      maxlength: [500, 'Reply must not exceed 500 characters.'],
      default: '',
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['flagged', 'deleted', 'visible'],
      default: 'visible',
    },
  },
  { timestamps: true },
);

reviewSchema.statics.calcAverageRating = async function (doctorId, session) {
  if (!doctorId) {
    console.error('❌ Doctor ID is required to calculate average rating.');
    return;
  }
  const [aggregatedObj] = await this.aggregate([
    {
      $match: {
        doctor: doctorId,
      },
    },
    {
      $group: {
        _id: '$doctor',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ])
    .session(session) // Using session for transaction support
    .exec(); // Using exec() to ensure the query is executed

  // updating the doctors' document in DB
  try {
    const doctor = await Doctor.findById(doctorId).session(session);
    if (!doctor) {
      console.error('❌ Doctor not found with ID: ', doctorId);
      return;
    }
    if (!aggregatedObj) {
      doctor.averageRating = 4.5; // default rating
      doctor.numRating = 0;
      console.error('❌ No reviews found for the doctor with ID:', doctorId);
    } else {
      const { avgRating, numRating } = aggregatedObj;

      doctor.averageRating = Math.round(avgRating * 10) / 10; // rounding to one decimal place
      doctor.numRating = numRating;
    }

    await doctor.save({ session });
    console.log('✅ Doctor rating updated successfully:', doctor.averageRating);
  } catch (err) {
    console.error('❌ Error updating doctor rating:', err.message);
  }
};

reviewSchema.index({ doctor: 1, patient: 1, appointment: 1 }, { unique: true }); // Adding a compound index to optimize queries for reviews by doctor and patient

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
