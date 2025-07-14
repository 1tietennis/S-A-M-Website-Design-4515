import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nnxzyqznjinxjjwjgphz.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ueHp5cXpuamlueGpqd2pncGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzODc4MzQsImV4cCI6MjA2Nzk2MzgzNH0.Fb54wREVfn654CAAj3cmheoaNGb-h7fg0xMS-bLyk8A'

if(SUPABASE_URL == 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY == '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})