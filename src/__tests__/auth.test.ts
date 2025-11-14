import request from 'supertest';
import app from '../app';
import prisma from '../prisma/prismaClient';
import bcrypt from 'bcrypt';

describe('Auth API', () => {
  const testUser = {
    name: 'Sourav Manna',
    email: 'test@example.com',
    phone_number: '9999999999',
    password: 'Password@123', // meets your Joi regex
  };

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should signup a new user successfully', async () => {
    const res = await request(app).post('/auth/signup').send(testUser);

    // 201 or 200 depending on sendHttpResponse default
    expect([200, 201]).toContain(res.status);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Success');
    expect(res.headers).toHaveProperty('authorization');
  });

  it('should login existing user successfully', async () => {
    // Hash password manually to match stored hash in DB
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.create({
      data: {
        first_name: 'Sourav',
        last_name: 'Manna',
        email: testUser.email,
        phone_number: testUser.phone_number,
        password: hashedPassword,
      },
    });

    const res = await request(app)
      .post('/auth/signin')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Login success');
    expect(res.headers).toHaveProperty('authorization');
  });
});
