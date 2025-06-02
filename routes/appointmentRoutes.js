const express = require('express');
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');

const reviewRouter = require('./reviewRoutes');
const prescriptionRouter = require('./prescriptionRoutes');

const router = express.Router({ mergeParams: true });

router.use('/:id/reviews', reviewRouter);
// doctors/appointments/:id/prescription
router.use('/:id/prescription', prescriptionRouter);

router.get(
  '/:id/checkout-session',
  authController.protect('patient'),
  appointmentController.getCheckoutSession,
);

// Cancel Appointment
router.patch(
  '/:id/cancel-appointment',
  authController.protect('patient'),
  appointmentController.cancelAppointment,
);

module.exports = router;
