import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getMoodHistory, getAverageMood, getMoodEmoji } from '../utils/moodStorage'
import './MoodHistory.css'

function MoodHistory({ timeframe = 'month' }) {
  const dateRange = useMemo(() => {
    const today = new Date()
    const start = new Date()
    
    if (timeframe === 'week') {
      start.setDate(today.getDate() - 7)
    } else if (timeframe === 'month') {
      start.setMonth(today.getMonth() - 1)
    } else {
      start.setFullYear(today.getFullYear() - 1)
    }
    
    return { start, end: today }
  }, [timeframe])

  const moodData = useMemo(() => {
    const history = getMoodHistory(
      dateRange.start.toDateString(),
      dateRange.end.toDateString()
    )
    
    return history.map(mood => ({
      date: new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: mood.mood,
      emoji: getMoodEmoji(mood.mood),
      notes: mood.notes
    }))
  }, [dateRange, timeframe])

  const averageMood = useMemo(() => {
    return getAverageMood(
      dateRange.start.toDateString(),
      dateRange.end.toDateString()
    )
  }, [dateRange, timeframe])

  if (moodData.length === 0) {
    return (
      <div className="mood-history-empty">
        <p>No mood data available for this period.</p>
        <p>Start tracking your mood to see trends!</p>
      </div>
    )
  }

  return (
    <div className="mood-history">
      {averageMood && (
        <div className="mood-average">
          <span className="average-label">Average Mood:</span>
          <span className="average-emoji">{getMoodEmoji(Math.round(averageMood))}</span>
          <span className="average-value">{averageMood.toFixed(1)} / 5</span>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="date" stroke="#666" />
          <YAxis stroke="#666" domain={[1, 5]} />
          <Tooltip 
            formatter={(value) => `${getMoodEmoji(value)} ${value}/5`}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="#667eea" 
            strokeWidth={3}
            dot={{ fill: '#667eea', r: 5 }}
            name="Mood (1-5)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MoodHistory
