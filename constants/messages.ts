export const ERROR_MESSAGES = {
  NOT_FOUND: 'Not found',
  FORBIDDEN: 'You do not have permission to perform this action',
  UNAUTHORIZED: 'Authentication required',
  VALIDATION_ERROR: 'Invalid request',
  CONFLICT: 'Resource conflict',
  INTERNAL_ERROR: 'Something went wrong. Please try again.',
  INVOICE_NOT_FOUND: 'Invoice not found',
  DISCOUNT_EXCEEDS_SUBTOTAL: 'Discount cannot exceed subtotal',
  EMAIL_SEND_FAILED: 'Failed to send invoice email',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESSFUL: 'Login successful',
  INVOICE_SAVED: 'Invoice saved successfully',
  INVOICE_RETRIEVED: 'Invoice retrieved successfully',
  EMAIL_SENT: 'Invoice email sent successfully',
} as const;
