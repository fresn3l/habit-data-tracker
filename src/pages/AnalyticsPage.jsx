import { useState, useMemo } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getAverageTimeToCompletion, getHabitCompletionStats, getTodoCompletionStats, getProductivityTrend } from '../utils/analytics'
import { getAllHabitStreaks } from '../utils/streaksStorage'
import { getDifficultyStats, getHighEffortLowCompletion } from '../utils/difficultyUtils'
import DataExport from '../components/modals/DataExport'
import DataImport from '../components/modals/DataImport'
import BackupManager from '../components/modals/BackupManager'
import HabitCalendar from '../components/habits/HabitCalendar'
import DayDetailModal from '../components/modals/DayDetailModal'
import MoodHistory from '../components/analytics/MoodHistory'
import MoodCorrelationChart from '../components/analytics/MoodCorrelationChart'
import './AnalyticsPage.css'

const COLORS = ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4']

function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('month') // 'week', 'month', 'all'
  const [showExport, setShowExport] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showBackup, setShowBackup] = useState(false)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null)

  const avgTimeToCompletion = useMemo(() => {
    return getAverageTimeToCompletion(timeframe)
  }, [timeframe])

  const habitStats = useMemo(() => {
    return getHabitCompletionStats(timeframe)
  }, [timeframe])

  const todoStats = useMemo(() => {
    return getTodoCompletionStats(timeframe)
  }, [timeframe])

  const productivityTrend = useMemo(() => {
    return getProductivityTrend(timeframe)
  }, [timeframe])

  const chartData = useMemo(() => {
    return productivityTrend.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      habitRate: day.habitCompletionRate,
      todosCompleted: day.todosCompleted
    }))
  }, [productivityTrend])

  const habitStreaks = useMemo(() => {
    return getAllHabitStreaks()
  }, [habitStats]) // Recalculate when habit stats change

  const difficultyStats = useMemo(() => {
    return getDifficultyStats()
  }, [habitStats])

  const highEffortHabits = useMemo(() => {
    return getHighEffortLowCompletion()
  }, [difficultyStats])

  return (
    <>
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <div className="timeframe-selector">
          <button 
            className={`timeframe-btn ${timeframe === 'week' ? 'active' : ''}`}
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'month' ? 'active' : ''}`}
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'all' ? 'active' : ''}`}
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="analytics-container">
        {/* Summary Cards */}
        <div className="analytics-summary">
          <div className="stat-card">
            <h3>Habit Completion Rate</h3>
            <div className="stat-value">
              {habitStats.length > 0 
                ? Math.round(habitStats.reduce((sum, h) => sum + h.percentage, 0) / habitStats.length)
                : 0}%
            </div>
            <div className="stat-label">Average across all habits</div>
          </div>

          <div className="stat-card">
            <h3>Todo Completion Rate</h3>
            <div className="stat-value">{todoStats.completionRate}%</div>
            <div className="stat-label">
              {todoStats.completed} / {todoStats.total} completed
            </div>
          </div>

          <div className="stat-card">
            <h3>Avg Time to Complete</h3>
            <div className="stat-value">
              {avgTimeToCompletion ? avgTimeToCompletion.formatted : 'N/A'}
            </div>
            <div className="stat-label">
              {avgTimeToCompletion ? `Based on ${avgTimeToCompletion.count} todos` : 'No completed todos'}
            </div>
          </div>
        </div>

        {/* Habit Completion Rates */}
        {habitStats.length > 0 && (
          <div className="chart-container">
            <h2>Individual Habit Completion Rates</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={habitStats.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#666"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#666" domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="percentage" fill="#667eea" name="Completion %">
                  {habitStats.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Productivity Trend */}
        {chartData.length > 0 && (
          <div className="chart-container">
            <h2>Productivity Trend Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="habitRate" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 4 }}
                  name="Habit Completion %"
                />
                <Line 
                  type="monotone" 
                  dataKey="todosCompleted" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Todos Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Mood Tracking */}
        <div className="chart-container">
          <h2>Mood History</h2>
          <MoodHistory timeframe={timeframe} />
        </div>

        {/* Mood Correlations */}
        <div className="chart-container">
          <h2>Mood & Habit Correlations</h2>
          <MoodCorrelationChart />
        </div>

        {/* Calendar Heatmap */}
        <div className="chart-container">
          <h2>Completion Calendar</h2>
          <HabitCalendar 
            onDayClick={(date, dayData) => setSelectedCalendarDate(date)}
          />
        </div>

        {/* Habit Performance Table */}
        {habitStats.length > 0 && (
          <div className="chart-container">
            <h2>Habit Performance Details</h2>
            <div className="habit-stats-table">
              <table>
                <thead>
                  <tr>
                    <th>Habit</th>
                    <th>Completion Rate</th>
                    <th>Completed Days</th>
                    <th>Total Days</th>
                    <th>Current Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {habitStats.map(habit => (
                    <tr key={habit.id}>
                      <td>
                        <span className="habit-emoji-table">{habit.emoji}</span>
                        {habit.name}
                      </td>
                      <td>
                        <div className="percentage-cell">
                          <div className="percentage-bar">
                            <div 
                              className="percentage-fill"
                              style={{ 
                                width: `${habit.percentage}%`,
                                backgroundColor: habit.percentage >= 80 ? '#10b981' : 
                                                 habit.percentage >= 50 ? '#f59e0b' : '#ef4444'
                              }}
                            ></div>
                          </div>
                          <span className="percentage-text">{habit.percentage}%</span>
                        </div>
                      </td>
                      <td>{habit.completedDays}</td>
                      <td>{habit.totalDays}</td>
                      <td>
                        {habitStreaks[habit.id] && (
                          <div className="streak-info">
                            🔥 {habitStreaks[habit.id].currentStreak} days
                            {habitStreaks[habit.id].longestStreak > habitStreaks[habit.id].currentStreak && (
                              <span className="streak-best"> (Best: {habitStreaks[habit.id].longestStreak})</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Difficulty & Effort Analysis */}
        {difficultyStats.length > 0 && (
          <div className="chart-container">
            <h2>Habit Difficulty & Effort</h2>
            <div className="difficulty-stats">
              <div className="difficulty-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={difficultyStats.filter(s => s.difficulty).slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#666"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#666" domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="difficulty" fill="#f59e0b" name="Difficulty (1-5)" />
                    <Bar dataKey="completionRate" fill="#667eea" name="Completion Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {highEffortHabits.length > 0 && (
                <div className="effort-recommendations">
                  <h3>💡 Recommendations</h3>
                  <p>These habits have high effort but low completion rates. Consider:</p>
                  <ul>
                    {highEffortHabits.slice(0, 3).map(habit => (
                      <li key={habit.id}>
                        <strong>{habit.name}</strong> - Try breaking it down into smaller steps or reducing difficulty
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Todo Statistics */}
        {todoStats.total > 0 && (
          <div className="chart-container">
            <h2>Todo Statistics</h2>
            <div className="todo-stats-grid">
              <div className="todo-stat-item">
                <div className="todo-stat-value">{todoStats.total}</div>
                <div className="todo-stat-label">Total Todos</div>
              </div>
              <div className="todo-stat-item">
                <div className="todo-stat-value completed">{todoStats.completed}</div>
                <div className="todo-stat-label">Completed</div>
              </div>
              <div className="todo-stat-item">
                <div className="todo-stat-value pending">{todoStats.pending}</div>
                <div className="todo-stat-label">Pending</div>
              </div>
              <div className="todo-stat-item">
                <div className="todo-stat-value">{todoStats.completionRate}%</div>
                <div className="todo-stat-label">Completion Rate</div>
              </div>
            </div>
          </div>
        )}

        {habitStats.length === 0 && todoStats.total === 0 && (
          <div className="no-analytics">
            <p>No data available yet. Start tracking your habits and todos to see analytics!</p>
          </div>
        )}
      </div>

      {showExport && <DataExport onClose={() => setShowExport(false)} />}
      {showImport && (
        <DataImport 
          onClose={() => setShowImport(false)}
          onSuccess={() => setShowImport(false)}
        />
      )}
      {showBackup && <BackupManager onClose={() => setShowBackup(false)} />}
      {selectedCalendarDate && (
        <DayDetailModal 
          date={selectedCalendarDate}
          onClose={() => setSelectedCalendarDate(null)}
        />
      )}
    </>
  )
}

export default AnalyticsPage
