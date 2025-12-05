# Desktop File Storage - Implementation Guide

## Overview

Yes! You can absolutely store all app data in a file on your Desktop. Since this is a desktop app using Python Eel, we already have file system access. This guide shows you how to implement desktop file storage.

---

## 🎯 How It Works

### Current System (localStorage)
- Data stored in browser localStorage
- Hidden from view
- Limited to browser storage location

### New System (Desktop File)
- All data in a single JSON file on your Desktop
- Easy to see, backup, and share
- You control the location

---

## 📁 File Structure

**Option 1: Single File (Recommended)**
```
~/Desktop/personal-tracker-data.json
```

Contains all data:
```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-12-01T20:00:00.000Z",
  "data": {
    "habits": { /* all habit data */ },
    "todos": [ /* all todos */ ],
    "goals": [ /* all goals */ ],
    "goalSteps": [ /* all goal steps */ ],
    "mood": { /* all mood data */ },
    "journals": { /* all journals */ },
    "reminders": [ /* all reminders */ ],
    "streaks": { /* all streaks */ }
  }
}
```

**Option 2: Folder with Separate Files**
```
~/Desktop/personal-tracker-data/
  ├── habits.json
  ├── todos.json
  ├── goals.json
  ├── mood.json
  └── journals.json
```

---

## 🔧 Implementation Options

### Option A: Automatic Sync (Recommended)
- Auto-syncs localStorage ↔ Desktop file
- Changes in app update the file
- File changes update the app
- Best of both worlds

### Option B: Desktop File Only
- All data in desktop file only
- localStorage used as temporary cache
- Requires file to be accessible

### Option C: Manual Sync
- User chooses when to sync
- Button to "Save to Desktop"
- Button to "Load from Desktop"

---

## 🚀 Quick Implementation: Option A (Auto-Sync)

This is the easiest and most user-friendly approach.

### Step 1: Add Python Functions to `start.py`

```python
import json
import os
from pathlib import Path

@eel.expose
def get_desktop_path():
    """
    Returns the user's Desktop path.
    
    Returns:
        dict: Result object with desktop path
    """
    try:
        desktop = Path.home() / 'Desktop'
        return {
            "success": True,
            "path": str(desktop)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@eel.expose
def save_all_data_to_file(file_path, data_json):
    """
    Saves all app data to a JSON file.
    
    Args:
        file_path (str): Full path to the data file
        data_json (str): JSON string of all app data
    
    Returns:
        dict: Result object
    """
    try:
        # Ensure directory exists
        directory = os.path.dirname(file_path)
        os.makedirs(directory, exist_ok=True)
        
        # Write file with pretty formatting
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(json.loads(data_json), f, indent=2, ensure_ascii=False)
        
        return {
            "success": True,
            "path": file_path
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@eel.expose
def load_all_data_from_file(file_path):
    """
    Loads all app data from a JSON file.
    
    Args:
        file_path (str): Full path to the data file
    
    Returns:
        dict: Result object with data
    """
    try:
        if not os.path.exists(file_path):
            return {
                "success": False,
                "error": "File not found"
            }
        
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return {
            "success": True,
            "data": data
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@eel.expose
def set_data_file_path(file_path):
    """
    Saves the chosen data file path to a config file.
    
    Args:
        file_path (str): Full path to the data file
    
    Returns:
        dict: Result object
    """
    try:
        config_path = Path.home() / '.personal-tracker-config.json'
        config = {
            "dataFilePath": file_path
        }
        with open(config_path, 'w') as f:
            json.dump(config, f)
        
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

@eel.expose
def get_data_file_path():
    """
    Gets the saved data file path from config.
    
    Returns:
        dict: Result object with file path
    """
    try:
        config_path = Path.home() / '.personal-tracker-config.json'
        if os.path.exists(config_path):
            with open(config_path, 'r') as f:
                config = json.load(f)
                return {
                    "success": True,
                    "path": config.get("dataFilePath")
                }
        return {
            "success": True,
            "path": None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

### Step 2: Create Desktop Storage Utility (`src/utils/desktopStorage.js`)

```javascript
/**
 * Desktop File Storage Utilities
 * 
 * Syncs app data between localStorage and a desktop file.
 */

// Check if Eel is available
const isEelAvailable = () => {
  return typeof window !== 'undefined' && window.eel
}

/**
 * Get the desktop path.
 */
export const getDesktopPath = async () => {
  if (!isEelAvailable()) {
    return null
  }
  
  try {
    const result = await window.eel.get_desktop_path()()
    if (result.success) {
      return result.path
    }
  } catch (error) {
    console.error('Error getting desktop path:', error)
  }
  
  return null
}

/**
 * Get the configured data file path.
 */
export const getDataFilePath = async () => {
  if (!isEelAvailable()) {
    return null
  }
  
  try {
    const result = await window.eel.get_data_file_path()()
    if (result.success) {
      return result.path
    }
  } catch (error) {
    console.error('Error getting data file path:', error)
  }
  
  return null
}

/**
 * Set the data file path.
 */
export const setDataFilePath = async (filePath) => {
  if (!isEelAvailable()) {
    return false
  }
  
  try {
    const result = await window.eel.set_data_file_path(filePath)()
    return result.success
  } catch (error) {
    console.error('Error setting data file path:', error)
    return false
  }
}

/**
 * Export all data from localStorage to JSON.
 */
const exportAllData = () => {
  const { getAllStoredData } = require('./dataStorage')
  const { getAllTodos } = require('./todoStorage')
  const { getAllGoals, getAllGoalSteps } = require('./goalStorage')
  const { getAllJournals } = require('./journalStorage')
  
  // Import mood and reminder storage
  const moodData = JSON.parse(localStorage.getItem('mood-data') || '{}')
  const reminders = JSON.parse(localStorage.getItem('habit-tracker-reminders') || '[]')
  const streaks = JSON.parse(localStorage.getItem('habit-tracker-streaks') || '{}')
  
  return {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    data: {
      habits: getAllStoredData(),
      todos: getAllTodos(),
      goals: getAllGoals(),
      goalSteps: getAllGoalSteps(),
      mood: moodData,
      journals: getAllJournals(),
      reminders: reminders,
      streaks: streaks
    }
  }
}

/**
 * Save all data to desktop file.
 */
export const saveAllDataToDesktop = async (filePath = null) => {
  if (!isEelAvailable()) {
    console.warn('Eel not available - cannot save to desktop')
    return { success: false, error: 'Desktop storage not available' }
  }
  
  try {
    // Get file path (use provided or get saved path)
    let dataFilePath = filePath
    if (!dataFilePath) {
      dataFilePath = await getDataFilePath()
      
      // If no path saved, use default Desktop location
      if (!dataFilePath) {
        const desktopPath = await getDesktopPath()
        if (!desktopPath) {
          return { success: false, error: 'Could not get desktop path' }
        }
        dataFilePath = `${desktopPath}/personal-tracker-data.json`
      }
    }
    
    // Export all data
    const allData = exportAllData()
    
    // Save to file
    const result = await window.eel.save_all_data_to_file(dataFilePath, JSON.stringify(allData))()
    
    if (result.success) {
      // Save the file path for future use
      await setDataFilePath(dataFilePath)
    }
    
    return result
  } catch (error) {
    console.error('Error saving data to desktop:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Load all data from desktop file.
 */
export const loadAllDataFromDesktop = async (filePath = null) => {
  if (!isEelAvailable()) {
    return { success: false, error: 'Desktop storage not available' }
  }
  
  try {
    // Get file path
    let dataFilePath = filePath
    if (!dataFilePath) {
      dataFilePath = await getDataFilePath()
      if (!dataFilePath) {
        return { success: false, error: 'No data file path configured' }
      }
    }
    
    // Load from file
    const result = await window.eel.load_all_data_from_file(dataFilePath)()
    
    if (!result.success) {
      return result
    }
    
    // Import all data to localStorage
    const { importAllData } = require('./desktopStorage')
    importAllData(result.data)
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error loading data from desktop:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Import data into localStorage from desktop file data.
 */
const importAllData = (data) => {
  if (!data || !data.data) {
    throw new Error('Invalid data structure')
  }
  
  const { data: appData } = data
  
  // Import each data type
  if (appData.habits) {
    localStorage.setItem('habit-tracker-data', JSON.stringify(appData.habits))
  }
  if (appData.todos) {
    localStorage.setItem('todos-data', JSON.stringify(appData.todos))
  }
  if (appData.goals) {
    localStorage.setItem('goals-data', JSON.stringify(appData.goals))
  }
  if (appData.goalSteps) {
    localStorage.setItem('goal-steps-data', JSON.stringify(appData.goalSteps))
  }
  if (appData.mood) {
    localStorage.setItem('mood-data', JSON.stringify(appData.mood))
  }
  if (appData.journals) {
    localStorage.setItem('habit-tracker-journals', JSON.stringify(appData.journals))
  }
  if (appData.reminders) {
    localStorage.setItem('habit-tracker-reminders', JSON.stringify(appData.reminders))
  }
  if (appData.streaks) {
    localStorage.setItem('habit-tracker-streaks', JSON.stringify(appData.streaks))
  }
  
  // Clear all caches
  const { clearDataCache } = require('./dataStorage')
  clearDataCache()
}

/**
 * Auto-sync: Save to desktop file whenever data changes.
 * Call this after any save operation.
 */
export const autoSyncToDesktop = async () => {
  // Check if auto-sync is enabled
  const autoSyncEnabled = localStorage.getItem('desktop-auto-sync-enabled') === 'true'
  if (!autoSyncEnabled) {
    return
  }
  
  // Debounce: Only sync every 2 seconds max
  const lastSync = localStorage.getItem('desktop-last-sync-time')
  const now = Date.now()
  if (lastSync && (now - parseInt(lastSync)) < 2000) {
    return // Too soon, skip
  }
  
  localStorage.setItem('desktop-last-sync-time', now.toString())
  
  // Save to desktop in background (don't block UI)
  saveAllDataToDesktop().catch(error => {
    console.warn('Auto-sync failed:', error)
  })
}

/**
 * Enable/disable auto-sync.
 */
export const setAutoSyncEnabled = (enabled) => {
  localStorage.setItem('desktop-auto-sync-enabled', enabled ? 'true' : 'false')
  if (enabled) {
    // Sync immediately when enabling
    autoSyncToDesktop()
  }
}

export const isAutoSyncEnabled = () => {
  return localStorage.getItem('desktop-auto-sync-enabled') === 'true'
}
```

### Step 3: Integrate Auto-Sync into Storage Functions

Update `src/utils/dataStorage.js` to auto-sync after saves:

```javascript
import { autoSyncToDesktop } from './desktopStorage'

export const saveDayData = (dateKey, habits, weight = null) => {
  // ... existing save logic ...
  
  // Auto-sync to desktop (background, non-blocking)
  autoSyncToDesktop().catch(err => {
    console.warn('Auto-sync failed:', err)
  })
}
```

Do the same for:
- `src/utils/todoStorage.js`
- `src/utils/goalStorage.js`
- `src/utils/moodStorage.js`
- `src/utils/journalStorage.js`

### Step 4: Add Settings UI

Create `src/components/settings/StorageSettings.jsx`:

```javascript
import { useState, useEffect } from 'react'
import { 
  getDesktopPath, 
  getDataFilePath,
  setDataFilePath,
  saveAllDataToDesktop,
  loadAllDataFromDesktop,
  setAutoSyncEnabled,
  isAutoSyncEnabled
} from '../../utils/desktopStorage'

function StorageSettings() {
  const [desktopPath, setDesktopPath] = useState(null)
  const [filePath, setFilePath] = useState(null)
  const [autoSync, setAutoSync] = useState(false)
  
  useEffect(() => {
    loadSettings()
  }, [])
  
  const loadSettings = async () => {
    const desktop = await getDesktopPath()
    setDesktopPath(desktop)
    
    const savedPath = await getDataFilePath()
    setFilePath(savedPath || `${desktop}/personal-tracker-data.json`)
    
    setAutoSync(isAutoSyncEnabled())
  }
  
  const handleEnableAutoSync = async (enabled) => {
    setAutoSyncEnabled(enabled)
    setAutoSync(enabled)
    if (enabled) {
      await saveAllDataToDesktop(filePath)
    }
  }
  
  const handleSaveNow = async () => {
    const result = await saveAllDataToDesktop(filePath)
    if (result.success) {
      alert('✅ Data saved to desktop!')
    } else {
      alert('❌ Error: ' + result.error)
    }
  }
  
  const handleLoadNow = async () => {
    if (confirm('This will replace all current data. Continue?')) {
      const result = await loadAllDataFromDesktop(filePath)
      if (result.success) {
        alert('✅ Data loaded from desktop!')
        window.location.reload() // Refresh to show new data
      } else {
        alert('❌ Error: ' + result.error)
      }
    }
  }
  
  return (
    <div className="storage-settings">
      <h2>Desktop File Storage</h2>
      
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => handleEnableAutoSync(e.target.checked)}
          />
          Auto-sync to desktop file
        </label>
        <p className="setting-hint">
          Automatically save all data to desktop file whenever you make changes
        </p>
      </div>
      
      <div className="setting-item">
        <label>Data File Location:</label>
        <input
          type="text"
          value={filePath || ''}
          onChange={(e) => setFilePath(e.target.value)}
          placeholder={`${desktopPath}/personal-tracker-data.json`}
        />
        <button onClick={handleSaveNow}>Save Now</button>
        <button onClick={handleLoadNow}>Load Now</button>
      </div>
      
      <div className="setting-info">
        <p>
          💡 <strong>Tip:</strong> Enable auto-sync to automatically save all changes
          to your desktop file. The file will be updated whenever you:
        </p>
        <ul>
          <li>Complete a habit</li>
          <li>Add/edit a todo</li>
          <li>Update a goal</li>
          <li>Log mood or journal entry</li>
        </ul>
      </div>
    </div>
  )
}

export default StorageSettings
```

---

## 📋 Implementation Checklist

- [ ] Add Python functions to `start.py`
- [ ] Create `src/utils/desktopStorage.js`
- [ ] Integrate auto-sync into storage functions
- [ ] Add Settings UI component
- [ ] Test save/load functionality
- [ ] Test auto-sync
- [ ] Handle errors gracefully

---

## 🎯 Result

After implementation:

1. **Settings Page** → Enable "Auto-sync to desktop file"
2. **Choose location** → Desktop or custom path
3. **File created** → `personal-tracker-data.json` on your Desktop
4. **Auto-updates** → File updates whenever you make changes
5. **Easy backup** → Just copy the file!

---

**Would you like me to implement this feature? It would take about 1-2 hours to build completely!**

