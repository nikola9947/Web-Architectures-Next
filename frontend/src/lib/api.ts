const API_BASE_URL = 'http://localhost:3001/api'

export async function getMoods() {
  const res = await fetch(`${API_BASE_URL}/moods`)
}

export async function createMood(mood: string, intensity: number, notes: string) {
  const res = await fetch(`${API_BASE_URL}/moods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, intensity, notes }),
  })
  if (!res.ok) throw new Error('Failed to create mood')
  return res.json()
}

export async function getMoodStats() {
  const res = await fetch(`${API_BASE_URL}/moods/stats/summary`)
  if (!res.ok) throw new Error('Failed to fetch mood stats')
  return res.json()
}

export async function getEntries() {
  const res = await fetch(`${API_BASE_URL}/entries`)
  if (!res.ok) throw new Error('Failed to fetch entries')
  return res.json()
}

export async function createEntry(title: string, content: string, mood: string) {
  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, mood }),
  })
  if (!res.ok) throw new Error('Failed to create entry')
  return res.json()
}

export async function updateEntry(id: string, title: string, content: string, mood: string) {
  const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, mood }),
  })
  if (!res.ok) throw new Error('Failed to update entry')
  return res.json()
}

export async function getAllSkills() {
  const res = await fetch(`${API_BASE_URL}/skills`)
  if (!res.ok) throw new Error('Failed to fetch skills')
  return res.json()
}

export async function getUserSkills() {
  const res = await fetch(`${API_BASE_URL}/skills/user`)
  if (!res.ok) throw new Error('Failed to fetch user skills')
  return res.json()
}

export async function addUserSkill(skillId: string) {
  const res = await fetch(`${API_BASE_URL}/skills/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId }),
  })
  if (!res.ok) throw new Error('Failed to add skill')
  return res.json()
}

export async function removeUserSkill(skillId: string) {
  const res = await fetch(`${API_BASE_URL}/skills/user/${skillId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to remove skill')
  return res.json()
}