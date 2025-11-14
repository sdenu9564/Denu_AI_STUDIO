import httpStatus from 'http-status';

/**
 * Base class extending Error to add status and visibility control.
 */
export class ExtendableError extends Error {
  public status: number;
  public isPublic: boolean;
  public isOperational: boolean;

  constructor(message: string, status: number, isPublic: boolean) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    Error.captureStackTrace(this, new.target);
  }
}

/**
 * Class representing an API error.
 */
export class APIError extends ExtendableError {
  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    isPublic: boolean = false
  ) {
    super(message, status, isPublic);
  }
}

/**
 * Interface describing validation error shape
 */
interface ValidationError {
  field: string;
  messages: string[];
}

/**
 * Class for formatting required/validation errors.
 */
export class RequiredError {
  /**
   * Transform Joi-like error arrays into a readable key-value object.
   */
  static makePretty(errors: ValidationError[]): Record<string, string> {
    return errors.reduce((obj, error) => {
      return {
        ...obj,
        [error.field]: error.messages[0]!.replace(/"/g, ''),
      };
    }, {});
  }

  /**
   * Merge multiple validation error objects into one.
   */
  static makeValidationsPretty(errors: Record<string, string>[]): Record<string, string> {
    return errors.reduce((obj, error) => ({ ...obj, ...error }), {});
  }
}

export default APIError;
