# Quick Build & Run Guide

## 🚀 Rebuild and Run the App

### Option 1: Automated Build (Easiest) ⭐

```bash
# 1. Build the React app (automated)
python3 build.py

# 2. Run the desktop app
source venv/bin/activate
python3 start.py
```

---

### Option 2: Manual Step-by-Step

#### Step 1: Build React App
```bash
npm run build
```

#### Step 2: Run Desktop App
```bash
# Activate Python virtual environment
source venv/bin/activate

# Run the app
python3 start.py
```

---

## 📦 Full Rebuild (If Starting Fresh)

If you need to rebuild everything from scratch:

```bash
# 1. Install/update Node dependencies
npm install

# 2. Build React app
npm run build

# 3. Activate Python environment
source venv/bin/activate

# 4. Install/update Python dependencies (if needed)
pip install -r requirements.txt

# 5. Run the app
python3 start.py
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| **Build React app** | `npm run build` |
| **Build (automated)** | `python3 build.py` |
| **Run desktop app** | `source venv/bin/activate && python3 start.py` |
| **Run dev server** | `npm run dev` |

---

## 🖥️ For Development (Browser)

If you want to test in browser without packaging:

```bash
npm run dev
```

Then open: `http://localhost:5173`

---

## 📱 Create Standalone Executable

To package as a standalone app:

```bash
# 1. Build React app first
npm run build

# 2. Package
source venv/bin/activate
python3 package.py

# 3. Create macOS app bundle (macOS only)
./create_app_bundle.sh

# 4. Install to Applications (optional)
cp -r dist/PersonalTracker.app /Applications/
```

---

## ⚡ TL;DR - Just Run It

```bash
# Quick rebuild and run
npm run build
source venv/bin/activate
python3 start.py
```

---

## ✅ Verify It Works

After running, you should see:
1. A desktop window opens (no browser UI)
2. App loads with all tabs visible
3. Your data is preserved (localStorage)

---

## 🔧 Troubleshooting

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

### "Module not found"
```bash
npm install  # For Node.js
pip install -r requirements.txt  # For Python
```

---

**That's it! The app should launch in its own window.** 🎉

