const request = require('supertest');
const app = require('../index');
const Task = require('../model/Task');
const jwt = require('jsonwebtoken');

// Increase global timeout to 10 seconds
jest.setTimeout(60000);

describe('Task API', () => {

  let authToken;

  beforeAll(async () => {

    const resp = await request(app).get('/');

    console.log(resp?.text)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'mohdhuzaifa80@gmail.com', password: 'Huzaifa@123' });

    console.log(res?.body?.accessToken)

    authToken = res?.body?.accessToken;

  });

  console.log(authToken)

  test('Create valid task', async () => {
    const decoded = jwt.verify(authToken, 'zMKzyLC5GoVoPuWwaTv9lud2RG8tKDxabzIJX5EzBxrvOMLcRu9BOMX8t55MD1eC');
    const res = await request(app)
      .post('/api/tasks/create')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'testing using jest',
        dueDate: new Date().toISOString(),
        createdBy: decoded?.UserInfo?.id
      });
    console.log(res?.body)
    expect(res?.statusCode).toEqual(200);
    expect(res?.body).toHaveProperty('_id');
  });

  test('Prevent unauthorized task deletion', async () => {
    const task = await Task.findOne();
    let invalidToken = 'i9nvalid-token'
    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(res.statusCode).toEqual(401);
  });
});