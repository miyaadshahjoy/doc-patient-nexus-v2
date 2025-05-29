const swaggerJsDoc = require('swagger-jsdoc');
const doctorDocs = require('../docs-sources/routes/doctorDocs');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DocPatient Nexus API',
      version: '2.0.0',
      description:
        'A robust API for doctor-patient appointment management and communication.',
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
      schemas: require('../docs-sources/components/schemas'),
      responses: require('../docs-sources/components/responses'),
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
  ...doctorDocs.paths, // Merging doctorDocs paths into swaggerSpec
};
module.exports = swaggerSpec;
