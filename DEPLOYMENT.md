# Deployment Guide for GreenAlgebra
# ===================================
# Free hosting options to make your app publicly accessible

## Quick Deploy Options (Recommended)

### Option 1: Vercel (Frontend) + Railway (Backend) - EASIEST ⭐

**Frontend (Vercel):**
- Free tier: Unlimited projects, 100GB bandwidth
- Auto-deploys from GitHub
- Custom domains included

**Backend (Railway):**
- Free tier: $5 credit/month (enough for small apps)
- Auto-deploys from GitHub
- Environment variables support

### Option 2: Netlify (Frontend) + Render (Backend)

**Frontend (Netlify):**
- Free tier: 100GB bandwidth, 300 build minutes/month
- Auto-deploys from GitHub

**Backend (Render):**
- Free tier: Spins down after 15min inactivity (wakes on request)
- Auto-deploys from GitHub

### Option 3: All-in-One: Fly.io (Both Frontend & Backend)

**Fly.io:**
- Free tier: 3 shared VMs, 3GB storage
- Can host both frontend and backend
- More setup required

---

## Step-by-Step: Vercel + Railway (Recommended)

### Prerequisites
1. GitHub account
2. Vercel account (free): https://vercel.com/signup
3. Railway account (free): https://railway.app/signup

### Step 1: Initialize Git & Push to GitHub

```bash
# In your project directory
cd /Users/francescotomatis/Noyakka/GreenAlgrebra

# Initialize git
git init
git add .
git commit -m "Initial commit: GreenAlgebra ESG Platform"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/GreenAlgebra.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your GreenAlgebra repository
4. Railway will auto-detect Python
5. Set these environment variables in Railway dashboard:
   ```
   PORT=8000
   PYTHON_VERSION=3.9
   ```
6. Railway will give you a URL like: `https://greenalgebra-backend.railway.app`
7. Copy this URL - you'll need it for the frontend

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://greenalgebra-backend.railway.app
   ```
6. Click "Deploy"
7. Vercel will give you a URL like: `https://greenalgebra.vercel.app`

### Step 4: Update Backend CORS

Update `backend/main.py` to include your Vercel URL in CORS origins.

### Step 5: Share Your App!

Your app will be live at: `https://greenalgebra.vercel.app`

---

## Alternative: Render (Free Tier)

### Backend on Render:

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - **Name:** greenalgebra-backend
   - **Environment:** Python 3
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:**
     ```
     PORT=10000
     ```
5. Render gives you: `https://greenalgebra-backend.onrender.com`

**Note:** Render free tier spins down after 15min inactivity. First request takes ~30s to wake up.

---

## Environment Variables Needed

### Backend (Railway/Render):
```
PORT=8000
FIREBASE_CONFIG=<your-firebase-config-json>  # Optional, can run in demo mode
```

### Frontend (Vercel/Netlify):
```
VITE_API_URL=https://your-backend-url.railway.app
```

---

## Firebase Setup (Optional)

If you want real database:
1. Keep using Firebase Firestore
2. Add `FIREBASE_CONFIG` as environment variable in Railway/Render
3. Or keep `firebase-credentials.json` in backend (not recommended for production)

---

## Custom Domain (Optional)

Both Vercel and Railway support custom domains:
- Vercel: Add domain in project settings
- Railway: Add custom domain in service settings

---

## Monitoring & Updates

- **Vercel:** Auto-deploys on every git push to main
- **Railway:** Auto-deploys on every git push to main
- Both provide logs and monitoring dashboards

---

## Cost Summary

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| Vercel | ✅ Free | Unlimited projects, 100GB bandwidth |
| Railway | ✅ $5 credit/month | ~500 hours of runtime |
| Render | ✅ Free | Spins down after inactivity |
| Firebase | ✅ Free | 1GB storage, 50K reads/day |

**Total Cost: $0/month** (if within free tier limits)

---

## Troubleshooting

### Backend not connecting?
- Check CORS settings in `backend/main.py`
- Verify `VITE_API_URL` in frontend environment variables
- Check Railway/Render logs

### Frontend shows errors?
- Check browser console
- Verify API URL is correct
- Check Vercel build logs

### Database issues?
- App runs in demo mode without Firebase
- Add Firebase credentials as environment variable for production

