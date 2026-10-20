# Invoice Generator - Backend

Backend API for the Invoice Generator application. Built with Express, TypeScript, and MongoDB.

## Tech Stack

- Node.js & Express 5
- TypeScript
- MongoDB with Mongoose
- Zod (request validation)
- Nodemailer (email dispatch)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your MongoDB connection string and email SMTP credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/invoice_generator

   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=your_email@example.com
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

   API will be accessible at `http://localhost:5000`.

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - Health check
- `POST /api/invoices` - Create or update an invoice
- `GET /api/invoices/:id` - Fetch an invoice by ID
- `POST /api/invoices/:id/send` - Send invoice via email (optional `to` field in body)
