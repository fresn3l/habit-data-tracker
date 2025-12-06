# Build and Install Commands

## 🚀 Quick Commands

### Option 1: Automated Script (All-in-One) ⭐

```bash
./build_and_install.sh
```

This single command will:
1. Build the React app
2. Package it as an executable
3. Create macOS app bundle
4. Install to Applications folder

---

### Option 2: Manual Step-by-Step

```bash
# 1. Build React app
npm run build

# 2. Package as executable
source venv/bin/activate
python3 package.py

# 3. Create macOS app bundle
./create_app_bundle.sh

# 4. Install to Applications
cp -r dist/PersonalTracker.app /Applications/
```

---

## 📋 Detailed Steps

### Step 1: Build React App
```bash
npm run build
```
**Output:** `web/` directory with compiled app

### Step 2: Package as Executable
```bash
source venv/bin/activate
python3 package.py
```
**Output:** `dist/PersonalTracker` executable

### Step 3: Create macOS App Bundle
```bash
./create_app_bundle.sh
```
**Output:** `dist/PersonalTracker.app` bundle

### Step 4: Install to Applications
```bash
cp -r dist/PersonalTracker.app /Applications/
```
**Result:** App installed in Applications folder!

---

## 🎯 One-Liner Commands

### Build Only
```bash
npm run build && source venv/bin/activate && python3 package.py
```

### Build + Install
```bash
npm run build && source venv/bin/activate && python3 package.py && ./create_app_bundle.sh && cp -r dist/PersonalTracker.app /Applications/
```

### Full Automated (Recommended)
```bash
./build_and_install.sh
```

---

## ✅ After Installation

The app will be available:
- **Applications folder** - Launch from Finder
- **Spotlight** - Press Cmd+Space, type "Personal Tracker"
- **Launchpad** - Find in Launchpad apps
- **Dock** - Drag from Applications to Dock

---

## 🔧 Troubleshooting

### "Permission denied" on script
```bash
chmod +x build_and_install.sh
chmod +x create_app_bundle.sh
```

### "web directory not found"
```bash
npm run build
```

### "venv not found"
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 📍 File Locations

After building:
- **React build:** `web/` directory
- **Executable:** `dist/PersonalTracker`
- **App bundle:** `dist/PersonalTracker.app`
- **Installed app:** `/Applications/PersonalTracker.app`

---

## 🎉 Quick Start

**Just run:**
```bash
./build_and_install.sh
```

**Then launch from Applications!**

