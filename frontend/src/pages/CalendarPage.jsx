import { useEffect, useMemo, useState } from "react"
import { getEntries, getMoods } from "../services/api"
import "./CalendarPage.css"

export default function CalendarPage() {
  const [items, setItems] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCalendarData()
  }, [])

  const loadCalendarData = async () => {
    try {
      const [entriesRes, moodsRes] = await Promise.all([getEntries(), getMoods()])

      const journalItems = entriesRes.data.map((entry) => ({
        id: `entry-${entry.id}`,
        type: "journal",
        title: entry.title,
        text: entry.content,
        mood: entry.mood,
        date: entry.created_at
      }))

      const moodItems = moodsRes.data.map((mood) => ({
        id: `mood-${mood.id}`,
        type: "mood",
        title: mood.mood,
        text: mood.notes || "",
        intensity: mood.intensity,
        date: mood.created_at
      }))

      setItems([...journalItems, ...moodItems])
    } catch (error) {
      console.error("Failed to load calendar:", error)
    } finally {
      setLoading(false)
    }
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  })

  const getDateKey = (date) => {
    return date.toISOString().split("T")[0]
  }

  const itemsByDay = useMemo(() => {
    return items.reduce((groups, item) => {
      const key = getDateKey(new Date(item.date))
      if (!groups[key]) groups[key] = []
      groups[key].push(item)
      return groups
    }, {})
  }, [items])

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    const daysInMonth = lastDay.getDate()

    const days = []

    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }, [year, month])

  const goPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const goToday = () => {
    setCurrentDate(new Date())
    setSelectedDay(new Date())
  }

  const selectedKey = selectedDay ? getDateKey(selectedDay) : null
  const selectedItems = selectedKey ? itemsByDay[selectedKey] || [] : []

  if (loading) {
    return <div className="calendar-page">Loading calendar...</div>
  }

  return (
    <div className="calendar-page">
      <section className="calendar-hero">
        <div>
          <p className="calendar-kicker">Monthly overview</p>
          <h1>Calendar</h1>
          <p>See your journal entries and mood checks in a real monthly calendar.</p>
        </div>

        <div className="calendar-count">
          <span>{items.length}</span>
          <small>items</small>
        </div>
      </section>

      <section className="calendar-shell">
        <div className="calendar-toolbar">
          <button onClick={goPreviousMonth}>Previous</button>
          <h2>{monthName}</h2>
          <button onClick={goNextMonth}>Next</button>
        </div>

        <button className="today-btn" onClick={goToday}>
          Today
        </button>

        <div className="calendar-weekdays">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="calendar-cell empty" />
            }

            const key = getDateKey(day)
            const dayItems = itemsByDay[key] || []
            const isSelected = selectedKey === key
            const isToday = key === getDateKey(new Date())

            return (
              <button
                key={key}
                className={`calendar-cell ${isSelected ? "selected" : ""} ${
                  isToday ? "today" : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="day-number">{day.getDate()}</span>

                <div className="day-dots">
                  {dayItems.slice(0, 3).map((item) => (
                    <span key={item.id} className={`day-dot ${item.type}`} />
                  ))}
                </div>

                {dayItems.length > 0 && (
                  <span className="day-count">{dayItems.length}</span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="selected-day-panel">
        <h2>
          {selectedDay
            ? selectedDay.toLocaleDateString()
            : "Select a day"}
        </h2>

        {!selectedDay ? (
          <p>Click a day to see all mood and journal entries.</p>
        ) : selectedItems.length === 0 ? (
          <p>No entries for this day.</p>
        ) : (
          <div className="selected-items">
            {selectedItems.map((item) => (
              <article key={item.id} className="selected-item">
                <span className="selected-type">
                  {item.type === "journal" ? "Journal" : "Mood"}
                </span>

                <h3>{item.title}</h3>

                {item.mood && <p>Mood: {item.mood}</p>}
                {item.intensity && <p>Intensity: {item.intensity}/10</p>}

                {item.text && <p>{item.text}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}