import { PrismaClient, Prisma } from "@prisma/client";


import prisma from "../prisma/prismaClient";

interface CreateGenerationData {
  prompt: string;
  style: string;
  imageUrl: string;
  generatedImageUrl: string;
  status: string;
  userId: number;
}

export const createGenerationQuery = async (data: CreateGenerationData) => {
  const { userId, ...rest } = data;
  return prisma.generation.create({
    data: {
      ...rest,
      user: { connect: { id: Number(userId) } },
    },
  });
};

export const getUserGenerationsQuery = async (userId: number, limit = 5) => {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};
