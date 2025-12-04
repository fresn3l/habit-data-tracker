# 🎨 Adding an App Icon - Simple Steps

## Quick Start

### Step 1: Get Your Icon Image
You need a square PNG image (1024x1024 pixels recommended):
- Create your own design, or
- Use an existing image (square, high resolution)

Save it as `icon.png` in your project root.

### Step 2: Convert to macOS Format
Run this command:
```bash
./create_icon.sh icon.png
```

This automatically creates `icon.icns` with all required sizes.

### Step 3: Rebuild Your App
```bash
npm run build
source venv/bin/activate
python3 package.py
./create_app_bundle.sh
```

The icon will be automatically included! ✅

---

## What Happens

1. **`create_icon.sh`** converts your PNG to `.icns` format (macOS icon format)
2. **`create_app_bundle.sh`** automatically finds and includes `icon.icns`
3. Icon appears in:
   - Finder
   - Dock
   - Launchpad
   - Spotlight
   - Applications folder

---

## No Icon Yet?

That's fine! The app will work perfectly without an icon - it'll just use the default macOS app icon. You can add one later.

---

## Need More Details?

See:
- **QUICK_ICON_GUIDE.md** - Quick reference
- **ICON_SETUP.md** - Detailed instructions and troubleshooting

---

## Example Workflow

```bash
# 1. Create/obtain icon.png (square image, 1024x1024 recommended)
# 2. Convert to .icns:
./create_icon.sh icon.png

# 3. Verify it worked:
ls -lh icon.icns

# 4. Rebuild app (icon will be included automatically):
npm run build
source venv/bin/activate
python3 package.py
./create_app_bundle.sh

# 5. Check the icon in the bundle:
open dist/PersonalTracker.app/Contents/Resources/
# You should see AppIcon.icns
```

---

**That's it!** Your app will have a beautiful custom icon. 🎉

