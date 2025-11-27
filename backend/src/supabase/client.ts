import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url' && supabaseKey !== 'your-service-key') {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️  Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
  console.warn('⚠️  API endpoints will return errors until Supabase is configured.');
}

export { supabase };
