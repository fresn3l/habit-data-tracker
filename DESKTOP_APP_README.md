# Personal Tracker - Desktop Application

This is the desktop version of the Personal Tracker habit tracking application, packaged as a standalone executable using Eel and PyInstaller.

## Quick Start

### 1. Build the Application

```bash
python3 build.py
```

This will:
- Check all requirements
- Install dependencies if needed
- Build the React app
- Verify everything is ready

### 2. Test the Application

```bash
source venv/bin/activate
python3 start.py
```

This launches the app in a desktop window (no browser).

### 3. Package as Executable

```bash
python3 package.py
```

This creates a standalone executable in the `dist/` directory.

## Project Structure

```
.
├── start.py              # Python backend (Eel server)
├── build.py              # Build script
├── package.py            # Packaging script
├── test_app.py           # Test/verification script
├── requirements.txt      # Python dependencies
├── web/                  # Built React app (created by build)
│   ├── index.html
│   └── assets/
├── src/                  # React source code
├── venv/                 # Python virtual environment
└── dist/                 # Packaged executables (created by package)
```

## Development Workflow

1. **Make changes** to React code in `src/`
2. **Build:** `python3 build.py`
3. **Test:** `python3 start.py`
4. **Package:** `python3 package.py` (when ready to distribute)

## Requirements

- **Node.js** (v18+) and **npm**
- **Python 3** (3.8+)
- **Chrome or Edge** browser (required by Eel)

## Installation

1. Clone the repository
2. Install Node dependencies: `npm install`
3. Create Python virtual environment: `python3 -m venv venv`
4. Activate virtual environment:
   - macOS/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
5. Install Python dependencies: `pip install -r requirements.txt`

## Building

Run the build script:
```bash
python3 build.py
```

This ensures everything is set up and builds the React app.

## Running

### Development Mode (with browser)
```bash
npm run dev
```

### Desktop App Mode
```bash
source venv/bin/activate
python3 start.py
```

## Packaging

See [PACKAGING.md](./PACKAGING.md) for detailed packaging instructions.

Quick packaging:
```bash
python3 package.py
```

## Testing

Run the test script to verify everything is set up:
```bash
python3 test_app.py
```

## Features

- ✅ Standalone desktop application
- ✅ No browser required (uses Chrome/Edge in app mode)
- ✅ No console window (Window Based mode)
- ✅ All data stored locally (localStorage)
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Single executable file

## Troubleshooting

### App won't start
- Make sure Chrome or Edge is installed
- Run `python3 build.py` to rebuild
- Check `python3 test_app.py` for issues

### Packaging fails
- Make sure you've run `python3 build.py` first
- Check that `web/` directory exists
- Verify virtual environment is activated

### Executable is large
- This is normal (~50-100 MB)
- Includes Python runtime and all dependencies
- Single file is self-contained

## Distribution

The executable in `dist/` can be distributed as-is. Users need:
- Chrome or Edge browser installed
- No other dependencies required

## Platform Notes

- **Windows:** Creates `.exe` file
- **macOS:** Creates executable (consider creating `.app` bundle)
- **Linux:** Creates executable (consider creating AppImage)

## License

Same as the main project.

