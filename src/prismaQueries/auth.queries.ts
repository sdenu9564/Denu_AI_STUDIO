import { PrismaClient, Prisma } from "@prisma/client";

import prisma from '../prisma/prismaClient';

export const getUser = async (obj: Record<string, any>) => {
  const { id, email, phone_number } = obj;

  const whereClause: Prisma.UserWhereInput = {};

  if (id) whereClause.id = id;

  if (email || phone_number) {
    whereClause.OR = [
      ...(email ? [{ email }] : []),
      ...(phone_number ? [{ phone_number }] : []),
    ];
  }

  return await prisma.user.findFirst({
    where: whereClause,
  });
};


export const storeSecret = async (email: string, secret: string) => {
  await prisma.user.update({
    where: { email },
    data: { secret },
  });
};

export const createUser = async (
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  password: string
) => {
  return await prisma.user.create({
    data: {
      first_name,
      last_name,
      email,
      phone_number,
      password,
    },
  });
};
