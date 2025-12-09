# Packaging Commands for Desktop Application

## Quick Build and Install (All-in-One)

```bash
# Make script executable (first time only)
chmod +x build_and_install.sh

# Build, package, and install to Applications
./build_and_install.sh
```

This script will:
1. Build the React app (`npm run build`)
2. Activate virtual environment
3. Check/install Python dependencies
4. Package with PyInstaller (`python3 package.py`)
5. Create macOS app bundle (`./create_app_bundle.sh`)
6. Install to `/Applications/PersonalTracker.app`

---

## Step-by-Step Commands

If you prefer to run each step manually:

### 1. Build React App
```bash
npm run build
```

### 2. Activate Virtual Environment
```bash
source venv/bin/activate
```

### 3. Package with PyInstaller
```bash
python3 package.py
```

This creates: `dist/PersonalTracker` (executable)

### 4. Create macOS App Bundle
```bash
chmod +x create_app_bundle.sh
./create_app_bundle.sh
```

This creates: `dist/PersonalTracker.app`

### 5. Install to Applications (Optional)
```bash
cp -r dist/PersonalTracker.app /Applications/
```

---

## Alternative: Use Launcher Script

For development/testing (doesn't package, just runs):
```bash
./launch_app.sh
```

---

## Verification

After packaging, verify the app:
```bash
# Check executable exists
ls -lh dist/PersonalTracker

# Check app bundle exists
ls -lh dist/PersonalTracker.app

# Test run (if not installed)
./dist/PersonalTracker.app/Contents/MacOS/Personal\ Tracker
```

---

## Troubleshooting

**If build fails:**
- Ensure `venv` is activated: `source venv/bin/activate`
- Check dependencies: `pip install -r requirements.txt`
- Verify React build: `ls web/index.html`

**If packaging fails:**
- Check PyInstaller is installed: `pip list | grep pyinstaller`
- Rebuild React app: `npm run build`
- Check `web` directory exists with `index.html`

**If app bundle creation fails:**
- Ensure executable exists: `ls dist/PersonalTracker`
- Check script permissions: `chmod +x create_app_bundle.sh`

