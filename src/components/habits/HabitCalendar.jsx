import { useState, useEffect } from 'react'
import { getHeatmapData, getIntensityColor, formatMonthYear, getCalendarDays } from '../utils/calendarUtils'
import { getDayData } from '../utils/dataStorage'
import './HabitCalendar.css'

function HabitCalendar({ habitId = null, onDayClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [heatmapData, setHeatmapData] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    const data = getHeatmapData(year, month, habitId)
    setHeatmapData(data)
  }, [year, month, habitId])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleDayClick = (day) => {
    if (!day) return
    setSelectedDate(day.date)
    if (onDayClick) {
      const dayData = getDayData(day.date)
      onDayClick(day.date, dayData)
    }
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="habit-calendar">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={handlePrevMonth}>
          ←
        </button>
        <h3 className="calendar-month">{formatMonthYear(year, month)}</h3>
        <button className="calendar-nav-btn" onClick={handleNextMonth}>
          →
        </button>
      </div>

      <div className="calendar-grid">
        {/* Week day headers */}
        {weekDays.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {heatmapData.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="calendar-day empty" />
          }

          const isSelected = selectedDate === day.date
          const isToday = day.date === new Date().toDateString()

          return (
            <div
              key={day.date}
              className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              style={{
                backgroundColor: getIntensityColor(day.intensity)
              }}
              onClick={() => handleDayClick(day)}
              title={`${day.date}: ${Math.round(day.intensity * 100)}% complete`}
            >
              <span className="day-number">{day.day}</span>
              {day.completed && <span className="day-check">✓</span>}
            </div>
          )
        })}
      </div>

      <div className="calendar-legend">
        <span className="legend-label">Less</span>
        <div className="legend-colors">
          <div className="legend-color" style={{ backgroundColor: '#ebedf0' }}></div>
          <div className="legend-color" style={{ backgroundColor: '#c6e48b' }}></div>
          <div className="legend-color" style={{ backgroundColor: '#7bc96f' }}></div>
          <div className="legend-color" style={{ backgroundColor: '#239a3b' }}></div>
          <div className="legend-color" style={{ backgroundColor: '#196127' }}></div>
        </div>
        <span className="legend-label">More</span>
      </div>
    </div>
  )
}

export default HabitCalendar
