"use client"

import { useState } from 'react'
import { createEntry } from '../lib/api'

const MOODS = ['happy', 'sad', 'anxious', 'angry', 'calm', 'stressed', 'excited', 'confused', 'lonely', 'sluggish']

export default function JournalForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: ''
  })
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required')
      return
    }

    setLoading(true)
    try {
      await createEntry(formData.title.trim(), formData.content.trim(), formData.mood || '')
      setFormData({ title: '', content: '', mood: '' })
      setShowForm(false)
      window.location.reload()
    } catch (error) {
      console.error('Failed to save entry:', error)
      alert('Failed to save entry')
    } finally {
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        New Entry
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
      <div>
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Content</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">Mood (optional)</label>
        <select
          value={formData.mood}
          onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">Select mood</option>
          {MOODS.map(mood => (
            <option key={mood} value={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}