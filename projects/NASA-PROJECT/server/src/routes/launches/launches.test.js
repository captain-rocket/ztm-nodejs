const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

const launchRoute = '/v1/launches';

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    console.log('Disconnecting from MongoDB and closing server...');
    await mongoDisconnect(); // Await MongoDB disconnection
    console.log('MongoDB disconnected.');
  });
  describe(`Test GET ${launchRoute}`, () => {
    test('It should respond with Content-Type json and 200 success', async () => {
      await request(app).get(launchRoute).expect('Content-Type', /json/).expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Mission Test',
      rocket: 'Rocket Test',
      launchDate: 'July 14, 1982',
      target: 'Kepler-452 b',
    };
    const launchDataInvalidDate = {
      mission: 'Mission Test',
      rocket: 'Rocket Test',
      launchDate: 'zoot',
      target: 'Kepler-452 b',
    };

    const launchDataNoDate = {
      mission: 'Mission Test',
      rocket: 'Rocket Test',
      target: 'Kepler-452 b',
    };

    test('It should respond with 201 created', async () => {
      const resp = await request(app).post(launchRoute).send(completeLaunchData).expect('Content-Type', /json/).expect(201);

      const reqDate = new Date(completeLaunchData.launchDate).valueOf();
      const resDate = new Date(resp.body.launchDate).valueOf();

      expect(resDate).toBe(reqDate);

      expect(resp.body).toMatchObject(launchDataNoDate);
    });
    test('It should catch missing required properties', async () => {
      const resp = await request(app).post(launchRoute).send(launchDataNoDate).expect('Content-Type', /json/).expect(400);

      expect(resp.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });
    test('It should catch missing invalid dates', async () => {
      const resp = await request(app).post(launchRoute).send(launchDataInvalidDate).expect('Content-Type', /json/).expect(400);

      expect(resp.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
