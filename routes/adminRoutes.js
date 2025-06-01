const express = require('express');
// const adminController = require('../controllers/adminController');
const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');
const handlerFactory = require('../controllers/handlerFactory');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword(Admin));

router.post('/reset-password/:resetToken', authController.resetPassword(Admin));

router.post('/signup', authController.signup(Admin));
router.post('/signin', authController.signin(Admin));

router.get('/email-verification', authController.sendEmailVerification(Admin));

router.patch(
  '/email-verification/:token',

  authController.verifyEmail(Admin),
);
router.use(checkAccountEligibility(Admin));
router.patch(
  '/me/password',
  authController.protect(Admin),
  currentUserController.updatePassword(Admin),
);
router.patch(
  '/me',
  authController.protect(Admin),
  currentUserController.updateCurrentUser(Admin),
);

router.delete(
  '/me',
  authController.protect(Admin),
  currentUserController.deleteCurrentUser(Admin),
);

// Approve Doctor Accounts
router.patch(
  '/approve-doctors/:id',
  authController.protect(Admin),
  authController.restrictTo('admin'),
  handlerFactory.verifyAccount(Doctor),
);

// Approve Patient Accounts
router.patch(
  '/approve-patients/:id',
  authController.protect(Admin),
  authController.restrictTo('admin'),
  handlerFactory.verifyAccount(Patient),
);

module.exports = router;
