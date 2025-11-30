import { useState, useEffect } from 'react'
import { getBackups, restoreFromBackup, deleteBackup, createBackup } from '../../utils/importUtils'
import './BackupManager.css'

function BackupManager({ onClose }) {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = () => {
    const backupList = getBackups()
    setBackups(backupList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
  }

  const handleManualBackup = () => {
    setLoading(true)
    try {
      createBackup()
      setTimeout(() => {
        loadBackups()
        setLoading(false)
        alert('Backup created successfully!')
      }, 300)
    } catch (error) {
      alert('Error creating backup: ' + error.message)
      setLoading(false)
    }
  }

  const handleRestore = (backupKey) => {
    if (!window.confirm('Are you sure you want to restore this backup? This will replace your current data.')) {
      return
    }

    setLoading(true)
    try {
      restoreFromBackup(backupKey)
      setTimeout(() => {
        alert('Backup restored successfully! The page will reload.')
        window.location.reload()
      }, 300)
    } catch (error) {
      alert('Error restoring backup: ' + error.message)
      setLoading(false)
    }
  }

  const handleDelete = (backupKey) => {
    if (!window.confirm('Are you sure you want to delete this backup?')) {
      return
    }

    try {
      deleteBackup(backupKey)
      loadBackups()
    } catch (error) {
      alert('Error deleting backup: ' + error.message)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="backup-manager-overlay" onClick={onClose}>
      <div className="backup-manager-container" onClick={(e) => e.stopPropagation()}>
        <div className="backup-manager-header">
          <h2>Backup Manager</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="backup-manager-content">
          <div className="backup-actions">
            <button 
              className="btn-create-backup"
              onClick={handleManualBackup}
              disabled={loading}
            >
              {loading ? 'Creating...' : '+ Create Manual Backup'}
            </button>
            <p className="backup-info">
              Automatic backups are created before data imports. Manual backups can be created anytime.
            </p>
          </div>

          <div className="backups-list">
            <h3>Available Backups ({backups.length})</h3>
            {backups.length === 0 ? (
              <div className="no-backups">
                <p>No backups available yet.</p>
                <p>Backups are automatically created before data imports.</p>
              </div>
            ) : (
              <div className="backup-items">
                {backups.map((backup) => (
                  <div key={backup.key} className="backup-item">
                    <div className="backup-info">
                      <div className="backup-date">
                        {formatDate(backup.timestamp)}
                      </div>
                      <div className="backup-stats">
                        {backup.data?.habits && (
                          <span>{Object.keys(backup.data.habits).length} days</span>
                        )}
                        {backup.data?.todos && (
                          <span>{backup.data.todos.length} todos</span>
                        )}
                      </div>
                    </div>
                    <div className="backup-actions-item">
                      <button
                        className="btn-restore"
                        onClick={() => handleRestore(backup.key)}
                        disabled={loading}
                      >
                        Restore
                      </button>
                      <button
                        className="btn-delete-backup"
                        onClick={() => handleDelete(backup.key)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackupManager
