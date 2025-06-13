#!/bin/bash

# 🚀 Clic.World Website - Direct gh-pages Deployment
# This bypasses GitHub Actions and deploys directly

echo "🌍 Clic.World Website - Direct Deployment"
echo "========================================="

# Navigate to project directory
cd "/Users/admin/Library/Mobile Documents/com~apple~CloudDocs/ClicBrain/Clic_Website_2"

echo "📦 Installing gh-pages package..."
npm install gh-pages --save-dev

echo "🔨 Building React application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Deploying directly to gh-pages branch..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Direct deployment complete!"
        echo ""
        echo "🌐 Your website should be live in 1-2 minutes at:"
        echo "   https://clicworld-andre.github.io/clic-world-website"
        echo ""
        echo "🔧 This deployment:"
        echo "   • Built the React app locally"
        echo "   • Pushed built files to gh-pages branch"
        echo "   • Bypassed GitHub Actions"
        echo ""
        echo "📋 If still showing README, you may need to:"
        echo "   1. Go to repository Settings > Pages"
        echo "   2. Change Source to 'Deploy from a branch'"
        echo "   3. Select 'gh-pages' branch"
        echo "   4. Save settings"
        
    else
        echo "❌ Deployment failed!"
        echo "💡 You may need to authenticate git first"
    fi
    
else
    echo "❌ Build failed!"
fi
