import { createClient } from '@supabase/supabase-js';

export const client = createClient(
    process.env.DEV_OPS_SUPABASE_URL, 
    process.env.DEV_OPS_SUPABASE_ANON_KEY
);
