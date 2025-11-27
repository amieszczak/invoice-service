// Ensure environment variables are loaded
import '../config/env';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url' && supabaseKey !== 'your-service-key') {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
  console.log(`📍 Supabase URL: ${supabaseUrl.substring(0, 30)}...`);
} else {
  console.warn('⚠️  Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
  console.warn('⚠️  API endpoints will return errors until Supabase is configured.');
  if (!supabaseUrl) console.warn('   Missing: SUPABASE_URL');
  if (!supabaseKey) console.warn('   Missing: SUPABASE_SERVICE_KEY');
}

export { supabase };
