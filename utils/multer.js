const multer = require('multer');
const AppError = require('./appError');
// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/records');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    // Generate a unique filename using the current timestamp and a random number
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  },
});

// Filter to allow only specific file types
const filter = function (req, file, cb) {
  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
  ];
  if (allowedFileTypes.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new AppError(
        'Invalid file type. Only JPEG, PNG, and PDF files are allowed.',
        400,
      ),
      false,
    );
};
module.exports = multer({ storage, fileFilter: filter });
