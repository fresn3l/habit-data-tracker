import { useState, useEffect } from 'react'
import HabitItem from '../components/HabitItem'
import WeightInput from '../components/WeightInput'
import StatsView from '../components/StatsView'
import { getCategoryForHabit } from '../utils/habitCategories'
import { saveDayData, getDayData, getTodayKey, saveWeight } from '../utils/dataStorage'
import { getTimeBasedGreeting, getCurrentTimePeriod, shouldShowHabit } from '../utils/timeUtils'
import '../App.css'

const DEFAULT_HABITS = [
  { id: 1, name: 'Brush Teeth (AM)', emoji: '🦷', completed: false, timeOfDay: 'morning' },
  { id: 2, name: 'Meditate', emoji: '🧘', completed: false, timeOfDay: 'morning' },
  { id: 3, name: 'Weightlifting', emoji: '💪', completed: false, timeOfDay: 'anytime' },
  { id: 4, name: 'Met Water Intake', emoji: '💧', completed: false, timeOfDay: 'anytime' },
  { id: 5, name: 'Read', emoji: '📚', completed: false, timeOfDay: 'anytime' },
  { id: 6, name: 'Met Calories Intake', emoji: '🍔', completed: false, timeOfDay: 'anytime' },
  { id: 7, name: 'Journaling', emoji: '✍️', completed: false, timeOfDay: 'night' },
  { id: 8, name: 'No Phone 1hr Before Bed', emoji: '📵', completed: false, timeOfDay: 'night' },
  { id: 9, name: 'No Alcohol Intake', emoji: '🍺', completed: false, timeOfDay: 'anytime' },
  { id: 10, name: 'No Weed Intake', emoji: '🚬', completed: false, timeOfDay: 'anytime' },
  { id: 11, name: 'Supplements On Time', emoji: '💊', completed: false, timeOfDay: 'morning' },
  { id: 12, name: 'Wear Retainers', emoji: '😬', completed: false, timeOfDay: 'night' },
].map(habit => ({
  ...habit,
  category: getCategoryForHabit(habit.name),
  timeOfDay: habit.timeOfDay || 'anytime',
}))

function HabitsPage() {
  const [habits, setHabits] = useState(DEFAULT_HABITS)
  const [weight, setWeight] = useState(null)
  const [view, setView] = useState('daily') // 'daily', 'weekly', 'monthly'
  const [showFilter, setShowFilter] = useState('current') // 'current', 'all', 'morning', 'night'
  
  const greeting = getTimeBasedGreeting()
  const timePeriod = getCurrentTimePeriod()

  // Load habits and weight from localStorage on mount
  useEffect(() => {
    const todayKey = getTodayKey()
    const savedData = getDayData(todayKey)
    
    if (savedData) {
      if (savedData.habits) {
        // Restore saved habits with categories and timeOfDay
        setHabits(savedData.habits.map(h => ({
          ...h,
          category: h.category || getCategoryForHabit(h.name),
          timeOfDay: h.timeOfDay || 'anytime',
        })))
      } else {
        setHabits(DEFAULT_HABITS)
      }
      
      // Restore saved weight
      if (savedData.weight !== undefined && savedData.weight !== null) {
        setWeight(savedData.weight)
      }
    } else {
      // Initialize with categories if not present
      setHabits(DEFAULT_HABITS)
    }
  }, [])

  // Save habits and weight to localStorage whenever they change
  useEffect(() => {
    const todayKey = getTodayKey()
    saveDayData(todayKey, habits, weight)
  }, [habits, weight])

  const handleWeightChange = (newWeight) => {
    setWeight(newWeight)
    const todayKey = getTodayKey()
    saveWeight(todayKey, newWeight)
  }

  const toggleHabit = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed }
        : habit
    ))
  }

  const getFilteredHabits = () => {
    if (view !== 'daily' || showFilter === 'all') {
      return habits
    }
    if (showFilter === 'morning') {
      return habits.filter(h => h.timeOfDay === 'morning' || h.timeOfDay === 'anytime')
    }
    if (showFilter === 'night') {
      return habits.filter(h => h.timeOfDay === 'night' || h.timeOfDay === 'anytime')
    }
    // 'current' - show habits relevant to current time
    return habits.filter(h => shouldShowHabit(h, timePeriod))
  }

  const filteredHabits = getFilteredHabits()
  const completedCount = filteredHabits.filter(h => h.completed).length
  const totalCount = filteredHabits.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <>
      <div className="page-header">
        <div className="view-tabs">
          <button 
            className={`tab ${view === 'daily' ? 'active' : ''}`}
            onClick={() => setView('daily')}
          >
            Daily
          </button>
          <button 
            className={`tab ${view === 'weekly' ? 'active' : ''}`}
            onClick={() => setView('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`tab ${view === 'monthly' ? 'active' : ''}`}
            onClick={() => setView('monthly')}
          >
            Monthly
          </button>
        </div>

        {view === 'daily' && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {completedCount} / {totalCount} completed ({completionPercentage}%)
            </p>
          </div>
        )}
      </div>

      {view === 'daily' ? (
        <>
          <div className="time-greeting">
            <span className="greeting-emoji">{greeting.emoji}</span>
            <p className="greeting-message">{greeting.message}</p>
          </div>
          
          <div className="habit-filters">
            <button 
              className={`filter-btn ${showFilter === 'current' ? 'active' : ''}`}
              onClick={() => setShowFilter('current')}
            >
              Current Time
            </button>
            <button 
              className={`filter-btn ${showFilter === 'morning' ? 'active' : ''}`}
              onClick={() => setShowFilter('morning')}
            >
              Morning
            </button>
            <button 
              className={`filter-btn ${showFilter === 'night' ? 'active' : ''}`}
              onClick={() => setShowFilter('night')}
            >
              Night
            </button>
            <button 
              className={`filter-btn ${showFilter === 'all' ? 'active' : ''}`}
              onClick={() => setShowFilter('all')}
            >
              All
            </button>
          </div>

          <WeightInput 
            weight={weight}
            onWeightChange={handleWeightChange}
            dateKey={getTodayKey()}
          />
          <div className="habits-container">
            {filteredHabits.length === 0 ? (
              <div className="no-habits-message">
                <p>No habits to show for this time period.</p>
              </div>
            ) : (
              filteredHabits.map(habit => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <StatsView viewType={view} />
      )}
    </>
  )
}

export default HabitsPage
