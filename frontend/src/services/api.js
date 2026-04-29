import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

/* ===============================
   AUTH
================================= */

export const loginUser = (email, password) => {
  return axios.post(
    `${API_BASE_URL}/auth/login`,
    { email, password },
    { withCredentials: true }
  )
}

export const registerUser = (username, email, password) => {
  return axios.post(
    `${API_BASE_URL}/auth/register`,
    { username, email, password },
    { withCredentials: true }
  )
}

/* ===============================
   USER
================================= */

export const getCurrentUser = () => {
  return axios.get(`${API_BASE_URL}/users/me`, {
    withCredentials: true
  })
}

/* ===============================
   MOODS
================================= */

export const getMoods = () => {
  return axios.get(`${API_BASE_URL}/moods`)
}

export const createMood = (mood, intensity, notes) => {
  return axios.post(`${API_BASE_URL}/moods`, {
    mood,
    intensity,
    notes
  })
}

export const getMoodStats = () => {
  return axios.get(`${API_BASE_URL}/moods/stats/summary`, {
    withCredentials: true
  })
}

/* ===============================
   JOURNAL
================================= */

export const getEntries = () => {
  return axios.get(`${API_BASE_URL}/entries`)
}

export const createEntry = (title, content, mood) => {
  return axios.post(`${API_BASE_URL}/entries`, {
    title,
    content,
    mood
  })
}

export const updateEntry = (id, title, content, mood) => {
  return axios.put(`${API_BASE_URL}/entries/${id}`, {
    title,
    content,
    mood
  })
}

export const deleteEntry = (id) => {
  return axios.delete(`${API_BASE_URL}/entries/${id}`)
}

/* ===============================
   SKILLS
================================= */

export const getAllSkills = () => {
  return axios.get(`${API_BASE_URL}/skills`)
}

export const getSkillsForMood = (mood) => {
  return axios.get(`${API_BASE_URL}/skills/for-mood/${mood}`)
}

export const getUserSkills = () => {
  return axios.get(`${API_BASE_URL}/skills/my-skills`, {
    withCredentials: true
  })
}

export const addUserSkill = (skillId) => {
  return axios.post(
    `${API_BASE_URL}/skills/my-skills/${skillId}`,
    {},
    { withCredentials: true }
  )
}

export const removeUserSkill = (skillId) => {
  return axios.delete(
    `${API_BASE_URL}/skills/my-skills/${skillId}`,
    { withCredentials: true }
  )
}

export const markSkillAsPracticed = (skillId) => {
  return axios.post(
    `${API_BASE_URL}/skills/my-skills/${skillId}/practice`,
    {},
    { withCredentials: true }
  )
}