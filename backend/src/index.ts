import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import { logger, pinoLogger } from './middleware/logger';
import healthRoutes from './routes/health';
import invoiceRoutes from './routes/invoices';

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/health', healthRoutes);
app.use('/invoices', invoiceRoutes);

app.listen(PORT, () => {
  pinoLogger.info(`Backend running on http://localhost:${PORT}`);
});
