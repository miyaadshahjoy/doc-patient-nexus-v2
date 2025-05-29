module.exports = {
  Doctor: {
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
      'averageRating',
      'location',
      'consultationFees',
    ],
    properties: {
      _id: {
        type: 'string',
        example: '664c3b5587dfcd3a41e80c21',
      },
      fullName: {
        type: 'string',
        example: 'Dr. John Doe',
      },
      email: {
        type: 'string',
        example: 'johndoe@example.com',
      },
      phone: {
        type: 'string',
        example: '+1234567890',
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'others', 'prefer not to say'],
        example: 'male',
      },
      profilePhoto: {
        type: 'string',
        example: 'https://cdn.example.com/images/john.jpg',
      },
      password: {
        type: 'string',
        format: 'password',
        example: 'strongPassword123',
      },
      passwordConfirm: {
        type: 'string',
        format: 'password',
        example: 'strongPassword123',
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
              example: 'Harvard Medical School',
            },
          },
        },
      },
      averageRating: {
        type: 'number',
        minimum: 1,
        maximum: 5,
        example: 4.8,
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
            example: [-73.935242, 40.73061],
          },
          city: {
            type: 'string',
            example: 'New York',
          },
          address: {
            type: 'string',
            example: '1234 Medical Lane, NY',
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
        example: 5000,
      },
      appointmentDuration: {
        type: 'number',
        example: 60,
      },
      role: {
        type: 'string',
        enum: ['doctor'],
        example: 'doctor',
      },
      isVerified: {
        type: 'boolean',
        example: false,
      },
      status: {
        type: 'string',
        enum: ['active', 'pending', 'removed'],
        example: 'pending',
      },
      emailVerified: {
        type: 'boolean',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
};
