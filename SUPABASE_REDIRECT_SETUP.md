# Supabase Redirect URL Configuration

## Problem
When users click the email confirmation link, it tries to redirect to `localhost` instead of your Vercel domain.

## Solution: Configure Redirect URLs in Supabase

### Step 1: Get Your Vercel Domain

Your Vercel domain should be something like:
- `https://self-mastery-os.vercel.app` (production)
- Or your custom domain if you have one

### Step 2: Configure Supabase Redirect URLs

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/url-configuration

2. **Set Site URL:**
   - **Site URL**: `https://your-vercel-domain.vercel.app`
   - This is the default redirect URL

3. **Add Redirect URLs:**
   Add these URLs to the **Redirect URLs** list:
   ```
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-vercel-domain.vercel.app/**
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

   **Important:** Replace `your-vercel-domain.vercel.app` with your actual Vercel domain.

4. **Click "Save"**

### Step 3: Configure Email Templates (Optional)

1. Go to: **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Update the redirect URL in the template if needed:
   ```
   {{ .ConfirmationURL }}
   ```
   This will automatically use the redirect URL you configured.

### Step 4: Test

1. Try signing up a new user
2. Check your email
3. Click the confirmation link
4. It should redirect to your Vercel domain, not localhost

## For Local Development

The code automatically detects the current origin, so:
- **Localhost**: Uses `http://localhost:3000/auth/callback`
- **Production**: Uses your Vercel domain automatically

## Additional Settings

### Enable Email Provider

1. Go to: **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings:
   - **Enable email confirmations**: ON (recommended)
   - **Secure email change**: ON (recommended)

### Email Service

Supabase has a free tier for emails, but you can also:
1. Use your own SMTP server
2. Configure in: **Authentication** → **SMTP Settings**

## Troubleshooting

### Still redirecting to localhost?

1. **Check your Vercel domain** - Make sure you're using the correct URL
2. **Clear browser cache** - Old redirects might be cached
3. **Check Supabase logs** - Go to **Logs** → **Auth** to see what's happening
4. **Verify environment variables** - Make sure `NEXT_PUBLIC_SUPABASE_URL` is set correctly in Vercel

### Email not sending?

1. Check **Authentication** → **Rate Limits**
2. Verify email provider is enabled
3. Check Supabase logs for email errors
4. Make sure you haven't exceeded the free tier limits

## Quick Checklist

- [ ] Site URL set to your Vercel domain
- [ ] Redirect URLs added (production + localhost)
- [ ] Email provider enabled
- [ ] Email confirmations enabled
- [ ] Environment variables set in Vercel
- [ ] Test signup flow works

