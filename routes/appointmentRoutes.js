const express = require('express');
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');
const Patient = require('../models/patientModel');
const reviewRouter = require('./reviewRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:id/reviews', reviewRouter);

router.get(
  '/:id/checkout-session',
  authController.protect(Patient),
  appointmentController.getCheckoutSession,
);

// Cancel Appointment
router.patch(
  '/:id/cancel-appointment',
  authController.protect(Patient),
  appointmentController.cancelAppointment,
);

module.exports = router;
