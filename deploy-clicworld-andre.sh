#!/bin/bash

# 🚀 Clic.World Website - Automated GitHub Deployment
# Username: clicworld-andre (corrected)
# Repository: clic-world-website

echo "🌍 Clic.World Website - Automated GitHub Deployment"
echo "=================================================="
echo "👤 GitHub Username: clicworld-andre"
echo "📦 Repository: clic-world-website"
echo ""

# Navigate to project directory
cd "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/ClicBrain/Clic_Website_2"

# Repository details
GITHUB_USERNAME="clicworld-andre"
REPO_NAME="clic-world-website"
DESCRIPTION="Clic.World Revolutionary Social Financial Movement Website - React & Tailwind CSS"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "📋 Deployment Details:"
echo "   • Username: $GITHUB_USERNAME"
echo "   • Repository: $REPO_NAME"
echo "   • Description: $DESCRIPTION"
echo "   • URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

# Check current git status
echo "📊 Current Git Status:"
git status --short

# Check if remote origin already exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "🔗 Remote origin configured:"
    git remote get-url origin
    echo ""
    echo "🚀 Attempting to push to GitHub..."
    
    if git push -u origin main; then
        echo ""
        echo "🎉 SUCCESS! Website deployed to GitHub!"
        echo ""
        echo "📱 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        echo "🌐 GitHub Pages: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
        echo ""
        echo "🚀 Next Steps:"
        echo "   1. Enable GitHub Pages:"
        echo "      → Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
        echo "      → Source: Deploy from a branch"
        echo "      → Branch: main / (root)"
        echo "      → Save"
        echo ""
        echo "🎉 The Clic.World movement is now live!"
        
    else
        echo "❌ Push failed - please check:"
        echo "   • Repository exists: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        echo "   • You're authenticated with GitHub"
        echo "   • Repository name is correct: $REPO_NAME"
        echo ""
        echo "🔗 Create repository here: https://github.com/new"
    fi
    
else
    echo "❌ No remote origin configured"
    echo "🔧 Setting up remote..."
    git remote add origin "$REPO_URL"
    git branch -M main
    git push -u origin main
fi
