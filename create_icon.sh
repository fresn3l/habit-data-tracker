#!/bin/bash
# Helper script to create icon.icns from a source PNG image
# Usage: ./create_icon.sh icon.png

if [ $# -eq 0 ]; then
    echo "Usage: ./create_icon.sh <source_image.png>"
    echo ""
    echo "This script creates a macOS .icns icon file from a PNG image."
    echo "The source image should be at least 1024x1024 pixels."
    echo ""
    exit 1
fi

SOURCE_IMAGE="$1"

# Check if source image exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "❌ Error: Source image not found: $SOURCE_IMAGE"
    exit 1
fi

# Check if sips is available (macOS built-in image converter)
if ! command -v sips &> /dev/null; then
    echo "❌ Error: 'sips' command not found. This script requires macOS."
    exit 1
fi

echo "Creating macOS icon from: $SOURCE_IMAGE"
echo ""

# Create iconset directory
ICONSET_DIR="icon.iconset"
if [ -d "$ICONSET_DIR" ]; then
    echo "Removing existing iconset directory..."
    rm -rf "$ICONSET_DIR"
fi

mkdir -p "$ICONSET_DIR"
echo "Created iconset directory: $ICONSET_DIR"
echo ""

# Create all required icon sizes
echo "Generating icon sizes..."

# Standard sizes
sips -z 16 16 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_16x16.png"
sips -z 32 32 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_16x16@2x.png"
sips -z 32 32 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_32x32.png"
sips -z 64 64 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_32x32@2x.png"
sips -z 128 128 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_128x128.png"
sips -z 256 256 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_128x128@2x.png"
sips -z 256 256 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_256x256.png"
sips -z 512 512 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_256x256@2x.png"
sips -z 512 512 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_512x512.png"
sips -z 1024 1024 "$SOURCE_IMAGE" --out "${ICONSET_DIR}/icon_512x512@2x.png"

echo "✅ Generated all icon sizes"
echo ""

# Convert iconset to icns
if command -v iconutil &> /dev/null; then
    echo "Converting iconset to .icns format..."
    iconutil -c icns "$ICONSET_DIR" -o icon.icns
    
    if [ -f "icon.icns" ]; then
        echo ""
        echo "✅ Successfully created icon.icns!"
        echo ""
        echo "You can now:"
        echo "  1. Preview the icon: open icon.icns"
        echo "  2. Use it in your app: ./create_app_bundle.sh"
        echo ""
        
        # Clean up iconset directory
        echo "Cleaning up temporary files..."
        rm -rf "$ICONSET_DIR"
        
        # Show file size
        SIZE=$(du -h icon.icns | cut -f1)
        echo "✅ Icon file size: $SIZE"
    else
        echo "❌ Error: Failed to create icon.icns"
        exit 1
    fi
else
    echo "❌ Error: 'iconutil' command not found. This script requires macOS."
    exit 1
fi

