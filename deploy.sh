#!/bin/bash

# 🚀 Clic.World Website - GitHub Deployment Script
# This script helps you push the website to GitHub

echo "🌍 Clic.World Website - GitHub Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the project directory. Please run this from the website root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized. Run 'git init' first."
    exit 1
fi

# Check if we have a remote origin
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "⚠️  No GitHub remote found."
    echo "📋 Please create a GitHub repository first and then run:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/clic-world-website.git"
    echo ""
    echo "🔗 Or follow the instructions in GITHUB_SETUP.md"
    exit 1
fi

# Get current status
echo "📊 Current Git Status:"
git status --short

echo ""
echo "🔍 Ready to deploy to GitHub?"
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Add all changes
echo "➕ Adding all changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "✅ No changes to commit. Repository is up to date."
else
    # Get commit message
    echo "💬 Enter commit message (or press Enter for default):"
    read -p "> " commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update Clic.World website - $(date '+%Y-%m-%d %H:%M')"
    fi
    
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "$commit_message"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push origin main; then
    echo ""
    echo "✅ Successfully deployed to GitHub!"
    echo "🔗 View your repository at: $(git remote get-url origin)"
    echo ""
    echo "🌐 Next steps:"
    echo "   1. Enable GitHub Pages for free hosting"
    echo "   2. Set up Netlify for advanced deployment"
    echo "   3. Share your revolutionary website with the world!"
    echo ""
    echo "🎉 The Clic.World movement is now on GitHub!"
else
    echo ""
    echo "❌ Failed to push to GitHub."
    echo "💡 Common solutions:"
    echo "   1. Check your GitHub credentials"
    echo "   2. Ensure the repository exists on GitHub"
    echo "   3. Try: git push -u origin main (for first push)"
fi
