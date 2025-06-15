const express = require('express');

const patientRecordController = require('../controllers/patientRecordController');
const authController = require('../controllers/authController');

const upload = require('../utils/multer');

const router = express.Router({ mergeParams: true });

// POST/doctors/patients/{patientId}/records
router
  .route('/')
  .post(
    authController.protect(),
    authController.restrictTo('doctor'),
    patientRecordController.createRecord,
  )
  // PATCH/doctors/patients/{patientId}/records
  .patch(
    authController.protect(),
    authController.restrictTo('doctor'),
    upload.single('record'),
    patientRecordController.uploadRecord,
  );

module.exports = router;
