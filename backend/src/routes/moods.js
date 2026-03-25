import express from 'express';
import { dbRun, dbGet, dbAll } from '../utils/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all mood entries for a user
router.get('/', async (req, res) => {
  try {
    const userId = 1; // Temporary: no auth
    const moods = await dbAll(
      'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood entries for a specific date range
router.get('/range/:startDate/:endDate', async (req, res) => {
  try {
    const userId = 1; // Temporary: no auth
    const { startDate, endDate } = req.params;
    const moods = await dbAll(
      'SELECT * FROM mood_entries WHERE user_id = ? AND DATE(created_at) BETWEEN ? AND ? ORDER BY created_at DESC',
      [userId, startDate, endDate]
    );
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mood statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const userId = 1; // Temporary: no auth
    const stats = await dbGet(`
      SELECT 
        mood,
        COUNT(*) as count,
        AVG(intensity) as avg_intensity,
        MAX(intensity) as max_intensity,
        MIN(intensity) as min_intensity
      FROM mood_entries
      WHERE user_id = ?
      GROUP BY mood
    `, [userId]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new mood entry
router.post('/', async (req, res) => {
  try {
    const userId = 1; // Temporary: no auth
    const { mood, intensity, notes } = req.body;

    if (!mood || !intensity) {
      return res.status(400).json({ error: 'Mood and intensity are required' });
    }

    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({ error: 'Intensity must be between 1 and 10' });
    }

    const result = await dbRun(
      'INSERT INTO mood_entries (user_id, mood, intensity, notes) VALUES (?, ?, ?, ?)',
      [userId, mood, intensity, notes || null]
    );

    const newEntry = await dbGet(
      'SELECT * FROM mood_entries WHERE id = ?',
      [result.id]
    );

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a mood entry.
router.put('/:id', async (req, res) => {
  try {
    const userId = 1; // Temporary: no auth
    const moodId = req.params.id;
    const { mood, intensity, notes } = req.body;

    // Verify ownership
    const entry = await dbGet(
      'SELECT * FROM mood_entries WHERE id = ? AND user_id = ?',
      [moodId, userId]
    );

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    await dbRun(
      'UPDATE mood_entries SET mood = ?, intensity = ?, notes = ? WHERE id = ?',
      [mood || entry.mood, intensity || entry.intensity, notes !== undefined ? notes : entry.notes, moodId]
    );

    const updated = await dbGet('SELECT * FROM mood_entries WHERE id = ?', [moodId]);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a mood entry
router.delete('/:id', async (req, res) => {
  try {
    const userId = 1; // Temporary: no auth
    const moodId = req.params.id;

    const entry = await dbGet(
      'SELECT * FROM mood_entries WHERE id = ? AND user_id = ?',
      [moodId, userId]
    );

    if (!entry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    await dbRun('DELETE FROM mood_entries WHERE id = ?', [moodId]);
    res.json({ message: 'Mood entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
