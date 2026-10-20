import nodemailer from 'nodemailer';
import type { IInvoice } from '../models/Invoice.js';
import { EmailSendError } from '../lib/errors.js';
import { getTransporter } from '../config/email.js';
import { generateInvoiceEmailHtml } from '../templates/invoice-email.template.js';

export { getTransporter };
export { generateInvoiceEmailHtml };

export interface SendEmailResult {
  messageId: string;
  recipient: string;
  previewUrl?: string | false;
}

export async function sendInvoiceEmail(
  invoice: IInvoice,
  recipientOverride?: string
): Promise<SendEmailResult> {
  const recipient =
    recipientOverride ||
    invoice.customerDetails?.email ||
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER;

  if (!recipient) {
    throw new EmailSendError('No recipient email address available for sending.');
  }

  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@invoicegenerator.com';
  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.businessDetails?.name || 'Business'}`;

  const htmlContent = generateInvoiceEmailHtml(invoice);
  const textContent = `
Invoice: ${invoice.invoiceNumber}
From: ${invoice.businessDetails?.name || 'Business'}
To: ${invoice.customerDetails?.name || 'Customer'}
Grand Total: $${invoice.grandTotal.toFixed(2)}
Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
  `.trim();

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject,
      text: textContent,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('Preview URL: %s', previewUrl);
    }

    return {
      messageId: info.messageId,
      recipient,
      previewUrl,
    };
  } catch (error) {
    const err = error as Error;
    console.error('Email sending error:', err);
    throw new EmailSendError(err.message || 'Failed to send invoice email');
  }
}
