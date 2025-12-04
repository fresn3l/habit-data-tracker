import { useState, useEffect } from 'react'
import HabitItem from '../components/habits/HabitItem'
import WeightInput from '../components/habits/WeightInput'
import MoodInput from '../components/analytics/MoodInput'
import StatsView from '../components/analytics/StatsView'
import { getCategoryForHabit, HABIT_CATEGORIES } from '../utils/habitCategories'
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
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    )
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

  // Group filtered habits by category
  const groupHabitsByCategory = (habits) => {
    const grouped = {}
    
    // Group habits by their category
    habits.forEach(habit => {
      if (!habit.category) return
      
      // Find which category key this habit belongs to by comparing category objects
      const categoryKey = Object.keys(HABIT_CATEGORIES).find(key => {
        return habit.category === HABIT_CATEGORIES[key] || 
               (habit.category.name && habit.category.name === HABIT_CATEGORIES[key].name)
      })
      
      if (categoryKey) {
        if (!grouped[categoryKey]) {
          grouped[categoryKey] = {
            category: HABIT_CATEGORIES[categoryKey],
            habits: []
          }
        }
        grouped[categoryKey].habits.push(habit)
      }
    })
    
    // Return only categories that have habits
    return Object.keys(grouped)
      .filter(key => grouped[key].habits.length > 0)
      .map(key => grouped[key])
  }

  const filteredHabits = getFilteredHabits()
  const habitsByCategory = groupHabitsByCategory(filteredHabits)
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

          <MoodInput />
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
            ) : habitsByCategory.length === 0 ? (
              <div className="no-habits-message">
                <p>No habits to display.</p>
              </div>
            ) : (
              habitsByCategory.map((categoryGroup) => (
                <div key={categoryGroup.category.name} className="habit-category-column">
                  <div 
                    className="category-header"
                    style={{
                      backgroundColor: categoryGroup.category.bgColor,
                      borderColor: categoryGroup.category.borderColor,
                      color: categoryGroup.category.color,
                    }}
                  >
                    <h3>{categoryGroup.category.name}</h3>
                    <span className="category-count">
                      {categoryGroup.habits.filter(h => h.completed).length} / {categoryGroup.habits.length}
                    </span>
                  </div>
                  <div className="category-habits">
                    {categoryGroup.habits.map(habit => (
                      <HabitItem
                        key={habit.id}
                        habit={habit}
                        onToggle={(id) => {
                          toggleHabit(id)
                        }}
                        onUpdate={() => {
                          // Reload habits to get updated data
                          const todayKey = getTodayKey()
                          const savedData = getDayData(todayKey)
                          if (savedData && savedData.habits) {
                            setHabits(savedData.habits.map(h => ({
                              ...h,
                              category: h.category || getCategoryForHabit(h.name),
                              timeOfDay: h.timeOfDay || 'anytime',
                            })))
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
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
