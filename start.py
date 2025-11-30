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

# Initialize Eel with the web directory (contains built React app)
eel.init('web')

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
    web_dir = Path('web')
    index_file = web_dir / 'index.html'
    
    if not web_dir.exists():
        print(f"ERROR: 'web' directory not found!")
        print("Please run 'npm run build' first to build the React app.")
        return False
    
    if not index_file.exists():
        print(f"ERROR: 'web/index.html' not found!")
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
    # mode='chrome' uses Chrome/Edge (or 'chrome-app' for app mode)
    # size=WINDOW_SIZE sets the window dimensions
    # port=0 means use a random available port
    try:
        eel.start(
            'index.html',
            mode='chrome-app',  # 'chrome-app' for app mode (no browser UI)
            size=WINDOW_SIZE,
            port=0,  # Random port
            host='localhost',
            disable_cache=True,  # Disable cache for development
            cmdline_args=[
                '--disable-web-security',  # Allow local file access if needed
                '--disable-features=TranslateUI',
                '--disable-background-networking'
            ]
        )
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

