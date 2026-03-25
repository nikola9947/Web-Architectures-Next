import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import userRoutes from "./routes/users.js"
import moodRoutes from "./routes/moods.js"
import entryRoutes from "./routes/entries.js"
import skillRoutes from "./routes/skills.js"
import { initializeDatabase } from "./utils/database.js"


dotenv.config()

const PORT = process.env.PORT || 3001

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/moods", moodRoutes)
app.use("/api/entries", entryRoutes)
app.use("/api/skills", skillRoutes)

const startServer = async () => {
  try {
    await initializeDatabase()

    app.listen(PORT, () => {
      console.log(`Mood Tracker API running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()