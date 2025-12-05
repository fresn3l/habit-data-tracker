/**
 * Storage Settings Component
 * 
 * Allows users to configure desktop file storage:
 * - Enable/disable auto-sync
 * - View/change file path
 * - Manually save/load data
 * 
 * @module components/settings/StorageSettings
 * @component
 */

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
import './StorageSettings.css'

function StorageSettings() {
  const [desktopPath, setDesktopPath] = useState(null)
  const [filePath, setFilePath] = useState(null)
  const [autoSync, setAutoSync] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [isEelAvailable, setIsEelAvailable] = useState(false)

  useEffect(() => {
    checkEelAvailability()
    loadSettings()
  }, [])

  const checkEelAvailability = () => {
    const available = typeof window !== 'undefined' && window.eel
    setIsEelAvailable(available)
  }

  const loadSettings = async () => {
    try {
      const desktop = await getDesktopPath()
      setDesktopPath(desktop)
      
      const savedPath = await getDataFilePath()
      const defaultPath = desktop ? `${desktop}/personal-tracker-data.json` : null
      setFilePath(savedPath || defaultPath)
      
      setAutoSync(isAutoSyncEnabled())
    } catch (error) {
      console.error('Error loading settings:', error)
      setMessage({ type: 'error', text: 'Failed to load settings' })
    }
  }

  const handleEnableAutoSync = async (enabled) => {
    setAutoSyncEnabled(enabled)
    setAutoSync(enabled)
    
    if (enabled) {
      // Sync immediately when enabling
      setIsLoading(true)
      try {
        const result = await saveAllDataToDesktop(filePath)
        if (result.success) {
          setMessage({ type: 'success', text: 'Auto-sync enabled! Data saved to desktop.' })
          setTimeout(() => setMessage(null), 3000)
        } else {
          setMessage({ type: 'error', text: `Failed to save: ${result.error}` })
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to save data' })
      } finally {
        setIsLoading(false)
      }
    } else {
      setMessage({ type: 'info', text: 'Auto-sync disabled' })
      setTimeout(() => setMessage(null), 2000)
    }
  }

  const handleSaveNow = async () => {
    if (!filePath) {
      setMessage({ type: 'error', text: 'Please set a file path first' })
      return
    }

    setIsLoading(true)
    try {
      const result = await saveAllDataToDesktop(filePath)
      if (result.success) {
        setMessage({ type: 'success', text: `✅ Data saved to: ${result.path}` })
        setTimeout(() => setMessage(null), 5000)
        await setDataFilePath(filePath) // Save path for future use
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save data' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadNow = async () => {
    if (!filePath) {
      setMessage({ type: 'error', text: 'Please set a file path first' })
      return
    }

    if (!confirm('This will replace all current data with data from the desktop file. Continue?')) {
      return
    }

    setIsLoading(true)
    try {
      const result = await loadAllDataFromDesktop(filePath)
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Data loaded! Refreshing...' })
        setTimeout(() => {
          window.location.reload() // Refresh to show new data
        }, 1000)
      } else {
        setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load data' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilePathChange = async (newPath) => {
    setFilePath(newPath)
    if (newPath) {
      await setDataFilePath(newPath)
    }
  }

  if (!isEelAvailable) {
    return (
      <div className="storage-settings">
        <div className="storage-not-available">
          <p>⚠️ Desktop file storage is only available in the desktop app.</p>
          <p>This feature requires Python Eel integration.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="storage-settings">
      <h2>Desktop File Storage</h2>
      
      {message && (
        <div className={`storage-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="setting-section">
        <div className="setting-item">
          <label className="setting-label">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => handleEnableAutoSync(e.target.checked)}
              disabled={isLoading}
              className="setting-checkbox"
            />
            <span className="setting-label-text">Enable Auto-Sync</span>
          </label>
          <p className="setting-description">
            Automatically save all data to the desktop file whenever you make changes.
            The file will update in the background without interrupting your work.
          </p>
        </div>

        <div className="setting-item">
          <label className="setting-label">Data File Location:</label>
          <div className="file-path-input-group">
            <input
              type="text"
              value={filePath || ''}
              onChange={(e) => handleFilePathChange(e.target.value)}
              placeholder={desktopPath ? `${desktopPath}/personal-tracker-data.json` : 'Enter file path...'}
              className="file-path-input"
              disabled={isLoading}
            />
            <div className="file-path-actions">
              <button 
                onClick={handleSaveNow}
                disabled={isLoading || !filePath}
                className="storage-btn save-btn"
              >
                {isLoading ? 'Saving...' : 'Save Now'}
              </button>
              <button 
                onClick={handleLoadNow}
                disabled={isLoading || !filePath}
                className="storage-btn load-btn"
              >
                {isLoading ? 'Loading...' : 'Load Now'}
              </button>
            </div>
          </div>
          <p className="setting-hint">
            💡 Default location: <code>{desktopPath || 'Desktop'}/personal-tracker-data.json</code>
          </p>
        </div>

        <div className="setting-info">
          <h3>How It Works</h3>
          <ul>
            <li>
              <strong>Auto-Sync:</strong> When enabled, all changes (habits, todos, goals, mood, journals) 
              are automatically saved to the desktop file.
            </li>
            <li>
              <strong>Manual Save:</strong> Click "Save Now" to manually save all current data.
            </li>
            <li>
              <strong>Manual Load:</strong> Click "Load Now" to load data from the desktop file 
              (replaces current data).
            </li>
            <li>
              <strong>Backup:</strong> Simply copy the JSON file to backup your data!
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StorageSettings

