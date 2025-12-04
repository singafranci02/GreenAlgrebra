# Easiest Way to Share Your Website
# ===================================

## Option 1: Vercel (Easiest - 2 minutes) ⭐ RECOMMENDED

### Step 1: Deploy Frontend to Vercel

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository: `singafranci02/GreenAlgrebra`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click "Deploy"

**That's it!** Vercel will give you a URL like: `https://greenalgrebra.vercel.app`

### Step 2: Deploy Backend (if you want full functionality)

For now, the frontend will work but API calls will fail. To add backend:

1. Go to: https://railway.app/new
2. Click "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Python
5. Add environment variable: `PORT=8000`
6. Copy your backend URL

### Step 3: Connect Frontend to Backend

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Add: `VITE_API_URL` = your Railway backend URL
4. Redeploy

---

## Option 2: Netlify (Alternative - Also Easy)

1. Go to: https://app.netlify.com/start
2. Click "Import from Git"
3. Select GitHub → Your repository
4. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. Click "Deploy"

---

## Option 3: GitHub Pages (Free but more setup)

More complex, requires build setup. Not recommended for quick sharing.

---

## Quickest Solution Right Now:

**Just deploy the frontend to Vercel** - it takes 2 minutes and gives you a shareable link immediately!

The website will be live, but some features (like API calls) won't work until you add the backend. But people can see the UI and navigate around.

