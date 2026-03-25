import express from 'express';
import { dbRun, dbGet, dbAll } from '../utils/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all journal entries for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await dbAll(
      'SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific journal entry
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    const entry = await dbGet(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    );

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new journal entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, mood_id } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const result = await dbRun(
      'INSERT INTO journal_entries (user_id, title, content, mood_id) VALUES (?, ?, ?, ?)',
      [userId, title, content, mood_id || null]
    );

    const newEntry = await dbGet(
      'SELECT * FROM journal_entries WHERE id = ?',
      [result.id]
    );

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a journal entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;
    const { title, content, mood_id } = req.body;

    const entry = await dbGet(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    );

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await dbRun(
      'UPDATE journal_entries SET title = ?, content = ?, mood_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title || entry.title, content || entry.content, mood_id || entry.mood_id, entryId]
    );

    const updated = await dbGet('SELECT * FROM journal_entries WHERE id = ?', [entryId]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a journal entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const entry = await dbGet(
      'SELECT * FROM journal_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    );

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await dbRun('DELETE FROM journal_entries WHERE id = ?', [entryId]);
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
