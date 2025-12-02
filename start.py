#!/usr/bin/env python3
"""
Personal Tracker Desktop Application - Python Backend

This module serves as the Python backend for the Personal Tracker desktop application.
It uses the Eel library to create a standalone desktop app by:
1. Serving the built React application from the 'web' directory
2. Launching Chrome/Edge in app mode (no browser UI)
3. Exposing Python functions to the JavaScript frontend (optional)

Architecture:
- Eel creates a local web server that serves the React app
- Chrome/Edge is launched in app mode (--app flag) for a native feel
- The app runs in its own window without browser UI elements

Requirements:
- Python 3.7+
- Eel library (pip install eel)
- Microsoft Edge or Google Chrome installed
- Built React app in 'web' directory (run 'npm run build' first)

Usage:
    python3 start.py

For packaging as standalone executable:
    python3 package.py
    # Creates dist/PersonalTracker executable

@module start
@author Personal Tracker Development Team
@version 1.0.0
"""

import eel
import os
import sys
import json
from pathlib import Path

# ============================================================================
# PATH RESOLUTION
# ============================================================================

def get_resource_path(relative_path):
    """
    Get absolute path to a resource file or directory.
    
    This function handles path resolution for both development and
    PyInstaller-packaged environments:
    - Development: Uses the directory containing start.py
    - Packaged: Uses PyInstaller's temporary extraction directory (_MEIPASS)
    
    PyInstaller extracts all files to a temporary directory when the
    executable runs. The _MEIPASS attribute contains the path to this
    temporary directory. We need to use this path to find our 'web'
    directory when the app is packaged.
    
    Args:
        relative_path (str): Path relative to the base directory
                            (e.g., 'web', 'assets/icon.png')
    
    Returns:
        str: Absolute path to the resource
    
    Example:
        >>> web_path = get_resource_path('web')
        >>> # Returns: '/path/to/app/web' (dev) or '/tmp/_MEI12345/web' (packaged)
    """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        # This is set when running from a packaged executable
        base_path = sys._MEIPASS
    except AttributeError:
        # Not packaged - running in development mode
        # Use the directory containing this script (start.py)
        base_path = os.path.abspath(os.path.dirname(__file__))
    
    return os.path.join(base_path, relative_path)

# Get the correct path to web directory (contains built React app)
web_path = get_resource_path('web')

# Initialize Eel with the web directory
# This tells Eel where to find the HTML/CSS/JS files to serve
eel.init(web_path)

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

APP_NAME = "Personal Tracker"
APP_VERSION = "1.0.0"
WINDOW_SIZE = (1400, 900)  # Width x Height in pixels

# ============================================================================
# PYTHON FUNCTIONS EXPOSED TO JAVASCRIPT
# ============================================================================

# These functions can be called from JavaScript using: eel.function_name()()
# They provide a bridge between the React frontend and Python backend

@eel.expose
def get_app_info():
    """
    Returns application information.
    
    This function can be called from JavaScript to get app metadata.
    Useful for displaying version info or platform-specific features.
    
    Returns:
        dict: Application information
            - name (str): Application name
            - version (str): Application version
            - platform (str): Operating system platform
    
    Example (JavaScript):
        const info = await eel.get_app_info()()
        console.log(info.name)  // "Personal Tracker"
    """
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "platform": sys.platform
    }

@eel.expose
def get_app_data_path():
    """
    Returns the path where app data should be stored.
    
    This follows platform conventions:
    - Windows: %APPDATA%/Personal Tracker
    - macOS: ~/Library/Application Support/Personal Tracker
    - Linux: ~/.local/share/Personal Tracker
    
    Currently not used (app uses browser localStorage), but available
    for future features like file-based backups or cloud sync.
    
    Returns:
        str: Absolute path to app data directory
    
    Example (JavaScript):
        const dataPath = await eel.get_app_data_path()()
        // Returns: "/Users/username/Library/Application Support/Personal Tracker"
    """
    if sys.platform == "win32":
        # Windows: Use AppData\Roaming
        app_data = os.path.join(os.environ.get("APPDATA", ""), APP_NAME)
    elif sys.platform == "darwin":  # macOS
        # macOS: Use ~/Library/Application Support
        app_data = os.path.join(
            os.path.expanduser("~"),
            "Library",
            "Application Support",
            APP_NAME
        )
    else:  # Linux and other Unix-like systems
        # Linux: Use ~/.local/share (XDG Base Directory spec)
        app_data = os.path.join(
            os.path.expanduser("~"),
            ".local",
            "share",
            APP_NAME
        )
    
    # Create directory if it doesn't exist
    os.makedirs(app_data, exist_ok=True)
    return app_data

@eel.expose
def save_file_dialog(default_filename="habit-tracker-backup.json"):
    """
    Opens a file save dialog (placeholder - not fully implemented).
    
    Note: Eel doesn't have built-in native file dialogs. This is a
    placeholder for future enhancement. Currently, the app uses
    JavaScript's File API for file operations.
    
    Args:
        default_filename (str): Suggested filename for the save dialog
    
    Returns:
        dict: Placeholder response
            - success (bool): Always False (not implemented)
            - message (str): Explanation message
    
    Future: Could use platform-specific libraries like:
    - tkinter.filedialog (cross-platform, but requires GUI)
    - PyQt5/PySide2 file dialogs
    - Platform-specific APIs (Cocoa on macOS, Win32 on Windows)
    """
    # Note: Eel doesn't have built-in file dialogs
    # You would need to use JavaScript's file API or implement a custom solution
    # This is a placeholder for future enhancement
    return {"success": False, "message": "File dialogs not implemented yet"}

@eel.expose
def read_file(file_path):
    """
    Reads a file and returns its contents (for data import).
    
    This function allows the JavaScript frontend to read files from
    the filesystem. Used for importing backup data.
    
    Args:
        file_path (str): Absolute path to the file to read
    
    Returns:
        dict: Result object
            - success (bool): True if read succeeded, False otherwise
            - content (str): File contents (if success)
            - error (str): Error message (if failure)
    
    Example (JavaScript):
        const result = await eel.read_file('/path/to/backup.json')()
        if (result.success) {
            const data = JSON.parse(result.content)
        }
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return {"success": True, "content": content}
    except Exception as e:
        return {"success": False, "error": str(e)}

@eel.expose
def write_file(file_path, content):
    """
    Writes content to a file (for data export).
    
    This function allows the JavaScript frontend to write files to
    the filesystem. Used for exporting backup data.
    
    Args:
        file_path (str): Absolute path where file should be written
        content (str): Content to write to the file
    
    Returns:
        dict: Result object
            - success (bool): True if write succeeded, False otherwise
            - error (str): Error message (if failure)
    
    Example (JavaScript):
        const result = await eel.write_file('/path/to/backup.json', jsonData)()
        if (result.success) {
            console.log('Export successful!')
        }
    """
    try:
        # Ensure directory exists before writing
        dir_path = os.path.dirname(file_path)
        if dir_path:
            os.makedirs(dir_path, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@eel.expose
def show_notification(title, message):
    """
    Shows a system notification (placeholder - not fully implemented).
    
    Currently just prints to console. In production, you might want to use:
    - plyer (cross-platform notifications)
    - pynotifier (Windows/Linux)
    - Cocoa APIs (macOS)
    
    Args:
        title (str): Notification title
        message (str): Notification message
    
    Returns:
        dict: Always returns {"success": True}
    
    Future: Implement platform-specific system notifications
    """
    # Placeholder for system notifications
    # In production, you might want to use platform-specific notification libraries
    print(f"Notification: {title} - {message}")
    return {"success": True}

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def check_web_directory():
    """
    Verifies that the web directory exists and contains the built React app.
    
    This function checks:
    1. That the 'web' directory exists
    2. That 'web/index.html' exists (entry point for the React app)
    
    Returns:
        bool: True if web directory is valid, False otherwise
    
    Side Effects:
        Prints error messages to console if validation fails
    """
    web_dir = Path(web_path)
    index_file = web_dir / 'index.html'
    
    if not web_dir.exists():
        print(f"ERROR: 'web' directory not found at {web_dir}!")
        print("Please run 'npm run build' first to build the React app.")
        return False
    
    if not index_file.exists():
        print(f"ERROR: 'web/index.html' not found at {index_file}!")
        print("Please run 'npm run build' first to build the React app.")
        return False
    
    return True

# ============================================================================
# MAIN APPLICATION ENTRY POINT
# ============================================================================

def main():
    """
    Main entry point for the desktop application.
    
    This function:
    1. Validates that the web directory exists
    2. Detects available browser (Edge or Chrome)
    3. Launches the browser in app mode
    4. Starts the Eel server
    
    The app runs in standalone mode (no browser UI) using Chrome/Edge's
    --app flag. Safari is not supported because it doesn't support app mode.
    
    Raises:
        SystemExit: Exits with code 1 if web directory is missing or
                   if no supported browser is found
    
    Side Effects:
        - Starts a local web server on port 8080
        - Launches Chrome/Edge in app mode
        - Blocks until the application is closed
    """
    # Validate web directory before proceeding
    if not check_web_directory():
        sys.exit(1)
    
    print(f"Starting {APP_NAME} v{APP_VERSION}...")
    print(f"Window size: {WINDOW_SIZE[0]}x{WINDOW_SIZE[1]}")
    
    # ========================================================================
    # BROWSER DETECTION
    # ========================================================================
    
    # Check for Edge or Chrome on macOS - REQUIRED for app mode
    # Safari doesn't support app mode, so we need Chrome or Edge
    edge_path = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    chrome_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    
    chrome_path_param = None
    browser_name = None
    
    # Prefer Edge (better on macOS), fall back to Chrome
    if os.path.exists(edge_path):
        chrome_path_param = edge_path
        browser_name = "Microsoft Edge"
        print(f"✓ Found {browser_name}")
    elif os.path.exists(chrome_path):
        chrome_path_param = chrome_path
        browser_name = "Google Chrome"
        print(f"✓ Found {browser_name}")
    else:
        # No supported browser found - exit with error
        print("ERROR: Neither Chrome nor Edge found!")
        print("")
        print("To run as a standalone app (not in Safari), you need:")
        print("  - Microsoft Edge: https://www.microsoft.com/edge")
        print("  - OR Google Chrome: https://www.google.com/chrome")
        print("")
        print("Safari does not support app mode. Please install Edge or Chrome.")
        sys.exit(1)
    
    # ========================================================================
    # APPLICATION LAUNCH
    # ========================================================================
    
    try:
        import subprocess
        import threading
        import time
        
        # Use a fixed port so we can launch browser manually
        # Port 8080 is commonly used for development servers
        FIXED_PORT = 8080
        
        def launch_browser():
            """
            Launch Edge/Chrome in app mode pointing to the Eel server.
            
            This function runs in a separate thread to avoid blocking.
            It waits a short time for the Eel server to start, then
            launches the browser with the --app flag for standalone mode.
            
            Browser flags:
            - --app: Run in app mode (no browser UI)
            - --window-size: Set window dimensions
            - --disable-web-security: Allow local file access (dev only)
            - --disable-features=TranslateUI: Disable translation UI
            - --disable-background-networking: Reduce background processes
            - --no-first-run: Skip first-run dialogs
            - --no-default-browser-check: Don't prompt to set as default
            """
            # Give Eel server time to start (reduced from 1s for faster startup)
            time.sleep(0.2)
            
            # Construct the URL to the React app
            url = f'http://localhost:{FIXED_PORT}/index.html'
            
            # Build command-line arguments for browser launch
            app_args = [
                chrome_path_param,              # Browser executable path
                '--app=' + url,                 # App mode with URL
                '--window-size={},{}'.format(WINDOW_SIZE[0], WINDOW_SIZE[1]),
                '--disable-web-security',       # Allow local file access
                '--disable-features=TranslateUI',  # Disable translation
                '--disable-background-networking',  # Reduce background processes
                '--no-first-run',               # Skip first-run dialogs
                '--no-default-browser-check'    # Don't prompt for default browser
            ]
            
            # Launch browser in a separate process
            subprocess.Popen(app_args)
        
        print(f"Starting app in {browser_name} (standalone mode)...")
        
        # Launch browser in a separate thread (non-blocking)
        # Daemon thread means it will exit when main thread exits
        browser_thread = threading.Thread(target=launch_browser, daemon=True)
        browser_thread.start()
        
        # Start Eel server without auto-opening browser (mode=False)
        # We launch the browser manually for better control
        eel.start('index.html',
                  mode=False,           # Don't auto-open browser
                  port=FIXED_PORT,      # Use fixed port
                  host='localhost',     # Only accept local connections
                  disable_cache=True)    # Disable browser cache for development
        
    except (SystemExit, MemoryError, KeyboardInterrupt):
        # Handle graceful shutdown
        # SystemExit: Normal exit
        # MemoryError: Out of memory (rare)
        # KeyboardInterrupt: User pressed Ctrl+C
        print(f"\n{APP_NAME} is shutting down...")
        pass
    except Exception as e:
        # Handle any other unexpected errors
        print(f"ERROR: Failed to start application: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure Chrome/Edge is installed")
        print("2. Run 'npm run build' to build the React app")
        print("3. Check that 'web' directory contains index.html")
        sys.exit(1)

# ============================================================================
# SCRIPT ENTRY POINT
# ============================================================================

if __name__ == '__main__':
    # Only run main() if this script is executed directly
    # (not when imported as a module)
    main()
