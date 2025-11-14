import { NextFunction, Router } from "express";
import HttpStatus  from "http-status";


import APIError from "../services/error.service";
import logErrorService from "../services/log.service";


import UserRoutes from './auth';
import GenerationRoutes from './generation';


const routes = Router();

routes.use('/auth', UserRoutes);
routes.use('/generations', GenerationRoutes);


routes.all('', (req ,res,next) =>
  next(new APIError('Route Not Found!', HttpStatus.NOT_FOUND, true))
);

routes.use(logErrorService);


export default routes;