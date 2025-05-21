const express = require('express');
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');
const Patient = require('../models/patientModel');

const router = express.Router();
router.get(
  '/:id/checkout-session',
  authController.protect(Patient),
  appointmentController.getCheckoutSession,
);

module.exports = router;
