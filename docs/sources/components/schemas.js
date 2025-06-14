module.exports = {
  Admin: {
    type: 'object',
    required: [
      'fullName',
      'email',
      'phone',
      'gender',
      'password',
      'passwordConfirm',
    ],

    properties: {
      _id: {
        type: 'string',
        example: '682787f1fea3f44089558cd5',
      },
      fullName: {
        type: 'string',
        example: 'Ahsan Habib',
      },
      email: {
        type: 'string',
        example: 'ahsan.habib@example.com',
      },
      phone: {
        type: 'string',
        example: '+8801712345678',
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'others', 'prefer not to say'],
        example: 'male',
      },
      profilePhoto: {
        type: 'string',
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
      role: {
        type: 'string',
        enum: ['admin', 'super-admin'],
        default: 'admin',
        example: 'admin',
      },
      status: {
        type: 'string',
        enum: ['active', 'pending', 'removed'],
        example: 'pending',
      },
      isVerified: {
        type: 'boolean',
        example: false,
      },
      emailVerified: {
        type: 'boolean',
        example: false,
      },
      passwordChangedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },

      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
    },
  },
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
  Patient: {
    type: 'object',
    required: [
      'fullName',
      'email',
      'phone',
      'gender',
      'password',
      'passwordConfirm',
      'bloodGroup',
      'dateOfBirth',
      'location',
    ],
    /*
    const testPatient = {
  fullName: "Sadia Rahman",
  email: "sadia.rahman@example.com",
  phone: "+8801712345678",
  gender: "female",
  profilePhoto: "https://example.com/sadia-profile.jpg",
  password: "securePass789",
  passwordConfirm: "securePass789",
  bloodGroup: "B+",
  dateOfBirth: new Date("1992-03-10"),
  medicalHistory: ["Thyroid Disorder", "Anemia"],
  allergies: ["Shellfish", "Pollen"],
  currentMedications: ["Levothyroxine", "Iron Supplements"],
  location: {
    type: "Point",
    coordinates: [90.412518, 23.810332],
    city: "Dhaka",
    address: "House 12, Road 5, Dhanmondi, Dhaka 1205"
  },
  status: "pending",
  role: "patient",
  isVerified: false,
  emailVerified: false
};
    
    */

    properties: {
      _id: {
        type: 'string',
        example: '682787f1fea3f44089558cd7',
      },
      fullName: {
        type: 'string',
        example: 'Sadia Rahman',
      },
      email: {
        type: 'string',
        example: 'sadia.rahman@example.com',
      },
      phone: {
        type: 'string',
        example: '+8801712345679',
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'others', 'prefer not to say'],
        example: 'female',
      },
      profilePhoto: {
        type: 'string',
        example: 'https://example.com/sadia-profile.jpg',
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
        enum: ['A+', 'B+', 'O+', 'A-', 'B-', 'O-', 'AB+', 'AB-'],
        example: 'B+',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '1992-03-10',
      },
      medicalHistory: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Thyroid Disorder', 'Anemia'],
      },
      allergies: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Shellfish', 'Pollen'],
      },
      currentMedications: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Levothyroxine', 'Iron Supplements'],
      },
      // location: {
      //   type: {
      //     city: {
      //       type: String,
      //       trim: true,
      //     },
      //     address: {
      //       type: String,
      //       trim: true,
      //     },
      //   },
      //   required: [true, 'Location is required.'],
      // },
      location: {
        type: 'object',
        required: ['city', 'address'],
        properties: {
          city: {
            type: 'string',
            example: 'Dhaka',
          },
          address: {
            type: 'string',
            example: 'House 12, Road 5, Dhanmondi, Dhaka 1205',
          },
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'pending', 'removed'],
        example: 'pending',
      },
      role: {
        type: 'string',
        enum: ['patient'],
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
    },
  },

  Medication: {
    type: 'object',
    required: ['name', 'dosage', 'frequency', 'duration'],
    properties: {
      name: {
        type: 'string',
        example: 'Aspirin',
      },
      dosage: {
        type: 'string',
        example: '500mg',
      },
      frequency: {
        type: 'string',
        example: 'Twice a day',
      },
      duration: {
        type: 'number',
        example: 7, // in days
      },
      instruction: {
        type: 'string',
        example: 'Take with water, do not exceed the recommended dosage.',
      },
    },
  },
  Prescription: {
    type: 'object',
    required: ['doctor', 'patient', 'appointment', 'medications'],
    properties: {
      doctor: {
        type: 'string',
        example: '682787f1fea3f44089558cd6',
      },
      patient: {
        type: 'string',
        example: '682787f1fea3f44089558cd7',
      },
      appointment: {
        type: 'string',
        example: '682787f1fea3f44089558cd8',
      },
      notes: {
        type: 'string',
        example: 'Take the medication after meals.',
      },
      status: {
        type: 'string',
        enum: ['active', 'expired', 'deleted'],
        default: 'active',
      },
      medications: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Medication',
        },
        example: [
          {
            name: 'Aspirin',
            dosage: '500mg',
            frequency: 'Twice a day',
            duration: 7,
            instruction:
              'Take with water, do not exceed the recommended dosage.',
          },
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: 'Once a day',
            duration: 5,
            instruction: 'Take after meals.',
          },
        ],
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
    },
  },
  Appointment: {
    type: 'object',
    required: ['doctor', 'patient', 'appointmentDate', 'appointmentSchedule'],
    properties: {
      doctor: {
        type: 'string',
        example: '682787f1fea3f44089558cd6',
      },
      patient: {
        type: 'string',
        example: '682787f1fea3f44089558cd7',
      },
      appointmentDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-16T09:00:00.000Z',
      },
      appointmentSchedule: {
        type: 'object',
        required: ['day', 'hours'],
        properties: {
          day: {
            type: 'string',
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
                example: '09:59',
              },
            },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['confirmed', 'cancelled', 'completed'],
        default: 'confirmed',
      },
      reason: {
        type: 'string',
        example: 'Regular blood pressure check-up and follow-up consultation',
      },
      notes: {
        type: 'string',
        example: 'Patient has been advised to bring previous test reports.',
      },
      consultationType: {
        type: 'string',
        enum: ['in-person', 'online'],
        default: 'in-person',
      },
      paymentStatus: {
        type: 'string',
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
      },
      paymentMethod: {
        type: 'string',
        enum: ['card', 'cash'],
        default: 'card',
      },
      paymentIntent: {
        type: 'string',
        example: 'pi_1HV8XK2eZvKYlo2C5pFAKE123',
      },
      isPrescribed: {
        type: 'boolean',
        default: false,
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
    },
  },
  /*
  {
  "doctor": "64fc8e27b12d5a9cfdcdef07",
  "patient": "64fc8e27b12d5a9cfdcdef08",
  "appointment": "64fc8e27b12d5a9cfdcdef09",
  "review": "Dr. Rafiq was very attentive and explained everything clearly. I felt genuinely cared for during my consultation.",
  "rating": 5,
  "reply": "Thank you for your kind feedback. We're glad to hear about your experience!",
  "isEdited": false,
  "status": "visible",
  "createdAt": "2025-06-13T14:30:00.000Z",
  "updatedAt": "2025-06-13T14:30:00.000Z"
}

  */
  Review: {
    type: 'object',
    required: ['doctor', 'patient', 'appointment', 'review', 'rating'],
    properties: {
      doctor: {
        type: 'string',
        example: '682787f1fea3f44089558cd6',
      },
      patient: {
        type: 'string',
        example: '682787f1fea3f44089558cd7',
      },
      appointment: {
        type: 'string',
        example: '682787f1fea3f44089558cd8',
      },
      review: {
        type: 'string',
        example:
          'Dr. Rafiq was very attentive and explained everything clearly. I felt genuinely cared for during my consultation.',
      },
      rating: {
        type: 'number',
        example: 5,
      },
      reply: {
        type: 'string',
        example:
          "Thank you for your kind feedback. We're glad to hear about your experience!",
      },
      isEdited: {
        type: 'boolean',
        default: false,
      },
      status: {
        type: 'string',
        enum: ['visible', 'flagged', 'hidden'],
        default: 'visible',
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
    },
  },
  PatientRecord: {
    type: 'object',
    required: ['patient'],
    properties: {
      patient: {
        type: 'string',
        example: '682787f1fea3f44089558cd6',
      },
      allergies: {
        type: 'array',
        example: ['Peanuts', 'Penicillin'],
      },
      conditions: {
        type: 'array',
        example: ['Hypertension', 'Type 2 Diabetes'],
      },
      surgeries: {
        type: 'array',
        example: ['Appendectomy (2010)', 'Gallbladder removal (2016)'],
      },
      familyHistory: {
        type: 'array',
        example: ['Father - Heart disease', 'Mother - Type 2 Diabetes'],
      },
      lifestyle: {
        type: 'object',
        properties: {
          badHabits: {
            type: 'array',
            example: ['smoking'],
          },
          exercise: {
            type: 'string',
            example: 'moderate',
          },
        },
      },
      medications: {
        type: 'array',
        example: ['682787f1fea3f44089558cd7', '682787f1fea3f44089558cd8'],
      },
      reports: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'fileUrl', 'issuedBy', 'issuedOn'],
          properties: {
            title: {
              type: 'string',
              example: 'Blood Test Report',
            },
            fileUrl: {
              type: 'string',
              example: 'https://example.com/reports/bloodtest_jan2025.pdf',
            },
            issuedBy: {
              type: 'string',
              example: 'Dr. Nafisa Rahman',
            },
            issuedOn: {
              type: 'string',
              example: '2025-01-15T00:00:00.000Z',
            },
          },
        },
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
    },
  },
};
