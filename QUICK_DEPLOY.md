# Quick Start Deployment Guide
# =============================

## 🚀 Fastest Way to Deploy (5 minutes)

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/GreenAlgebra.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend (Railway - Free)

1. Go to https://railway.app → Sign up (free)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `GreenAlgebra` repository
4. Railway auto-detects Python
5. Add environment variable:
   - Key: `PORT` → Value: `8000`
6. Copy your backend URL (e.g., `https://greenalgebra-backend.railway.app`)

### 3. Deploy Frontend (Vercel - Free)

1. Go to https://vercel.com → Sign up (free)
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://greenalgebra-backend.railway.app` (your Railway URL)
6. Click "Deploy"

### 4. Update Backend CORS

In Railway dashboard, add environment variable:
- Key: `FRONTEND_URL`
- Value: `https://your-app.vercel.app` (your Vercel URL)

### 5. Done! 🎉

Your app is live at: `https://your-app.vercel.app`

---

## 📝 Environment Variables Summary

### Backend (Railway):
```
PORT=8000
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel):
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 🔄 Auto-Deploy

Both services auto-deploy on every git push to `main` branch!

---

## 💰 Cost: $0/month

- Vercel: Free tier (unlimited projects)
- Railway: $5 free credit/month (enough for small apps)
- Firebase: Free tier (1GB storage)

---

## 🆘 Need Help?

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

