import type { IInvoice } from '../models/Invoice.js';

export function generateInvoiceEmailHtml(invoice: IInvoice): string {
  const lineItemRows = (invoice.lineItems || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155;">${item.description || '-'}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #334155;">${item.quantity}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">$${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a;">$${item.lineTotal.toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const visibleCustomFields = (invoice.customFields || [])
    .filter((cf) => cf.isVisible)
    .map(
      (cf) => `
      <div style="margin-bottom: 4px; font-size: 13px; color: #475569;">
        <strong>${cf.label}:</strong> ${cf.value}
      </div>`
    )
    .join('');

  const issueDateFormatted = invoice.issueDate
    ? new Date(invoice.issueDate).toLocaleDateString()
    : 'N/A';
  const dueDateFormatted = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString()
    : 'N/A';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Invoice ${invoice.invoiceNumber}</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      
      <!-- Header -->
      <div style="background-color: #4f46e5; padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 700;">INVOICE</h1>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 14px;"># ${invoice.invoiceNumber}</p>
      </div>

      <div style="padding: 24px;">
        <!-- Parties -->
        <table style="width: 100%; margin-bottom: 24px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 50%; vertical-align: top;">
              <h3 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">From:</h3>
              <div style="font-weight: 600; font-size: 15px; color: #0f172a;">${invoice.businessDetails?.name || 'Business'}</div>
              <div style="font-size: 13px; color: #475569; white-space: pre-line;">${invoice.businessDetails?.address || ''}</div>
              <div style="font-size: 13px; color: #475569;">${invoice.businessDetails?.email || ''}</div>
              <div style="font-size: 13px; color: #475569;">${invoice.businessDetails?.phone || ''}</div>
            </td>
            <td style="width: 50%; vertical-align: top;">
              <h3 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Billed To:</h3>
              <div style="font-weight: 600; font-size: 15px; color: #0f172a;">${invoice.customerDetails?.name || 'Customer'}</div>
              <div style="font-size: 13px; color: #475569; white-space: pre-line;">${invoice.customerDetails?.address || ''}</div>
              <div style="font-size: 13px; color: #475569;">${invoice.customerDetails?.email || ''}</div>
              <div style="font-size: 13px; color: #475569;">${invoice.customerDetails?.phone || ''}</div>
            </td>
          </tr>
        </table>

        <!-- Dates -->
        <table style="width: 100%; margin-bottom: 24px; background-color: #f1f5f9; border-radius: 6px; padding: 12px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size: 13px;"><strong>Issue Date:</strong> ${issueDateFormatted}</td>
            <td style="font-size: 13px; text-align: right;"><strong>Due Date:</strong> ${dueDateFormatted}</td>
          </tr>
        </table>

        <!-- Line items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;" cellpadding="0" cellspacing="0">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 12px; text-transform: uppercase; color: #64748b;">
              <th style="padding: 10px 12px; text-align: left;">Description</th>
              <th style="padding: 10px 12px; text-align: center;">Qty</th>
              <th style="padding: 10px 12px; text-align: right;">Price</th>
              <th style="padding: 10px 12px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemRows || '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8;">No items</td></tr>'}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="margin-left: auto; width: 240px; margin-bottom: 24px;">
          <table style="width: 100%; font-size: 14px;" cellpadding="4" cellspacing="0">
            <tr>
              <td style="color: #64748b;">Subtotal:</td>
              <td style="text-align: right; font-weight: 500;">$${invoice.subtotal.toFixed(2)}</td>
            </tr>
            ${
              invoice.discount > 0
                ? `<tr>
                    <td style="color: #64748b;">Discount:</td>
                    <td style="text-align: right; color: #ef4444;">-$${invoice.discount.toFixed(2)}</td>
                  </tr>`
                : ''
            }
            ${
              invoice.taxRate > 0
                ? `<tr>
                    <td style="color: #64748b;">Tax (${invoice.taxRate}%):</td>
                    <td style="text-align: right; font-weight: 500;">$${invoice.taxAmount.toFixed(2)}</td>
                  </tr>`
                : ''
            }
            <tr style="border-top: 2px solid #e2e8f0; font-size: 16px; font-weight: 700;">
              <td style="padding-top: 8px; color: #0f172a;">Grand Total:</td>
              <td style="padding-top: 8px; text-align: right; color: #4f46e5;">$${invoice.grandTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        ${
          visibleCustomFields
            ? `<div style="border-top: 1px solid #e2e8f0; padding-top: 14px; margin-bottom: 14px;">
                <h4 style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #64748b;">Additional Info</h4>
                ${visibleCustomFields}
              </div>`
            : ''
        }

        ${
          invoice.notes
            ? `<div style="border-top: 1px solid #e2e8f0; padding-top: 14px;">
                <h4 style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #64748b;">Notes</h4>
                <p style="margin: 0; font-size: 13px; color: #475569; white-space: pre-line;">${invoice.notes}</p>
              </div>`
            : ''
        }

      </div>
    </div>
  </body>
  </html>
  `;
}
