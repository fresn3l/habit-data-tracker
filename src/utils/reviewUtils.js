// Review generation utilities

import { getWeekData, getMonthData, getAllStoredData } from './dataStorage'
import { getAllHabitStreaks } from './streaksStorage'
import { getAverageMood } from './moodStorage'
import { getAllTodos } from './todoStorage'
import { getAllGoals } from './goalStorage'

export const generateWeeklyReview = () => {
  const weekData = getWeekData()
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  
  const weekEnd = new Date(today)
  
  const review = {
    period: 'week',
    startDate: weekStart.toDateString(),
    endDate: weekEnd.toDateString(),
    generatedAt: new Date().toISOString(),
    statistics: {},
    highlights: [],
    insights: [],
    reflection: null
  }
  
  if (weekData.length === 0) {
    return review
  }
  
  // Calculate statistics
  const totalDays = weekData.length
  const totalHabits = weekData.reduce((sum, day) => sum + (day.totalCount || 0), 0)
  const completedHabits = weekData.reduce((sum, day) => sum + (day.completedCount || 0), 0)
  const avgCompletion = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
  
  review.statistics = {
    daysTracked: totalDays,
    totalHabitsCompleted: completedHabits,
    totalHabitsAvailable: totalHabits,
    averageCompletionRate: Math.round(avgCompletion),
    averageMood: getAverageMood(weekStart.toDateString(), weekEnd.toDateString())
  }
  
  // Find best/worst days
  const dayCompletions = weekData.map(day => ({
    date: day.date,
    rate: day.totalCount > 0 ? (day.completedCount / day.totalCount) * 100 : 0
  }))
  
  const bestDay = dayCompletions.reduce((best, day) => 
    day.rate > best.rate ? day : best, dayCompletions[0] || { date: '', rate: 0 }
  )
  
  const worstDay = dayCompletions.reduce((worst, day) => 
    day.rate < worst.rate ? day : worst, dayCompletions[0] || { date: '', rate: 100 }
  )
  
  // Calculate streaks
  const streaks = getAllHabitStreaks()
  const activeStreaks = Object.values(streaks).filter(s => s.currentStreak > 0)
  const longestStreak = activeStreaks.length > 0
    ? Math.max(...activeStreaks.map(s => s.currentStreak))
    : 0
  
  // Find most consistent habit
  const habitStats = {}
  weekData.forEach(day => {
    if (day.habits) {
      day.habits.forEach(habit => {
        if (!habitStats[habit.id]) {
          habitStats[habit.id] = { name: habit.name, completed: 0, total: 0 }
        }
        habitStats[habit.id].total++
        if (habit.completed) {
          habitStats[habit.id].completed++
        }
      })
    }
  })
  
  const mostConsistent = Object.values(habitStats)
    .filter(h => h.total > 0)
    .sort((a, b) => (b.completed / b.total) - (a.completed / a.total))[0]
  
  // Generate highlights
  if (bestDay.rate >= 80) {
    review.highlights.push({
      type: 'best_day',
      message: `Best day: ${new Date(bestDay.date).toLocaleDateString()} with ${Math.round(bestDay.rate)}% completion!`,
      emoji: '🌟'
    })
  }
  
  if (longestStreak >= 7) {
    review.highlights.push({
      type: 'streak',
      message: `Amazing ${longestStreak}-day streak maintained!`,
      emoji: '🔥'
    })
  }
  
  if (mostConsistent && (mostConsistent.completed / mostConsistent.total) >= 0.9) {
    review.highlights.push({
      type: 'consistency',
      message: `${mostConsistent.name} was completed ${Math.round((mostConsistent.completed / mostConsistent.total) * 100)}% of the time!`,
      emoji: '✨'
    })
  }
  
  // Generate insights
  if (avgCompletion >= 80) {
    review.insights.push('Excellent week! You maintained high consistency across all habits.')
  } else if (avgCompletion >= 60) {
    review.insights.push('Good progress this week. Keep up the momentum!')
  } else {
    review.insights.push('There\'s room for improvement. Try focusing on your most important habits.')
  }
  
  if (bestDay.rate > worstDay.rate + 20) {
    review.insights.push(`You had a great day on ${new Date(bestDay.date).toLocaleDateString()}. What made that day different?`)
  }
  
  return review
}

export const generateMonthlyReview = () => {
  const monthData = getMonthData()
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today)
  
  const review = {
    period: 'month',
    startDate: monthStart.toDateString(),
    endDate: monthEnd.toDateString(),
    generatedAt: new Date().toISOString(),
    statistics: {},
    highlights: [],
    insights: [],
    reflection: null,
    weeklyBreakdown: []
  }
  
  if (monthData.length === 0) {
    return review
  }
  
  // Calculate overall statistics
  const totalDays = monthData.length
  const totalHabits = monthData.reduce((sum, day) => sum + (day.totalCount || 0), 0)
  const completedHabits = monthData.reduce((sum, day) => sum + (day.completedCount || 0), 0)
  const avgCompletion = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
  
  // Calculate weekly breakdown
  const weeks = []
  let currentWeek = []
  monthData.forEach(day => {
    const dayDate = new Date(day.date)
    if (dayDate.getDay() === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek])
      currentWeek = [day]
    } else {
      currentWeek.push(day)
    }
  })
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }
  
  review.weeklyBreakdown = weeks.map((week, index) => {
    const weekHabits = week.reduce((sum, day) => sum + (day.totalCount || 0), 0)
    const weekCompleted = week.reduce((sum, day) => sum + (day.completedCount || 0), 0)
    return {
      week: index + 1,
      completionRate: weekHabits > 0 ? Math.round((weekCompleted / weekHabits) * 100) : 0,
      daysTracked: week.length
    }
  })
  
  review.statistics = {
    daysTracked: totalDays,
    totalHabitsCompleted: completedHabits,
    totalHabitsAvailable: totalHabits,
    averageCompletionRate: Math.round(avgCompletion),
    averageMood: getAverageMood(monthStart.toDateString(), monthEnd.toDateString()),
    todosCompleted: getAllTodos().filter(t => {
      if (!t.completedAt) return false
      const completedDate = new Date(t.completedAt)
      return completedDate >= monthStart && completedDate <= monthEnd
    }).length,
    goalsActive: getAllGoals().length
  }
  
  // Find trends
  const firstWeek = review.weeklyBreakdown[0]
  const lastWeek = review.weeklyBreakdown[review.weeklyBreakdown.length - 1]
  const improvement = lastWeek && firstWeek 
    ? lastWeek.completionRate - firstWeek.completionRate 
    : 0
  
  // Generate highlights
  if (avgCompletion >= 80) {
    review.highlights.push({
      type: 'excellent',
      message: `Outstanding month with ${Math.round(avgCompletion)}% average completion!`,
      emoji: '🏆'
    })
  }
  
  if (improvement > 10) {
    review.highlights.push({
      type: 'improvement',
      message: `Great improvement! You increased completion rate by ${improvement}% this month!`,
      emoji: '📈'
    })
  }
  
  const streaks = getAllHabitStreaks()
  const maxStreak = Math.max(...Object.values(streaks).map(s => s.longestStreak), 0)
  if (maxStreak >= 20) {
    review.highlights.push({
      type: 'streak',
      message: `Incredible ${maxStreak}-day streak achieved this month!`,
      emoji: '🔥'
    })
  }
  
  // Generate insights
  if (improvement > 0) {
    review.insights.push('You\'re building momentum! Your consistency is improving over time.')
  }
  
  if (review.statistics.todosCompleted > 0) {
    review.insights.push(`You completed ${review.statistics.todosCompleted} todos this month. Great productivity!`)
  }
  
  return review
}

export const saveReview = (review) => {
  const reviews = getReviews()
  review.id = Date.now().toString()
  reviews.push(review)
  localStorage.setItem('habit-tracker-reviews', JSON.stringify(reviews))
  return review
}

export const getReviews = () => {
  try {
    const data = localStorage.getItem('habit-tracker-reviews')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading reviews:', error)
    return []
  }
}

export const getReview = (reviewId) => {
  const reviews = getReviews()
  return reviews.find(r => r.id === reviewId) || null
}

