import { useState, useEffect } from 'react'
import { saveReminder, getReminder } from '../utils/reminderStorage'
import './ReminderSettings.css'

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAY_INDICES = [0, 1, 2, 3, 4, 5, 6]

function ReminderSettings({ habitId, onClose, onSave }) {
  const [enabled, setEnabled] = useState(false)
  const [time, setTime] = useState('09:00')
  const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5]) // Default: weekdays

  useEffect(() => {
    const reminder = getReminder(habitId)
    if (reminder) {
      setEnabled(reminder.enabled || false)
      setTime(reminder.time || '09:00')
      setSelectedDays(reminder.days || [1, 2, 3, 4, 5])
    }
  }, [habitId])

  const handleDayToggle = (dayIndex) => {
    setSelectedDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex)
      } else {
        return [...prev, dayIndex].sort()
      }
    })
  }

  const handlePreset = (preset) => {
    switch (preset) {
      case 'weekdays':
        setSelectedDays([1, 2, 3, 4, 5])
        break
      case 'weekends':
        setSelectedDays([0, 6])
        break
      case 'everyday':
        setSelectedDays([0, 1, 2, 3, 4, 5, 6])
        break
      default:
        break
    }
  }

  const handleSave = () => {
    const reminderConfig = {
      enabled: enabled && selectedDays.length > 0,
      time: time,
      days: selectedDays
    }
    
    saveReminder(habitId, reminderConfig)
    
    if (onSave) {
      onSave(reminderConfig)
    }
    
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="reminder-settings">
      <div className="reminder-settings-header">
        <h3>🔔 Reminder Settings</h3>
      </div>

      <div className="reminder-settings-content">
        <div className="setting-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="toggle-checkbox"
            />
            <span>Enable Reminders</span>
          </label>
        </div>

        {enabled && (
          <>
            <div className="setting-group">
              <label>Reminder Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="time-input"
              />
            </div>

            <div className="setting-group">
              <label>Repeat On</label>
              <div className="preset-buttons">
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePreset('weekdays')}
                >
                  Weekdays
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePreset('weekends')}
                >
                  Weekends
                </button>
                <button
                  type="button"
                  className="preset-btn"
                  onClick={() => handlePreset('everyday')}
                >
                  Every Day
                </button>
              </div>
              <div className="days-selector">
                {DAY_INDICES.map(dayIndex => (
                  <button
                    key={dayIndex}
                    type="button"
                    className={`day-btn ${selectedDays.includes(dayIndex) ? 'selected' : ''}`}
                    onClick={() => handleDayToggle(dayIndex)}
                  >
                    {DAY_LABELS[dayIndex]}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="reminder-settings-actions">
        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}

export default ReminderSettings

