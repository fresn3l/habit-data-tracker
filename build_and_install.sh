#!/bin/bash
# Build and Install Script for Personal Tracker
# Builds the React app, packages it, and installs to Applications

set -e  # Exit on error

echo "=========================================="
echo "Building Personal Tracker Desktop App"
echo "=========================================="
echo ""

# Step 1: Build React App
echo "📦 Step 1: Building React app..."
npm run build

if [ ! -d "web" ] || [ ! -f "web/index.html" ]; then
    echo "❌ Error: React build failed. web/index.html not found."
    exit 1
fi
echo "✅ React app built successfully"
echo ""

# Step 2: Activate Python Environment
echo "🐍 Step 2: Activating Python environment..."
if [ ! -d "venv" ]; then
    echo "❌ Error: Virtual environment not found. Run: python3 -m venv venv"
    exit 1
fi

source venv/bin/activate

# Step 3: Check Python Dependencies
echo "📚 Step 3: Checking Python dependencies..."
if ! python3 -c "import eel" 2>/dev/null; then
    echo "⚠️  Eel not found. Installing dependencies..."
    pip install -r requirements.txt
fi
echo "✅ Python dependencies ready"
echo ""

# Step 4: Package the App
echo "📦 Step 4: Packaging app with PyInstaller..."
python3 package.py

if [ ! -f "dist/PersonalTracker" ]; then
    echo "❌ Error: Packaging failed. dist/PersonalTracker not found."
    exit 1
fi
echo "✅ App packaged successfully"
echo ""

# Step 5: Create macOS App Bundle
echo "🍎 Step 5: Creating macOS app bundle..."
chmod +x create_app_bundle.sh
./create_app_bundle.sh

if [ ! -d "dist/PersonalTracker.app" ]; then
    echo "❌ Error: App bundle creation failed."
    exit 1
fi
echo "✅ App bundle created successfully"
echo ""

# Step 6: Install to Applications
echo "📱 Step 6: Installing to Applications folder..."
APP_NAME="PersonalTracker.app"
APP_PATH="dist/$APP_NAME"
APPLICATIONS_PATH="/Applications/$APP_NAME"

# Remove existing app if it exists
if [ -d "$APPLICATIONS_PATH" ]; then
    echo "⚠️  Removing existing app from Applications..."
    rm -rf "$APPLICATIONS_PATH"
fi

# Copy to Applications
cp -r "$APP_PATH" "$APPLICATIONS_PATH"

# Fix permissions
chmod -R 755 "$APPLICATIONS_PATH"

echo "✅ App installed to Applications!"
echo ""
echo "=========================================="
echo "🎉 Build and Install Complete!"
echo "=========================================="
echo ""
echo "You can now launch the app from:"
echo "  - Applications folder in Finder"
echo "  - Spotlight (Cmd+Space, type 'Personal Tracker')"
echo "  - Launchpad"
echo ""
echo "App location: $APPLICATIONS_PATH"
echo ""

