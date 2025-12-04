#!/bin/bash
# Quick deployment setup script

echo "🌿 GreenAlgebra Deployment Setup"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: GreenAlgebra ESG Platform"
    echo "✅ Git initialized"
    echo ""
    echo "⚠️  Next steps:"
    echo "1. Create a new repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/GreenAlgebra.git"
    echo "3. Run: git push -u origin main"
    echo ""
else
    echo "✅ Git repository already initialized"
    echo ""
fi

# Check for required files
echo "📋 Checking deployment files..."
files=("backend/requirements.txt" "vercel.json" "railway.json" "DEPLOYMENT.md" "QUICK_DEPLOY.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
    fi
done

echo ""
echo "🎯 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend: https://railway.app (see QUICK_DEPLOY.md)"
echo "3. Deploy frontend: https://vercel.com (see QUICK_DEPLOY.md)"
echo ""
echo "📖 Full guide: QUICK_DEPLOY.md"

