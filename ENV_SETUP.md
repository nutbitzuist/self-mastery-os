# Environment Variables Setup

## Your Supabase Project

- **Project Reference ID:** `fqccyqrbfbxqpjlgaoog`
- **Project URL:** `https://fqccyqrbfbxqpjlgaoog.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog

## Get Your API Keys

1. Go to: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/settings/api

2. Copy these values:
   - **Project URL** (should be: `https://fqccyqrbfbxqpjlgaoog.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Local Development (.env.local)

Create a file `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://fqccyqrbfbxqpjlgaoog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For AI Coach
ANTHROPIC_API_KEY=your-api-key-here
```

## Vercel Deployment

1. Go to: https://vercel.com/dashboard
2. Select your `self-mastery-os` project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://fqccyqrbfbxqpjlgaoog.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key-here`
   - `ANTHROPIC_API_KEY` = `your-api-key-here` (optional)
5. Select all environments (Production, Preview, Development)
6. Click **Save**
7. Redeploy your application

## Verify Setup

After setting environment variables:

1. Restart your dev server: `npm run dev`
2. Check browser console - should see no Supabase warnings
3. The app will use Supabase when variables are set, localStorage otherwise

