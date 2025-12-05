# Supabase Quick Setup Guide

## ✅ Essential Configuration (Do This First!)

### 1. Configure Redirect URLs (MOST IMPORTANT)

**Direct Link:** https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/url-configuration

**Steps:**
1. **Site URL**: Set to your Vercel domain
   ```
   https://your-vercel-domain.vercel.app
   ```

2. **Redirect URLs**: Add these (one per line):
   ```
   https://your-vercel-domain.vercel.app/auth/callback
   https://your-vercel-domain.vercel.app/**
   http://localhost:3000/auth/callback
   http://localhost:3000/**
   ```

3. Click **Save**

### 2. Enable Email Provider

**Direct Link:** https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/providers

**Steps:**
1. Click on **Email** provider
2. Enable:
   - ✅ **Enable email confirmations**: ON
   - ✅ **Secure email change**: ON
3. Click **Save**

## 📧 Email Templates (Optional)

If you want to customize emails, try these locations:

**Option 1:** Authentication → Settings → Email Templates
**Option 2:** Project Settings → Auth → Email Templates  
**Option 3:** Direct link: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/templates

**Note:** The default email template works fine! It automatically uses your configured redirect URLs. You don't need to change it unless you want custom email content.

## 🎯 What You Actually Need

**Minimum Required:**
- ✅ Redirect URLs configured (Step 1 above)
- ✅ Email confirmations enabled (Step 2 above)

**That's it!** The default email template will work with your redirect URLs.

## 🔍 Finding Settings in Supabase Dashboard

If you're having trouble navigating:

1. **URL Configuration:**
   - Left sidebar → **Authentication** → **URL Configuration**
   - OR: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/url-configuration

2. **Email Provider:**
   - Left sidebar → **Authentication** → **Providers** → Click **Email**
   - OR: https://supabase.com/dashboard/project/fqccyqrbfbxqpjlgaoog/auth/providers

3. **Project Settings:**
   - Left sidebar → **Settings** (gear icon) → **Auth**

## ✅ Quick Checklist

- [ ] Site URL = Your Vercel domain
- [ ] Redirect URLs added (4 URLs total)
- [ ] Email confirmations = ON
- [ ] Clicked Save on both pages

After this, email confirmations should work! 🎉

