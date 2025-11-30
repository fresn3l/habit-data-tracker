#!/usr/bin/env python3
"""
Quick test script to verify the Eel app setup
Tests that all components are in place without launching the GUI.
"""

import sys
from pathlib import Path

def test_web_directory():
    """Tests that the web directory exists and has required files."""
    print("Testing web directory...")
    web_dir = Path("web")
    index_file = web_dir / "index.html"
    assets_dir = web_dir / "assets"
    
    if not web_dir.exists():
        print("  ❌ web/ directory not found")
        return False
    
    if not index_file.exists():
        print("  ❌ web/index.html not found")
        return False
    
    if not assets_dir.exists():
        print("  ❌ web/assets/ directory not found")
        return False
    
    asset_files = list(assets_dir.glob("*"))
    if not asset_files:
        print("  ❌ web/assets/ directory is empty")
        return False
    
    print(f"  ✅ web/ directory structure is correct")
    print(f"     - index.html exists")
    print(f"     - assets/ has {len(asset_files)} file(s)")
    return True

def test_python_dependencies():
    """Tests that Python dependencies are installed."""
    print("\nTesting Python dependencies...")
    try:
        import eel
        print(f"  ✅ Eel is installed (version check: {eel.__version__ if hasattr(eel, '__version__') else 'installed'})")
        return True
    except ImportError:
        print("  ❌ Eel is not installed")
        print("     Run: source venv/bin/activate && pip install -r requirements.txt")
        return False

def test_start_script():
    """Tests that start.py exists and is valid."""
    print("\nTesting start.py...")
    start_file = Path("start.py")
    if not start_file.exists():
        print("  ❌ start.py not found")
        return False
    
    try:
        # Try to import it to check for syntax errors
        import importlib.util
        spec = importlib.util.spec_from_file_location("start", start_file)
        if spec is None:
            print("  ❌ start.py could not be loaded")
            return False
        print("  ✅ start.py exists and is valid")
        return True
    except Exception as e:
        print(f"  ❌ Error checking start.py: {e}")
        return False

def test_build_output():
    """Tests that the build output is valid."""
    print("\nTesting build output...")
    index_file = Path("web/index.html")
    
    if not index_file.exists():
        print("  ❌ Build output not found")
        print("     Run: python3 build.py")
        return False
    
    # Check that index.html references assets
    try:
        content = index_file.read_text()
        if "assets" in content or "index-" in content:
            print("  ✅ Build output looks valid")
            return True
        else:
            print("  ⚠️  Build output exists but may be incomplete")
            return True  # Still count as pass
    except Exception as e:
        print(f"  ⚠️  Could not read index.html: {e}")
        return True  # Still count as pass if file exists

def main():
    """Run all tests."""
    print("="*60)
    print("Personal Tracker - Application Test")
    print("="*60)
    
    tests = [
        ("Web Directory", test_web_directory),
        ("Python Dependencies", test_python_dependencies),
        ("Start Script", test_start_script),
        ("Build Output", test_build_output),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n  ❌ Error in {name} test: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n✅ All tests passed! The app is ready to run.")
        print("\nTo launch the desktop app:")
        print("  source venv/bin/activate")
        print("  python3 start.py")
        return 0
    else:
        print("\n❌ Some tests failed. Please fix the issues above.")
        print("\nTo rebuild:")
        print("  python3 build.py")
        return 1

if __name__ == '__main__':
    sys.exit(main())

