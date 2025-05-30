const express = require('express');
const handlerFactory = require('../controllers/handlerFactory');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const Patient = require('../models/patientModel');
const Review = require('../models/reviewModel');

const router = express.Router({ mergeParams: true });

router.post('/', authController.protect(Patient), reviewController.postReview);

router.get('/', handlerFactory.readAll(Review));

router.delete('/:id', handlerFactory.deleteOne(Review));

module.exports = router;
