#!/bin/bash

# 🚀 Clic.World Website - GitHub CLI Deployment Script
# This script uses GitHub CLI for automatic repository creation and deployment

echo "🌍 Clic.World Website - GitHub CLI Deployment"
echo "=============================================="

# Check if GitHub CLI is authenticated
if ! gh auth status >/dev/null 2>&1; then
    echo "🔐 GitHub CLI authentication required"
    echo "Please run: gh auth login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ GitHub CLI authenticated"
echo ""

# Navigate to project directory
cd "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/ClicBrain/Clic_Website_2"

# Repository details
REPO_NAME="clic-world-website"
DESCRIPTION="Clic.World Revolutionary Social Financial Movement Website - React & Tailwind CSS"

echo "📋 Repository Details:"
echo "   Name: $REPO_NAME"
echo "   Description: $DESCRIPTION"
echo "   Visibility: Public"
echo ""

# Create repository and push
echo "🚀 Creating GitHub repository and deploying..."

# Use GitHub CLI to create repo and push in one command
if gh repo create "$REPO_NAME" --public --description "$DESCRIPTION" --push --source=.; then
    echo ""
    echo "✅ SUCCESS! Repository created and code deployed!"
    echo ""
    
    # Get the repository URL
    REPO_URL=$(gh repo view --json url -q .url)
    echo "🔗 Repository: $REPO_URL"
    echo ""
    
    # Instructions for GitHub Pages
    echo "🌐 To enable GitHub Pages:"
    echo "   1. Go to: $REPO_URL/settings/pages"
    echo "   2. Source: Deploy from a branch"
    echo "   3. Branch: main / (root)"
    echo "   4. Save"
    echo ""
    
    # Get username for Pages URL
    USERNAME=$(gh api user --jq .login)
    echo "📱 Your website will be available at:"
    echo "   https://$USERNAME.github.io/$REPO_NAME"
    echo ""
    
    echo "🎉 The Clic.World movement is now live on GitHub!"
    echo ""
    echo "🚀 Next steps:"
    echo "   • Enable GitHub Pages (see instructions above)"
    echo "   • Set up Netlify/Vercel for advanced deployment"
    echo "   • Share your revolutionary website with the world!"
    
else
    echo ""
    echo "❌ Failed to create repository"
    echo "💡 Possible issues:"
    echo "   • Repository name already exists"
    echo "   • Authentication issues"
    echo "   • Network connectivity"
    echo ""
    echo "🔧 Try running: gh auth status"
fi
