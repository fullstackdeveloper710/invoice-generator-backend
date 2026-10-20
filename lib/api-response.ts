import type { Response } from 'express';
import { HTTP_STATUS } from '../constants/http-status.js';

export interface ISuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

export interface IError {
  success: false;
  statusCode: number;
  message: string;
  code: string;
  details?: unknown;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = HTTP_STATUS.OK,
): void {
  const resObj: ISuccess<T> = {
    success: true,
    statusCode,
    message,
    data: data ?? ({} as T),
  };
  res.status(statusCode).json(resObj);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode: number = HTTP_STATUS.BAD_REQUEST,
  details?: unknown,
): void {
  const resObj: IError = {
    success: false,
    statusCode,
    message,
    code,
    ...(details !== undefined ? { details } : {}),
  };
  res.status(statusCode).json(resObj);
}
