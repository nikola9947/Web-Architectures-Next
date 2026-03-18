# 🚀 Quick Start Guide

Get your Mood Tracker running in 5 minutes!

## Prerequisites
- Node.js v16+ installed
- npm installed

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Install Frontend Dependencies

Open a new terminal:
```bash
cd frontend
npm install
```

## Step 3: Start Backend Server

In your first terminal:
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to SQLite database: ./data/moodtracker.db
✅ Database tables initialized
✅ Default skills seeded
✅ Mood Tracker API running on http://localhost:3000
```

## Step 4: Start Frontend Server

In your second terminal:
```bash
cd frontend
npm run dev
```

Click the link or open: **http://localhost:5173**

## Step 5: Create Your Account

1. Click "Register" if you don't have an account
2. Fill in username, email, and password
3. Login with your credentials
4. Start tracking your mood! 🎭

## Project Layout

```
your-workspace/
├── backend/          <- Express API (Port 3000)
├── frontend/         <- React App (Port 5173)
├── README.md         <- Full documentation
└── QUICKSTART.md     <- This file
```

## Key Features to Try

### 1. Track Your Mood (Dashboard)
- Select your current emotion
- Rate intensity from 1-10
- Add optional notes
- See recommended skills

### 2. Write Journal Entries
- Go to "Journal" page
- Create new entries
- Link to specific moods
- Edit or delete anytime

### 3. Explore Coping Skills
- View 8 pre-loaded skills
- Learn instructions for each
- Track practice history
- Add/remove from your list

## Troubleshooting

### Port 3000 or 5173 already in use?

**Change backend port:**
Edit `backend/.env`:
```env
PORT=3001
```

**Change frontend port:**
Edit `frontend/vite.config.js`:
```javascript
server: {
  port: 5174,
}
```

### Database not initializing?

Make sure the `data/` directory exists:
```bash
# Manually create if needed
mkdir backend/data
```

### CORS errors?

Ensure both `.env` files have correct settings:
- Backend `CORS_ORIGIN=http://localhost:5173`
- Frontend API calls use `http://localhost:3000`

## API Test

Once servers are running, test the API:

```bash
# Health check
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Mood Tracker API is running"
}
```

## Next Steps

1. **Customize Skills** - Edit default skills in `backend/src/utils/database.js`
2. **Add Spotify** - Uncomment Spotify config in `.env` when ready
3. **Deploy** - Use Vercel (frontend) and Heroku/Railway (backend)
4. **Extend** - Add more features like sound, analytics, or social sharing

## Common Commands

```bash
# Backend
cd backend
npm run dev          # Start with nodemon
npm start            # Start production

# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Database Reset

To start fresh:
```bash
# Delete the database file
rm backend/data/moodtracker.db

# Restart backend - it will recreate and seed automatically
cd backend
npm run dev
```

## Support

- Check backend logs for API errors
- Check browser console for frontend errors
- Ensure Node.js version is v16+

---

Happy tracking! 🎭💚
