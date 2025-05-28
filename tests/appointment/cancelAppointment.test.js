// cancelAppointment.test.js

const request = require('supertest');
const mockingoose = require('mockingoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = require('../../app'); // Your Express app
const Appointment = require('../../models/appointmentModel');
const Doctor = require('../../models/doctorModel');
const Patient = require('../../models/patientModel');
const email = require('../../utils/email');

jest.mock('../../utils/email');
jest.mock('stripe');

const fakePatientId = '60b6c0f5f9d3c34d1cb3b234';
const fakeDoctorId = '60b6c0f5f9d3c34d1cb3b235';
const fakeAppointmentId = '60b6c0f5f9d3c34d1cb3b236';

const mockAppointment = {
  _id: fakeAppointmentId,
  patient: fakePatientId,
  doctor: fakeDoctorId,
  appointmentDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hrs from now
  appointmentSchedule: {
    hours: {
      from: '10:00',
      to: '11:00',
    },
  },
  paymentIntent: 'pi_test_123',
  status: 'confirmed',
  save: jest.fn().mockResolvedValue(true),
};

describe('cancelAppointment', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should cancel and refund a confirmed appointment successfully', async () => {
    mockingoose(Appointment).toReturn(mockAppointment, 'findOne');
    mockingoose(Doctor).toReturn(
      { _id: fakeDoctorId, email: 'doc@example.com', fullName: 'Strange' },
      'findOne',
    );
    mockingoose(Patient).toReturn(
      { _id: fakePatientId, email: 'pat@example.com', fullName: 'Tony Stark' },
      'findOne',
    );

    stripe.refunds.create = jest
      .fn()
      .mockResolvedValue({ status: 'succeeded' });
    email.mockResolvedValue(true);

    const res = await request(app)
      .delete(`/api/v2/appointments/${fakeAppointmentId}/cancel`)
      .set('Authorization', `Bearer mockToken`) // Mock token middleware assumed
      .send();

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toMatch(/successfully cancelled/i);
    expect(stripe.refunds.create).toHaveBeenCalledWith({
      payment_intent: 'pi_test_123',
    });
    expect(email).toHaveBeenCalledTimes(2);
    expect(mockAppointment.save).toHaveBeenCalled();
  });

  it('should fail if appointment is already cancelled', async () => {
    const cancelled = { ...mockAppointment, status: 'cancelled' };
    mockingoose(Appointment).toReturn(cancelled, 'findOne');

    const res = await request(app)
      .delete(`/api/v2/appointments/${fakeAppointmentId}/cancel`)
      .set('Authorization', `Bearer mockToken`)
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already cancelled/i);
  });

  it('should block cancellation if < 24h before appointment', async () => {
    const almostTime = {
      ...mockAppointment,
      appointmentDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    };
    mockingoose(Appointment).toReturn(almostTime, 'findOne');

    const res = await request(app)
      .delete(`/api/v2/appointments/${fakeAppointmentId}/cancel`)
      .set('Authorization', `Bearer mockToken`)
      .send();

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/24 hours/i);
  });
});
