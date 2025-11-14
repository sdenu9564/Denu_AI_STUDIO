import { Router } from "express";
import {createValidator} from 'express-joi-validation'
import * as AuthValidation from '../validations/auth.validations';
import * as AuthController from '../controllers/user.controllers';


const routes = Router();
const validate = createValidator();

routes.post(
    "/signup",
    validate.body(AuthValidation.signupValidation),
    AuthController.SingUpNewUser
);


routes.post(
    "/signin",
    validate.body(AuthValidation.signinValidation),
    AuthController.Signin
)



export default routes;

