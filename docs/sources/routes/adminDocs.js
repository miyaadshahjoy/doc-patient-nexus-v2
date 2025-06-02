const responses = require('../components/responses');

/*{
  "fullName": "Ahsan Habib",
  "email": "ahsan.habib@example.com",
  "phone": "+8801712345678",
  "gender": "male",
  "profilePhoto": "https://example.com/photos/ahsan_habib.jpg",
  "password": "pass1234",
  "passwordConfirm": "pass1234",
  "role": "admin",
  "isVerified": false,
  "status": "pending",
  "emailVerified": false,
  "passwordChangedAt": "2025-06-02T14:20:00.000Z",
  "passwordResetToken": null,
  "passwordResetExpires": null,
  "emailVerificationToken": null,
  "emailVerificationExpires": null,
  "createdAt": "2025-06-02T14:20:00.000Z",
  "updatedAt": "2025-06-02T14:20:00.000Z"
}*/

module.exports = {
  paths: {
    '/api/v2/admins/signin': {
      post: {
        tags: ['Admins'],
        summary: 'Admin Sign In',
        description: 'Allows an admin to sign in using email and password.',
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
                    example: 'ahsan.habib@example.com',
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
            description: 'Admin signed in successfully',
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
                        admin: { $ref: '#/components/schemas/Admin' },
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
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example: 'Enter correct email and password to sign in.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized access.',
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
                        'Please verify your email before accessing the system',
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden access due to account status.',
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
                        'Your account is pending approval by an admin or has been removed. Please contact support.',
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
    // how to make this route protected in docs

    '/api/v2/admins/approve-doctors/{doctorId}': {
      patch: {
        tags: ['Admins'],
        summary: 'Approve Doctor Account.',
        security: {
          bearerAuth: [], // This indicates that the endpoint requires authentication
        },
        description:
          '**Allows an admin with an active and verified account to approve a doctor account by ID. The doctor must be in a pending state. Requires a valid `JWT` token with admin privileges.**',
        parameters: [
          {
            name: 'doctorId',
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
            description: 'Doctor account approved successfully.',
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
                        doctor: { $ref: '#/components/schemas/Doctor' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Doctor account is already approved or does not exist.',
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
                        'Doctor account is already approved or does not exist.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized access.',
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
                        'Please verify your email before accessing the system',
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden access due to account status.',
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
                        'You do not have permission to approve doctor accounts.',
                    },
                  },
                },
              },
            },
          },
          // TODO: Should we add a 404 response here? may be not needed
          404: {
            description: 'Doctor account not found.',
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
                      example: 'No doctor found with the provided ID.',
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
