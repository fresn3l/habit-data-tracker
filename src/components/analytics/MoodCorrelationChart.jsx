import { useMemo } from 'react'
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { getMoodVsHabitsCompleted, getTopMoodBoostingHabits, getTopMoodNegativeHabits } from '../utils/moodCorrelations'
import { getAllStoredData } from '../utils/dataStorage'
import './MoodCorrelationChart.css'

const COLORS = ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

function MoodCorrelationChart() {
  const scatterData = useMemo(() => {
    return getMoodVsHabitsCompleted()
  }, [])

  const topBoosting = useMemo(() => {
    return getTopMoodBoostingHabits(5)
  }, [])

  const topNegative = useMemo(() => {
    return getTopMoodNegativeHabits(3)
  }, [])

  const allData = getAllStoredData()
  
  const getHabitName = (habitId) => {
    for (const dayData of Object.values(allData)) {
      if (dayData.habits) {
        const habit = dayData.habits.find(h => h.id === habitId)
        if (habit) return habit.name
      }
    }
    return 'Unknown'
  }

  const barData = useMemo(() => {
    return topBoosting.map(corr => ({
      name: getHabitName(corr.habitId),
      moodImpact: corr.moodImpact.toFixed(2),
      avgMoodWith: corr.avgMoodWith?.toFixed(2) || 'N/A',
      days: corr.daysWithHabit
    }))
  }, [topBoosting, allData])

  if (scatterData.length === 0) {
    return (
      <div className="mood-correlation-empty">
        <p>Not enough data for correlation analysis.</p>
        <p>Track your mood and habits for a few days to see insights!</p>
      </div>
    )
  }

  return (
    <div className="mood-correlation-charts">
      {/* Scatter Plot */}
      <div className="correlation-chart-section">
        <h3>Mood vs Habits Completed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={scatterData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              type="number" 
              dataKey="habitsCompleted" 
              name="Habits Completed"
              stroke="#666"
              label={{ value: 'Habits Completed', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="mood" 
              name="Mood"
              stroke="#666"
              domain={[1, 5]}
              label={{ value: 'Mood (1-5)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => {
                if (name === 'mood') return `${value}/5`
                return value
              }}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
            />
            <Legend />
            <Scatter name="Mood vs Habits" data={scatterData} fill="#667eea" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Top Mood Boosting Habits */}
      {barData.length > 0 && (
        <div className="correlation-chart-section">
          <h3>Top Habits That Boost Your Mood</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#666" />
              <Tooltip 
                formatter={(value) => `${value} points`}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="moodImpact" name="Mood Impact" fill="#10b981">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Habits List */}
      {topBoosting.length > 0 && (
        <div className="top-habits-list">
          <h3>🎯 Top Habits for Better Mood</h3>
          <div className="habits-ranking">
            {topBoosting.slice(0, 5).map((corr, index) => (
              <div key={corr.habitId} className="habit-rank-item">
                <div className="rank-number">#{index + 1}</div>
                <div className="rank-info">
                  <div className="rank-name">{getHabitName(corr.habitId)}</div>
                  <div className="rank-stats">
                    <span className="mood-impact positive">
                      +{corr.moodImpact.toFixed(2)} mood boost
                    </span>
                    <span className="mood-days">
                      {corr.daysWithHabit} days tracked
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topNegative.length > 0 && (
        <div className="top-habits-list negative">
          <h3>⚠️ Habits That May Lower Mood</h3>
          <div className="habits-ranking">
            {topNegative.map((corr, index) => (
              <div key={corr.habitId} className="habit-rank-item">
                <div className="rank-number">#{index + 1}</div>
                <div className="rank-info">
                  <div className="rank-name">{getHabitName(corr.habitId)}</div>
                  <div className="rank-stats">
                    <span className="mood-impact negative">
                      {corr.moodImpact.toFixed(2)} mood impact
                    </span>
                    <span className="mood-days">
                      {corr.daysWithoutHabit} days tracked
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodCorrelationChart
