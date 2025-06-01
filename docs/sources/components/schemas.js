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
      'education',
      'specialization',
      'experience',
      'location',
      'visitingSchedule',
      'consultationFees',
    ],

    properties: {
      _id: {
        type: 'string',
        example: '682787f1fea3f44089558cd6',
      },
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
        example: 'male',
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
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
      passwordChangedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:08.776Z',
      },
      numRating: {
        type: 'number',
        example: 10,
      },
    },
  },
};
