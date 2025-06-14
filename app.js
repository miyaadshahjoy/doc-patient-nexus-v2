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
    status: 'SUCCESS',
    message: 'DocPateint Nexus Homepage',
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

    customCss: `@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); @font-face { font-family: 'Operator Mono'; src: url(${__dirname}/public/assets/fonts/operator-mono-bold.woff2) format('woff2'); font-display: swap; } .swagger-ui .topbar { display: none !important;  } .swagger-ui .topbar::after { content: ''; position: absolute; height: 300px !important; width: 100% !important; background-color: black !important; top: 0 !important; } .swagger-ui .opblock-body pre.microlight { background-color: #1e1e2e !important; } .swagger-ui p, .swagger-ui h1, .swagger-ui h2, .swagger-ui h3, .swagger-ui h4, .swagger-ui ul li, .swagger-ui th, .swagger-ui a { font-family: 'Poppins', sans-serif !important; } .swagger-ui td, .swagger-ui p { font-size: 1rem !important; font-weight: 400 !important; line-height: 1.5 !important; } .swagger-ui pre, .swagger-ui code, .swagger-ui tr, .swagger-ui td, .swagger-ui span, .swagger-ui textarea { font-family: 'Operator Mono', monospace !important; } .swagger-ui pre, .swagger-ui code { font-size: 0.875rem !important; font-weight: 400 !important; } .swagger-ui button, .swagger-ui .btn, .swagger-ui .opblock .opblock-summary-method { font-family: 'Poppins', arial-sans !important; font-size: 1.125rem !important; font-weight: 400 !important; letter-spacing: 1px !important; padding: 7px 13.5px; } .swagger-ui b, .swagger-ui strong { font-size: 1.25rem !important; } .swagger-ui .opblock .opblock-section-header h4, .swagger-ui th { font-size: 1rem !important; } .swagger-ui .try-out__btn, .swagger-ui .execute { color: #ffffff !important; background-color: #f7345e !important; border-color: #f7345e !important; font-size: 1.125rem !important; margin-left: 5px !important; margin-right: 5px !important; } .swagger-ui .model-box-control:focus, .swagger-ui .models-control:focus, .swagger-ui .opblock-summary-control:focus { border: none !important; outline: none !important;} .swagger-ui .swagger-ui .auth-btn-wrapper .btn { color: #ffffff !important; background-color: #f7345e !important; border-color: #f7345e !important; font-size: 1.125rem !important; margin-left: 5px !important; margin-right: 5px !important; }`,
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
