import type { Request, Response } from 'express';

import { ERROR_CODES } from '../constants/error-codes.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { sendError } from '../lib/api-response.js';

/** Mounted after every route. Anything reaching here matched no route. */
export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, ERROR_CODES.NOT_FOUND, ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
}
