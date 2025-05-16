const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: `success`,
      message: `${Model.modelName} created successfully.`,
      data: {
        doc: newDoc,
      },
    });
  });

exports.readAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryObject = req.query;
    const query = Model.find();
    const features = new APIFeatures(query, queryObject)
      .filter()
      .sort()
      .select()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: `success`,
      message: `${Model.modelName}s retrieved successfully.`,
      data: {
        results: docs.length,
        docs,
      },
    });
  });

exports.readOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc) {
      return next(
        new AppError(`No ${Model.modelName} found with the provided Id.`, 404),
      );
      // return res.status(404).json({
      //   status: `fail`,
      //   message: `No ${Model.modelName} found with the provided Id.`,
      // });
    }
    res.status(200).json({
      status: `success`,
      message: `${Model.modelName} retrieved successfully.`,
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    if (!updatedDoc) {
      return next(
        new AppError(`No ${Model.modelName} found with the provided Id.`, 404),
      );
    }
    res.status(200).json({
      status: `success`,
      message: `${Model.modelName} updated successfully.`,
      data: {
        doc: updatedDoc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) {
      return next(
        new AppError(`No ${Model.modelName} found with the provided Id`, 404),
      );
    }
    // res.status(204).json({
    //   status: `success`,
    //   message: `${Model.modelName} deleted successfully.`,
    //   data: null,
    // });
    res.status(204).send();
  });

exports.verifyAccount = (Model) =>
  catchAsync(async (req, res, next) => {
    const user = await Model.findById(req.params.id);
    if (!user) return next(new AppError('User does not exist.', 400));
    if (user.isVerified)
      return next(new AppError('User account is already verified.', 400));
    user.isVerified = true;
    user.status = 'active';
    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'User verified successfully',
    });
  });
