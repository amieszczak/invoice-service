import { env } from './config/env';
import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger';
import { logger } from './utils/logger';
import healthRoutes from './routes/health';
import invoiceRoutes from './routes/invoices';
import { runMigrations } from './migrations-runner/runMigrations';

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/health', healthRoutes);
app.use('/invoices', invoiceRoutes);

runMigrations().then(() => {
  app.listen(PORT, () => {
    logger.info(`Backend running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  logger.error({ msg: 'Failed to start server', error });
  process.exit(1);
});
