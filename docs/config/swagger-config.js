const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const adminDocs = require('../sources/routes/adminDocs');
const doctorDocs = require('../sources/routes/doctorDocs');
const prescriptionDocs = require('../sources/routes/prescriptionDocs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DocPatient Nexus API',
      version: '2.0.0',
      description: `DocPatient Nexus is a modern, scalable RESTful API that bridges the gap between patients and healthcare providers through an intelligent, role-based medical appointment management system. Designed with security, performance, and flexibility in mind, it empowers clinics, hospitals, and telemedicine platforms to streamline doctor-patient interactions.\n\nAt its core, the API provides seamless scheduling, real-time availability tracking, appointment confirmation and cancellation workflows, payment processing via Stripe, and robust access control for Super Admins, Admins, Doctors, and Patients. With dynamic validation, modular architecture, and industry-standard security practices (JWT, CORS, HTTPS-ready), DocPatient Nexus is built to scale from small clinics to enterprise-grade hospital systems.\n\n> Whether you're integrating into a mobile health app, a web-based clinic portal, or a hospital ERP system, this API is your backend workhorse—reliable, extendable, and well-documented.\n\n🧩 Key Features:\n\n* Smart doctor availability scheduling\n* Role-based access control (RBAC + Identity-based access)\n* Patient appointment booking with dynamic slot validation\n* Secure payment processing with Stripe integration\n* Appointment status tracking: pending → confirmed → completed/cancelled\n* Automated refund and cancellation logic\n* Admin dashboards for healthcare staff & clinic management\n* Email notifications to keep doctors and patients in the loop\n* Built with Node.js, Express, MongoDB, Mongoose, and Stripe\n\n🚀 Designed For:\n\n* Telehealth startups\n* Clinics and hospital chains\n* Appointment scheduling apps\n* Healthcare SaaS platforms\n* Developer teams needing a plug-and-play health backend\n\n      
`,
      contact: {
        name: 'Miyaad Shah Joy',
        email: 'docpatientnexus@example.com',
      },
    },
    servers: [
      {
        url: 'https://docpatient-nexus.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: require('../sources/components/schemas'),
      responses: require('../sources/components/responses'),
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      // {
      //   name: 'Super Admins',
      //   description: 'Operations related to super admins',
      // },
      // { name: 'Admins', description: 'Operations related to admins' },
      { name: 'Doctors', description: 'Operations related to doctors' },
      // { name: 'Patients', description: 'Operations related to patients' },
      // {
      //   name: 'Appointments',
      //   description: 'Operations related to appointments',
      // },
    ],
  },
  apis: [
    path.join(__dirname, './components/*.js'),
    path.join(__dirname, './routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsDoc(options);
swaggerSpec.paths = {
  ...swaggerSpec.paths,
  ...adminDocs.paths,
  ...doctorDocs.paths,
  ...prescriptionDocs.paths, // Merging doctorDocs paths into swaggerSpec
};
module.exports = swaggerSpec;
