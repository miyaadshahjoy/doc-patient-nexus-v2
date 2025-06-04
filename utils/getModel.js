const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const AppError = require('./appError');

module.exports = (userRole) => {
  let Model;
  switch (userRole) {
    case 'admin':
      Model = Admin;
      break;
    case 'doctor':
      Model = Doctor;
      break;
    case 'patient':
      Model = Patient;
      break;
    default:
      throw new AppError('Invalid user role provided.', 400);
  }
  return Model;
};
