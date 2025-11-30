import dotenv from 'dotenv';
import { envSchema } from '../schemas/env.schema';
import { logger } from '../utils/logger';

// Load environment variables first, before any other imports
dotenv.config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error({ msg: 'Invalid environment variables', errors: parsedEnv.error.format() });
  process.exit(1);
}

export const env = parsedEnv.data;

