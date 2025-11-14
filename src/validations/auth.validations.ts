import { ValidatedRequestSchema, ContainerTypes, createValidator } from 'express-joi-validation';
import Joi from 'joi';

export const validator = createValidator();

// Validation schema for signup
export const signupValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required!',
    'string.email': 'Please provide a valid email!',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Name is required!',
  }),
  phone_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must have 10 digits.',
      'string.empty': 'Phone number is required!',
    }),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,22}$/)
    .required()
    .messages({
      'string.empty': 'Password is required!',
      'string.pattern.base':
        'Password must be 8–22 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    }),
});

export const signinValidation =  Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email is required!',
            'string.email': 'Please provide a valid email!',
        }),
        password : Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,22}$/)
        .required()
        .messages({
            'string.empty': 'Password is required!',
            'string.pattern.base':
            'Password must be 8–22 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        })

})

// Type for validated request
export interface SignupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
    name: string;
    phone_number: string;
   password : string
  };
}

export interface SignInRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Body] : {
        email : string,
        password : string
    }
}


