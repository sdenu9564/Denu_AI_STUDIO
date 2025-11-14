import {Router} from 'express'
import { authLocal, authJwt } from '../services/auth.service';
import {createValidator} from 'express-joi-validation';
import * as ImageValidation from '../validations/image.validation';
import * as ImageGeneration from '../controllers/generation.controller'
import { upload } from '../utils/generated';


const routes = Router();
const validate = createValidator();



routes.post(
    "/",
    authJwt,
    upload.single('imageUpload'),
    validate.body(ImageValidation.imageValidation),
    ImageGeneration.createGeneration
)

routes.get(
    "/",
    authJwt,
    ImageGeneration.getImages
)

export default routes;