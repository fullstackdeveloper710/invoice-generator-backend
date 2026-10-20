import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../lib/errors.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { ERROR_MESSAGES } from '../constants/messages.js';

import { sendError } from '../lib/api-response.js';

/**
 * Centralised error handling. A known `AppError` sends its own safe
 * message and status code. Anything else is an unexpected failure: logged
 * in full (stack included) but never leaked to the client, which only ever
 * sees a generic message.
 *
 * Must be registered last, after every route and after `notFoundHandler`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express identifies error middleware by arity (4 params)
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof ZodError) {
    sendError(
      res,
      ERROR_CODES.VALIDATION_ERROR,
      ERROR_MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.BAD_REQUEST,
      err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    );
    return;
  }

  if (err instanceof AppError) {
    // AppErrors above 499 (none currently thrown deliberately) still count
    // as unexpected server failures worth logging in full.
    if (err.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      console.error({ err }, 'AppError with 5xx status');
    }
    sendError(res, err.code, err.message, err.statusCode);
    return;
  }

  // Malformed JSON / oversized body: body-parser errors carry a 4xx status.
  const status = (err as { status?: unknown } | null)?.status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    sendError(res, ERROR_CODES.VALIDATION_ERROR, ERROR_MESSAGES.VALIDATION_ERROR, status);
    return;
  }

  console.error({ err, path: req.path, method: req.method }, 'Unhandled error');

  sendError(
    res,
    ERROR_CODES.INTERNAL_ERROR,
    ERROR_MESSAGES.INTERNAL_ERROR,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    err instanceof Error ? err.stack : String(err),
  );
}
