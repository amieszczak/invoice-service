import { z } from 'zod';

export const nodeEnvEnum = z.enum(['development', 'production', 'test']).default('development');

export const envSchema = z.object({
  PORT: z.string().optional().default('4000'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  SUPABASE_DB_URL: z.string().url(),
  NODE_ENV: nodeEnvEnum,
});

export type Env = z.infer<typeof envSchema>;
