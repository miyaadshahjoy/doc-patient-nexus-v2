const express = require('express');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');
const doctorRouter = require('./doctorRoutes');

const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');

const Patient = require('../models/patientModel');

const router = express.Router({ mergeParams: true });
router.use('/doctors', doctorRouter);

router.post('/forgot-password', authController.forgotPassword(Patient));
router.post(
  '/reset-password/:resetToken',
  authController.resetPassword(Patient),
);

router.post('/signup', authController.signup(Patient));
router.post('/signin', authController.signin(Patient));

router.get(
  '/me/email-verification',
  authController.protect(Patient),
  currentUserController.sendEmailVerification(Patient),
);

router.patch(
  '/me/email-verification/:token',
  authController.protect(Patient),
  currentUserController.verifyEmail(Patient),
);

router.use(checkAccountEligibility(Patient));
router.patch(
  '/me/password',
  authController.protect(Patient),
  currentUserController.updatePassword(Patient),
);
router.patch(
  '/me',
  authController.protect(Patient),
  currentUserController.updateCurrentUser(Patient),
);

router.delete(
  '/me',
  authController.protect(Patient),
  currentUserController.deleteCurrentUser(Patient),
);

module.exports = router;
