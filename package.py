#!/usr/bin/env python3
"""
Packaging script for Personal Tracker Desktop Application
Creates a standalone executable using PyInstaller.
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

def check_build():
    """Checks if the app has been built."""
    print_step("CHECK", "Checking Build Status")
    
    web_dir = Path("web")
    index_file = web_dir / "index.html"
    
    if not web_dir.exists() or not index_file.exists():
        print("  ❌ App has not been built yet.")
        print("  Run 'python3 build.py' first to build the React app.")
        return False
    
    print("  ✅ Build files found")
    return True

def create_spec_file():
    """Creates a PyInstaller spec file for the application."""
    print_step("SPEC", "Creating PyInstaller Spec File")
    
    spec_content = '''# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['start.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('web', 'web'),  # Include the entire web directory
    ],
    hiddenimports=[
        'eel',
        'bottle',
        'bottle_websocket',
        'gevent',
        'gevent.websocket',
        'geventwebsocket',
        'future',
        'pyparsing',
        'typing_extensions',
        'importlib_resources',
        'zope.event',
        'zope.interface',
        'greenlet',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='PersonalTracker',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Window Based - no console
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # Add icon path here if you have one: 'icon.ico'
)
'''
    
    spec_file = Path("PersonalTracker.spec")
    spec_file.write_text(spec_content)
    print(f"  ✅ Created {spec_file}")
    return True

def package_app():
    """Packages the application using PyInstaller."""
    print_step("PACKAGE", "Packaging Application")
    
    # Check if spec file exists, create if not
    spec_file = Path("PersonalTracker.spec")
    if not spec_file.exists():
        print("  Creating spec file...")
        create_spec_file()
    
    # Run PyInstaller
    print("  Running PyInstaller...")
    print("  This may take a few minutes...")
    
    try:
        result = subprocess.run(
            ["pyinstaller", "--clean", "PersonalTracker.spec"],
            check=True,
            capture_output=True,
            text=True
        )
        
        if result.stdout:
            # Print last few lines of output
            lines = result.stdout.strip().split('\n')
            print("\n".join(lines[-10:]))
        
        print("  ✅ Packaging complete!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"  ❌ Packaging failed: {e}")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False
    except FileNotFoundError:
        print("  ❌ PyInstaller not found")
        print("  Make sure you're in the virtual environment:")
        print("    source venv/bin/activate")
        return False

def verify_package():
    """Verifies that the package was created successfully."""
    print_step("VERIFY", "Verifying Package")
    
    dist_dir = Path("dist")
    exe_name = "PersonalTracker"
    
    if sys.platform == "win32":
        exe_path = dist_dir / f"{exe_name}.exe"
    else:
        exe_path = dist_dir / exe_name
    
    if not exe_path.exists():
        print(f"  ❌ Executable not found at {exe_path}")
        return False
    
    size_mb = exe_path.stat().st_size / (1024 * 1024)
    print(f"  ✅ Executable created: {exe_path}")
    print(f"  ✅ Size: {size_mb:.1f} MB")
    
    return True

def main():
    """Main packaging process."""
    print("="*60)
    print("Personal Tracker - Packaging Script")
    print("="*60)
    
    # Step 1: Check if app is built
    if not check_build():
        sys.exit(1)
    
    # Step 2: Create spec file
    if not create_spec_file():
        print("\n❌ Failed to create spec file.")
        sys.exit(1)
    
    # Step 3: Package the app
    if not package_app():
        print("\n❌ Packaging failed.")
        sys.exit(1)
    
    # Step 4: Verify package
    if not verify_package():
        print("\n❌ Package verification failed.")
        sys.exit(1)
    
    # Success!
    print_step("SUCCESS", "Packaging Complete!")
    
    if sys.platform == "win32":
        exe_path = "dist/PersonalTracker.exe"
    else:
        exe_path = "dist/PersonalTracker"
    
    print(f"\n✅ Executable created: {exe_path}")
    print(f"\nYou can now distribute this executable!")
    print(f"\nNote: The executable is platform-specific.")
    print(f"      To create for other platforms, run this script on that platform.")
    print()

if __name__ == '__main__':
    main()

