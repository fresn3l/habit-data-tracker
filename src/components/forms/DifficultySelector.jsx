import { useState } from 'react'
import './DifficultySelector.css'

function DifficultySelector({ difficulty, onSelect, showLabel = true }) {
  const [hovered, setHovered] = useState(null)

  const handleClick = (value) => {
    if (onSelect) {
      onSelect(value)
    }
  }

  const getDifficultyLabel = (value) => {
    const labels = {
      1: 'Very Easy',
      2: 'Easy',
      3: 'Medium',
      4: 'Hard',
      5: 'Very Hard'
    }
    return labels[value] || ''
  }

  return (
    <div className="difficulty-selector">
      {showLabel && <label className="difficulty-label">Difficulty:</label>}
      <div className="difficulty-stars">
        {[1, 2, 3, 4, 5].map(value => (
          <button
            key={value}
            className={`difficulty-star ${difficulty >= value ? 'filled' : ''} ${hovered >= value ? 'hovered' : ''}`}
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHovered(value)}
            onMouseLeave={() => setHovered(null)}
            title={getDifficultyLabel(value)}
          >
            ⭐
          </button>
        ))}
      </div>
      {difficulty && (
        <span className="difficulty-text">{getDifficultyLabel(difficulty)}</span>
      )}
    </div>
  )
}

export default DifficultySelector
