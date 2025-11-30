import dotenv from 'dotenv';
import pino from 'pino';
import { envSchema } from '../schemas/env.schema';

// Load environment variables first, before any other imports
dotenv.config();

const logger = pino({
  level: 'error',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard'
    }
  }
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error({ msg: 'Invalid environment variables', errors: parsedEnv.error.format() });
  process.exit(1);
}

export const env = parsedEnv.data;

