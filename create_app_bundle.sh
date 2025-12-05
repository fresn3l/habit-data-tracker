#!/bin/bash
# Creates a macOS .app bundle and installs it to Applications folder

APP_NAME="Personal Tracker"
BUNDLE_NAME="PersonalTracker.app"
EXECUTABLE_PATH="dist/PersonalTracker"
BUNDLE_DIR="dist/${BUNDLE_NAME}"
CONTENTS_DIR="${BUNDLE_DIR}/Contents"
MACOS_DIR="${CONTENTS_DIR}/MacOS"
RESOURCES_DIR="${CONTENTS_DIR}/Resources"

echo "Creating macOS app bundle..."

# Check if executable exists
if [ ! -f "$EXECUTABLE_PATH" ]; then
    echo "ERROR: Executable not found at $EXECUTABLE_PATH"
    echo "Run 'python3 package.py' first to create the executable"
    exit 1
fi

# Remove existing bundle if it exists
if [ -d "$BUNDLE_DIR" ]; then
    echo "Removing existing bundle..."
    rm -rf "$BUNDLE_DIR"
fi

# Create bundle structure
echo "Creating bundle structure..."
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"

# Copy executable to MacOS folder
echo "Copying executable..."
cp "$EXECUTABLE_PATH" "$MACOS_DIR/$APP_NAME"

# Make executable
chmod +x "$MACOS_DIR/$APP_NAME"

# Create Info.plist
echo "Creating Info.plist..."
cat > "${CONTENTS_DIR}/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>${APP_NAME}</string>
    <key>CFBundleDisplayName</key>
    <string>${APP_NAME}</string>
    <key>CFBundleIdentifier</key>
    <string>com.personaltracker.app</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>${APP_NAME}</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>NSSupportsAutomaticGraphicsSwitching</key>
    <true/>
</dict>
</plist>
EOF

# Create PkgInfo
echo "APPL????" > "${CONTENTS_DIR}/PkgInfo"

# Copy app icon if it exists
ICON_SOURCE="icon.icns"
ICON_DEST="${RESOURCES_DIR}/AppIcon.icns"

if [ -f "$ICON_SOURCE" ]; then
    echo "Copying app icon..."
    cp "$ICON_SOURCE" "$ICON_DEST"
    echo "✅ App icon copied to bundle"
else
    echo "⚠️  Warning: icon.icns not found in project root"
    echo "   App will use default macOS app icon"
    echo "   To add an icon:"
    echo "     1. Place icon.icns in project root, or"
    echo "     2. Run: ./create_icon.sh your_icon.png"
fi

echo "✅ App bundle created at: $BUNDLE_DIR"

# Ask if user wants to install to Applications
read -p "Install to Applications folder? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing to Applications folder..."
    cp -r "$BUNDLE_DIR" "/Applications/${BUNDLE_NAME}"
    echo "✅ Installed to /Applications/${BUNDLE_NAME}"
    echo ""
    echo "You can now:"
    echo "  - Launch from Applications folder"
    echo "  - Launch from Spotlight (Cmd+Space, type 'Personal Tracker')"
    echo "  - Add to Dock by dragging from Applications"
else
    echo "Bundle created but not installed."
    echo "To install manually:"
    echo "  cp -r '$BUNDLE_DIR' /Applications/"
fi

