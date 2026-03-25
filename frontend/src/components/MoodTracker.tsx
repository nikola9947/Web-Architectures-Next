"use client"

import { useState } from 'react'
import { createMood } from '../lib/api'

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

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState('')
  const [intensity, setIntensity] = useState(5)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedMood) {
      alert('Please select a mood')
      return
    }

    setLoading(true)
    try {
      await createMood(selectedMood, intensity, notes || '')
      // Reset form
      setSelectedMood('')
      setIntensity(5)
      setNotes('')
      // Optionally refresh the page or update state
      window.location.reload()
    } catch (error) {
      console.error('Error submitting mood:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Track Your Mood</h2>

      <div>
        <p className="mb-3 font-medium">How are you feeling?</p>
        <div className="grid grid-cols-2 gap-2">
          {MOODS.map(mood => (
            <button
              key={mood}
              type="button"
              className={`p-3 border-2 rounded-lg transition-colors ${
                selectedMood === mood ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMood(mood)}
            >
              <span className="text-2xl mr-2">{MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]}</span>
              <span className="capitalize">{mood}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Intensity: <span className="text-blue-600">{intensity}/10</span>
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>Very Light</span>
          <span>Very Intense</span>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional thoughts or triggers..."
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Mood'}
      </button>
    </form>
  )
}