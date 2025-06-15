const express = require('express');
const doctorController = require('../controllers/doctorController');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');
const appointmentController = require('../controllers/appointmentController');
const appointmentRouter = require('./appointmentRoutes');
const patientRecordRouter = require('./patientRecordRoutes');

const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');
const Doctor = require('../models/doctorModel');

const router = express.Router({ mergeParams: true });

// POST /doctors/patients/{patientId}/records
// PATCH/doctors/patients/{patientId}/records
router.use('/patients/:id/records', patientRecordRouter);

// POST/doctors/appointments/{patientId}/prescription
router.use('/appointments', appointmentRouter);

router.get(
  '/doctors-within/:distance/center/:latlng/unit/:unit',
  doctorController.getDoctorsWithin, // Impl: Get doctors within a certain distance from a given location
);

// POST /patients/doctors/{doctorId}/available-visiting-hours
router.post(
  '/:id/available-visiting-hours',
  authController.protect('patient'),
  appointmentController.checkVisitingHours,
);

// POST/patients/doctors/{doctorId}/book-appointment
router.post(
  '/:id/book-appointment',
  authController.protect('patient'),
  appointmentController.bookAppointment,
);

router.post('/forgot-password', authController.forgotPassword(Doctor));
router.post(
  '/reset-password/:resetToken',
  authController.resetPassword(Doctor),
);

router.post('/signup', authController.signup(Doctor));
router.post('/signin', authController.signin(Doctor));

router.post(
  '/email-verification',
  authController.sendEmailVerification(Doctor),
);

router.patch('/email-verification/:token', authController.verifyEmail(Doctor));

//

router.patch(
  '/me/password',
  authController.protect('doctor'),
  checkAccountEligibility(Doctor),
  currentUserController.updatePassword(Doctor),
);
router.patch(
  '/me',
  authController.protect('doctor'),
  checkAccountEligibility(Doctor),
  currentUserController.updateCurrentUser(Doctor),
);

router.delete(
  '/me',
  authController.protect('doctor'),
  checkAccountEligibility(Doctor),
  currentUserController.deleteCurrentUser(Doctor),
);

router
  .route('/')
  .get(doctorController.getDoctors) // Impl: Get all doctors document
  .post(doctorController.createDoctor); // Impl: Create doctor

router
  .route('/:id')
  .get(doctorController.getDoctor) // Impl: Get doctor by Id
  .patch(
    authController.protect(),
    checkAccountEligibility(),
    authController.restrictTo('admin', 'super-admin'),
    doctorController.updateDoctor,
  ) // Impl: Update doctor
  .delete(
    authController.protect(),
    checkAccountEligibility(),
    authController.restrictTo('admin', 'super-admin'),
    doctorController.deleteDoctor,
  ); // Impl: Delete doctor

module.exports = router;
