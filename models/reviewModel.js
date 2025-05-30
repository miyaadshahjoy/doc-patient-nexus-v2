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

reviewSchema.statics.calcAverageRating = async function (doctorId) {
  if (!doctorId) {
    console.error('❌ Doctor ID is missing in the review document.');
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
  ]);

  // updating the doctors' document in DB
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      console.error('❌ Doctor not found with ID:', doctorId);
      return;
    }
    if (!aggregatedObj) {
      doctor.averageRating = 4.5; // default rating
      doctor.numRating = 0;
      console.error('❌ No reviews found for the doctor with ID:', doctorId);
    } else {
      const { avgRating, numRating } = aggregatedObj;

      doctor.averageRating = avgRating;
      doctor.numRating = numRating;
    }

    await doctor.save();
    console.log('✅ Doctor rating updated successfully:', doctor.averageRating);
  } catch (err) {
    console.error('❌ Error updating doctor rating:', err);
  }
};

reviewSchema.post('save', async function () {
  this.constructor.calcAverageRating(this.doctor);
});

reviewSchema.post(/^findOneAnd/, async (doc) => {
  doc.constructor.calcAverageRating(doc.doctor);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
