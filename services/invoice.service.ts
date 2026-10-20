import mongoose from 'mongoose';
import Invoice, { IInvoice, ILineItem } from '../models/Invoice.js';
import { CreateInvoiceInput } from '../validators/invoice.validator.js';
import { NotFoundError, ValidationError } from '../lib/errors.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { sendInvoiceEmail, SendEmailResult } from './email.service.js';

export interface CalculatedTotals {
  lineItems: ILineItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
}

export function calculateInvoiceTotals(
  items: Array<{ description?: string; quantity: number; unitPrice: number }>,
  discount: number = 0,
  taxRate: number = 0
): CalculatedTotals {
  // 1. Round each line to cents
  const calculatedLineItems: ILineItem[] = items.map((item) => {
    const lineTotal = Math.round(item.quantity * item.unitPrice * 100) / 100;
    return {
      description: item.description || '',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal,
    };
  });

  // 2. Sum line totals to get subtotal
  const rawSubtotal = calculatedLineItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const subtotal = Math.round(rawSubtotal * 100) / 100;

  // 3. Discount cannot exceed subtotal
  if (discount > subtotal) {
    throw new ValidationError(ERROR_MESSAGES.DISCOUNT_EXCEEDS_SUBTOTAL);
  }

  // 4. Apply discount, calculate tax on discounted amount, then round
  const discountedAmount = Math.max(0, subtotal - discount);
  const taxAmount = Math.round(discountedAmount * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.round((discountedAmount + taxAmount) * 100) / 100;

  return {
    lineItems: calculatedLineItems,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    grandTotal,
  };
}

export async function saveInvoice(input: CreateInvoiceInput): Promise<IInvoice> {
  const totals = calculateInvoiceTotals(
    input.lineItems || [],
    input.discount || 0,
    input.taxRate || 0
  );

  const invoiceData: Partial<IInvoice> = {
    ...input,
    lineItems: totals.lineItems,
    subtotal: totals.subtotal,
    discount: totals.discount,
    taxRate: totals.taxRate,
    taxAmount: totals.taxAmount,
    grandTotal: totals.grandTotal,
  };

  const invoice = new Invoice(invoiceData);
  const savedInvoice = await invoice.save();
  return savedInvoice;
}

export async function getInvoiceById(id: string): Promise<IInvoice> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(ERROR_MESSAGES.INVOICE_NOT_FOUND);
  }

  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new NotFoundError(ERROR_MESSAGES.INVOICE_NOT_FOUND);
  }

  return invoice;
}

export async function sendInvoiceEmailById(
  id: string,
  recipientOverride?: string
): Promise<SendEmailResult> {
  const invoice = await getInvoiceById(id);
  return sendInvoiceEmail(invoice, recipientOverride);
}

