#!/bin/bash

# Exit on error
set -e

echo "🔍 Checking dependencies..."
npm install

# Check if .env exists, if not, create it from .env.example
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "ℹ️  Please update the .env file with your configuration"
    exit 1
fi

echo "🔧 Building the application..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 You can now deploy the contents of the 'dist' directory to your hosting service."
echo "   For Netlify, you can use 'netlify deploy --prod'"
