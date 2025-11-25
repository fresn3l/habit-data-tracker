import { useState, useEffect } from 'react'
import './WeightInput.css'

function WeightInput({ weight, onWeightChange, dateKey }) {
  const [inputValue, setInputValue] = useState(weight ? weight.toString() : '')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setInputValue(weight ? weight.toString() : '')
  }, [weight])

  const handleSubmit = (e) => {
    e.preventDefault()
    const weightValue = parseFloat(inputValue)
    if (!isNaN(weightValue) && weightValue > 0) {
      onWeightChange(weightValue)
      setIsEditing(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setInputValue(weight ? weight.toString() : '')
      setIsEditing(false)
    }
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    const weightValue = parseFloat(inputValue)
    if (!isNaN(weightValue) && weightValue > 0) {
      onWeightChange(weightValue)
      setIsEditing(false)
    } else if (inputValue === '' || inputValue === weight?.toString()) {
      setIsEditing(false)
      setInputValue(weight ? weight.toString() : '')
    }
  }

  return (
    <div className="weight-input-container">
      <div className="weight-header">
        <span className="weight-icon">⚖️</span>
        <h3>Body Weight</h3>
      </div>
      {weight && !isEditing ? (
        <div className="weight-display" onClick={handleFocus}>
          <span className="weight-value">{weight.toFixed(1)}</span>
          <span className="weight-unit">lbs</span>
          <button className="weight-edit-btn" onClick={(e) => { e.stopPropagation(); handleFocus(); }}>
            Edit
          </button>
        </div>
      ) : (
        <form className="weight-form" onSubmit={handleSubmit}>
          <div className="weight-input-wrapper">
            <input
              type="number"
              step="0.1"
              min="0"
              className="weight-input-field"
              placeholder="Enter weight"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
            <span className="weight-unit-input">lbs</span>
          </div>
          <button type="submit" className="weight-save-btn">
            Save
          </button>
        </form>
      )}
    </div>
  )
}

export default WeightInput
