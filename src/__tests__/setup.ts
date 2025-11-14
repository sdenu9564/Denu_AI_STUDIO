import prisma from '../prisma/prismaClient';

beforeEach(async () => {
  // await prisma.generation.deleteMany();
  // await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
