import { useState, useEffect, useRef } from 'react'
import './TimeTracker.css'

function TimeTracker({ habitId, onTimeRecorded, initialTime = null }) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(initialTime || 0) // in seconds
  const [manualTime, setManualTime] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
    if (time > 0 && onTimeRecorded) {
      onTimeRecorded(time / 60) // Convert to minutes
    }
  }

  const handleReset = () => {
    setTime(0)
    setIsRunning(false)
  }

  const handleManualEntry = () => {
    const minutes = parseFloat(manualTime)
    if (!isNaN(minutes) && minutes > 0) {
      if (onTimeRecorded) {
        onTimeRecorded(minutes)
      }
      setManualTime('')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="time-tracker">
      <div className="timer-display">
        <span className="timer-time">{formatTime(time)}</span>
        {isRunning && <span className="timer-indicator">●</span>}
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="timer-btn start" onClick={handleStart}>
            ▶ Start
          </button>
        ) : (
          <button className="timer-btn stop" onClick={handleStop}>
            ⏸ Stop
          </button>
        )}
        <button className="timer-btn reset" onClick={handleReset}>
          ↻ Reset
        </button>
      </div>

      <div className="manual-time-entry">
        <span className="manual-label">Or enter time manually:</span>
        <div className="manual-input-group">
          <input
            type="number"
            step="0.1"
            min="0"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            placeholder="Minutes"
            className="manual-time-input"
          />
          <span className="manual-unit">min</span>
          <button className="timer-btn save" onClick={handleManualEntry}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimeTracker
