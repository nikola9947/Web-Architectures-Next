import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js'
import entryRoutes from './routes/entries.js'
import skillRoutes from './routes/skills.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: 'http://localhost:5177',
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/entries', entryRoutes)
app.use('/api/skills', skillRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`)
})