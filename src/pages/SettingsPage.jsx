/**
 * Settings Page Component
 * 
 * Main settings page for configuring app preferences and features.
 * Currently includes:
 * - Desktop file storage settings
 * 
 * @module pages/SettingsPage
 * @component
 */

import StorageSettings from '../components/settings/StorageSettings'
import DataExport from '../components/modals/DataExport'
import DataImport from '../components/modals/DataImport'
import BackupManager from '../components/modals/BackupManager'
import { useState } from 'react'
import './SettingsPage.css'

function SettingsPage() {
  const [showExport, setShowExport] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showBackup, setShowBackup] = useState(false)

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
      </div>

      <div className="settings-container">
        {/* Desktop File Storage Settings */}
        <div className="settings-section">
          <StorageSettings />
        </div>

        {/* Data Management Section */}
        <div className="settings-section">
          <div className="settings-card">
            <h3>Data Management</h3>
            <p className="settings-description">
              Export, import, and backup your data
            </p>
            
            <div className="settings-actions">
              <button 
                className="settings-btn export-btn"
                onClick={() => setShowExport(true)}
              >
                📤 Export Data
              </button>
              <button 
                className="settings-btn import-btn"
                onClick={() => setShowImport(true)}
              >
                📥 Import Data
              </button>
              <button 
                className="settings-btn backup-btn"
                onClick={() => setShowBackup(true)}
              >
                💾 Backup Manager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExport && (
        <DataExport onClose={() => setShowExport(false)} />
      )}

      {showImport && (
        <DataImport onClose={() => setShowImport(false)} />
      )}

      {showBackup && (
        <BackupManager onClose={() => setShowBackup(false)} />
      )}
    </div>
  )
}

export default SettingsPage

