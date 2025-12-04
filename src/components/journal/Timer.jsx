/**
 * Journal Timer Component
 * 
 * A 10-minute countdown timer for journaling sessions.
 * Allows users to:
 * - Start the timer
 * - Pause/resume the timer
 * - Reset the timer
 * - See time remaining
 * 
 * The timer counts down from 10 minutes (600 seconds) to 0.
 * 
 * @module components/journal/Timer
 * @component
 */

import { useState, useEffect, useRef } from 'react'
import './Timer.css'

const TIMER_DURATION = 600 // 10 minutes in seconds

/**
 * Timer component for journaling sessions.
 * 
 * @param {Object} props
 * @param {Function} props.onComplete - Callback when timer reaches 0
 * @param {Function} props.onTimeUpdate - Callback when timer updates (receives seconds remaining)
 * @returns {JSX.Element} Timer component
 */
export default function Timer({ onComplete, onTimeUpdate }) {
  /**
   * Current time remaining in seconds.
   */
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION)
  
  /**
   * Whether the timer is currently running.
   */
  const [isRunning, setIsRunning] = useState(false)
  
  /**
   * Whether the timer has been started at least once.
   */
  const [hasStarted, setHasStarted] = useState(false)
  
  /**
   * Reference to the interval ID for cleanup.
   */
  const intervalRef = useRef(null)
  
  /**
   * Format seconds into MM:SS format.
   * 
   * @param {number} seconds - Total seconds
   * @returns {string} Formatted time string (e.g., "10:00", "05:30")
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  /**
   * Start or resume the timer.
   */
  const handleStart = () => {
    setIsRunning(true)
    if (!hasStarted) {
      setHasStarted(true)
    }
  }
  
  /**
   * Pause the timer.
   */
  const handlePause = () => {
    setIsRunning(false)
  }
  
  /**
   * Reset the timer to 10 minutes.
   */
  const handleReset = () => {
    setIsRunning(false)
    setHasStarted(false)
    setTimeRemaining(TIMER_DURATION)
  }
  
  /**
   * Timer effect - runs every second when timer is active.
   */
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1
          
          // Notify parent component of time update
          if (onTimeUpdate) {
            onTimeUpdate(TIMER_DURATION - newTime) // Send elapsed time
          }
          
          // When timer reaches 0, stop and notify
          if (newTime === 0) {
            setIsRunning(false)
            if (onComplete) {
              onComplete()
            }
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    
    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeRemaining, onComplete, onTimeUpdate])
  
  /**
   * Calculate progress percentage for visual progress bar.
   */
  const progress = ((TIMER_DURATION - timeRemaining) / TIMER_DURATION) * 100
  
  /**
   * Get timer status text for display.
   */
  const getStatusText = () => {
    if (!hasStarted) {
      return 'Ready to start'
    }
    if (isRunning) {
      return 'Journaling in progress...'
    }
    if (timeRemaining === 0) {
      return 'Time\'s up! Great job!'
    }
    return 'Paused'
  }
  
  return (
    <div className="journal-timer">
      {/* Timer Display */}
      <div className="timer-display">
        <div className="timer-time">{formatTime(timeRemaining)}</div>
        <div className="timer-status">{getStatusText()}</div>
      </div>
      
      {/* Progress Bar */}
      <div className="timer-progress-container">
        <div 
          className="timer-progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Timer Controls */}
      <div className="timer-controls">
        {!isRunning && timeRemaining > 0 && (
          <button
            className="timer-btn timer-btn-start"
            onClick={handleStart}
            aria-label={hasStarted ? "Resume timer" : "Start timer"}
          >
            {hasStarted ? '▶ Resume' : '▶ Start'}
          </button>
        )}
        
        {isRunning && (
          <button
            className="timer-btn timer-btn-pause"
            onClick={handlePause}
            aria-label="Pause timer"
          >
            ⏸ Pause
          </button>
        )}
        
        {hasStarted && (
          <button
            className="timer-btn timer-btn-reset"
            onClick={handleReset}
            aria-label="Reset timer"
          >
            ↻ Reset
          </button>
        )}
      </div>
      
      {/* Timer Info */}
      <div className="timer-info">
        <span>Goal: 10 minutes of focused journaling</span>
      </div>
    </div>
  )
}

