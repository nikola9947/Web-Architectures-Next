import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Keine Auth-Route / keine user route mehr
// import userRoutes from "./routes/users.js"
// app.use("/api/users", userRoutes)

// Mood / Journal / Skills bleiben
import moodRoutes from "./routes/moods.js"
import entryRoutes from "./routes/entries.js"
import skillRoutes from "./routes/skills.js"

app.use("/api/moods", moodRoutes)
app.use("/api/entries", entryRoutes)
app.use("/api/skills", skillRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Mood Tracker API running on http://localhost:${PORT}`)
})