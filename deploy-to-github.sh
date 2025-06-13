#!/bin/bash

# 🚀 Clic.World Website - GitHub Deployment Script
# Run this after creating your GitHub repository

echo "🌍 Clic.World Website - GitHub Deployment"
echo "=========================================="

# Get GitHub username and repository name
echo "📝 Enter your GitHub username:"
read -p "> " github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

# Set repository name (you can change this)
repo_name="clic-world-website"

echo ""
echo "🔗 Repository URL will be: https://github.com/$github_username/$repo_name"
echo ""

# Check if repository exists (optional)
echo "⚠️  Make sure you've created the repository on GitHub first!"
echo "   1. Go to: https://github.com/new"
echo "   2. Repository name: $repo_name"
echo "   3. Description: Clic.World Revolutionary Social Financial Movement Website"
echo "   4. Make it Public"
echo "   5. Don't add README, .gitignore, or license (we have them)"
echo ""

read -p "Press Enter when you've created the repository on GitHub..."

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote add origin "https://github.com/$github_username/$repo_name.git"

# Verify remote was added
echo "✅ Remote added:"
git remote -v

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin main; then
    echo ""
    echo "✅ SUCCESS! Website deployed to GitHub!"
    echo ""
    echo "🔗 Repository: https://github.com/$github_username/$repo_name"
    echo "🌐 To enable GitHub Pages:"
    echo "   1. Go to: https://github.com/$github_username/$repo_name/settings/pages"
    echo "   2. Source: Deploy from a branch"
    echo "   3. Branch: main / (root)"
    echo "   4. Save"
    echo ""
    echo "📱 Your website will be available at:"
    echo "   https://$github_username.github.io/$repo_name"
    echo ""
    echo "🎉 The Clic.World movement is now on GitHub!"
    echo ""
    echo "🚀 Next steps:"
    echo "   • Enable GitHub Pages for free hosting"
    echo "   • Set up Netlify for advanced deployment"
    echo "   • Share your revolutionary website!"
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo "💡 Common solutions:"
    echo "   • Check your GitHub credentials"
    echo "   • Make sure the repository exists"
    echo "   • Ensure repository name matches: $repo_name"
fi
