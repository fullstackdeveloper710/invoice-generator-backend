import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporterInstance: Transporter | null = null;

export function getTransporter(): Transporter {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const port = Number(process.env.EMAIL_PORT) || 587;

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporterInstance;
}
