import express from 'express'
import { dbRun, dbGet, dbAll } from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all journal entries for a user, including linked mood info
router.get('/', async (req, res) => {
  try {
    const userId = 1 // Temporary: no auth

    const entries = await dbAll(
      `
      SELECT
        je.*,
        je.mood_text AS mood
      FROM journal_entries je
      WHERE je.user_id = ?
      ORDER BY je.created_at DESC
      `,
      [userId]
    )

    res.json(entries)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get a specific journal entry
router.get('/:id', async (req, res) => {
  try {
    const userId = 1 // Temporary: no auth
    const entryId = req.params.id

    const entry = await dbGet(
      `
      SELECT
        je.*,
        je.mood_text AS mood
      FROM journal_entries je
      WHERE je.id = ? AND je.user_id = ?
      `,
      [entryId, userId]
    )

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    res.json(entry)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    const userId = 1 // Temporary: no auth
    const { title, content, mood } = req.body

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Title and content are required' })
    }

    const result = await dbRun(
      'INSERT INTO journal_entries (user_id, title, content, mood_text) VALUES (?, ?, ?, ?)',
      [userId, title.trim(), content.trim(), mood?.trim() || null]
    )

    const newEntry = await dbGet(
      `
      SELECT
        je.*,
        me.mood AS linked_mood,
        me.intensity AS linked_mood_intensity,
        me.created_at AS linked_mood_created_at
      FROM journal_entries je
      LEFT JOIN mood_entries me
        ON je.mood_id = me.id
        AND me.user_id = je.user_id
      WHERE je.id = ?
      `,
      [result.id]
    )

    res.status(201).json(newEntry)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    const userId = 1 // Temporary: no auth
    const entryId = req.params.id
    const { title, content, mood } = req.body

    const entry = await dbGet(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    )

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    await dbRun(
      `
      UPDATE journal_entries
      SET title = ?, content = ?, mood_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        title?.trim() || entry.title,
        content?.trim() || entry.content,
        mood?.trim() || entry.mood_text,
        entryId
      ]
    )

    const updated = await dbGet(
      `
      SELECT
        je.*,
        me.mood AS linked_mood,
        me.intensity AS linked_mood_intensity,
        me.created_at AS linked_mood_created_at
      FROM journal_entries je
      LEFT JOIN mood_entries me
        ON je.mood_id = me.id
        AND me.user_id = je.user_id
      WHERE je.id = ?
      `,
      [entryId]
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    const userId = 1 // Temporary: no auth
    const entryId = req.params.id

    const entry = await dbGet(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    )

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    await dbRun('DELETE FROM journal_entries WHERE id = ?', [entryId])
    res.json({ message: 'Entry deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router