const express = require('express');
const doctorsController = require('../controllers/doctorsController');

const router = express.Router();

router
  .route('/')
  .get(doctorsController.getDoctors) // Impl: Get all doctors document
  .post(doctorsController.createDoctor); // Impl: Create doctor

router
  .route('/:id')
  .get(doctorsController.getDoctor) // Impl: Get doctor by Id
  .patch(doctorsController.updateDoctor) // Impl: Update doctor
  .delete(doctorsController.deleteDoctor); // Impl: Delete doctor

module.exports = router;
