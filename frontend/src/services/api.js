import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    Authorization: `Bearer ${token}`
  }
}

// User APIs
export const loginUser = (email, password) => {
  return axios.post(`${API_BASE_URL}/users/login`, { email, password })
}

export const registerUser = (username, email, password) => {
  return axios.post(`${API_BASE_URL}/users/register`, { username, email, password })
}

export const getCurrentUser = () => {
  return axios.get(`${API_BASE_URL}/users/me`, { headers: getAuthHeaders() })
}

// Mood APIs
export const getMoods = () => {
  return axios.get(`${API_BASE_URL}/moods`, { headers: getAuthHeaders() })
}

export const createMood = (mood, intensity, notes) => {
  return axios.post(`${API_BASE_URL}/moods`, { mood, intensity, notes }, { headers: getAuthHeaders() })
}

export const getMoodStats = () => {
  return axios.get(`${API_BASE_URL}/moods/stats/summary`, { headers: getAuthHeaders() })
}

// Journal APIs
export const getEntries = () => {
  return axios.get(`${API_BASE_URL}/entries`, { headers: getAuthHeaders() })
}

export const createEntry = (title, content, mood_id) => {
  return axios.post(`${API_BASE_URL}/entries`, { title, content, mood_id }, { headers: getAuthHeaders() })
}

export const updateEntry = (id, title, content, mood_id) => {
  return axios.put(`${API_BASE_URL}/entries/${id}`, { title, content, mood_id }, { headers: getAuthHeaders() })
}

export const deleteEntry = (id) => {
  return axios.delete(`${API_BASE_URL}/entries/${id}`, { headers: getAuthHeaders() })
}

// Skills APIs
export const getAllSkills = () => {
  return axios.get(`${API_BASE_URL}/skills`)
}

export const getSkillsForMood = (mood) => {
  return axios.get(`${API_BASE_URL}/skills/for-mood/${mood}`)
}

export const getUserSkills = () => {
  return axios.get(`${API_BASE_URL}/skills/my-skills`, { headers: getAuthHeaders() })
}

export const addUserSkill = (skillId) => {
  return axios.post(`${API_BASE_URL}/skills/my-skills/${skillId}`, {}, { headers: getAuthHeaders() })
}

export const removeUserSkill = (skillId) => {
  return axios.delete(`${API_BASE_URL}/skills/my-skills/${skillId}`, { headers: getAuthHeaders() })
}

export const markSkillAsPracticed = (skillId) => {
  return axios.post(`${API_BASE_URL}/skills/my-skills/${skillId}/practice`, {}, { headers: getAuthHeaders() })
}
