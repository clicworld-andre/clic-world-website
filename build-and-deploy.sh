#!/bin/bash

# 🚀 Clic.World Website - Build and Deploy Script
# This script builds the React app and deploys to GitHub Pages

echo "🌍 Clic.World Website - Build & Deploy"
echo "======================================"

# Navigate to project directory
cd "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/ClicBrain/Clic_Website_2"

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building React application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build files created in ./build directory"
    echo "📊 Build size:"
    du -sh build/
    echo ""
    
    echo "🚀 Committing and pushing to GitHub..."
    git add .
    git commit -m "Add GitHub Actions deployment workflow and build updates"
    git push origin main
    
    echo ""
    echo "🎉 Deployment initiated!"
    echo "🔗 Repository: https://github.com/clicworld-andre/clic-world-website"
    echo "⏳ GitHub Actions will build and deploy automatically"
    echo "🌐 Website will be available at: https://clicworld-andre.github.io/clic-world-website"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Go to: https://github.com/clicworld-andre/clic-world-website/settings/pages"
    echo "   2. Under 'Source': Select 'GitHub Actions'"
    echo "   3. Save settings"
    echo "   4. Wait for deployment to complete (~2-3 minutes)"
    
else
    echo "❌ Build failed!"
    echo "💡 Common issues:"
    echo "   • Missing dependencies: run 'npm install'"
    echo "   • Node.js version: ensure Node 16+ is installed"
    echo "   • Build errors: check console output above"
fi
