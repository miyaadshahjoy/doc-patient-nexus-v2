const express = require('express');

const patientRecordController = require('../controllers/patientRecordController');
const authController = require('../controllers/authController');

const upload = require('../utils/multer');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(authController.protect('doctor'), patientRecordController.createRecord)
  .patch(
    authController.protect('doctor'),
    upload.single('record', 5),
    patientRecordController.uploadRecord,
  );

module.exports = router;
