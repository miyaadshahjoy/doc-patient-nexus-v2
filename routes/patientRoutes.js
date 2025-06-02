const express = require('express');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');

const appointmentRouter = require('./appointmentRoutes');

const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');

const doctorRouter = require('./doctorRoutes');
const Patient = require('../models/patientModel');

const router = express.Router({ mergeParams: true });

// patients/doctors/:id/book-appointment
// patients/doctors/:id/available-visiting-hours

router.use('/doctors', doctorRouter);

// patients/appointments/:id/cancel-appointment
// patients/appointments/:id/checkout-session
router.use('/appointments', appointmentRouter);

router.post('/forgot-password', authController.forgotPassword(Patient));
router.post(
  '/reset-password/:resetToken',
  authController.resetPassword(Patient),
);

router.post('/signup', authController.signup(Patient));
router.post('/signin', authController.signin(Patient));

router.get(
  '/email-verification',

  authController.sendEmailVerification(Patient),
);

router.patch(
  '/email-verification/:token',

  authController.verifyEmail(Patient),
);

router.use(checkAccountEligibility(Patient));
router.patch(
  '/me/password',
  authController.protect('patient'),
  currentUserController.updatePassword(Patient),
);
router.patch(
  '/me',
  authController.protect('patient'),
  currentUserController.updateCurrentUser(Patient),
);

router.delete(
  '/me',
  authController.protect('patient'),
  currentUserController.deleteCurrentUser(Patient),
);

module.exports = router;
