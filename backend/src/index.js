import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import moodRoutes from './routes/moods.js'
import authRoutes from './routes/auth.js'
import entryRoutes from './routes/entries.js'
import skillRoutes from './routes/skills.js'
import { initializeDatabase } from './utils/database.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/moods', moodRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/entries', entryRoutes)
app.use('/api/skills', skillRoutes)

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    await initializeDatabase()

    app.listen(PORT, () => {
      console.log(`✅ Server läuft auf http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()