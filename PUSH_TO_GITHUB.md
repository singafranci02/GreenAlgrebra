# Push to GitHub - Step by Step
# ==============================

## Step 1: Update Remote URL

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details:

```bash
cd /Users/francescotomatis/Noyakka/GreenAlgrebra

# Remove the placeholder remote
git remote remove origin

# Add your actual GitHub repository URL
# Replace with your actual repository URL:
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git

# Verify it's set correctly
git remote -v
```

## Step 2: Make sure all files are committed

```bash
# Check what's not committed
git status

# If there are uncommitted files, add and commit them:
git add -A
git commit -m "Add all project files for deployment"
```

## Step 3: Push to GitHub

```bash
# Push to main branch
git push -u origin main
```

If you get an error about the branch name, try:
```bash
git branch -M main
git push -u origin main
```

## Step 4: Verify

Go to your GitHub repository page and refresh - you should see all your files!

---

## Quick One-Liner (if you know your repo URL)

```bash
cd /Users/francescotomatis/Noyakka/GreenAlgrebra && \
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git && \
git push -u origin main
```

