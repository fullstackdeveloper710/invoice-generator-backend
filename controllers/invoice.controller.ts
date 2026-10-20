import type { Request, Response, NextFunction } from 'express';
import { saveInvoice, getInvoiceById, sendInvoiceEmailById } from '../services/invoice.service.js';
import { sendSuccess } from '../lib/api-response.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { SUCCESS_MESSAGES } from '../constants/messages.js';

export async function createInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoice = await saveInvoice(req.body);
    sendSuccess(res, invoice, SUCCESS_MESSAGES.INVOICE_SAVED, HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
}

export async function getInvoiceController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const invoice = await getInvoiceById(req.params.id as string);
    sendSuccess(res, invoice, SUCCESS_MESSAGES.INVOICE_RETRIEVED, HTTP_STATUS.OK);
  } catch (error) {
    next(error);
  }
}

export async function sendInvoiceEmailController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params as { id: string };
    // `to` is an optional recipient override validated by sendInvoiceEmailSchema
    const { to } = req.body as { to?: string };

    const result = await sendInvoiceEmailById(id, to);

    sendSuccess(
      res,
      {
        messageId: result.messageId,
        recipient: result.recipient,
        ...(result.previewUrl ? { previewUrl: result.previewUrl } : {}),
      },
      SUCCESS_MESSAGES.EMAIL_SENT,
      HTTP_STATUS.OK,
    );
  } catch (error) {
    next(error);
  }
}
