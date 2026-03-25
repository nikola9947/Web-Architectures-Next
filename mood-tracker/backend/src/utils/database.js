import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/moodtracker.db');

// Ensure data directory exists
const DATA_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('✅ Connected to SQLite database:', DB_PATH);
  }
});

// Promisify database operations
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const initializeDatabase = async () => {
  try {
    // Create tables
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        mood TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mood_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (mood_id) REFERENCES mood_entries(id) ON DELETE SET NULL
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        for_moods TEXT,
        instructions TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbRun(`
      CREATE TABLE IF NOT EXISTS user_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        skill_id INTEGER NOT NULL,
        practiced_count INTEGER DEFAULT 0,
        last_practiced DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized');

    // Seed default skills
    await seedDefaultSkills();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

const seedDefaultSkills = async () => {
  try {
    const existingSkills = await dbAll('SELECT COUNT(*) as count FROM skills');
    
    if (existingSkills[0].count === 0) {
      const skills = [
        {
          name: 'Deep Breathing',
          description: 'A calming breathing technique',
          category: 'relaxation',
          for_moods: 'anxious,stressed,angry',
          instructions: '1. Inhale for 4 counts 2. Hold for 4 counts 3. Exhale for 4 counts 4. Hold for 4 counts 5. Repeat 5-10 times'
        },
        {
          name: 'Journaling',
          description: 'Write down your thoughts and feelings',
          category: 'reflection',
          for_moods: 'sad,confused,overwhelmed',
          instructions: 'Spend 10-15 minutes writing freely about what you\'re feeling. There\'s no right or wrong way.'
        },
        {
          name: 'Meditation',
          description: 'Mindfulness meditation for peace',
          category: 'mindfulness',
          for_moods: 'anxious,stressed,sad,overwhelmed',
          instructions: 'Find a quiet place, sit comfortably, and focus on your breath for 5-20 minutes.'
        },
        {
          name: 'Physical Exercise',
          description: 'Move your body to release endorphins',
          category: 'physical',
          for_moods: 'sad,sluggish,unmotivated',
          instructions: 'Do any physical activity you enjoy: walking, running, dancing, yoga, etc. Aim for 20-30 minutes.'
        },
        {
          name: 'Gratitude Practice',
          description: 'Focus on things you\'re grateful for',
          category: 'mindfulness',
          for_moods: 'sad,ungrateful,pessimistic',
          instructions: 'Write down 3-5 things you\'re grateful for, no matter how small.'
        },
        {
          name: 'Creative Expression',
          description: 'Draw, paint, or create art',
          category: 'creative',
          for_moods: 'stressed,angry,emotional',
          instructions: 'Use art supplies (or digital tools) to express your emotions. No artistic skill required.'
        },
        {
          name: 'Social Connection',
          description: 'Reach out to someone you care about',
          category: 'social',
          for_moods: 'lonely,sad,isolated',
          instructions: 'Call, text, or visit a friend or family member. Share what you\'re feeling.'
        },
        {
          name: 'Time in Nature',
          description: 'Spend time outdoors',
          category: 'nature',
          for_moods: 'stressed,overwhelmed,sad',
          instructions: 'Go for a walk in nature, sit outside, or just look at plants. Aim for at least 15-20 minutes.'
        }
      ];

      for (const skill of skills) {
        await dbRun(
          'INSERT INTO skills (name, description, category, for_moods, instructions) VALUES (?, ?, ?, ?, ?)',
          [skill.name, skill.description, skill.category, skill.for_moods, skill.instructions]
        );
      }
      
      console.log('✅ Default skills seeded');
    }
  } catch (error) {
    console.error('Error seeding skills:', error);
  }
};

export default db;
