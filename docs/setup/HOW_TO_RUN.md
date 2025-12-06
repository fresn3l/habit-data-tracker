# How to Rebuild and Run the App

## ✅ Quick Start (3 Steps)

### Step 1: Rebuild the React App
```bash
npm run build
```

### Step 2: Activate Python Environment
```bash
source venv/bin/activate
```

### Step 3: Run the App
```bash
python3 start.py
```

**That's it!** The app will open in its own window.

---

## 🔄 Complete Rebuild (If Needed)

If you want to rebuild everything from scratch:

```bash
# 1. Build React app
npm run build

# 2. Activate Python environment  
source venv/bin/activate

# 3. Run the app
python3 start.py
```

---

## 🎯 What Happens

1. **`npm run build`** - Compiles React app to `web/` directory
2. **`source venv/bin/activate`** - Activates Python virtual environment
3. **`python3 start.py`** - Starts the desktop app in its own window

---

## 📋 Your Current Setup

✅ Virtual environment: **Ready**  
✅ Build directory: **Ready**  
✅ Node.js: v22.18.0  
✅ Python: 3.14.0  

You can run the app right now!

---

## 🚀 Run It Now

Copy and paste these commands:

```bash
npm run build
source venv/bin/activate
python3 start.py
```

---

## 🛠️ Troubleshooting

### If build fails:
```bash
npm install
npm run build
```

### If Python fails:
```bash
source venv/bin/activate
pip install -r requirements.txt
python3 start.py
```

---

## 📦 Create Standalone App (Optional)

To package as a standalone executable:

```bash
# 1. Build React app
npm run build

# 2. Package it
source venv/bin/activate
python3 package.py

# 3. Create macOS app bundle
./create_app_bundle.sh

# 4. Install to Applications (optional)
cp -r dist/PersonalTracker.app /Applications/
```

---

**The app should open in its own window when you run `python3 start.py`!** 🎉

