const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION SHUTTING DOWN.........');
  console.log(err.name, err.message);
  // console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB_URI = process.env.DB_CONNECTION_STRING.replace(
  '<db_password>',
  process.env.DB_PASSWORD,
);
mongoose.connect(DB_URI).then(() => {
  console.log('DATABASE CONNECTED SUCCESSFULLY 😍');
});

const PORT = process.env.PORT || 3000;
const app = require('./app');

const server = app.listen(PORT, () => {
  console.log(`🟢 SERVER IS RUNNING ON PORT: ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION Shutting down........');
  console.log(err.name, err.message);
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
