import { env } from '../config/env';
import { logger } from '../utils/logger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

export const migrationService = {
  async runMigrations(): Promise<void> {
    try {
      logger.info('Starting database migrations...');
      
      if (!env.SUPABASE_DB_URL) {
        logger.warn('SUPABASE_DB_URL not provided. Skipping automatic migrations.');
        return;
      }
      
      const migrationPath = join(__dirname, '../../..', 'supabase', 'migrations', '20251203000000_create_invoices_table.sql');
      const migrationSQL = readFileSync(migrationPath, 'utf-8');
      
      const pool = new Pool({
        connectionString: env.SUPABASE_DB_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      try {
        await pool.query(migrationSQL);
        logger.info('Database migrations completed successfully');
      } finally {
        await pool.end();
      }
      
    } catch (err) {
      const error = err as Error;
      if (error.message?.includes('already exists')) {
        logger.info('Migration tables already exist - skipping');
      } else {
        logger.error({ msg: 'Failed to run migrations', error: error.message });
      }
    }
  }
};
