module.exports = {
  InternalServerError: {
    description:
      'Internal server error. Something went wrong while processing your request.',
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
              example: 'Something went wrong. Please try again later.',
            },
          },
        },
      },
    },
  },
};
