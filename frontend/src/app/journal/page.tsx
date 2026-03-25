import { getEntries } from '../../lib/api'
import JournalForm from '../../components/JournalForm'

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

export default async function JournalPage() {
  let entries = []

  try {
    entries = await getEntries()
  } catch (error) {
    console.error('Failed to load entries:', error)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
        <p className="text-gray-600">Reflect on your thoughts and experiences</p>
      </div>

      <div className="mb-8">
        <JournalForm />
      </div>

      <div className="space-y-6">
        {entries.map((entry: any) => (
          <div key={entry.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
                <p className="text-gray-700 mb-4">{entry.content}</p>
                {entry.mood && (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS] || '😐'}</span>
                    <span className="capitalize text-gray-600">{entry.mood}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No journal entries yet. Start writing!</p>
          </div>
        )}
      </div>
    </div>
  )
}