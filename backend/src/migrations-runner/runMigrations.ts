import { env } from '../config/env';
import { logger } from '../utils/logger';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

export const runMigrations = async (): Promise<void> => {
  logger.info('Starting database migrations...');

  let pool: Pool | null = null;
  
  try {
    const migrationsDir = join(__dirname, '../../..', 'supabase', 'migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (migrationFiles.length === 0) {
      logger.warn('No migration files found in supabase/migrations');
      return;
    }
    
    pool = new Pool({
      connectionString: env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false } // Disabled for local dev; enable SSL verification in production
    });
    
    for (const file of migrationFiles) {
      const migrationPath = join(migrationsDir, file);
      const migrationSQL = readFileSync(migrationPath, 'utf-8');
      
      logger.info(`Running migration: ${file}`);
      await pool.query(migrationSQL);
    }
    
    logger.info(`Database migrations completed successfully (${migrationFiles.length} file(s))`);
  } catch (err) {
    const error = err as Error;
    if (error.message?.includes('already exists')) {
      logger.info('Migration objects already exist - skipping');
    } else {
      logger.error({ msg: 'Failed to run migrations', error: error.message });
    }
  } finally {
    if (pool) {
      await pool.end();
    }
  }
};
