import { z } from 'zod';

export const partyDetailsSchema = z.object({
  name: z.string().optional().default(''),
  address: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
}).default({
  name: '',
  address: '',
  email: '',
  phone: '',
});

export const lineItemSchema = z.object({
  description: z.string().optional().default(''),
  quantity: z
    .number({ error: 'Quantity must be a number' })
    .min(0, 'Quantity cannot be negative'),
  unitPrice: z
    .number({ error: 'Unit price must be a number' })
    .min(0, 'Unit price cannot be negative'),
  lineTotal: z.number().min(0, 'Line total cannot be negative').optional(),
});

export const customFieldSchema = z.object({
  label: z.string().optional().default(''),
  value: z.string().optional().default(''),
  isVisible: z.boolean().optional().default(true),
});

export const createInvoiceSchema = z
  .object({
    issueDate: z.coerce.date().optional(),
    dueDate: z.coerce.date().optional(),
    businessDetails: partyDetailsSchema.optional(),
    customerDetails: partyDetailsSchema.optional(),
    notes: z.string().optional().default(''),
    lineItems: z.array(lineItemSchema).optional().default([]),
    discount: z
      .number({ error: 'Discount must be a number' })
      .min(0, 'Discount cannot be negative')
      .optional()
      .default(0),
    taxRate: z
      .number({ error: 'Tax rate must be a number' })
      .min(0, 'Tax rate cannot be negative')
      .optional()
      .default(0),
    customFields: z.array(customFieldSchema).optional().default([]),
  });

export const getInvoiceParamsSchema = z.object({
  id: z.string().min(1, 'Invoice ID is required'),
});

export const sendInvoiceEmailSchema = z.object({
  to: z.string().email('Invalid email address').optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type GetInvoiceParams = z.infer<typeof getInvoiceParamsSchema>;
export type SendInvoiceEmailInput = z.infer<typeof sendInvoiceEmailSchema>;
