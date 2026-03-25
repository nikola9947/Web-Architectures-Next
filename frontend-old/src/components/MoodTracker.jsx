import React, { useState } from 'react'
import './MoodTracker.css'

const MOODS = ['happy', 'sad', 'anxious', 'angry', 'calm', 'stressed', 'excited', 'confused', 'lonely', 'sluggish']

const MOOD_EMOJIS = {
  happy: '😄',
  sad: '😢',
  anxious: '😰',
  angry: '😠',
  calm: '😌',
  stressed: '😩',
  excited: '🤩',
  confused: '😕',
  lonely: '😔',
  sluggish: '😑'
}

export default function MoodTracker({ onMoodSubmit }) {
  const [selectedMood, setSelectedMood] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedMood) {
      alert('Please select a mood')
      return
    }

    setLoading(true)
    try {
      await onMoodSubmit({
        mood: selectedMood,
        intensity: parseInt(intensity),
        notes: notes || null
      })
      // Reset form
      setSelectedMood('')
      setIntensity(5)
      setNotes('')
    } catch (error) {
      console.error('Error submitting mood:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mood-tracker" onSubmit={handleSubmit}>
      <h2>Track Your Mood</h2>
      
      <div className="mood-selector">
        <p className="mood-label">How are you feeling?</p>
        <div className="mood-grid">
          {MOODS.map(mood => (
            <button
              key={mood}
              type="button"
              className={`mood-button ${selectedMood === mood ? 'selected' : ''}`}
              onClick={() => setSelectedMood(mood)}
              style={{
                borderColor: selectedMood === mood ? '#6366f1' : '#e5e7eb'
              }}
            >
              <span className="mood-emoji">{MOOD_EMOJIS[mood]}</span>
              <span className="mood-name">{mood}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="intensity">
          Intensity: <span className="intensity-value">{intensity}/10</span>
        </label>
        <input
          id="intensity"
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="intensity-slider"
        />
        <div className="intensity-labels">
          <span>Very Light</span>
          <span>Very Intense</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional thoughts or triggers..."
          rows="3"
        />
      </div>

      <button type="submit" className="submit-mood-btn" disabled={!selectedMood || loading}>
        {loading ? 'Saving...' : 'Save Mood Entry'}
      </button>
    </form>
  )
}
