import { Request, Response, NextFunction } from 'express';
import PrettyError from 'pretty-error';
import HTTPStatus from 'http-status';
import APIError, { RequiredError } from './error.service';
import constants from '../config/constants';

// Determine if environment is development
const isDev = constants.NODE_ENV === 'development';

// Define a type-safe structure for known error shapes
interface ValidationErrorDetail {
  field: string;
  messages: string[];
}

interface ExpressError extends Error {
  status?: number;
  details?: Record<string, any> | ValidationErrorDetail[];
  errors?: Record<string, any> | ValidationErrorDetail[];
  isPublic?: boolean;
}

/**
 * Centralized Error Logging & Response Middleware
 * Logs errors in dev mode and returns clean error responses.
 */
export default function logErrorService(
  err: ExpressError,
  req: Request,
  res: Response,
  _next: NextFunction
): Response {
  if (!err) {
    const fallbackError = new APIError(
      'Error with the server!',
      HTTPStatus.INTERNAL_SERVER_ERROR,
      true
    );
    return res
      .status(fallbackError.status)
      .json({ message: fallbackError.message });
  }

  // 🧩 Developer-friendly error output
  if (isDev) {
    const pe = new PrettyError();
    pe.skipNodeFiles();
    pe.skipPackage('express');
    // eslint-disable-next-line no-console
    console.error(pe.render(err));
  }

  // 🧱 Base error response
  const errorResponse: Record<string, any> = {
    message: err.message || 'Internal Server Error.',
  };

  // 🧩 Handle Joi or custom validation errors
  if (err.details) {
    const { details } = err;
    errorResponse.errors = {};

    if (Array.isArray(details)) {
      // Joi or validation-array-style
      errorResponse.errors = RequiredError.makeValidationsPretty(details as any[]);
    } else {
      // Key-value object format
      for (const key of Object.keys(details)) {
        errorResponse.errors[key] = details[key];
      }
    }
  }

  // 🧩 Handle Sequelize / Mongoose style validation errors
  if (err.errors) {
    const { errors } = err;
    errorResponse.errors = {};

    if (Array.isArray(errors)) {
      errorResponse.errors = RequiredError.makePretty(errors);
    } else {
      for (const key of Object.keys(errors)) {
        errorResponse.errors[key] = errors[key].message;
      }
    }
  }

  // ✅ Final production response
  return res
    .status(err.status || HTTPStatus.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
}
