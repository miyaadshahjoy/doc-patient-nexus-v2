const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');

const superAdminRouter = require('./routes/superAdminRoutes');
const adminRouter = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');

const app = express();

app.get('/', (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    data: 'Homepage',
  });
});

// middlewares
// 3rd party middlewares
// body parser middleware
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/api/v2/super-admins', superAdminRouter);
app.use('/api/v2/admins', adminRouter);
app.use('/api/v2/doctors', doctorRouter);

// handler function for unhandled routes
app.all('*wildcard', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}  on this server`,
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);
module.exports = app;
