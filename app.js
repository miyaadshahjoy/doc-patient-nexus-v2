const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs-config/swagger-config');
const doctorDocs = require('./docs-sources/routes/doctorDocs');
// Importing routes and controllers
const globalErrorHandler = require('./controllers/errorController');
const appointmentController = require('./controllers/appointmentController');
const superAdminRouter = require('./routes/superAdminRoutes');
const adminRouter = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const patientRouter = require('./routes/patientRoutes');
const appointmenRouter = require('./routes/appointmentRoutes');

// Initialize express app
const app = express();

app.get('/', (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    data: 'DocPatient Nexus',
  });
});
// Webhook Route
app.post(
  '/api/v2/appointments/webhooks',
  express.raw({ type: 'application/json' }),
  appointmentController.stripeWebhookHandler,
);

// middlewares
// Serving static files from the 'public' directory
app.use(express.static('public'));
// 3rd party middlewares
// CORS middleware
app.use(cors());
// body parser middleware
app.use(express.json());
app.use(morgan('dev'));

// Query String parser
app.set('query parser', require('qs').parse);

//Routes
app.use('/api/v2/super-admins', superAdminRouter);
app.use('/api/v2/admins', adminRouter);
app.use('/api/v2/doctors', doctorRouter);
app.use('/api/v2/patients', patientRouter);
app.use('/api/v2/appointments', appointmenRouter);

// Swagger Documentation

swaggerSpec.paths = {
  ...swaggerSpec.paths,
  ...doctorDocs.paths, // Merging doctorDocs paths into swaggerSpec
};

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
