import { ValidatedRequestSchema, ContainerTypes, createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const validator = createValidator();


export const imageValidation = Joi.object({
  prompt: Joi.string().trim().min(3).max(500).required().messages({
    "string.empty": "Prompt is required",
    "string.min": "Prompt should have at least 3 characters",
    "string.max": "Prompt cannot exceed 500 characters",
  }),

  style: Joi.string().trim().optional().messages({
    "string.base": "Style must be a string",
  }),
});

export interface ImageUploadRequestchema extends ValidatedRequestSchema {
    [ContainerTypes.Body] : {
        prompt : string,
       style?: string;
        image: {
            originalname: string;
            mimetype: 'image/jpeg' | 'image/png';
            size: number;
            buffer?: Buffer;
        };

    }
}