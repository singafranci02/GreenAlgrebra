# Vercel Environments: Preview vs Production
# ==========================================

## Understanding Vercel Environments

Vercel has **3 types of environments**:

1. **Production** 🌟
   - Your main live website
   - Usually from `main` branch
   - Gets a stable URL (e.g., `greenalgrebra.vercel.app`)
   - Best for sharing with others

2. **Preview** 🔍
   - Created for every branch/commit
   - Temporary URLs (e.g., `greenalgrebra-git-main-username.vercel.app`)
   - Good for testing before production

3. **Development** 💻
   - Local development only

---

## How to Check Your Environment

### In Vercel Dashboard:
1. Go to your project: https://vercel.com/dashboard
2. Click on your project
3. Look at the deployments list
4. Check the badge:
   - **"Production"** = Production environment ✅
   - **"Preview"** = Preview environment

---

## How to Set Production Environment

### Option 1: Set Production Branch (Recommended)

1. Go to your project in Vercel
2. Click **Settings** → **Git**
3. Under **Production Branch**, select `main`
4. Save

Now every push to `main` will deploy to **Production** automatically.

### Option 2: Promote Preview to Production

1. Go to your project → **Deployments**
2. Find the deployment you want
3. Click the **"..."** menu (three dots)
4. Click **"Promote to Production"**

---

## Which URL to Share?

- **Production URL**: `https://greenalgrebra.vercel.app` (or your custom domain)
- **Preview URL**: `https://greenalgrebra-git-main-username.vercel.app` (temporary)

**Always share the Production URL** - it's stable and won't change.

---

## Quick Check:

If your URL looks like:
- ✅ `greenalgrebra.vercel.app` → **Production** (good to share!)
- ⚠️ `greenalgrebra-git-main-xxx.vercel.app` → **Preview** (promote to production)

---

## Set Production Branch Now:

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Settings → Git
4. Set **Production Branch** = `main`
5. Save

Your next deployment will be **Production**! 🎉

