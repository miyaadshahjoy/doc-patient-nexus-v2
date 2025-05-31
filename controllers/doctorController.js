const Doctor = require('../models/doctorModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlers = require('./handlerFactory');

exports.createDoctor = handlers.createOne(Doctor);
exports.getDoctors = handlers.readAll(Doctor);
exports.getDoctor = handlers.readOne(Doctor);
exports.updateDoctor = handlers.updateOne(Doctor);
exports.deleteDoctor = handlers.deleteOne(Doctor);

// Find doctors within a certain distance from a given location
exports.getDoctorsWithin = catchAsync(async (req, res, next) => {
  if (!req.params.distance || !req.params.latlng || !req.params.unit) {
    return next(new AppError('Please provide distance, latlng and unit', 400));
  }
  const { distance, latlng, unit } = req.params;

  if (!['mi', 'km'].includes(unit))
    return next(new AppError('Unit must be either "mi" or "km"', 400));
  const earthRadius = unit === 'mi' ? 3963.1 : 6378;

  const radius = Number.parseFloat(distance) / earthRadius;
  if (Number.isNaN(radius) || radius <= 0)
    return next(new AppError('Invalid distance provided.', 400));

  if (!latlng.includes(',') || latlng.split(',').length !== 2)
    return next(
      new AppError('Please provide valid latlng in format lat,lng', 400),
    );

  const [lat, lng] = latlng.split(',').map(Number);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return next(
      new AppError('Please provide valid latitude and longitude', 400),
    );
  }

  const doctors = await Doctor.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });
  res.status(200).json({
    status: 'success',
    message: 'Doctors found within specified distance.',
    resutls: doctors.length,
    data: {
      doctors,
    },
  });
});
