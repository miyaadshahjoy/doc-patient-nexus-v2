const express = require('express');
// const adminController = require('../controllers/adminController');
const handlerFactory = require('../controllers/handlerFactory');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword(Admin));

router.post('/reset-password/:resetToken', authController.resetPassword(Admin));

router.post('/signup', authController.signup(Admin));
router.post('/signin', authController.signin(Admin));

router.get(
  '/me/email-verification',
  authController.protect(Admin),
  currentUserController.sendEmailVerification(Admin),
);

router.patch(
  '/me/email-verification/:token',
  authController.protect(Admin),
  currentUserController.verifyEmail(Admin),
);

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

module.exports = router;
