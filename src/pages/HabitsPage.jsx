import { useState, useEffect } from 'react'
import HabitItem from '../components/habits/HabitItem'
import HabitForm from '../components/habits/HabitForm'
import WeightInput from '../components/habits/WeightInput'
import MoodInput from '../components/analytics/MoodInput'
import StatsView from '../components/analytics/StatsView'
import { getCategoryForHabit, HABIT_CATEGORIES } from '../utils/habitCategories'
import { saveDayData, getDayData, getTodayKey, saveWeight } from '../utils/dataStorage'
import { getTimeBasedGreeting, getCurrentTimePeriod, shouldShowHabit } from '../utils/timeUtils'
import { 
  getAllHabitTemplates, 
  saveHabitTemplate, 
  deleteHabitTemplate, 
  initializeDefaultHabits 
} from '../utils/habitStorage'
import '../App.css'

/**
 * Converts habit templates to daily habit instances with completion status.
 * 
 * @param {Array} templates - Array of habit template objects
 * @returns {Array} Array of daily habit instances
 */
const convertTemplatesToDailyHabits = (templates) => {
  return templates.map(template => ({
    ...template,
    completed: false, // Daily habits start as incomplete
  }))
}

/**
 * Merges existing daily habits with new templates, preserving completion status.
 * 
 * @param {Array} existingHabits - Current day's habits with completion status
 * @param {Array} templates - Habit templates (definitions)
 * @returns {Array} Merged habits array
 */
const mergeHabitsWithTemplates = (existingHabits, templates) => {
  const habitMap = new Map()
  
  // First, add all existing habits (preserve completion status)
  existingHabits.forEach(habit => {
    habitMap.set(habit.id, habit)
  })
  
  // Then, add/update from templates
  templates.forEach(template => {
    if (habitMap.has(template.id)) {
      // Update existing habit with template data but keep completion
      const existing = habitMap.get(template.id)
      habitMap.set(template.id, {
        ...template,
        completed: existing.completed,
      })
    } else {
      // Add new habit from template
      habitMap.set(template.id, {
        ...template,
        completed: false,
      })
    }
  })
  
  return Array.from(habitMap.values())
}

function HabitsPage() {
  const [habits, setHabits] = useState([])
  const [weight, setWeight] = useState(null)
  const [view, setView] = useState('daily') // 'daily', 'weekly', 'monthly'
  const [showFilter, setShowFilter] = useState('current') // 'current', 'all', 'morning', 'night'
  const [showHabitForm, setShowHabitForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  
  const greeting = getTimeBasedGreeting()
  const timePeriod = getCurrentTimePeriod()

  // Initialize habit templates and load daily habits
  useEffect(() => {
    // Initialize default habits if none exist
    initializeDefaultHabits()
    
    // Load habit templates
    const templates = getAllHabitTemplates()
    
    // Load today's data
    const todayKey = getTodayKey()
    const savedData = getDayData(todayKey)
    
    if (savedData && savedData.habits && savedData.habits.length > 0) {
      // Merge existing habits with templates (preserve completion status)
      const merged = mergeHabitsWithTemplates(savedData.habits, templates)
      setHabits(merged.map(h => ({
        ...h,
        category: h.category || getCategoryForHabit(h.name),
        timeOfDay: h.timeOfDay || 'anytime',
      })))
    } else {
      // No saved data for today - create from templates
      const dailyHabits = convertTemplatesToDailyHabits(templates)
      setHabits(dailyHabits.map(h => ({
        ...h,
        category: h.category || getCategoryForHabit(h.name),
        timeOfDay: h.timeOfDay || 'anytime',
      })))
    }
    
    // Restore saved weight
    if (savedData && savedData.weight !== undefined && savedData.weight !== null) {
      setWeight(savedData.weight)
    }
  }, [])

  // Save habits and weight to localStorage whenever they change
  useEffect(() => {
    const todayKey = getTodayKey()
    saveDayData(todayKey, habits, weight)
  }, [habits, weight])

  // Reload habits when templates change
  const reloadHabits = () => {
    const templates = getAllHabitTemplates()
    const todayKey = getTodayKey()
    const savedData = getDayData(todayKey)
    
    if (savedData && savedData.habits && savedData.habits.length > 0) {
      const merged = mergeHabitsWithTemplates(savedData.habits, templates)
      setHabits(merged.map(h => ({
        ...h,
        category: h.category || getCategoryForHabit(h.name),
        timeOfDay: h.timeOfDay || 'anytime',
      })))
    } else {
      const dailyHabits = convertTemplatesToDailyHabits(templates)
      setHabits(dailyHabits.map(h => ({
        ...h,
        category: h.category || getCategoryForHabit(h.name),
        timeOfDay: h.timeOfDay || 'anytime',
      })))
    }
  }

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

  const handleHabitSave = (habitData) => {
    // Save the habit template
    saveHabitTemplate(habitData)
    
    // Reload habits to include the new/updated habit
    reloadHabits()
    
    // Close form
    setShowHabitForm(false)
    setEditingHabit(null)
  }

  const handleNewHabit = () => {
    setEditingHabit(null)
    setShowHabitForm(true)
  }

  const handleHabitDelete = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit? This will remove it from all days.')) {
      // Delete from templates
      deleteHabitTemplate(habitId)
      
      // Remove from today's habits
      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId.toString()))
      
      // Reload to sync with templates
      reloadHabits()
    }
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
        {view === 'daily' && (
          <div className="habits-header">
            <div className="habits-header-content">
              <h2>My Habits</h2>
              <button className="create-habit-btn-header" onClick={handleNewHabit}>
                + New Habit
              </button>
            </div>
          </div>
        )}
        
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
            <button 
              className="filter-btn create-habit-btn"
              onClick={handleNewHabit}
              title="Create New Habit"
            >
              + New Habit
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
                <button className="create-habit-btn-large" onClick={handleNewHabit}>
                  + Create Your First Habit
                </button>
              </div>
            ) : habitsByCategory.length === 0 ? (
              <div className="no-habits-message">
                <p>No habits to display.</p>
                <button className="create-habit-btn-large" onClick={handleNewHabit}>
                  + Create Your First Habit
                </button>
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
                          reloadHabits()
                        }}
                        onDelete={handleHabitDelete}
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

      {view === 'daily' && (
        <button 
          className="floating-create-habit-btn"
          onClick={handleNewHabit}
          title="Create New Habit"
          aria-label="Create New Habit"
        >
          +
        </button>
      )}

      {showHabitForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleHabitSave}
          onCancel={() => { 
            setShowHabitForm(false)
            setEditingHabit(null)
          }}
        />
      )}
    </>
  )
}

export default HabitsPage
