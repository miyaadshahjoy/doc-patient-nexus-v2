const express = require('express');
const doctorController = require('../controllers/doctorController');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');
const appointmentController = require('../controllers/appointmentController');
const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

const router = express.Router();

router.get(
  '/doctors-within/:distance/center/:latlng/unit/:unit',
  doctorController.getDoctorsWithin, // Impl: Get doctors within a certain distance from a given location
);

router.post(
  '/:id/available-visiting-hours',
  authController.protect(Patient),
  appointmentController.checkVisitingHours,
);
router.post(
  '/:id/book-appointment',
  authController.protect(Patient),
  appointmentController.bookAppointment,
);

router
  .route('/')
  .get(doctorController.getDoctors) // Impl: Get all doctors document
  .post(doctorController.createDoctor); // Impl: Create doctor

router
  .route('/:id')
  .get(doctorController.getDoctor) // Impl: Get doctor by Id
  .patch(doctorController.updateDoctor) // Impl: Update doctor
  .delete(doctorController.deleteDoctor); // Impl: Delete doctor

router.post('/forgot-password', authController.forgotPassword(Doctor));
router.post(
  '/reset-password/:resetToken',
  authController.resetPassword(Doctor),
);

router.post('/signup', authController.signup(Doctor));
router.post('/signin', authController.signin(Doctor));

router.get(
  '/me/email-verification',
  authController.protect(Doctor),
  currentUserController.sendEmailVerification(Doctor),
);

router.patch(
  '/me/email-verification/:token',
  authController.protect(Doctor),
  currentUserController.verifyEmail(Doctor),
);

router.use(checkAccountEligibility(Doctor));
router.patch(
  '/me/password',
  authController.protect(Doctor),
  currentUserController.updatePassword(Doctor),
);
router.patch(
  '/me',
  authController.protect(Doctor),
  currentUserController.updateCurrentUser(Doctor),
);

router.delete(
  '/me',
  authController.protect(Doctor),
  currentUserController.deleteCurrentUser(Doctor),
);

module.exports = router;
