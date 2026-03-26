import React, { useState, useEffect } from 'react'
import { getEntries, createEntry, updateEntry, deleteEntry, getMoods } from '../services/api'
import './JournalPage.css'

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

const MOOD_LABELS = {
  happy: 'Happy',
  sad: 'Sad',
  anxious: 'Anxious',
  angry: 'Angry',
  calm: 'Calm',
  stressed: 'Stressed',
  excited: 'Excited',
  confused: 'Confused',
  lonely: 'Lonely',
  sluggish: 'Sluggish'
}

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedEntryId, setExpandedEntryId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '' // Changed from mood_id to mood
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const entriesResponse = await getEntries()
      setEntries(entriesResponse.data)
    } catch (error) {
      console.error('Failed to load entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      mood: ''
    })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required')
      return
    }

    try {
      if (editingId) {
        await updateEntry(
          editingId,
          formData.title.trim(),
          formData.content.trim(),
          formData.mood || null
        )
      } else {
        await createEntry(
          formData.title.trim(),
          formData.content.trim(),
          formData.mood || null
        )
      }

      resetForm()
      await loadData()
    } catch (error) {
      console.error('Failed to save entry:', error)
      alert('Failed to save entry')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Do you really want to delete this entry?')) return

    try {
      await deleteEntry(id)
      if (expandedEntryId === id) {
        setExpandedEntryId(null)
      }
      await loadData()
    } catch (error) {
      console.error('Failed to delete entry:', error)
      alert('Failed to delete entry')
    }
  }

  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || ''
    })
    setEditingId(entry.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleExpanded = (entryId) => {
    setExpandedEntryId((prev) => (prev === entryId ? null : entryId))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`
  }

  if (loading) {
    return <div className="journal-page"><p>Loading...</p></div>
  }

  return (
    <div className="journal-page">
      <div className="journal-hero">
        <div>
          <p className="journal-kicker">Your personal space</p>
          <h1>📔 Journal</h1>
          <p className="journal-subtitle">
            Write down your thoughts and connect them with how you felt in that moment.
          </p>
        </div>

        <button
          className="new-entry-btn"
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false)
            } else {
              setShowForm(true)
              if (!editingId) {
                setFormData({ title: '', content: '', mood: '' })
              }
            }
          }}
        >
          {showForm ? 'Close form' : '✍️ New Entry'}
        </button>
      </div>

      {showForm && (
        <div className="entry-form-card">
          <div className="form-card-header">
            <h2>{editingId ? 'Edit entry' : 'Create a new entry'}</h2>
            <p>
              Add a title, write your thoughts, and optionally connect this entry to a saved mood.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Example: Today felt lighter than expected"
                maxLength={120}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="mood">Mood (optional)</label>
              <input
                id="mood"
                type="text"
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                placeholder="How are you feeling? (e.g. happy, excited, anxious...)"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Your thoughts</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="What happened today? What are you feeling? What do you want to remember?"
                rows={10}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                {editingId ? 'Save changes' : 'Save entry'}
              </button>
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="entries-section">
        <div className="entries-section-header">
          <h2>Your entries</h2>
          <span className="entries-count">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="entries-list">
          {entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No journal entries yet</h3>
              <p>Start with your first entry and connect it to a mood if you want.</p>
            </div>
          ) : (
            entries.map((entry) => {
              const isExpanded = expandedEntryId === entry.id
              const previewText =
                entry.content.length > 220
                  ? `${entry.content.substring(0, 220)}...`
                  : entry.content

              return (
                <article key={entry.id} className="entry-card">
                  <div className="entry-header">
                    <div className="entry-header-main">
                      <h3>{entry.title}</h3>
                      <p className="entry-date">{formatDate(entry.created_at)}</p>
                    </div>

                    <div className="entry-actions">
                      <button
                        type="button"
                        className="icon-btn edit-btn"
                        onClick={() => handleEdit(entry)}
                        title="Edit entry"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(entry.id)}
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {entry.mood && (
                    <div className="entry-mood-pill">
                      <span className="entry-mood-text">{entry.mood}</span>
                    </div>
                  )}

                  <p className="entry-content">
                    {isExpanded ? entry.content : previewText}
                  </p>

                  {entry.content.length > 220 && (
                    <button
                      type="button"
                      className="read-more-btn"
                      onClick={() => toggleExpanded(entry.id)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </article>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}