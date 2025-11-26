import { useState, useEffect } from 'react'
import { calculateStreak } from '../utils/streaksStorage'
import './StreakBadge.css'

function StreakBadge({ habitId, showLongest = false }) {
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 })

  useEffect(() => {
    const streakData = calculateStreak(habitId)
    setStreak(streakData)
  }, [habitId])

  if (streak.currentStreak === 0 && !showLongest) return null

  return (
    <div className="streak-badge">
      {streak.currentStreak > 0 && (
        <span className="streak-fire">🔥</span>
      )}
      <span className="streak-count">{streak.currentStreak}</span>
      <span className="streak-label">day{streak.currentStreak !== 1 ? 's' : ''}</span>
      {showLongest && streak.longestStreak > streak.currentStreak && (
        <span className="streak-longest">
          (Best: {streak.longestStreak})
        </span>
      )}
    </div>
  )
}

export default StreakBadge
