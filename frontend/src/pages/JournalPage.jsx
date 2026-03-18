import React, { useState, useEffect } from 'react'
import { getEntries, createEntry, updateEntry, deleteEntry, getMoods } from '../services/api'
import './JournalPage.css'

export default function JournalPage({ user }) {
  const [entries, setEntries] = useState([])
  const [moods, setMoods] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood_id: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [entriesResponse, moodsResponse] = await Promise.all([
        getEntries(),
        getMoods()
      ])
      setEntries(entriesResponse.data)
      setMoods(moodsResponse.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required')
      return
    }

    try {
      if (editingId) {
        await updateEntry(editingId, formData.title, formData.content, formData.mood_id || null)
      } else {
        await createEntry(formData.title, formData.content, formData.mood_id || null)
      }
      
      setFormData({ title: '', content: '', mood_id: '' })
      setEditingId(null)
      setShowForm(false)
      await loadData()
    } catch (error) {
      console.error('Failed to save entry:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(id)
        await loadData()
      } catch (error) {
        console.error('Failed to delete entry:', error)
      }
    }
  }

  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      mood_id: entry.mood_id || ''
    })
    setEditingId(entry.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({ title: '', content: '', mood_id: '' })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="journal-page"><p>Loading...</p></div>
  }

  return (
    <div className="journal-page">
      <div className="journal-header">
        <h1>📔 Journal Entries</h1>
        <button 
          className="new-entry-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '✏️ New Entry'}
        </button>
      </div>

      {/* Entry Form */}
      {showForm && (
        <div className="entry-form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Give your entry a title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mood">Associated Mood (optional)</label>
              <select
                id="mood"
                value={formData.mood_id}
                onChange={(e) => setFormData({ ...formData, mood_id: e.target.value })}
              >
                <option value="">Select a mood...</option>
                {moods.map(mood => (
                  <option key={mood.id} value={mood.id}>
                    {mood.mood} - {new Date(mood.created_at).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your thoughts, feelings, and experiences here..."
                rows={10}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className="entries-list">
        {entries.length === 0 ? (
          <p className="no-entries">No journal entries yet. Start writing! ✍️</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="entry-card">
              <div className="entry-header">
                <h3>{entry.title}</h3>
                <div className="entry-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(entry)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="entry-date">
                {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
              </p>
              <p className="entry-content">{entry.content.substring(0, 200)}...</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
