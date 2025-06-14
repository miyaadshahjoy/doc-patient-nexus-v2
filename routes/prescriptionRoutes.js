const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');

const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST/doctors/appointments/{appointmentId}/prescription
router.post(
  '/',
  authController.protect(),
  prescriptionController.createPrescription,
);

module.exports = router;
