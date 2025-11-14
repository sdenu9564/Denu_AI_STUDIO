
// import express from 'express';
// import {createServer} from 'http';
// import constants from './config/constants';
// import middlewaresConfig from './config/middleware';
// import prisma  from './prisma/prismaClient'
// import ApiRoutes from "./routes/index";

// const app = express();
// const httpServer = createServer(app);

// middlewaresConfig(app);
// app.use('/api', ApiRoutes);

// httpServer.listen(constants.PORT, () => {
//         console.log(`API server listening on port: ${constants.PORT}`);
// })

// httpServer.on('error', async(err) => {
//     await prisma.$disconnect();
//     console.error('can not run !', err)
// })

import { createServer } from 'http';
import constants from './config/constants';
import prisma from './prisma/prismaClient';
import app from './app'; 

const httpServer = createServer(app);

httpServer.listen(constants.PORT, () => {
  console.log(`API server listening on port: ${constants.PORT}`);
});

httpServer.on('error', async (err) => {
  await prisma.$disconnect();
  console.error('Cannot run server:', err);
});

