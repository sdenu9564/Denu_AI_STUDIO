import { PrismaClient } from "@prisma/client";
import logger from "../config/winston";

// Enable comprehensive Prisma logging
const prisma = new PrismaClient({})

export default prisma;