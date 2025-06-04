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
    'api/v2/admins/signup': {
      post: {
        tags: ['Admins'],
        summary: 'Register a new admin account.',
        description:
          'Allows a new admin to register by providing necessary credentials and profile details.',
        operationId: 'signupAdmin',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Ahsan Habib',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'ahsan.habib@example.com',
                  },
                  phone: {
                    type: 'string',
                    pattern: '^\\+?[0-9]{10,15}$',
                    example: '+8801712345678',
                  },
                  gender: {
                    type: 'string',
                    example: 'male',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/photos/ahsan_habib.jpg',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                  passwordConfirm: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                },
                responses: {
                  201: {
                    description: 'Admin registered successfully',
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
                    description: 'Invalid input or validation failed',
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
                              example: 'Passwords do not match',
                            },
                          },
                        },
                      },
                    },
                  },
                  409: {
                    description: 'Email or phone number already in use.',
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
                                'Email already exists. Please use a different email.',
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
        },
      },
    },
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

    // Sending email verification link
    '/api/v2/admins/email-verification': {
      post: {
        tags: ['Admins'],
        summary: 'Send email verification link',
        description:
          '**Sends an `email verification link` to the admins’s registered email address. The email address is also sent along with the verification token.**',
        operationId: 'sendEmailVerification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'asif.hossain@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Email verification link sent successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Email verification link sent successfully. Please check your inbox.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid email format or missing email.',
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
                        'Invalid email format or missing email. Please provide a valid email address.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No admin found with the provided email address.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example:
                        'No admin found with the provided email address. Please check the email and try again.',
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

    // Email verification route
    '/api/v2/admin/email-verification/{token}': {
      patch: {
        tags: ['Admins'],
        summary: 'Verify admin’s email.',
        description:
          '**Verifies the admin’s email using the token sent to their email address.**',
        operationId: 'verifyAdminEmail',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            description: 'Email verification token',
            schema: {
              type: 'string',
              example: 'verification-token-here',
            },
          },
        ],
        responses: {
          200: {
            description: 'Email verified successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Email verified successfully.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid or expired token.',
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
                        'Invalid or expired email verificaion token. Please request a new verification link.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              'No admin found with the provided token or token does not exist.',
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
                      example: 'No verfication token found.',
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

    // Update currently logged in admin's profile
    '/api/v2/admins/me': {
      get: {
        tags: ['Admins'],
        summary: 'Get currently logged in admin profile.',
        description:
          '**Fetches the profile information of the currently logged in admin. The admin must be `logged in` and have a valid `JWT` token.**',
        security: {
          bearerAuth: [], // This indicates that the endpoint requires authentication
        },
        responses: {
          200: {
            description: 'Admin profile fetched successfully.',
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
            description:
              'Bad request. Possibly due to invalid input or validation errors.',
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
                        'Invalid input. Please provide valid profile information.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Admin must be logged in with a valid JWT token.',
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
                      example: 'You must be logged in to update your profile.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Admin does not have permission to update profile.',
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
                        'You do not have permission to update this profile.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      patch: {
        tags: ['Admins'],
        summary: 'Update Admin Profile.',
        description:
          '**Allows an admin to update their profile information. The admin must be `logged in` and have a valid `JWT` token.**',
        security: {
          bearerAuth: [], // This indicates that the endpoint requires authentication
        },
        /*
        Forbidden fields:
          'specialization',
          'experience',
          'education',
          'averageRating',
          'isVerified',
          'status',
          'role',
         
         */
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Ahsan Habib',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'ahsan.habib@example.com',
                  },
                  phone: {
                    type: 'String',
                    pattern: '^\\+?[0-9]{10,15}$',
                    example: '+8801712345678',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/photos/ahsan_habib.jpg',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Admin profile updated successfully.',
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
            description:
              'Bad request. Possibly due to invalid input or validation errors.',
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
                        'Invalid input. Please provide valid profile information.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Admin must be logged in with a valid JWT token.',
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
                      example: 'You must be logged in to update your profile.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Admin does not have permission to update profile.',
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
                        'You do not have permission to update this profile.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      delete: {
        tags: ['Admins'],
        summary: 'Delete Admin Account.',
        security: {
          bearerAuth: [], // This indicates that the endpoint requires authentication
        },
        description:
          '**Allows an admin to delete their own account. The admin must be `logged in` with a valid `JWT` token.**',
        responses: {
          204: {
            description: 'Admin account deleted successfully.',
          },
          401: {
            description:
              'Unauthorized access. Admin must be logged in with a valid `JWT` token.',
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
                      example: 'You must be logged in to delete your account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Admin does not have permission to delete this account.',
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
                        'You do not have permission to delete this account.',
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

    // Approve patient account

    '/api/v2/admins/approve-patients/{patientId}': {
      patch: {
        tags: ['Admins'],
        summary: 'Approve patient account.',
        security: {
          bearerAuth: [], // This indicates that the endpoint requires authentication
        },
        description:
          '**Allows an admin with an active and verified account to approve a patient account by ID. The patient must be in a pending state. Requires a valid `JWT` token with admin privileges.**',
        parameters: [
          {
            name: 'patientId',
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
            description: 'Patient account approved successfully.',
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
                        patient: { $ref: '#/components/schemas/Patient' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Patient account is already approved or does not exist.',
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
                        'Patient account is already approved or does not exist.',
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
                        'You do not have permission to approve patient accounts.',
                    },
                  },
                },
              },
            },
          },
          // TODO: Should we add a 404 response here? may be not needed
          404: {
            description: 'Patient account not found.',
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
                      example: 'No patient found with the provided ID.',
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
