// This module exports response schemas for use in Swagger documentation.
module.exports = {
  Success200: {
    description: 'Successfully fetched all doctors',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            results: {
              type: 'integer',
              example: 3,
            },
            data: {
              type: 'object',
              properties: {
                doctors: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Doctor',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  InternalServerError: {
    description: 'Something went wrong on the server',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'Internal server error',
            },
          },
        },
      },
    },
  },
};
