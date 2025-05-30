const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'Get all doctors',
        description: 'Retrieve a list of all registered doctors',
        operationId: 'getDoctors',
        responses: {
          200: responses.Success200,
          500: responses.InternalServerError,
        },
      },
    },
  },
};
