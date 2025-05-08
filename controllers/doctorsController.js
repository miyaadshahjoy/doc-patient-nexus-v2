const Doctor = require('../models/doctorsModel');
const handlers = require('./handlerFactory');

exports.createDoctor = handlers.createOne(Doctor);
exports.getDoctors = handlers.readAll(Doctor);
exports.getDoctor = handlers.readOne(Doctor);
exports.updateDoctor = handlers.updateOne(Doctor);
exports.deleteDoctor = handlers.deleteOne(Doctor);
