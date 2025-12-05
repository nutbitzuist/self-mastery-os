# Supabase Email Configuration Guide

## Finding Email Templates in Supabase Dashboard

The email templates location may vary. Here are the steps:

### Option 1: Via Authentication Settings

1. Go to: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog
2. Click **Authentication** in the left sidebar
3. Look for one of these:
   - **Email Templates** (direct link)
   - **Templates** tab
   - **Settings** → **Email Templates**
   - **Configuration** → **Email Templates**

### Option 2: Via Project Settings

1. Go to: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog
2. Click **Settings** (gear icon) in the left sidebar
3. Click **Auth** in the settings menu
4. Scroll down to find **Email Templates** section

### Option 3: Direct URL

Try this direct URL:
- https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/templates

## Most Important: Redirect URLs Configuration

Even if you can't find email templates, the **Redirect URLs** are the most critical setting:

### Step 1: Go to URL Configuration

1. Go to: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/url-configuration
   
   OR navigate: **Authentication** → **URL Configuration**

### Step 2: Configure These Settings

**Site URL:**
```
https://your-vercel-domain.vercel.app
```
(Replace with your actual Vercel domain)

**Redirect URLs** (add each on a new line):
```
https://your-vercel-domain.vercel.app/auth/callback
https://your-vercel-domain.vercel.app/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

### Step 3: Save

Click **Save** at the bottom of the page.

## Email Provider Settings

### Enable Email Provider

1. Go to: **Authentication** → **Providers**
2. Find **Email** provider
3. Make sure it's **Enabled**
4. Configure:
   - ✅ **Enable email confirmations**: ON
   - ✅ **Secure email change**: ON (recommended)
   - **Double confirm email changes**: ON (optional, extra security)

## Email Templates (If Available)

If you find the Email Templates section, you can customize:

### Confirm Signup Template

The default template should work, but you can customize:
- Subject: "Confirm your signup"
- Body: Should include `{{ .ConfirmationURL }}` which will be replaced with the redirect URL

### Magic Link Template

For passwordless login (if you enable it later).

## SMTP Settings (Optional - For Custom Email)

If you want to use your own email service:

1. Go to: **Project Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP server
3. This is optional - Supabase has a free email service

## Testing

After configuration:

1. Try signing up a new user
2. Check email inbox
3. Click the confirmation link
4. Should redirect to your Vercel domain (not localhost)

## Troubleshooting

### Can't find Email Templates?

**Don't worry!** The default email template works fine. The most important thing is:
- ✅ **Redirect URLs** are configured correctly
- ✅ **Email confirmations** are enabled
- ✅ **Site URL** is set to your Vercel domain

### Email not sending?

1. Check **Authentication** → **Rate Limits**
2. Verify you haven't exceeded free tier limits
3. Check **Logs** → **Auth** for errors
4. Make sure email provider is enabled

### Still redirecting to localhost?

1. Double-check **Redirect URLs** in URL Configuration
2. Make sure you added both:
   - `https://your-domain.vercel.app/auth/callback`
   - `https://your-domain.vercel.app/**`
3. Clear browser cache
4. Try in incognito mode

## Quick Reference

**Most Important Settings:**
- **URL Configuration**: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/url-configuration
- **Providers**: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/providers
- **Settings**: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/settings/auth

