import { HTTP_STATUS } from '../constants/http-status.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { ERROR_CODES } from '../constants/error-codes.js';

/**
 * A thrown AppError carries a message safe to send to the client and the
 * HTTP status it should map to. Anything else that throws is treated as an
 * unexpected failure — logged in full, but never leaked to the response
 * (see src/middleware/error-handler.ts).
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    code: string = ERROR_CODES.UNAUTHORIZED,
    message: string = ERROR_MESSAGES.UNAUTHORIZED,
  ) {
    super(HTTP_STATUS.UNAUTHORIZED, code, message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION_ERROR) {
    super(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = ERROR_MESSAGES.CONFLICT) {
    super(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, message);
  }
}

export class EmailSendError extends AppError {
  constructor(message: string = ERROR_MESSAGES.EMAIL_SEND_FAILED) {
    super(HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.EMAIL_SEND_FAILED, message);
  }
}
