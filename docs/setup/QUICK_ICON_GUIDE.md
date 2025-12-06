# Quick Guide: Adding an App Icon

## Fastest Method

### 1. Get or Create Your Icon
- Find/create a square PNG image (at least 512x512 pixels)
- Save it as `icon.png` in your project root

### 2. Convert to .icns Format
Run the helper script:
```bash
./create_icon.sh icon.png
```

This will create `icon.icns` automatically!

### 3. Rebuild Your App
```bash
# Build React app
npm run build

# Package
source venv/bin/activate
python3 package.py

# Create app bundle (will automatically include icon)
./create_app_bundle.sh
```

### 4. Done! ✅
The icon is now included in your app bundle.

---

## Alternative: Manual Conversion

If you prefer to use an online tool:

1. Visit: https://cloudconvert.com/png-to-icns
2. Upload your `icon.png`
3. Download `icon.icns`
4. Place it in your project root
5. Rebuild the app bundle

---

## Verify Icon

After creating the bundle:
```bash
open dist/PersonalTracker.app/Contents/Resources/
```

You should see `AppIcon.icns` in the Resources folder.

---

**That's it!** The app will now show your custom icon in Finder, Dock, and Launchpad.

