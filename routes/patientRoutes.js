const express = require('express');
const authController = require('../controllers/authController');
const handlerFactory = require('../controllers/handlerFactory');
const currentUserController = require('../controllers/currentUserController');

const appointmentRouter = require('./appointmentRoutes');

const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');

const doctorRouter = require('./doctorRoutes');
const Patient = require('../models/patientModel');

const router = express.Router({ mergeParams: true });

// POST /patients/doctors/{doctorId}/available-visiting-hours
// POST/patients/doctors/{doctorId}/book-appointment
router.use('/doctors', doctorRouter);

// patients/appointments/:id/cancel-appointment
// patients/appointments/:id/checkout-session
// POST/patients/appointments/{appointmentId}/reviews
router.use('/appointments', appointmentRouter);

router.post('/forgot-password', authController.forgotPassword(Patient));
router.post(
  '/reset-password/:resetToken',
  authController.resetPassword(Patient),
);

router.post('/signup', authController.signup(Patient));
router.post('/signin', authController.signin(Patient));

router.post(
  '/email-verification',
  authController.sendEmailVerification(Patient),
);

router.patch('/email-verification/:token', authController.verifyEmail(Patient));

// router.use(checkAccountEligibility(Patient));
router.patch(
  '/me/password',
  authController.protect(),
  checkAccountEligibility(Patient),
  currentUserController.updatePassword(Patient),
);
router.patch(
  '/me',
  authController.protect(),
  checkAccountEligibility(Patient),

  currentUserController.updateCurrentUser(Patient),
);

router.delete(
  '/me',
  authController.protect(),
  checkAccountEligibility(Patient),

  currentUserController.deleteCurrentUser(Patient),
);

// Get all patietns
// TODO: Add pagination, filtering, sorting and field selection
router.route('/').get(
  authController.protect(),
  checkAccountEligibility(),
  authController.restrictTo('admin', 'super-admin', 'doctor'),
  handlerFactory.readAll(Patient), // FIXME: virtual property age shows up even if not selected.
);

router
  .route('/:id')
  .get(
    authController.protect(),
    checkAccountEligibility(),
    authController.restrictTo('admin', 'super-admin', 'doctor'),
    handlerFactory.readOne(Patient),
  )
  .patch(
    authController.protect(),
    checkAccountEligibility(),
    authController.restrictTo('admin', 'super-admin', 'doctor'),
    handlerFactory.updateOne(Patient),
  )
  .delete(
    authController.protect(),
    checkAccountEligibility(),
    authController.restrictTo('admin', 'super-admin', 'doctor'),
    handlerFactory.deleteOne(Patient),
  );

module.exports = router;
