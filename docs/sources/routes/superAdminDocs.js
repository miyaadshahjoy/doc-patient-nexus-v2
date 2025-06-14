const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/super-admins/signin': {
      post: {
        tags: ['Super-Admins'],
        summary: 'Super Admin Sign In',
        description:
          'Allows a super-admin to sign in using email and password. After sigining in use the `jwt` token to access the protected routes.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'miyaadjoy@docpatientnexus.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Super-Admin signed in successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    token: {
                      type: 'string',
                      example: 'JWT token here',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        superAdmin: {
                          $ref: '#/components/schemas/Admin',
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
              'Invalid email or password. Please provide valid credentials.',
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
                      example: 'Enter correct email and password to sign in.',
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

    // approve admin accounts
    '/api/v2/super-admins/approve-admins/{adminId}': {
      patch: {
        tags: ['Super-Admins'],
        summary: 'Approve Admin Account.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows a super-admin to approve an admin account by ID. The admin must be in a pending state. Requires a valid `JWT` token with super-admin privileges.',
        parameters: [
          {
            name: 'adminId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4f3a',
            },
          },
        ],
        responses: {
          200: {
            description: 'Admin account approved successfully.',
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
                        admin: { $ref: '#/components/schemas/Admin' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Admin account is already approved or does not exist.',
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
                        'Admin account is already approved or does not exist.',
                    },
                  },
                },
              },
            },
          },
          // TODO: Should we add a 404 response here? may be not needed
          404: {
            description: 'Admin account not found.',
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
                      example: 'No admin found with the provided ID.',
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
