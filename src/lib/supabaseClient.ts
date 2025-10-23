import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gulqlqlfsxdlkufmsxsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1bHFscWxmc3hkbGt1Zm1zeHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MTQwNTksImV4cCI6MjA3NjI5MDA1OX0.HJZ4iHdV626kF6OmGYMkNDKJS2MB2mTYgSC-JbVzZjE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});