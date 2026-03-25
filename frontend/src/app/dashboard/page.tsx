import { getMoods } from '../../lib/api'
import MoodTracker from '../../components/MoodTracker'

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

export default async function DashboardPage() {
  let moods = []
  let lastMood = null

  try {
    moods = await getMoods()
    if (moods.length > 0) {
      lastMood = moods[0]
    }
  } catch (error) {
    console.error('Failed to load moods:', error)
  }

  const getMoodColor = (mood: string) => {
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
    return colors[mood as keyof typeof colors] || '#6366f1'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome! 👋</h1>
        <p className="text-gray-600">How are you feeling today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mood Entry Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <MoodTracker />
        </div>

        {/* Last Mood */}
        {lastMood && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Your Last Mood</h3>
            <div className="flex items-center space-x-4 p-4 border-2 rounded-lg" style={{ borderColor: getMoodColor(lastMood.mood) }}>
              <div className="text-4xl">
                {MOOD_EMOJIS[lastMood.mood as keyof typeof MOOD_EMOJIS] || '😐'}
              </div>
              <div>
                <p className="font-medium text-lg">{lastMood.mood.toUpperCase()}</p>
                <p className="text-gray-600">Intensity: {lastMood.intensity}/10</p>
                {lastMood.notes && <p className="text-sm text-gray-500">{lastMood.notes}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}