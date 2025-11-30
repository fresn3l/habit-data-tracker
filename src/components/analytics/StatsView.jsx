import { useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts'
import { getWeekData, getMonthData, calculateCompletionRate, calculatePercentageChange, getDateRange, getAllStoredData, getAverageWeight, calculateWeightChange } from '../../utils/dataStorage'
import { HABIT_CATEGORIES } from '../../utils/habitCategories'
import './StatsView.css'

function StatsView({ viewType }) {
  const data = useMemo(() => {
    return viewType === 'weekly' ? getWeekData() : getMonthData()
  }, [viewType])

  const chartData = useMemo(() => {
    return data.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completionRate: day.totalCount > 0 
        ? Math.round((day.completedCount / day.totalCount) * 100) 
        : 0,
      completed: day.completedCount || 0,
      total: day.totalCount || 0,
      weight: day.weight || null,
    }))
  }, [data])

  const weightData = useMemo(() => {
    return chartData.filter(d => d.weight !== null && d.weight !== undefined)
  }, [chartData])

  const averageWeight = useMemo(() => {
    return getAverageWeight(data)
  }, [data])

  const previousAverageWeight = useMemo(() => {
    return getAverageWeight(previousData)
  }, [previousData])

  const weightChange = useMemo(() => {
    if (!averageWeight || !previousAverageWeight) return null
    return calculateWeightChange(averageWeight, previousAverageWeight)
  }, [averageWeight, previousAverageWeight])

  const currentRate = useMemo(() => {
    return calculateCompletionRate(data) * 100
  }, [data])

  const previousData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    const daysToGoBack = viewType === 'weekly' ? 7 : 30
    const lastDay = new Date(data[data.length - 1].date)
    lastDay.setHours(0, 0, 0, 0)
    
    // Get the previous period (e.g., previous week or month)
    const periodEnd = new Date(lastDay)
    periodEnd.setDate(periodEnd.getDate() - 1)
    periodEnd.setHours(23, 59, 59, 999)
    
    const periodStart = new Date(periodEnd)
    periodStart.setDate(periodStart.getDate() - daysToGoBack + 1)
    periodStart.setHours(0, 0, 0, 0)
    
    return getDateRange(periodStart, periodEnd)
  }, [data, viewType])

  const previousRate = useMemo(() => {
    return calculateCompletionRate(previousData) * 100
  }, [previousData])

  const percentageChange = useMemo(() => {
    return calculatePercentageChange(currentRate, previousRate)
  }, [currentRate, previousRate])

  // Category breakdown
  const categoryData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    const categoryCounts = {}
    const categoryTotals = {}
    
    data.forEach(day => {
      if (!day.habits) return
      
      day.habits.forEach(habit => {
        const category = habit.category?.name || 'Other'
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0
          categoryTotals[category] = 0
        }
        categoryTotals[category]++
        if (habit.completed) {
          categoryCounts[category]++
        }
      })
    })
    
    return Object.keys(categoryTotals).map(category => {
      const categoryInfo = Object.values(HABIT_CATEGORIES).find(c => c.name === category)
      return {
        name: category,
        completed: categoryCounts[category],
        total: categoryTotals[category],
        percentage: Math.round((categoryCounts[category] / categoryTotals[category]) * 100),
        color: categoryInfo?.color || '#667eea',
      }
    })
  }, [data])

  const COLORS = categoryData.map(d => d.color)

  if (data.length === 0) {
    return (
      <div className="stats-empty">
        <p>No data available for this {viewType} period yet.</p>
        <p>Start tracking your habits to see statistics!</p>
      </div>
    )
  }

  return (
    <div className="stats-view">
      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Average Completion Rate</h3>
          <div className="stat-value">{currentRate.toFixed(1)}%</div>
          <div className={`stat-change ${percentageChange >= 0 ? 'positive' : 'negative'}`}>
            {percentageChange >= 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% 
            vs previous {viewType === 'weekly' ? 'week' : 'month'}
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Total Days Tracked</h3>
          <div className="stat-value">{data.length}</div>
          <div className="stat-change">days this {viewType === 'weekly' ? 'week' : 'month'}</div>
        </div>

        {averageWeight !== null && (
          <div className="stat-card">
            <h3>Average Weight</h3>
            <div className="stat-value">{averageWeight.toFixed(1)}</div>
            <div className="stat-unit">lbs</div>
            {weightChange !== null && previousAverageWeight && (
              <div className={`stat-change ${weightChange < 0 ? 'positive' : weightChange > 0 ? 'negative' : ''}`}>
                {weightChange > 0 ? '↑' : weightChange < 0 ? '↓' : '→'} {Math.abs(weightChange).toFixed(1)} lbs
                vs previous {viewType === 'weekly' ? 'week' : 'month'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion Rate Over Time */}
      <div className="chart-container">
        <h2>Completion Rate Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => `${value}%`}
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="completionRate" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 5 }}
              name="Completion %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Completed Count */}
      <div className="chart-container">
        <h2>Habits Completed Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="Completed" />
            <Bar dataKey="total" fill="#e5e7eb" name="Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weight Trend Over Time */}
      {weightData.length > 0 && (
        <div className="chart-container">
          <h2>Body Weight Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis 
                stroke="#666" 
                label={{ value: 'Weight (lbs)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => `${value.toFixed(1)} lbs`}
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 5 }}
                name="Weight (lbs)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="chart-container">
        <h2>Performance by Category</h2>
        <div className="category-breakdown">
          <div className="category-list">
            {categoryData.map((category, index) => (
              <div key={category.name} className="category-item">
                <div className="category-header">
                  <span className="category-name" style={{ color: category.color }}>
                    {category.name}
                  </span>
                  <span className="category-percentage">{category.percentage}%</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-bar-fill" 
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color 
                    }}
                  ></div>
                </div>
                <div className="category-stats">
                  {category.completed} / {category.total} completed
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default StatsView
