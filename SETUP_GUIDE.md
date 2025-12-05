# Self Mastery OS - Setup Guide

## Current Setup (Single User - No Database Needed)

### ✅ What Works Right Now

Your app is **fully functional** without any database setup! Here's what you have:

1. **LocalStorage-based storage** - All data is stored in the browser
2. **No database required** - Works immediately
3. **Export/Import feature** - You can backup your data manually via Settings
4. **AI Coach** - Works in demo mode (or with Anthropic API key)

### ⚠️ Current Limitations

Since you're using localStorage:
- **Data is browser-specific** - Only available on the device/browser where you entered it
- **No sync across devices** - Phone, tablet, and computer have separate data
- **Data loss risk** - If you clear browser data, everything is lost
- **No automatic backup** - You need to manually export data

### 📝 What You Need to Do (Optional)

**For Single User (Current Setup):**
- ✅ **Nothing!** The app works as-is
- ⚠️ **Recommended:** Regularly export your data from Settings → Export All Data
- 🔑 **Optional:** Add `ANTHROPIC_API_KEY` in Vercel for real AI insights

---

## Multi-User Setup (Supabase)

If you want to:
- Support multiple users
- Sync data across devices
- Have automatic backups
- Add user authentication

Follow these steps:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name:** `self-mastery-os` (or your choice)
   - **Database Password:** (save this securely!)
   - **Region:** Choose closest to you
4. Wait for project to be created (~2 minutes)

### Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` from this repo
4. Paste into the SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates:
- ✅ All necessary tables (daily_entries, weekly_entries, goals, etc.)
- ✅ Row Level Security (RLS) policies (users can only see their own data)
- ✅ Indexes for performance
- ✅ Triggers for auto-updating timestamps

### Step 3: Get Supabase Credentials

1. In Supabase, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 4: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ... (your anon key)
```

4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

### Step 5: Update Code to Use Supabase

⚠️ **This requires code changes** - The current code uses localStorage. You'll need to:

1. Install Supabase client library (already in package.json)
2. Create a Supabase client utility
3. Update `src/lib/store.ts` to use Supabase instead of localStorage
4. Add authentication pages/components
5. Update all components to handle authentication state

**This is a significant refactor.** Would you like me to help you implement this?

### Step 6: Enable Authentication in Supabase

1. In Supabase, go to **Authentication** → **Providers**
2. Enable **Email** provider (or Google, GitHub, etc.)
3. Configure email templates if needed
4. Set up email service (Supabase has a free tier)

---

## Quick Comparison

| Feature | Current (LocalStorage) | Multi-User (Supabase) |
|---------|----------------------|---------------------|
| Setup Time | ✅ 0 minutes | ⏱️ ~30 minutes |
| Works Immediately | ✅ Yes | ❌ Requires setup |
| Multi-device Sync | ❌ No | ✅ Yes |
| Data Backup | ⚠️ Manual export | ✅ Automatic |
| Multiple Users | ❌ No | ✅ Yes |
| Authentication | ❌ No | ✅ Yes |
| Data Loss Risk | ⚠️ High (browser clear) | ✅ Low (cloud backup) |

---

## Recommendations

### For Personal Use (Single User)
- ✅ **Keep current setup** - It's simple and works great
- ✅ **Regular backups** - Export data weekly/monthly from Settings
- ✅ **Add Anthropic API key** - For real AI insights

### For Sharing with Others / Multiple Devices
- ✅ **Set up Supabase** - Follow the multi-user guide above
- ✅ **Implement authentication** - So each user has their own data
- ✅ **Deploy with environment variables** - For secure database access

---

## Need Help?

If you want to migrate to Supabase, I can help you:
1. Create the Supabase client setup
2. Refactor `store.ts` to use Supabase
3. Add authentication pages
4. Update all components to work with Supabase

Just let me know!

