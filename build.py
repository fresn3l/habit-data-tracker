#!/usr/bin/env python3
"""
Build script for Personal Tracker Desktop Application
Builds the React app and prepares the application for packaging.
"""

import os
import sys
import subprocess
from pathlib import Path

def print_step(step, message):
    """Prints a formatted step message."""
    print(f"\n{'='*60}")
    print(f"[{step}] {message}")
    print('='*60)

def run_command(command, description, check=True):
    """Runs a shell command and handles errors."""
    print(f"\n> {description}")
    print(f"  Running: {command}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            check=check,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"ERROR: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def check_requirements():
    """Checks if all required tools are installed."""
    print_step("CHECK", "Checking Requirements")
    
    requirements = {
        "Node.js": "node --version",
        "npm": "npm --version",
        "Python": "python3 --version",
    }
    
    all_ok = True
    for tool, command in requirements.items():
        success = run_command(command, f"Checking {tool}", check=False)
        if not success:
            print(f"  ❌ {tool} not found or not working")
            all_ok = False
        else:
            print(f"  ✅ {tool} is installed")
    
    return all_ok

def check_node_modules():
    """Checks if node_modules exists, installs if missing."""
    print_step("DEPENDENCIES", "Checking Node Dependencies")
    
    if not Path("node_modules").exists():
        print("  node_modules not found. Installing dependencies...")
        if not run_command("npm install", "Installing npm packages"):
            return False
        print("  ✅ Dependencies installed")
    else:
        print("  ✅ node_modules exists")
    
    return True

def check_python_env():
    """Checks if Python virtual environment exists, creates if missing."""
    print_step("PYTHON ENV", "Checking Python Virtual Environment")
    
    venv_path = Path("venv")
    if not venv_path.exists():
        print("  Virtual environment not found. Creating...")
        if not run_command("python3 -m venv venv", "Creating virtual environment"):
            return False
        print("  ✅ Virtual environment created")
    else:
        print("  ✅ Virtual environment exists")
    
    # Check if Eel is installed
    print("  Checking Eel installation...")
    eel_check = run_command(
        "source venv/bin/activate && pip show eel",
        "Checking for Eel package",
        check=False
    )
    
    if not eel_check:
        print("  Eel not found. Installing from requirements.txt...")
        if not run_command(
            "source venv/bin/activate && pip install -r requirements.txt",
            "Installing Python dependencies"
        ):
            return False
        print("  ✅ Python dependencies installed")
    else:
        print("  ✅ Eel is installed")
    
    return True

def build_react_app():
    """Builds the React application."""
    print_step("BUILD", "Building React Application")
    
    # Clean previous build if it exists
    web_dir = Path("web")
    if web_dir.exists():
        print("  Cleaning previous build...")
        # Remove old files but keep the directory
        for file in web_dir.iterdir():
            if file.is_file():
                file.unlink()
            elif file.is_dir():
                import shutil
                shutil.rmtree(file)
        print("  ✅ Previous build cleaned")
    
    # Build the React app
    if not run_command("npm run build", "Building React app with Vite"):
        return False
    
    # Verify build output
    index_file = web_dir / "index.html"
    assets_dir = web_dir / "assets"
    
    if not index_file.exists():
        print("  ❌ ERROR: index.html not found in web/ directory")
        return False
    
    if not assets_dir.exists() or not any(assets_dir.iterdir()):
        print("  ❌ ERROR: assets directory is empty")
        return False
    
    print("  ✅ React app built successfully")
    
    # Show build output info
    print(f"\n  Build output:")
    print(f"    - index.html: {index_file.exists()}")
    asset_files = list(assets_dir.glob("*"))
    print(f"    - Assets: {len(asset_files)} file(s)")
    for asset in asset_files[:5]:  # Show first 5
        size = asset.stat().st_size / 1024  # KB
        print(f"      • {asset.name} ({size:.1f} KB)")
    if len(asset_files) > 5:
        print(f"      ... and {len(asset_files) - 5} more")
    
    return True

def verify_build():
    """Verifies that the build is complete and ready."""
    print_step("VERIFY", "Verifying Build")
    
    checks = {
        "web/index.html": Path("web/index.html"),
        "web/assets directory": Path("web/assets"),
        "start.py": Path("start.py"),
        "requirements.txt": Path("requirements.txt"),
    }
    
    all_ok = True
    for name, path in checks.items():
        if path.exists():
            print(f"  ✅ {name}")
        else:
            print(f"  ❌ {name} - MISSING")
            all_ok = False
    
    return all_ok

def main():
    """Main build process."""
    print("="*60)
    print("Personal Tracker - Desktop App Build Script")
    print("="*60)
    
    # Step 1: Check requirements
    if not check_requirements():
        print("\n❌ Requirements check failed. Please install missing tools.")
        sys.exit(1)
    
    # Step 2: Check/install Node dependencies
    if not check_node_modules():
        print("\n❌ Failed to install Node dependencies.")
        sys.exit(1)
    
    # Step 3: Check/install Python dependencies
    if not check_python_env():
        print("\n❌ Failed to set up Python environment.")
        sys.exit(1)
    
    # Step 4: Build React app
    if not build_react_app():
        print("\n❌ React app build failed.")
        sys.exit(1)
    
    # Step 5: Verify build
    if not verify_build():
        print("\n❌ Build verification failed.")
        sys.exit(1)
    
    # Success!
    print_step("SUCCESS", "Build Complete!")
    print("\n✅ The application is ready to run!")
    print("\nTo start the desktop app:")
    print("  1. Activate virtual environment: source venv/bin/activate")
    print("  2. Run the app: python3 start.py")
    print("\nOr on Windows:")
    print("  1. Activate virtual environment: venv\\Scripts\\activate")
    print("  2. Run the app: python start.py")
    print()

if __name__ == '__main__':
    main()

