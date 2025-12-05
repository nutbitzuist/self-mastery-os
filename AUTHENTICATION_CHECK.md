# Authentication Check & Troubleshooting

## Why You're Not Seeing Login Screen

If you're not being prompted to sign in, it's likely because:

1. **Dev Server Needs Restart**: Next.js needs to be restarted to pick up `.env.local` changes
2. **Environment Variables Not Loaded**: The browser might not have the variables yet

## Quick Fix

1. **Stop your dev server** (Ctrl+C)
2. **Restart it**:
   ```bash
   npm run dev
   ```
3. **Clear browser cache/localStorage**:
   - Open browser DevTools (F12)
   - Go to Application → Local Storage
   - Clear all data for localhost:3000
   - Or use Incognito/Private window

4. **Refresh the page** - You should now see the login screen

## Verify Supabase is Configured

Check the browser console (F12 → Console). You should see:
- If configured: No warnings about Supabase
- If not configured: Warning message about localStorage fallback

## Test Authentication

1. Visit: http://localhost:3000
2. You should see a login screen
3. Click "Sign up" to create an account
4. After signup, you'll be logged in

## Current Status

- ✅ **Database**: Ready (migrations pushed)
- ✅ **Auth Components**: Created
- ✅ **Environment Variables**: Set in `.env.local`
- ⚠️ **Requires**: Dev server restart to load env vars

## User Settings

User settings are now integrated with Supabase:
- Settings are saved to your user profile in Supabase
- Each user has their own settings
- Falls back to localStorage if Supabase isn't configured

