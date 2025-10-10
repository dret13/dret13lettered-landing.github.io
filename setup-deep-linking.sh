#!/bin/bash

# Setup Deep Linking for Lettered Landing Page
# This script copies association files and sets up deep linking

echo "🔗 Setting up Deep Linking for Lettered Landing Page"
echo "======================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Must be run from landing-page directory"
    echo "Usage: cd landing-page && ./setup-deep-linking.sh"
    exit 1
fi

# Create .well-known directory
echo "📁 Creating .well-known directory..."
mkdir -p .well-known

# Check if web-hosting directory exists
if [ -d "../lettered-app/web-hosting" ]; then
    echo "📋 Copying association files from lettered-app/web-hosting..."
    
    # Copy iOS association file
    if [ -f "../lettered-app/web-hosting/apple-app-site-association" ]; then
        cp "../lettered-app/web-hosting/apple-app-site-association" .well-known/
        echo "✅ Copied apple-app-site-association"
    else
        echo "⚠️  apple-app-site-association not found"
    fi
    
    # Copy Android association file
    if [ -f "../lettered-app/web-hosting/assetlinks.json" ]; then
        cp "../lettered-app/web-hosting/assetlinks.json" .well-known/
        echo "✅ Copied assetlinks.json"
    else
        echo "⚠️  assetlinks.json not found"
    fi
else
    echo "⚠️  lettered-app/web-hosting directory not found"
    echo "Creating placeholder association files..."
    
    # Create placeholder iOS file
    cat > .well-known/apple-app-site-association << 'EOF'
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "SV329B54UF.com.lettered.app",
      "paths": ["/profile/*", "/post/*", "/stream/*"]
    }]
  },
  "webcredentials": {
    "apps": ["SV329B54UF.com.lettered.app"]
  }
}
EOF
    echo "✅ Created apple-app-site-association"
    
    # Create placeholder Android file
    cat > .well-known/assetlinks.json << 'EOF'
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.lettered.app",
    "sha256_cert_fingerprints": [
      "REPLACE_WITH_YOUR_SHA256_FINGERPRINT"
    ]
  }
}]
EOF
    echo "✅ Created assetlinks.json"
fi

echo ""
echo "📝 Next steps:"
echo ""
echo "1. Add deep link handler to index.html:"
echo "   Add this line before </body>:"
echo "   <script src=\"deep-link-handler.js\"></script>"
echo ""
echo "2. Verify association files:"
echo "   cat .well-known/apple-app-site-association"
echo "   cat .well-known/assetlinks.json"
echo ""
echo "3. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "4. Test deep links:"
echo "   https://ltrd.space/profile/test123"
echo "   https://ltrd.space/post/test456"
echo "   https://ltrd.space/stream/test789"
echo ""
echo "✅ Setup complete!"

