#!/usr/bin/env python3
"""
Personal Tracker Desktop Application
Launches the React habit tracker app as a standalone desktop application using Eel.
"""

import eel
import os
import sys
import json
from pathlib import Path

# Determine the correct path to web directory
# When packaged with PyInstaller, we need to find the directory correctly
def get_resource_path(relative_path):
    """Get absolute path to resource, works for dev and for PyInstaller"""
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        # If not packaged, use the directory containing start.py
        base_path = os.path.abspath(os.path.dirname(__file__))
    
    return os.path.join(base_path, relative_path)

# Get the correct path to web directory
web_path = get_resource_path('web')

# Initialize Eel with the web directory (contains built React app)
eel.init(web_path)

# Application configuration
APP_NAME = "Personal Tracker"
APP_VERSION = "1.0.0"
WINDOW_SIZE = (1400, 900)  # Width x Height

# Optional: Expose Python functions to the frontend
# These functions can be called from JavaScript using: eel.function_name()()

@eel.expose
def get_app_info():
    """Returns application information."""
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "platform": sys.platform
    }

@eel.expose
def get_app_data_path():
    """Returns the path where app data should be stored (for future use)."""
    if sys.platform == "win32":
        app_data = os.path.join(os.environ.get("APPDATA", ""), APP_NAME)
    elif sys.platform == "darwin":  # macOS
        app_data = os.path.join(
            os.path.expanduser("~"),
            "Library",
            "Application Support",
            APP_NAME
        )
    else:  # Linux
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
    """Opens a file save dialog (placeholder - Eel doesn't have native dialogs)."""
    # Note: Eel doesn't have built-in file dialogs
    # You would need to use JavaScript's file API or implement a custom solution
    # This is a placeholder for future enhancement
    return {"success": False, "message": "File dialogs not implemented yet"}

@eel.expose
def read_file(file_path):
    """Reads a file and returns its contents (for data import)."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return {"success": True, "content": content}
    except Exception as e:
        return {"success": False, "error": str(e)}

@eel.expose
def write_file(file_path, content):
    """Writes content to a file (for data export)."""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path) if os.path.dirname(file_path) else '.', exist_ok=True)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@eel.expose
def show_notification(title, message):
    """Shows a system notification (if platform supports it)."""
    # Placeholder for system notifications
    # In production, you might want to use platform-specific notification libraries
    print(f"Notification: {title} - {message}")
    return {"success": True}

def check_web_directory():
    """Verifies that the web directory exists and contains the built React app."""
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

def main():
    """Main entry point for the desktop application."""
    # Check if web directory exists
    if not check_web_directory():
        sys.exit(1)
    
    print(f"Starting {APP_NAME} v{APP_VERSION}...")
    print(f"Window size: {WINDOW_SIZE[0]}x{WINDOW_SIZE[1]}")
    
    # Start Eel application
    # Try to use Edge first (better on macOS), fall back to Chrome
    # mode='chrome-app' for app mode (no browser UI) - works with Chrome/Edge
    # size=WINDOW_SIZE sets the window dimensions
    # port=0 means use a random available port
    
    # Check for Edge or Chrome on macOS - REQUIRED for app mode
    edge_path = '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    chrome_path = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    
    chrome_path_param = None
    browser_name = None
    
    if os.path.exists(edge_path):
        chrome_path_param = edge_path
        browser_name = "Microsoft Edge"
        print(f"✓ Found {browser_name}")
    elif os.path.exists(chrome_path):
        chrome_path_param = chrome_path
        browser_name = "Google Chrome"
        print(f"✓ Found {browser_name}")
    else:
        print("ERROR: Neither Chrome nor Edge found!")
        print("")
        print("To run as a standalone app (not in Safari), you need:")
        print("  - Microsoft Edge: https://www.microsoft.com/edge")
        print("  - OR Google Chrome: https://www.google.com/chrome")
        print("")
        print("Safari does not support app mode. Please install Edge or Chrome.")
        sys.exit(1)
    
    try:
        import subprocess
        import threading
        import time
        
        # Use a fixed port so we can launch browser manually
        FIXED_PORT = 8080
        
        # Function to launch Edge/Chrome in app mode after server starts
        def launch_browser():
            """Launch Edge/Chrome in app mode pointing to the Eel server."""
            time.sleep(0.2)  # Give Eel server time to start (reduced from 1s)
            url = f'http://localhost:{FIXED_PORT}/index.html'
            app_args = [
                chrome_path_param,
                '--app=' + url,
                '--window-size={},{}'.format(WINDOW_SIZE[0], WINDOW_SIZE[1]),
                '--disable-web-security',
                '--disable-features=TranslateUI',
                '--disable-background-networking',
                '--no-first-run',
                '--no-default-browser-check'
            ]
            subprocess.Popen(app_args)
        
        print(f"Starting app in {browser_name} (standalone mode)...")
        
        # Launch browser in a separate thread
        browser_thread = threading.Thread(target=launch_browser, daemon=True)
        browser_thread.start()
        
        # Start Eel server without auto-opening browser (mode=False)
        # We'll launch the browser manually
        eel.start('index.html',
                  mode=False,  # Don't auto-open browser
                  port=FIXED_PORT,
                  host='localhost',
                  disable_cache=True)
    except (SystemExit, MemoryError, KeyboardInterrupt):
        # Handle graceful shutdown
        print(f"\n{APP_NAME} is shutting down...")
        pass
    except Exception as e:
        print(f"ERROR: Failed to start application: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure Chrome/Edge is installed")
        print("2. Run 'npm run build' to build the React app")
        print("3. Check that 'web' directory contains index.html")
        sys.exit(1)

if __name__ == '__main__':
    main()

