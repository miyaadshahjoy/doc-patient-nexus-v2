const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');

const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.post(
  '/',
  authController.protect('doctor'),
  prescriptionController.createPrescription,
);

module.exports = router;
