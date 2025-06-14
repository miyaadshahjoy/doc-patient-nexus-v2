const responses = require('../components/responses');

/*
{
    "fullName": "Farzana Nahar",
    "email": "farzana.nahar92@example.com",
    "phone": "+8801745123456",
    "gender": "female",
    "profilePhoto": "https://example.com/uploads/farzana.jpg",
    "password": "SafePass123!", 
    "passwordConfirm": "SafePass123!",
    "bloodGroup": "O+",
    "dateOfBirth": "1992-03-15T00:00:00.000Z",
    "medicalHistory": [
      "Diabetes Type 2",
      "Migraines"
    ],
    "allergies": [
      "Penicillin",
      "Dust"
    ],
    "currentMedications": [
      "Metformin",
      "Paracetamol"
    ],
    "location": {
      "city": "Chattogram",
      "address": "House #22, Road #5, Nasirabad"
    },
    "status": "active",
    "role": "patient",
    "isVerified": true,
    "emailVerified": true,
    "passwordChangedAt": "2024-11-01T10:00:00.000Z",
    "passwordResetToken": "e3c8fd0abf1a4d12ac9be1e4bdf2f630",
    "passwordResetExpires": "2025-06-15T12:00:00.000Z",
    "emailVerificationToken": "v3r1fyT0k3n2025",
    "emailVerificationExpires": "2025-06-14T23:59:00.000Z",
    "createdAt": "2025-06-13T10:00:00.000Z",
    "updatedAt": "2025-06-13T10:00:00.000Z"
          }
          */
module.exports = {
  paths: {
    '/api/v2/patients/signup': {
      post: {
        tags: ['Patients'],
        summary: 'Register a new patient account.',
        description:
          'Allows a new patient to register by providing necessary credentials and profile details. After registration, you will have to verify you email through the `/api/v2/patients/email-verification` endpoint. Initially your account will be in a `pending` state. After verification, your account will be `active` and you can log in.',
        operationId: 'signupPatient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Patient',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Patient registered successfully.',
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
                        patient: {
                          $ref: '#/components/schemas/Patient',
                        },
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
    '/api/v2/patients/signin': {
      post: {
        tags: ['Patients'],
        summary: 'Patient Sign In',
        description:
          'Allows a patient to sign in using email and password. If your email is `not verified`, you will not be able to sign in. Verify your email using the `/api/v2/patients/email-verification` endpoint. If your account is pending approval by the admin, you will not be able to sign in.<br><br>After successfully logging in use the `jwt` token from the response to authenticate or authorize for accessing protected routes.',
        operationId: 'signinPatient',
        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'farzana.nahar@example.com',
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
            description: 'Patient signed in successfully.',
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
                        patient: {
                          $ref: '#/components/schemas/Patient',
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
    '/api/v2/patients/email-verification': {
      post: {
        tags: ['Patients'],
        summary: 'Send email verification link',
        description:
          'Sends an `email verification link` to the patient’s registered email address. The email address is also sent along with the verification token. Collect the token from the email and use it to verify your email using the `/api/v2/patients/email-verification/{token}` endpoint. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the `/api/v2/patients/email-verification` endpoint. <br><br>**Note**: The email verification token could be long. Make sure to copy the entire token from the email.',
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
                    example: 'farzana.nahar@example.com',
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
            description: 'No patient found with the provided email address.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example:
                        'No patient found with the provided email address. Please check the email and try again.',
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
    '/api/v2/patients/email-verification/{token}': {
      patch: {
        tags: ['Patients'],
        summary: 'Verify patient’s email.',
        description:
          'Verifies the patient’s email using the token sent to their email address. Collect the token from the email and use it in the parameters section to verify your email. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the `/api/v2/patients/email-verification` endpoint.<br><br>**Note**: The email verification token could be long. Make sure to copy the entire token from the email.',
        operationId: 'verifyPatientEmail',
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
                    status: { type: 'string', example: 'fail' },
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
              'No patient found with the provided token or token does not exist.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
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
    '/api/v2/patients': {
      // Only logged in Admins or Doctors can access this route
      get: {
        tags: ['Patients'],
        summary: 'Get all registered patients',

        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          ' This endpoint allows `logged-in` Admins or Doctors to retrieve all the registered patietnts in the system.',
        operationId: 'getPatients',

        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: {
              type: 'integer',
              example: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: {
              type: 'integer',
              example: 100,
            },
          },
          {
            name: 'sort',
            in: 'query',
            description:
              'Sort order of the results (e.g., "fullName,email,-dateOfBirth")',
            schema: {
              type: 'string',
              example: '-dateOfBirth',
            },
          },
          {
            name: 'fields',
            in: 'query',
            description:
              'Fields to include in the response (e.g., "fullName,email,gender,dateOfBirth,location")',
            schema: {
              type: 'string',
              example: 'fullName,email,gender,dateOfBirth,location',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully retrieved all patients.',
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
                        patients: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Patient',
                          },
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
              'Bad request. Possibly due to invalid query parameters.',
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
                        'Invalid query parameters provided. Check your request.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins and Doctors can access this route.',
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
                        'You are not authorized to access this resource.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins or Doctors can access this route.',
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
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No patients found matching the provided criteria',
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
                      example: 'No patients found.',
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

    '/api/v2/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Get a single patient by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Retrieve details of a specific patient by their `ID`. This endpoint is accessible to `logged-in` Admins or Doctors only.',
        operationId: 'getPatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the patient to retrieve',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully fetched the patients's details.",
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
                        patient: {
                          $ref: '#/components/schemas/Patient',
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
              'Bad request. Possibly due to invalid ID format or missing `ID`.',
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
                        'Invalid ID format or missing ID. Please provide a valid patient ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins or Doctors can access this route.',
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
                        'You are not authorized to access this resource. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins or Doctors can access this route.',
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
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No patient found with the provided ID.',
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
                        'No patient found with the provided ID. Please check the ID and try again.',
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
        tags: ['Patients'],
        summary: 'Update a patient by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Update a specific patient by their `ID`. This endpoint is accessible to `logged-in` Admins or Doctors only.',
        operationId: 'updatePatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the patient to update',
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
                properties: {
                  name: {
                    type: 'string',
                    example: 'Sadia Rahman',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'sadin.rahman@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '+8801234567890',
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'other', 'prefer not to say'],
                    example: 'male',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/profile-photo.jpg',
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
                  bloodGroup: {
                    type: 'string',
                    example: 'O+',
                  },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    example: '1990-01-01',
                  },
                  medicalHistory: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Diabetes, Hypertension, Asthma',
                    },
                  },
                  allergies: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Penicillin, Nuts',
                    },
                  },
                  currentMedications: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Metformin, Lisinopril',
                    },
                  },

                  location: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['Point'],
                        example: 'Point',
                      },
                      coordinates: {
                        type: 'array',
                        items: {
                          type: 'number',
                        },
                        example: [23.8103, 90.4125],
                      },
                      city: {
                        type: 'string',
                        example: 'Dhaka',
                      },
                      address: {
                        type: 'string',
                        example: '123 Main St, Dhaka, Bangladesh',
                      },
                    },
                    status: {
                      type: 'string',
                      enum: ['active', 'pending', 'removed'],
                      example: 'active',
                    },
                    role: {
                      type: 'string',
                      example: 'patient',
                    },
                    isVerified: {
                      type: 'boolean',
                      example: false,
                    },
                    emailVerified: {
                      type: 'boolean',
                      example: false,
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully updated the patient.',
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
                        patient: {
                          $ref: '#/components/schemas/Patient',
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
              'Bad request. Possibly due to invalid ID format or missing `ID`.',
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
                        'Invalid ID format or missing ID. Please provide a valid patient ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins or Doctors can access this route.',
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
                        'You are not authorized to access this resource. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins or Doctors can access this route.',
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
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              'No patient found with the provided ID. Please check the ID and try again.',
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
                        'No patient found with the provided ID. Please check the ID and try again.',
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
        tags: ['Patients'],
        summary: 'Delete a patient by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Delete a specific patient by their `ID`. This endpoint is accessible to `logged-in` Admins or Doctors only.',
        operationId: 'deletePatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the patient to delete',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          204: {
            description: 'Successfully deleted the patient.',
          },
          400: {
            description:
              'Bad request. Possibly due to invalid ID format or missing `ID`.',
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
                        'Invalid ID format or missing ID. Please provide a valid patient ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins or Doctors can access this route.',
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
                        'You are not authorized to access this resource. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins or Doctors can access this route.',
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
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              'No patient found with the provided ID. Please check the ID and try again.',
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
                        'No patient found with the provided ID. Please check the ID and try again.',
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

    '/api/v2/patients/me': {
      get: {
        tags: ['Patients'],
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
      },
      summary: 'Get currently logged in patient profile.',
      description:
        'Get details of the currently logged in patient. This endpoint is accessible to `logged-in` patients only.',
    },
    // POST /patients/doctors/{doctorId}/available-visiting-hours
    '/api/v2/patients/doctors/{doctorId}/available-visiting-hours': {
      post: {
        tags: ['Patients'],
        summary: 'Get available visiting hours for a doctor.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Get `available visiting hours` for a doctor. The visiting hours are displayed in 24-hour format. You have to provide a `valid date` to get available visiting hours on the provided date.<br><br>This endpoint is accessible to `logged-in` patients only.',
        operationId: 'getAvailableVisitingHours',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            description: 'ID of the doctor',
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
                properties: {
                  date: {
                    type: 'string',
                    example: '2025-08-01',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully retrieved all available visiting hours.',
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
                        'Available visiting time slots retrieved successfully',
                    },
                    /*
  "data": {
    "date": "2025-06-16",
    "visitingDay": "monday",
    "visitingHours": [
      {
        "from": "09:00",
        "to": "09:59",
        "available": true
      },
      {
        "from": "10:00",
        "to": "10:59",
        "available": true
      },
      {
        "from": "11:00",
        "to": "11:59",
        "available": true
      },
      {
        "from": "12:00",
        "to": "12:59",
        "available": true
      },
      {
        "from": "13:00",
        "to": "13:59",
        "available": true
      },
      {
        "from": "14:00",
        "to": "14:59",
        "available": true
      },
      {
        "from": "15:00",
        "to": "15:59",
        "available": true
      },
      {
        "from": "16:00",
        "to": "16:59",
        "available": true
      }
    ]
  }*/
                    data: {
                      type: 'object',
                      properties: {
                        date: {
                          type: 'string',
                          example: '2025-06-16',
                        },
                        visitingDay: {
                          type: 'string',
                          example: 'monday',
                        },
                        visitingHours: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              from: {
                                type: 'string',
                                example: '09:00',
                              },
                              to: {
                                type: 'string',
                                example: '09:59',
                              },
                              available: {
                                type: 'boolean',
                                example: true,
                              },
                            },
                          },
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
              'Invalid date format. Please provide a valid date in YYYY-MM-DD format.',
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
                        'Invalid or passed date. Please provide a valid date',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in patients can access this route. Log in with a valid jwt token.',
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
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in patients can access this route.',
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
                        'You do not have permission to access this route.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No doctor found matching the provided ID',
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
                      example: 'No doctor found.',
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
    // POST /patients/doctors/{doctorId}/book-appointment
    '/api/v2/patients/doctors/{doctorId}/book-appointment': {
      post: {
        tags: ['Patients'],
        summary: 'Book an appointment with a doctor.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          'Allows a patient to `book an appointment` with a doctor. The patient must be `logged in` to use this route. The patient enters a `valid date` and an `available time slot` to book an appointment with the doctor.',
        operationId: 'bookAppointment',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            description: 'ID of the doctor to book an appointment with.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        /*
{
  "appointmentDate": "2025-06-16",
  "appointmentSchedule": {
    "day": "monday",
    "hours": {
      "from": "09:00",
      "to": "09:59"
    }
  },
  "reason": "Regular blood pressure check-up and follow-up consultation",
  "notes": "Patient has been advised to bring previous test reports.",
  "consultationType": "in-person"
}      
*/
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  appointmentDate: {
                    type: 'string',
                    example: '2025-06-16',
                  },
                  appointmentSchedule: {
                    type: 'object',
                    properties: {
                      day: {
                        type: 'string',
                        example: 'monday',
                      },
                      hours: {
                        type: 'object',
                        properties: {
                          from: {
                            type: 'string',
                            example: '09:00',
                          },
                          to: {
                            type: 'string',
                            example: '09:59',
                          },
                        },
                      },
                    },
                  },
                  reason: {
                    type: 'string',
                    example:
                      'Regular blood pressure check-up and follow-up consultation',
                  },
                  notes: {
                    type: 'string',
                    example:
                      'Patient has been advised to bring previous test reports.',
                  },
                  consultationType: {
                    type: 'string',
                    example: 'in-person',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Appointment successfully booked.',
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
                      example: 'Appointment created successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        appointment: {
                          $ref: '#/components/schemas/Appointment',
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
              'Invalid date format. Please provide a valid date in YYYY-MM-DD format.',
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
                        'Invalid or passed date. Please provide a valid date',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in patients can access this route. Log in with a valid jwt token.',
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
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in patients can access this route.',
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
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No doctor found matching the provided ID',
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
                      example: 'No doctor found.',
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
    // POST/patients/appointments/{appointmentId}/reviews
    '/api/v2/patients/appointments/{appointmentId}/reviews': {
      post: {
        tags: ['Patients'],
        summary: 'Post a review for an appointment.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows a patient to `post a review` for an appointment. The patient must be `logged in` to use this route.',
        operationId: 'postReview',
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            description: 'ID of the appointment to post a review for.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  review: {
                    type: 'string',
                    example:
                      'Dr. Rafiq was very attentive and explained everything clearly. I felt genuinely cared for during my consultation.',
                  },
                  rating: {
                    type: 'number',
                    example: 5,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Review posted successfully.',
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
                      example: 'Review created successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        review: {
                          $ref: '#/components/schemas/Review',
                        },
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
                      example: 'Validation failed.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in patients can access this route. Log in with a valid `jwt` token.',
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
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in patients can access this route.',
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
                      example: 'You are not allowed to post a review here.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No appointment found with provided ID.',
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
                      example: 'No appointment found.',
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
