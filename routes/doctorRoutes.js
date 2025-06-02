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

// POST /doctors/patients/{patientId}/patient-records
router.use('/patients/:id/records', patientRecordRouter);

// doctors/appointments/:id/prescription
router.use('/appointments', appointmentRouter);

router.get(
  '/doctors-within/:distance/center/:latlng/unit/:unit',
  doctorController.getDoctorsWithin, // Impl: Get doctors within a certain distance from a given location
);

router.post(
  '/:id/available-visiting-hours',
  authController.protect('patient'),
  appointmentController.checkVisitingHours,
);
router.post(
  '/:id/book-appointment',
  authController.protect('patient'),
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

router.post(
  '/email-verification',
  authController.sendEmailVerification(Doctor),
);

router.patch('/email-verification/:token', authController.verifyEmail(Doctor));

router.use(checkAccountEligibility(Doctor));
router.patch(
  '/me/password',
  authController.protect('doctor'),
  currentUserController.updatePassword(Doctor),
);
router.patch(
  '/me',
  authController.protect('doctor'),
  currentUserController.updateCurrentUser(Doctor),
);

router.delete(
  '/me',
  authController.protect('doctor'),
  currentUserController.deleteCurrentUser(Doctor),
);

module.exports = router;
