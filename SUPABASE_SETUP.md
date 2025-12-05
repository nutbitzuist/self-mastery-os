# Supabase Setup Guide

## Step 1: Link to Your Supabase Project

You have two options:

### Option A: Create a New Project via CLI (Recommended)

1. **Login to Supabase:**
   ```bash
   supabase login
   ```

2. **Create a new project:**
   ```bash
   supabase projects create self-mastery-os
   ```
   
   Or link to an existing project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

### Option B: Create Project via Web Dashboard

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project reference ID from the project settings
3. Link it:
   ```bash
   supabase link --project-ref your-project-ref
   ```

## Step 2: Push Migrations

Once linked, push the database schema:

```bash
supabase db push
```

This will create all tables, indexes, RLS policies, and triggers.

## Step 3: Set Environment Variables

### For Local Development

Create `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- Supabase Dashboard → Settings → API
- Or run: `supabase status` (for local development)

### For Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project-ref.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
3. Redeploy

## Step 4: Enable Authentication

1. In Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider
3. Configure email templates (optional)
4. Set up email service (Supabase has a free tier)

## Step 5: Test the Setup

1. Start local development:
   ```bash
   npm run dev
   ```

2. The app will:
   - Use Supabase if environment variables are set
   - Fall back to localStorage if not configured
   - Show authentication UI if Supabase is configured

## Troubleshooting

### Migration Errors

If you get errors when pushing migrations:
```bash
# Check migration status
supabase migration list

# Reset local database (WARNING: deletes local data)
supabase db reset
```

### Authentication Not Working

- Check that RLS policies are enabled
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure email provider is enabled in Supabase

### Local Development

For local development with Supabase:
```bash
# Start local Supabase (requires Docker)
supabase start

# This will give you local URLs and keys
# Update .env.local with local values
```

## Next Steps

After setup:
1. ✅ Database schema is deployed
2. ✅ Authentication is enabled
3. ✅ Environment variables are set
4. 🎉 Your app is ready for multi-user support!

