const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/config/swagger-config');
// Importing routes and controllers
const globalErrorHandler = require('./controllers/errorController');
const appointmentController = require('./controllers/appointmentController');
const superAdminRouter = require('./routes/superAdminRoutes');
const adminRouter = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const patientRouter = require('./routes/patientRoutes');
const appointmenRouter = require('./routes/appointmentRoutes');
const reviewRouter = require('./routes/reviewRoutes');

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
app.use('/api/v2/reviews', reviewRouter);

// Swagger Documentation

app.use(
  '/api/v2/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'DocPatient Nexus API Docs',

    customCss: `.swagger-ui .opblock-body pre.microlight{ background-color: #1e1e2e !important; } @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); .swagger-ui .information-container{font-family: 'Poppins', sans-serif !important;} .swagger-ui pre, .swagger-ui code, .swagger-ui span, .swagger-ui tr, .swagger-ui td, .swagger-ui textarea {font-family: 'Fira Code', monospace !important;} .swagger-ui button, .swagger-ui .btn, .swagger-ui .button, .swagger-ui .opblock .opblock-summary-method { font-size: 1rem !important;font-weight: 400!important; letter-spacing: 1px !important; padding: 7px 13.5px;}.swagger-ui pre, .swagger-ui code {font-size: 0.875rem!important; font-weight: 400!important;} .swagger-ui .topbar{ display: none !important; }`,
    customfavIcon: `${__dirname}/img/docpatient-nexus-icon.png`,
  }),
);

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
