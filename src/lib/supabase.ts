import { createClient } from '@supabase/supabase-js';

// Get environment variables (works in both server and client)
const supabaseUrl = typeof window !== 'undefined' 
  ? (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  : process.env.NEXT_PUBLIC_SUPABASE_URL || '';

const supabaseAnonKey = typeof window !== 'undefined'
  ? (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. The app will use localStorage fallback.');
  console.warn('URL:', supabaseUrl ? 'Set' : 'Missing');
  console.warn('Key:', supabaseAnonKey ? 'Set' : 'Missing');
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  const configured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co');
  if (!configured && typeof window !== 'undefined') {
    console.log('Supabase check:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl?.substring(0, 30) + '...',
    });
  }
  return configured;
};

