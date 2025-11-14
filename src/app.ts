import express from 'express';
import middlewaresConfig from './config/middleware';
import { staticUploads } from './config/middleware';
import ApiRoutes from './routes';
import prisma from './prisma/prismaClient';
import cors from 'cors';
import path from 'path';

const app = express();

middlewaresConfig(app);
app.use('/', ApiRoutes);
app.use('/uploads', ...staticUploads);


export default app;
