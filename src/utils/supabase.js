import { createClient } from '@supabase/supabase-js';

const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const sbAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(sbUrl, sbAnon);

