# Adding an App Icon to macOS Application

This guide explains how to add a custom app icon to your macOS application.

---

## 🎨 Step 1: Create or Obtain an Icon Image

You need a square icon image (1024x1024 pixels recommended) in PNG format.

**Options:**
1. Create your own icon design
2. Use an online icon generator
3. Use an existing image (will need to be resized)

**Requirements:**
- Format: PNG
- Size: At least 1024x1024 pixels (square)
- Transparent background (recommended)
- Save as: `icon.png` in the project root

---

## 📦 Step 2: Convert PNG to .icns Format

macOS requires icons in `.icns` format. You have several options:

### Option A: Using `iconutil` (Built into macOS)

1. Create an `icon.iconset` folder in your project root:
   ```bash
   mkdir icon.iconset
   ```

2. You need multiple sizes of the icon. Create them from your source image:
   - `icon_16x16.png` (16x16)
   - `icon_16x16@2x.png` (32x32)
   - `icon_32x32.png` (32x32)
   - `icon_32x32@2x.png` (64x64)
   - `icon_128x128.png` (128x128)
   - `icon_128x128@2x.png` (256x256)
   - `icon_256x256.png` (256x256)
   - `icon_256x256@2x.png` (512x512)
   - `icon_512x512.png` (512x512)
   - `icon_512x512@2x.png` (1024x1024)

3. Place all these files in the `icon.iconset` folder

4. Convert to `.icns`:
   ```bash
   iconutil -c icns icon.iconset
   ```

5. This creates `icon.icns` in your project root

### Option B: Using Online Tools (Easier)

1. Visit: https://cloudconvert.com/png-to-icns
   or
   https://www.icnsconverter.com/

2. Upload your `icon.png` file

3. Download the generated `icon.icns` file

4. Place it in your project root directory

### Option C: Using Python Script (Automated)

I'll create a helper script that automates this process.

---

## ✅ Step 3: Place Icon in Project

Once you have `icon.icns`, place it in your project root:

```
fictional-engine/
├── icon.icns          ← Your app icon
├── package.py
├── create_app_bundle.sh
├── ...
```

---

## 🔧 Step 4: Update Build Scripts

The scripts have been updated to automatically:
1. Copy `icon.icns` to the app bundle Resources folder
2. Rename it to `AppIcon.icns` (as referenced in Info.plist)
3. Ensure it's properly included

**Note:** The scripts will look for `icon.icns` in the project root. If it's not found, the app will work but use the default macOS app icon.

---

## 🚀 Step 5: Rebuild the App

After adding the icon, rebuild your app:

```bash
# Build React app
npm run build

# Package the app
source venv/bin/activate
python3 package.py

# Create app bundle with icon
./create_app_bundle.sh
```

---

## 📋 Quick Reference

### Icon File Locations:
- **Source icon**: `icon.png` (or `icon.icns`) in project root
- **In app bundle**: `PersonalTracker.app/Contents/Resources/AppIcon.icns`

### Icon Sizes Required (for .iconset method):
- 16x16, 32x32, 128x128, 256x256, 512x512 (standard)
- 32x32, 64x64, 256x256, 512x512, 1024x1024 (@2x retina)

### Testing:
After creating the app bundle, you can verify the icon:
1. Navigate to `dist/PersonalTracker.app` in Finder
2. Right-click → "Show Package Contents"
3. Check `Contents/Resources/AppIcon.icns` exists

---

## 🛠️ Troubleshooting

### Icon not showing?
- Make sure `icon.icns` is in the project root before running `create_app_bundle.sh`
- Check that the file is named exactly `icon.icns` (case-sensitive)
- Verify the icon file is valid: try opening it in Preview app
- Clear macOS icon cache: `sudo rm -rf /Library/Caches/com.apple.iconservices.store`

### Icon looks blurry?
- Use a high-resolution source image (1024x1024 minimum)
- Ensure all required sizes are included in the .iconset
- Check that @2x versions are properly named

### Need to update the icon?
- Replace `icon.icns` in project root
- Rebuild app bundle: `./create_app_bundle.sh`
- If app is in Applications, reinstall it

---

## 💡 Tips

- **Design**: Keep icon simple and recognizable at small sizes
- **Colors**: Use colors that match your app's theme
- **Testing**: Test icon at different sizes (especially 16x16 and 32x32)
- **Backup**: Keep your original PNG/SVG source file for future updates

---

**Next Steps:** After setting up your icon, the build process will automatically include it in the app bundle!

