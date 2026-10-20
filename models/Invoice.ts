import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ICustomField {
  label: string;
  value: string;
  isVisible: boolean;
}

export interface IPartyDetails {
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  issueDate: Date;
  dueDate?: Date;
  businessDetails: IPartyDetails;
  customerDetails: IPartyDetails;
  notes: string;
  lineItems: ILineItem[];
  discount: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  customFields: ICustomField[];
  createdAt: Date;
  updatedAt: Date;
}

export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}${month}${day}-${randomSuffix}`;
};

const lineItemSchema = new Schema<ILineItem>(
  {
    description: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 0, default: 1 },
    unitPrice: { type: Number, required: true, min: 0, default: 0 },
    lineTotal: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const customFieldSchema = new Schema<ICustomField>(
  {
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const partyDetailsSchema = new Schema<IPartyDetails>(
  {
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { _id: false }
);

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: generateInvoiceNumber,
    },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    businessDetails: { type: partyDetailsSchema, default: () => ({}) },
    customerDetails: { type: partyDetailsSchema, default: () => ({}) },
    notes: { type: String, default: '' },
    lineItems: [lineItemSchema],
    discount: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, default: 0, min: 0 },
    customFields: [customFieldSchema],
  },
  {
    timestamps: true,
  }
);

invoiceSchema.pre('validate', function () {
  if (!this.invoiceNumber || this.invoiceNumber.trim() === '') {
    this.invoiceNumber = generateInvoiceNumber();
  }
});

const Invoice: Model<IInvoice> = mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice;
