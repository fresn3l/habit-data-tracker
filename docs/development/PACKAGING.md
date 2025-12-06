# Packaging Guide - Personal Tracker Desktop App

This guide explains how to package the Personal Tracker application as a standalone executable.

## Prerequisites

1. **Build the React app first:**
   ```bash
   python3 build.py
   ```

2. **Activate virtual environment:**
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

## Method 1: Automated Packaging (Recommended)

Use the automated packaging script:

```bash
python3 package.py
```

This script will:
- Check that the app is built
- Create a PyInstaller spec file
- Package the application
- Verify the executable was created

The executable will be in the `dist/` directory:
- **Windows:** `dist/PersonalTracker.exe`
- **macOS/Linux:** `dist/PersonalTracker`

## Method 2: Using auto-py-to-exe GUI

1. **Launch auto-py-to-exe:**
   ```bash
   source venv/bin/activate
   auto-py-to-exe
   ```

2. **Configure the settings:**
   - **Script Location:** Browse and select `start.py`
   - **Onefile:** Select "One File" (creates single executable)
   - **Console Window:** Select "Window Based (hide the console)"
   - **Icon:** (Optional) Browse and select an `.ico` file if you have one
   - **Additional Files:** Click "Add Folder" and add the `web/` directory
   - **Name:** Enter "PersonalTracker"

3. **Advanced Settings (Optional):**
   - Click "Advanced" tab
   - Add hidden imports if needed:
     - `eel`
     - `bottle`
     - `gevent`
     - `geventwebsocket`

4. **Click "CONVERT .PY TO .EXE"**

5. **Find your executable:**
   - The executable will be in the `output/` directory

## Method 3: Using PyInstaller Directly

1. **Create a spec file** (or use the one created by `package.py`):
   ```bash
   pyi-makespec --windowed --name PersonalTracker start.py
   ```

2. **Edit the spec file** to include the web directory:
   ```python
   datas=[('web', 'web')],
   ```

3. **Build the executable:**
   ```bash
   pyinstaller --clean PersonalTracker.spec
   ```

## Platform-Specific Notes

### Windows
- Executable: `dist/PersonalTracker.exe`
- May need to install Visual C++ Redistributable on target machines
- Consider code signing for distribution

### macOS
- Executable: `dist/PersonalTracker`
- May need to create a `.app` bundle for better integration
- May need to handle code signing and notarization for distribution

### Linux
- Executable: `dist/PersonalTracker`
- May need to create an AppImage or package for distribution
- Consider creating a `.desktop` file

## Troubleshooting

### "Module not found" errors
- Add missing modules to `hiddenimports` in the spec file
- Run `pyinstaller` with `--hidden-import=module_name`

### Large executable size
- This is normal - includes Python runtime and all dependencies
- Consider using UPX compression (already enabled in spec file)

### Web directory not included
- Make sure `datas=[('web', 'web')]` is in the spec file
- Verify the `web/` directory exists and contains `index.html`

### Chrome/Edge not found
- Eel requires Chrome or Edge to be installed
- The executable will look for Chrome/Edge in standard locations
- Users need Chrome/Edge installed to run the app

## Distribution

### Single Executable
The packaged executable is self-contained and can be distributed as-is.

### Required Files
- The executable includes everything needed
- Users do NOT need Python, Node.js, or any other dependencies
- Users DO need Chrome or Edge browser installed

### Testing Before Distribution
1. Test on a clean machine (without Python/Node installed)
2. Verify all features work
3. Check that data persists (localStorage)
4. Test on different screen sizes

## File Sizes

Expected executable sizes:
- **Windows:** ~50-100 MB
- **macOS:** ~50-100 MB  
- **Linux:** ~50-100 MB

The size includes:
- Python runtime
- All Python dependencies (Eel, Bottle, Gevent, etc.)
- React app (built files)
- PyInstaller bootloader

## Next Steps

After packaging:
1. Test the executable thoroughly
2. Consider adding an icon (see Optional: App Icon section)
3. Create installer/package for your platform
4. Test on target machines
5. Distribute!

