#!/bin/bash
# Script to push GreenAlgebra to GitHub

echo "🌿 GreenAlgebra - Push to GitHub"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the GreenAlgebra project root"
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
git status --short

echo ""
echo "📦 Files ready to push:"
git ls-files | wc -l | xargs echo "  Total files tracked:"

echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🔄 Updating remote URL..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"

echo "✅ Remote set to: $REPO_URL"
echo ""

# Make sure we're on main branch
git branch -M main 2>/dev/null

echo "🚀 Pushing to GitHub..."
echo ""

if git push -u origin main; then
    echo ""
    echo "✅ Success! Your code has been pushed to GitHub!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Visit your repository: $REPO_URL"
    echo "2. Verify all files are there"
    echo "3. Follow QUICK_DEPLOY.md to deploy to Vercel + Railway"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "1. Repository doesn't exist - create it on GitHub first"
    echo "2. Authentication required - you may need to set up GitHub CLI or SSH keys"
    echo "3. Wrong URL - double-check your repository URL"
    echo ""
    echo "💡 Tip: If you need to authenticate, use:"
    echo "   gh auth login  (GitHub CLI)"
    echo "   or set up SSH keys"
fi

