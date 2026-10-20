import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import {
  createInvoiceSchema,
  getInvoiceParamsSchema,
  sendInvoiceEmailSchema,
} from '../validators/invoice.validator.js';
import {
  createInvoiceController,
  getInvoiceController,
  sendInvoiceEmailController,
} from '../controllers/invoice.controller.js';

const router = Router();

router.post('/', validate(createInvoiceSchema, 'body'), createInvoiceController);
router.get('/:id', validate(getInvoiceParamsSchema, 'params'), getInvoiceController);
router.post(
  '/:id/send',
  validate(getInvoiceParamsSchema, 'params'),
  validate(sendInvoiceEmailSchema, 'body'),
  sendInvoiceEmailController,
);

export default router;

