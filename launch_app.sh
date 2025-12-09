#!/bin/bash
# Launch script for Personal Tracker Desktop App
# This script automatically activates the virtual environment and starts the app

# Get the directory containing this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "ERROR: Virtual environment not found!"
    echo ""
    echo "Please create it first:"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if eel is installed
if ! python3 -c "import eel" 2>/dev/null; then
    echo "ERROR: Eel not found in virtual environment!"
    echo ""
    echo "Please install dependencies:"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
    exit 1
fi

# Start the application
echo "Starting Personal Tracker..."
python3 start.py

