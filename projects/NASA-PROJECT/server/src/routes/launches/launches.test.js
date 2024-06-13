const request = require('supertest');
const app = require('../../app');

const completeLaunchData = {
  mission: 'Mission Test',
  rocket: 'Rocket Test',
  launchDate: 'July 14, 1982',
  target: 'Target Test',
};
const launchDataInvalidDate = {
  mission: 'Mission Test',
  rocket: 'Rocket Test',
  launchDate: 'zoot',
  target: 'Target Test',
};

const launchDataNoDate = {
  mission: 'Mission Test',
  rocket: 'Rocket Test',
  target: 'Target Test',
};

describe('Test GET /launches', () => {
  test('It should respond with Content-Type json and 200 success', async () => {
    await request(app).get('/launches').expect('Content-Type', /json/).expect(200);
  });
});

describe('Test POST /launches', () => {
  test('It should respond with 201 created', async () => {
    const resp = await request(app).post('/launches').send(completeLaunchData).expect('Content-Type', /json/).expect(201);

    const reqDate = new Date(completeLaunchData.launchDate).valueOf();
    const resDate = new Date(resp.body.launchDate).valueOf();

    expect(resDate).toBe(reqDate);

    expect(resp.body).toMatchObject(launchDataNoDate);
  });
  test('It should catch missing required propeties', async () => {
    const resp = await request(app).post('/launches').send(launchDataNoDate).expect('Content-Type', /json/).expect(400);

    expect(resp.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });
  test('It should catch missing invalid dates', async () => {
    const resp = await request(app).post('/launches').send(launchDataInvalidDate).expect('Content-Type', /json/).expect(400);

    expect(resp.body).toStrictEqual({
      error: 'Invalid launch date',
    });
  });
});
