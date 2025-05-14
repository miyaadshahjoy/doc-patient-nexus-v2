const express = require('express');
const handlerFactory = require('../controllers/handlerFactory');
const authController = require('../controllers/authController');

const Admin = require('../models/adminModel');
const superAdminOnly = require('../middlewares/superAdminOnly');

const router = express.Router();

router.post('/signin', authController.signin(Admin));
router.patch(
  '/approve-admins/:id',
  authController.protect(Admin),
  superAdminOnly,
  handlerFactory.verifyAccount(Admin),
);

module.exports = router;
