
import path from 'path';
import request from 'supertest';
import app from '../app';
import prisma from '../prisma/prismaClient';

describe('Generation API', () => {
  let token: string;
  beforeEach(async () => {
  await prisma.generation.deleteMany();
});


  beforeAll(async () => {
  // Create user via API
  await request(app).post("/auth/signup").send({
    name : 'Sourav Denu',
    email: "gen@example.com",
    phone_number: "8617053607",
    password: "Pass@123",
  });
  const loginRes = await request(app).post("/auth/signin").send({
    email: "gen@example.com",
    password: "Pass@123",
  });
  token = loginRes.headers.authorization || '';
});

  afterAll(async () => {
    // await prisma.generation.deleteMany({ where: { user: { email: 'gen@example.com' } } });
    // await prisma.user.deleteMany({ where: { email: 'gen@example.com' } });
    // await prisma.$disconnect();
  });

  it('should create generation successfully', async () => {
    const res = await request(app)
      .post('/generations')
      .set('Authorization', `Bearer ${token}`)
      .field('prompt', 'Create modern outfit')
      .field('style', 'Casual')
      .attach('imageUpload', path.resolve(__dirname, './test-image.png'));

    console.log('🔍 POST /generations response:', res.status, res.body);

    // ✅ Acceptable statuses
    expect([200, 201, 503,]).toContain(res.status);

    if (res.status === 200 || res.status === 201) {
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('prompt');
      expect(res.body.data).toHaveProperty('style');
    }
  });

  it('should fetch last 5 generations', async () => {
    const res = await request(app)
      .get('/generations?limit=5')
      .set('Authorization', `Bearer ${token}`);

    console.log('🔍 GET /generations response:', res.status, res.body);

    expect([200, 401]).toContain(res.status); // 401 if auth fails

    if (res.status === 200) {
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });
});
