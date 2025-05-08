const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

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
    const docs = await Model.find();
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
