const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'Get all doctors',
        description: 'Retrieve a list of all registered doctors',
        operationId: 'getDoctors',

        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of results per page',
            required: false,
            schema: {
              type: 'integer',
              default: 100,
            },
          },
          {
            name: 'sort',
            in: 'query',
            description:
              'Sort order of the results (e.g., "experience,-averageRating")',
            required: false,
            schema: {
              type: 'string',
              default: '-averageRating',
            },
          },
          {
            name: 'fields',
            in: 'query',
            description:
              'Fields to include in the response (e.g., "name,experience,specialization,education,location")',
            required: false,
            schema: {
              type: 'string',
              default:
                'name,experience,specialization,education,location,averageRating',
            },
          },
          {
            name: 'experience[gte]',
            in: 'query',
            description:
              'Filter doctors with experience greater than or equal to the specified value',
            required: false,
            schema: {
              type: 'integer',
              default: 0,
            },
          },
          {
            name: 'experience[lte]',
            in: 'query',
            description:
              'Filter doctors with experience less than or equal to the specified value',
            required: false,
            schema: {
              type: 'integer',
              default: 50,
            },
          },
          {
            name: 'averageRating[gte]',
            in: 'query',
            description:
              'Filter doctors with average rating greater than or equal to the specified value',
            required: false,
            schema: {
              type: 'number',
              default: 1,
            },
          },
          {
            name: 'averageRating[lte]',
            in: 'query',
            description:
              'Filter doctors with average rating less than or equal to the specified value',
            required: false,
            schema: {
              type: 'number',
              default: 5,
            },
          },
          {
            name: 'specialization',
            in: 'query',
            description:
              'Filter doctors by specialization (e.g., "Cardiology,Neurology")',
            required: false,
            schema: {
              type: 'string',
              default: '',
            },
          },
        ],
        responses: {
          200: {
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
            links: {
              GetSingleDoctorById: {
                operationId: 'getDoctorById',
                parameters: {
                  id: '$response.body#/data/doctors/0/_id',
                },
                description:
                  'Link to get details of the first doctor in the list',
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
          404: {
            description: 'No doctors found matching the provided criteria',
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
                      example: 'No doctors found.',
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
    '/api/v2/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get a single doctor by ID',
        description: 'Retrieve details of a specific doctor by their ID',
        operationId: 'getDoctorById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the doctor to retrieve',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully fetched the doctor's details.",
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
                        doctor: {
                          $ref: '#/components/schemas/Doctor',
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
              'Bad request. Possibly due to invalid ID format or missing ID.',
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
                        'Invalid ID format or missing ID. Please provide a valid doctor ID.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No doctor found with the provided ID.',
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
                        'No doctor found with the provided ID. Please check the ID and try again.',
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

    '/api/v2/doctors/signup': {
      post: {
        tags: ['Doctors'],
        summary: 'Register a new doctor account.',
        description:
          'Allows a new doctor to register by providing necessary credentials and profile details.',
        operationId: 'signupDoctor',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'fullName',
                  'email',
                  'phone',
                  'gender',
                  'password',
                  'passwordConfirm',
                  'specialization',
                  'experience',
                  'education',
                  'location',
                  'visitingSchedule',
                  'consultationFees',
                ],
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Zarif Hossain',
                  },
                  email: {
                    type: 'string',
                    example: 'zarif.hossain@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '+880 1720 111234',
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'others', 'prefer not to say'],
                    example: 'female',
                  },
                  profilePhoto: {
                    type: 'string',
                    example: 'https://cdn.example.com/images/zarif.jpg',
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
                  specialization: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Cardiology', 'Internal Medicine'],
                  },
                  experience: {
                    type: 'number',
                    example: 10,
                  },
                  education: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['degree', 'institute'],
                      properties: {
                        degree: {
                          type: 'string',
                          example: 'MBBS',
                        },
                        institute: {
                          type: 'string',
                          example: 'Dhaka Medical College',
                        },
                      },
                    },
                  },
                  location: {
                    type: 'object',
                    required: ['type', 'coordinates'],
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
                        example: [90.389, 23.746],
                      },
                      city: {
                        type: 'string',
                        example: 'Dhaka',
                      },
                      address: {
                        type: 'string',
                        example: 'Green Road, Dhaka',
                      },
                    },
                  },
                  visitingSchedule: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        day: {
                          type: 'string',
                          enum: [
                            'saturday',
                            'sunday',
                            'monday',
                            'tuesday',
                            'wednesday',
                            'thursday',
                            'friday',
                          ],
                          example: 'monday',
                        },
                        hours: {
                          type: 'object',
                          required: ['from', 'to'],
                          properties: {
                            from: {
                              type: 'string',
                              example: '09:00',
                            },
                            to: {
                              type: 'string',
                              example: '17:00',
                            },
                          },
                        },
                      },
                    },
                  },
                  consultationFees: {
                    type: 'number',
                    example: 1000,
                  },
                  appointmentDuration: {
                    type: 'number',
                    example: 60,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Doctor registered successfully',
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
                        doctor: { $ref: '#/components/schemas/Doctor' },
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
                    status: { type: 'string', example: 'fail' },
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
    '/api/v2/doctors/signin': {
      post: {
        tags: ['Doctors'],
        summary: 'Sign in a doctor',
        description: 'Allows a doctor to sign in using email and password.',
        operationId: 'signinDoctor',
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
                    example: 'zarin.hossain@example.com',
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
            description: 'Doctor signed in successfully',
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
  },
};
