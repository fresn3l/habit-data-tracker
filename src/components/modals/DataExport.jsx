import { useState } from 'react'
import { exportAllData, downloadData } from '../../utils/exportUtils'
import './DataExport.css'

function DataExport({ onClose }) {
  const [format, setFormat] = useState('json')
  const [dateRange, setDateRange] = useState({ enabled: false, start: '', end: '' })
  const [exporting, setExporting] = useState(false)

  const handleExport = () => {
    setExporting(true)
    
    try {
      const range = dateRange.enabled ? {
        start: dateRange.start,
        end: dateRange.end
      } : null
      
      const data = exportAllData(format, range)
      const filename = `habit-tracker-export-${new Date().toISOString().split('T')[0]}`
      downloadData(data, filename, format)
      
      setTimeout(() => {
        setExporting(false)
        if (onClose) onClose()
      }, 500)
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting data: ' + error.message)
      setExporting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const defaultStart = new Date()
  defaultStart.setDate(defaultStart.getDate() - 30)
  const defaultStartDate = defaultStart.toISOString().split('T')[0]

  return (
    <div className="data-export-overlay" onClick={onClose}>
      <div className="data-export-container" onClick={(e) => e.stopPropagation()}>
        <div className="data-export-header">
          <h2>Export Data</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="data-export-content">
          <div className="form-group">
            <label>Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="form-input"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={dateRange.enabled}
                onChange={(e) => setDateRange({ ...dateRange, enabled: e.target.checked })}
              />
              {' '}Export specific date range
            </label>
            
            {dateRange.enabled && (
              <div className="date-range-inputs">
                <input
                  type="date"
                  value={dateRange.start || defaultStartDate}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="form-input"
                  max={today}
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateRange.end || today}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="form-input"
                  max={today}
                />
              </div>
            )}
          </div>

          <div className="export-info">
            <p>This will export all your habits, todos, goals, and tracking data.</p>
            {format === 'json' && <p>JSON format preserves all data structure.</p>}
            {format === 'csv' && <p>CSV format is compatible with spreadsheet applications.</p>}
          </div>
        </div>

        <div className="data-export-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button 
            className="btn-export" 
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : 'Export Data'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataExport
