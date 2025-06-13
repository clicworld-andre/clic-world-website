#!/bin/bash

# 🚀 Clic.World Website - Token-Based GitHub Deployment
# For automated deployment with GitHub token

echo "🌍 Clic.World Website - Token-Based Deployment"
echo "=============================================="
echo "👤 Username: clic-andre"
echo ""

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo "🔐 GitHub Token Required"
    echo ""
    echo "To use this automated deployment:"
    echo "1. Create a GitHub Personal Access Token:"
    echo "   → Go to: https://github.com/settings/tokens"
    echo "   → Generate new token (classic)"
    echo "   → Select scopes: repo, workflow, delete_repo"
    echo "   → Copy the token"
    echo ""
    echo "2. Run with token:"
    echo "   export GITHUB_TOKEN='your_token_here'"
    echo "   ./token-deploy.sh"
    echo ""
    echo "Or create repository manually at: https://github.com/new"
    exit 1
fi

# Navigate to project directory
cd "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/ClicBrain/Clic_Website_2"

# Repository details
GITHUB_USERNAME="clic-andre"
REPO_NAME="clic-world-website"
DESCRIPTION="Clic.World Revolutionary Social Financial Movement Website - React & Tailwind CSS"

echo "🚀 Creating repository with GitHub API..."

# Create repository using GitHub API
REPO_RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d "{\"name\":\"$REPO_NAME\",\"description\":\"$DESCRIPTION\",\"private\":false}")

if echo "$REPO_RESPONSE" | grep -q '"clone_url"'; then
    echo "✅ Repository created successfully!"
    
    # Add remote and push
    git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    git branch -M main
    
    if git push -u origin main; then
        echo ""
        echo "🎉 SUCCESS! Website deployed to GitHub!"
        echo "🔗 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        echo "🌐 GitHub Pages: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    else
        echo "❌ Failed to push code"
    fi
    
elif echo "$REPO_RESPONSE" | grep -q '"already exists"'; then
    echo "📦 Repository already exists, pushing to existing repo..."
    
    git remote add origin "https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git" 2>/dev/null || true
    git push -u origin main
    
else
    echo "❌ Failed to create repository"
    echo "Response: $REPO_RESPONSE"
fi
