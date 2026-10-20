import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/zod.js';
import connectDB from './config/db.js';
import invoiceRoutes from './routes/invoice.routes.js';
import { notFoundHandler } from './middleware/not-found.js';
import { errorHandler } from './middleware/error-handler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Invoice Generator API is running' });
});

// Invoice API Routes
app.use('/api/invoices', invoiceRoutes);

// 404 Handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
