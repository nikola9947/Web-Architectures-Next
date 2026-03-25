import React, { useState, useEffect } from 'react'
import { getMoods, createMood, getSkillsForMood, addUserSkill } from '../services/api'
import MoodTracker from '../components/MoodTracker'
import './Dashboard.css'

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

export default function Dashboard({ user }) {
  const [moods, setMoods] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [lastMood, setLastMood] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMoods()
  }, [])

  const loadMoods = async () => {
    try {
      const response = await getMoods()
      setMoods(response.data)
      if (response.data.length > 0) {
        setLastMood(response.data[0])
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to load moods:', error)
      setLoading(false)
    }
  }

  const handleMoodSubmit = async (moodData) => {
    try {
      await createMood(moodData.mood, moodData.intensity, moodData.notes)
      
      // Get skill recommendations
      const skillResponse = await getSkillsForMood(moodData.mood)
      setRecommendations(skillResponse.data)
      
      // Reload moods
      await loadMoods()
    } catch (error) {
      console.error('Failed to create mood:', error)
    }
  }

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#10b981',
      sad: '#3b82f6',
      anxious: '#f59e0b',
      angry: '#ef4444',
      calm: '#8b5cf6',
      stressed: '#ef4444',
      excited: '#ec4899',
      confused: '#f59e0b',
      lonely: '#6b7280',
      sluggish: '#6b7280'
    }
    return colors[mood] || '#6366f1'
  }

  if (loading) {
    return <div className="dashboard"><p>Loading...</p></div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}! 👋</h1>
        <p>How are you feeling today?</p>
      </div>

      <div className="dashboard-grid">
        {/* Mood Entry Section */}
        <div className="card mood-card">
          <MoodTracker onMoodSubmit={handleMoodSubmit} />
        </div>

        {/* Last Mood */}
        {lastMood && (
          <div className="card last-mood-card">
            <h3>Your Last Mood</h3>
            <div className="mood-display" style={{ borderColor: getMoodColor(lastMood.mood) }}>
              <div className="mood-emoji">
                {MOOD_EMOJIS[lastMood.mood] || '😐'}
              </div>
              <div className="mood-info">
                <p className="mood-name">{lastMood.mood.toUpperCase()}</p>
                <p className="mood-intensity">Intensity: <span>{lastMood.intensity}/10</span></p>
                <p className="mood-time">
                  {new Date(lastMood.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Skills */}
        {recommendations.length > 0 && (
          <div className="card skills-card">
            <h3>Recommended Skills for your mood</h3>
            <div className="skills-list">
              {recommendations.map(skill => (
                <div key={skill.id} className="skill-item">
                  <div className="skill-info">
                    <h4>{skill.name}</h4>
                    <p>{skill.description}</p>
                  </div>
                  <button 
                    className="add-skill-btn"
                    onClick={() => addUserSkill(skill.id).catch(err => console.error(err))}
                  >
                    Add to My Skills
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mood History */}
        {moods.length > 0 && (
          <div className="card history-card">
            <h3>Recent Mood History</h3>
            <div className="mood-history">
              {moods.slice(0, 5).map(mood => (
                <div key={mood.id} className="history-item" style={{ borderLeftColor: getMoodColor(mood.mood) }}>
                  <div className="history-emoji">{MOOD_EMOJIS[mood.mood] || '😐'}</div>
                  <div className="history-details">
                    <p className="history-mood">{mood.mood}</p>
                    <p className="history-intensity">Intensity: {mood.intensity}/10</p>
                    <p className="history-date">{new Date(mood.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
