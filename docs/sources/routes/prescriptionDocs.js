const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/doctors/appointments/{appointmentId}/prescription': {
      post: {
        tags: ['Prescription'],
        summary: 'Create a prescription for a patient.',
        description:
          '**Allows a doctor to create a prescription for a patient after an appointment.**',
        operationId: 'createPrescription',
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            required: true,
            description:
              'ID of the appointment for which the prescription is created',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['medications'],
                properties: {
                  medications: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Medication' },
                  },
                  notes: {
                    type: 'string',
                    example: 'Take the medication after meals.',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description:
              'Prescription created successfully. Returns the created prescription details.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        prescription: {
                          $ref: '#/components/schemas/Prescription',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to missing required fields or invalid data.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid input data. Please ensure all required fields are provided and correctly formatted.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Doctor must be authenticated to create a prescription.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You must be signed in as a doctor to create a prescription.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              'No appointment found with the provided ID or appointment does not belong to the doctor.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'No appointment found with the provided ID or the appointment does not exist.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
  },
};
