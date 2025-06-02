const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    const resourceName = `${Model.modelName}`;
    res.status(201).json({
      status: `success`,
      message: `${resourceName} created successfully.`,
      data: {
        [resourceName]: newDoc,
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

    const resourceName = `${Model.modelName.toLowerCase()}s`;

    res.status(200).json({
      status: `success`,
      message: `Successfully fetched all ${resourceName}.`,
      results: docs.length,
      data: {
        [resourceName]: docs,
      },
    });
  });

exports.readOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    const resourceName = `${Model.modelName.toLowerCase()}`;

    // Validate id
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new AppError(`Invalid ${resourceName} ID format.`, 400));
    }

    // Check if document exists
    if (!doc) {
      return next(
        new AppError(`No ${resourceName} found with the provided ID.`, 404),
      );
      // return res.status(404).json({
      //   status: `fail`,
      //   message: `No ${Model.modelName} found with the provided Id.`,
      // });
    }
    res.status(200).json({
      status: `success`,
      message: `Successfully fetched the ${resourceName}'s details.`,
      data: {
        [resourceName]: doc,
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

    res.status(204).send();
  });
//TODO: Change the name of the handler to -> approveAccount
exports.verifyAccount = (Model) =>
  catchAsync(async (req, res, next) => {
    const resourceName = `${Model.modelName}`;
    const user = await Model.findById(req.params.id);

    if (!user)
      return next(new AppError(`${resourceName} account does not exist.`, 400));
    // Check if the user is already verified
    if (user.isVerified)
      return next(
        new AppError(`${resourceName} account is already verified.`, 400),
      );
    user.isVerified = true;
    user.status = 'active';
    await user.save();
    res.status(200).json({
      status: 'success',
      message: `${resourceName} account verified successfully`,
    });
  });
