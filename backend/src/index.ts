// Load environment variables first
import './config/env';

import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger';
import healthRoutes from './routes/health';
import invoiceRoutes from './routes/invoices';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/health', healthRoutes);
app.use('/invoices', invoiceRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
