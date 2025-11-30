import { useState } from 'react'
import { importData, validateImportData } from '../../utils/importUtils'
import './DataImport.css'

function DataImport({ onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [importMode, setImportMode] = useState('replace') // 'replace' or 'merge'
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target.result
        const data = JSON.parse(text)
        const validation = validateImportData(data)
        
        if (!validation.valid) {
          setError(validation.error)
          setPreview(null)
        } else {
          setPreview({
            data: data,
            warning: validation.warning
          })
        }
      } catch (err) {
        setError('Invalid JSON file: ' + err.message)
        setPreview(null)
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleImport = () => {
    if (!preview || !preview.data) {
      setError('Please select a valid file first')
      return
    }

    setImporting(true)
    setError(null)

    try {
      const result = importData(preview.data, {
        merge: importMode === 'merge',
        backup: true
      })

      setTimeout(() => {
        setImporting(false)
        if (result.warning) {
          alert('Import successful with warning: ' + result.warning)
        }
        if (onSuccess) onSuccess()
        if (onClose) onClose()
        window.location.reload() // Reload to show new data
      }, 500)
    } catch (err) {
      setError('Import error: ' + err.message)
      setImporting(false)
    }
  }

  return (
    <div className="data-import-overlay" onClick={onClose}>
      <div className="data-import-container" onClick={(e) => e.stopPropagation()}>
        <div className="data-import-header">
          <h2>Import Data</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="data-import-content">
          <div className="form-group">
            <label>Select JSON File</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="file-input"
            />
            <small>Select a previously exported JSON file to import</small>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {preview && (
            <div className="preview-section">
              <h3>Preview</h3>
              {preview.warning && (
                <div className="warning-message">
                  ⚠️ {preview.warning}
                </div>
              )}
              <div className="preview-stats">
                <div className="preview-stat">
                  <strong>{Object.keys(preview.data.data?.habits || {}).length}</strong> days of habit data
                </div>
                <div className="preview-stat">
                  <strong>{preview.data.data?.todos?.length || 0}</strong> todos
                </div>
                <div className="preview-stat">
                  <strong>{preview.data.data?.goals?.length || 0}</strong> goals
                </div>
                <div className="preview-stat">
                  <strong>{preview.data.data?.goalSteps?.length || 0}</strong> goal steps
                </div>
              </div>
              {preview.data.exportDate && (
                <div className="preview-date">
                  Exported: {new Date(preview.data.exportDate).toLocaleString()}
                </div>
              )}
            </div>
          )}

          {preview && (
            <div className="form-group">
              <label>Import Mode</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={(e) => setImportMode(e.target.value)}
                  />
                  {' '}Replace all data (will backup current data first)
                </label>
                <label>
                  <input
                    type="radio"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={(e) => setImportMode(e.target.value)}
                  />
                  {' '}Merge with existing data
                </label>
              </div>
            </div>
          )}

          <div className="import-warning">
            <p>⚠️ <strong>Warning:</strong> Importing data will modify your current data.</p>
            <p>A backup will be created automatically before import.</p>
          </div>
        </div>

        <div className="data-import-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-import" 
            onClick={handleImport}
            disabled={!preview || importing}
          >
            {importing ? 'Importing...' : 'Import Data'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataImport
