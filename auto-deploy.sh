#!/bin/bash

# 🚀 Clic.World Website - Automated GitHub Deployment
# Username: clic-andre
# Repository: clic-world-website

echo "🌍 Clic.World Website - Automated GitHub Deployment"
echo "=================================================="
echo "👤 GitHub Username: clic-andre"
echo "📦 Repository: clic-world-website"
echo ""

# Navigate to project directory
cd "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/ClicBrain/Clic_Website_2"

# Repository details
GITHUB_USERNAME="clic-andre"
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
    echo "🔗 Remote origin already configured:"
    git remote get-url origin
    echo ""
    echo "🚀 Pushing updates to existing repository..."
    git push
else
    echo ""
    echo "🔗 Setting up GitHub remote..."
    
    # Try GitHub CLI first (automated)
    if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
        echo "✅ GitHub CLI authenticated - using automated deployment"
        
        # Create repository and push using GitHub CLI
        if gh repo create "$REPO_NAME" --public --description "$DESCRIPTION" --push --source=.; then
            echo ""
            echo "🎉 SUCCESS! Repository created and deployed via GitHub CLI!"
            
        else
            echo "⚠️  Repository might already exist, trying to add remote manually..."
            git remote add origin "$REPO_URL"
            git branch -M main
            git push -u origin main
        fi
        
    else
        echo "📝 GitHub CLI not authenticated - using manual method"
        echo ""
        echo "🔧 Manual Setup Required:"
        echo "   1. Create repository on GitHub:"
        echo "      → Go to: https://github.com/new"
        echo "      → Repository name: $REPO_NAME"
        echo "      → Description: $DESCRIPTION"
        echo "      → Make it Public"
        echo "      → Don't add README/gitignore/license"
        echo ""
        echo "   2. Then run these commands:"
        echo "      git remote add origin $REPO_URL"
        echo "      git branch -M main"
        echo "      git push -u origin main"
        echo ""
        
        # Try to add remote anyway in case repo exists
        echo "🔄 Attempting to add remote (in case repository exists)..."
        if git remote add origin "$REPO_URL" 2>/dev/null; then
            echo "✅ Remote added successfully"
            git branch -M main
            echo "🚀 Attempting to push..."
            if git push -u origin main; then
                echo "🎉 SUCCESS! Code pushed to existing repository!"
            else
                echo "❌ Push failed - you may need to create the repository first"
                echo "🔗 Create it here: https://github.com/new"
            fi
        else
            echo "⚠️  Remote already exists or repository not found"
        fi
    fi
fi

# Success information
echo ""
echo "📱 Repository Information:"
echo "   🔗 GitHub: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "   🌐 Future GitHub Pages: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""
echo "🚀 Next Steps:"
echo "   1. Enable GitHub Pages:"
echo "      → Settings → Pages → Source: Deploy from branch → main"
echo "   2. Set up custom domain (optional)"
echo "   3. Enable Netlify/Vercel for advanced deployment"
echo ""
echo "🎉 Clic.World movement is live on GitHub!"
