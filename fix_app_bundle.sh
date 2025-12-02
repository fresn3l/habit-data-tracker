#!/bin/bash
# Fixes the app bundle to work properly on macOS

APP_NAME="PersonalTracker"
BUNDLE_NAME="PersonalTracker.app"
BUNDLE_DIR="/Applications/${BUNDLE_NAME}"
CONTENTS_DIR="${BUNDLE_DIR}/Contents"
MACOS_DIR="${CONTENTS_DIR}/MacOS"

if [ ! -d "$BUNDLE_DIR" ]; then
    echo "ERROR: App not found at $BUNDLE_DIR"
    exit 1
fi

echo "Fixing app bundle..."

# Remove quarantine attribute (common macOS security block)
echo "Removing quarantine attribute..."
xattr -d com.apple.quarantine "$BUNDLE_DIR" 2>/dev/null
xattr -c "$BUNDLE_DIR" 2>/dev/null

# Fix permissions
echo "Fixing permissions..."
chmod -R 755 "$BUNDLE_DIR"
chmod +x "$MACOS_DIR"/*

# The executable might have a space in the name - let's check and fix
EXECUTABLE_PATH="$MACOS_DIR/Personal Tracker"
if [ -f "$EXECUTABLE_PATH" ]; then
    echo "Found executable with space in name, creating symlink..."
    # Create a version without space as backup
    if [ ! -f "$MACOS_DIR/$APP_NAME" ]; then
        ln -sf "Personal Tracker" "$MACOS_DIR/$APP_NAME"
    fi
fi

# Update Info.plist to match actual executable name
echo "Updating Info.plist..."
cat > "${CONTENTS_DIR}/Info.plist" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>PersonalTracker</string>
    <key>CFBundleDisplayName</key>
    <string>Personal Tracker</string>
    <key>CFBundleIdentifier</key>
    <string>com.personaltracker.app</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>Personal Tracker</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.13</string>
    <key>NSHighResolutionCapable</key>
    <true/>
    <key>LSApplicationCategoryType</key>
    <string>public.app-category.productivity</string>
</dict>
</plist>
EOF

echo "✅ App bundle fixed!"
echo ""
echo "Try launching again. If it still doesn't work:"
echo "1. Right-click the app in Dock → Options → Remove from Dock"
echo "2. Open Applications folder"
echo "3. Right-click 'Personal Tracker' → Open (to bypass security)"
echo "4. Then add it back to Dock"

