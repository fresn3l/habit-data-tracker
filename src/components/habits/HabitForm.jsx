import { useState, useEffect } from 'react'
import { HABIT_CATEGORIES, getCategoryForHabit } from '../../utils/habitCategories'
import './HabitForm.css'

/**
 * HabitForm Component
 * 
 * A form component for creating and editing habit templates.
 * Allows users to specify:
 * - Habit name
 * - Emoji/icon
 * - Category (auto-detected or manually selected)
 * - Time of day (morning, night, anytime)
 * 
 * @param {Object} props
 * @param {Object} [props.habit] - Existing habit template to edit (if editing)
 * @param {Function} props.onSave - Callback when habit is saved
 * @param {Function} props.onCancel - Callback when form is cancelled
 */
function HabitForm({ habit, onSave, onCancel }) {
  const [name, setName] = useState(habit?.name || '')
  const [emoji, setEmoji] = useState(habit?.emoji || '✨')
  const [timeOfDay, setTimeOfDay] = useState(habit?.timeOfDay || 'anytime')
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(null)
  
  // Initialize category from habit or auto-detect from name
  useEffect(() => {
    if (habit?.category) {
      // Find the category key that matches this category object
      const categoryKey = Object.keys(HABIT_CATEGORIES).find(key => {
        const cat = HABIT_CATEGORIES[key]
        return cat.name === habit.category.name
      })
      if (categoryKey) {
        setSelectedCategoryKey(categoryKey)
      }
    } else if (name) {
      // Auto-detect category from name
      const autoCategory = getCategoryForHabit(name)
      const categoryKey = Object.keys(HABIT_CATEGORIES).find(key => {
        return HABIT_CATEGORIES[key].name === autoCategory.name
      })
      if (categoryKey) {
        setSelectedCategoryKey(categoryKey)
      }
    }
  }, [habit, name])
  
  // Auto-detect category when name changes
  useEffect(() => {
    if (name && !selectedCategoryKey) {
      const autoCategory = getCategoryForHabit(name)
      const categoryKey = Object.keys(HABIT_CATEGORIES).find(key => {
        return HABIT_CATEGORIES[key].name === autoCategory.name
      })
      if (categoryKey) {
        setSelectedCategoryKey(categoryKey)
      }
    }
  }, [name, selectedCategoryKey])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    // Get the selected category object
    const category = selectedCategoryKey 
      ? HABIT_CATEGORIES[selectedCategoryKey]
      : getCategoryForHabit(name.trim())

    const habitData = {
      ...habit,
      name: name.trim(),
      emoji: emoji || '✨',
      category: category,
      timeOfDay: timeOfDay,
    }

    onSave(habitData)
  }

  return (
    <div className="habit-form-overlay" onClick={onCancel}>
      <div className="habit-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="habit-form-header">
          <h2>{habit ? 'Edit Habit' : 'Create New Habit'}</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-group">
            <label>Emoji</label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="✨"
              maxLength="2"
              className="emoji-input"
            />
          </div>

          <div className="form-group">
            <label>Habit Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Run"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={selectedCategoryKey || ''}
              onChange={(e) => setSelectedCategoryKey(e.target.value)}
              className="form-select"
            >
              <option value="">Auto-detect from name</option>
              {Object.keys(HABIT_CATEGORIES).map(key => {
                const cat = HABIT_CATEGORIES[key]
                return (
                  <option key={key} value={key}>
                    {cat.name}
                  </option>
                )
              })}
            </select>
            {selectedCategoryKey && (
              <div 
                className="category-preview"
                style={{
                  backgroundColor: HABIT_CATEGORIES[selectedCategoryKey].bgColor,
                  borderColor: HABIT_CATEGORIES[selectedCategoryKey].borderColor,
                  color: HABIT_CATEGORIES[selectedCategoryKey].color,
                }}
              >
                {HABIT_CATEGORIES[selectedCategoryKey].name}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Time of Day</label>
            <div className="time-of-day-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name="timeOfDay"
                  value="anytime"
                  checked={timeOfDay === 'anytime'}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
                <span>Anytime</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="timeOfDay"
                  value="morning"
                  checked={timeOfDay === 'morning'}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
                <span>🌅 Morning</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="timeOfDay"
                  value="night"
                  checked={timeOfDay === 'night'}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
                <span>🌙 Night</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {habit ? 'Update' : 'Create'} Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HabitForm

