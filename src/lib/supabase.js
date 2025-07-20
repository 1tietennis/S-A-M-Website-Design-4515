import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rmmksezgsqfcapupzmum.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbWtzZXpnc3FmY2FwdXB6bXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MDQ0MDQsImV4cCI6MjA2NjQ4MDQwNH0.ffMvz3a7j_cmTdgtSEiNJMLbzujFxgOvhzH2PyNN6c0'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})