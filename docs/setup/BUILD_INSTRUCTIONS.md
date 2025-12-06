# Build & Setup Instructions - Personal Tracker

Quick reference guide for building and packaging the desktop application.

---

## 🚀 Quick Start (All-in-One)

```bash
# 1. Install Node.js dependencies
npm install

# 2. Set up Python environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Build React app
npm run build

# 4. Package as executable
python3 package.py

# 5. Create macOS app bundle (macOS only)
./create_app_bundle.sh

# 6. Install to Applications (macOS only)
cp -r dist/PersonalTracker.app /Applications/
```

---

## 📋 Step-by-Step Instructions

### Step 1: Install Node.js Dependencies

```bash
npm install
```

**What this does:** Installs React, Vite, Recharts, and other frontend dependencies.

---

### Step 2: Set Up Python Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install Python dependencies
pip install -r requirements.txt
```

**What this does:** Sets up Python environment with Eel and PyInstaller.

**Dependencies installed:**
- `eel` - Desktop app framework
- `pyinstaller` - Executable packaging
- `auto-py-to-exe` - GUI packaging tool (optional)

---

### Step 3: Build React Application

**Option A: Using the automated build script (Recommended)**
```bash
python3 build.py
```

**Option B: Manual build**
```bash
npm run build
```

**What this does:**
- Compiles React app to `web/` directory
- Optimizes and minifies code
- Creates production-ready bundle

**Output:** `web/index.html` and `web/assets/` directory

---

### Step 4: Package as Standalone Executable

**Option A: Using the automated packaging script (Recommended)**
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Package the app
python3 package.py
```

**Option B: Manual packaging with PyInstaller**
```bash
source venv/bin/activate
pyinstaller --windowed --name PersonalTracker --add-data "web:web" start.py
```

**What this does:**
- Packages Python backend + React frontend into single executable
- Creates `dist/PersonalTracker` (or `dist/PersonalTracker.exe` on Windows)
- Includes all dependencies (no Python/Node.js needed to run)

**Output:** `dist/PersonalTracker` executable (~50-100 MB)

---

### Step 5: Create macOS App Bundle (macOS Only)

```bash
./create_app_bundle.sh
```

**What this does:**
- Creates `PersonalTracker.app` bundle
- Sets up proper macOS app structure
- Makes it launchable from Applications folder

**Output:** `dist/PersonalTracker.app`

**To install to Applications:**
```bash
cp -r dist/PersonalTracker.app /Applications/
```

---

## 🧪 Testing the Build

### Test Development Build

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

### Test Production Build

```bash
# Build first
npm run build

# Preview production build
npm run preview
```

### Test Desktop App (Development)

```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Run the Python backend
python3 start.py
```

### Test Packaged Executable

```bash
# Run the executable directly
./dist/PersonalTracker

# Or on macOS, launch the app bundle
open dist/PersonalTracker.app
```

---

## 📦 Complete Build Process (Copy & Paste)

```bash
# Navigate to project directory
cd /path/to/fictional-engine

# 1. Install Node.js dependencies
npm install

# 2. Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Build React app
npm run build

# 5. Package as executable
python3 package.py

# 6. Create macOS app bundle (macOS only)
chmod +x create_app_bundle.sh
./create_app_bundle.sh

# 7. Install to Applications (macOS only, optional)
cp -r dist/PersonalTracker.app /Applications/
```

---

## 🔧 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- Requires Node.js v18 or higher

### "python3: command not found"
- Install Python 3.7+ from https://www.python.org/
- On macOS, may need to use `python3` explicitly

### "web directory not found"
- Run `npm run build` first
- Check that `web/index.html` exists

### "Chrome/Edge not found"
- Install Microsoft Edge or Google Chrome
- Required for the desktop app to run

### "Permission denied" on scripts
```bash
chmod +x build.py
chmod +x package.py
chmod +x create_app_bundle.sh
```

### Build fails with "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Or for Python
pip install --upgrade -r requirements.txt
```

---

## 📁 Output Locations

After building, you'll find:

- **React Build:** `web/` directory
- **Executable:** `dist/PersonalTracker` (or `.exe` on Windows)
- **macOS App Bundle:** `dist/PersonalTracker.app`
- **Build Artifacts:** `build/` directory (can be ignored)

---

## ⚡ Quick Commands Reference

| Task | Command |
|------|---------|
| Install Node deps | `npm install` |
| Install Python deps | `pip install -r requirements.txt` |
| Build React app | `npm run build` |
| Build (automated) | `python3 build.py` |
| Package executable | `python3 package.py` |
| Create app bundle | `./create_app_bundle.sh` |
| Run dev server | `npm run dev` |
| Run desktop app | `python3 start.py` |
| Test executable | `./dist/PersonalTracker` |

---

## 🎯 Requirements Checklist

Before building, ensure you have:

- ✅ Node.js v18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Python 3.7+ installed (`python3 --version`)
- ✅ Microsoft Edge or Google Chrome installed
- ✅ Internet connection (for first-time npm/pip installs)

---

**That's it!** Your app should now be built and ready to use. 🎉

