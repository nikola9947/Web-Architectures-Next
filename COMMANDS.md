# 💻 Mood Tracker - Command Reference

Copy & paste these commands to get started!

## 🚀 First Time Setup

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

Wait for message: `✅ Mood Tracker API running on http://localhost:3000`

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

Then visit: **http://localhost:5173**

---

## 📚 Useful Commands

### Backend Development
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Install a new package
npm install express-cors

# Remove a package
npm uninstall package-name

# Clear database and restart
rm data/moodtracker.db
npm run dev
```

### Frontend Development
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Install a new package
npm install react-hook-form

# Fix linting issues
npm run lint
```

---

## 📁 File Navigation

### Viewing Backend Files
```bash
# See all backend files
cd backend
ls -la

# View routes
ls -la src/routes/

# View database config
cat src/utils/database.js

# View server main file
cat src/index.js
```

### Viewing Frontend Files
```bash
# See all frontend files
cd frontend
ls -la

# View pages
ls -la src/pages/

# View components
cat src/components/Header.jsx
```

---

## 🔐 Environment Setup

### Create Backend .env
```bash
cd backend
cp .env.example .env

# Edit if needed
nano .env              # macOS/Linux
code .env              # VS Code
notepad .env           # Windows
```

### Check Environment Variables
```bash
# View current settings
cat .env

# Check if ports are available
netstat -an | grep 3000   # macOS/Linux
netstat -ano | find "3000" # Windows
```

---

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Mood Tracker API is running"
}
```

### Create a Test Account
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "password123"
  }'
```

### Get All Skills
```bash
curl http://localhost:3000/api/skills
```

### Get Playlists for a Mood
```bash
curl http://localhost:3000/api/skills/for-mood/anxious
```

---

## 🐛 Troubleshooting Commands

### Check What's Using Port 3000
```bash
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000
```

### Kill Process on Port
```bash
# macOS/Linux
kill -9 PID                 # Replace PID from above

# Windows
taskkill /PID PID /F       # Replace PID from above
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### Check Node Version
```bash
node --version
npm --version
```

---

## 📊 Database Commands

### Access SQLite Database
```bash
# Install sqlite3 CLI first
# macOS: brew install sqlite3
# Windows: choco install sqlite3 or download from sqlite.org

# Open database
sqlite3 backend/data/moodtracker.db

# List all tables
.tables

# View users
SELECT * FROM users;

# View moods
SELECT * FROM mood_entries;

# View entries
SELECT * FROM journal_entries;

# View skills
SELECT * FROM skills;

# Count moods
SELECT COUNT(*) FROM mood_entries;

# Exit
.quit
```

---

## 🔄 Git Commands

### Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial Mood Tracker setup"
```

### Check Status
```bash
git status
```

### Create a New Branch
```bash
git checkout -b feature/spotify-integration
```

### Merge Changes
```bash
git checkout main
git merge feature/spotify-integration
```

---

## 🚀 Deployment Preview

### Build Frontend for Production
```bash
cd frontend
npm run build
# Creates optimized files in dist/ folder
```

### Test Production Build Locally
```bash
cd frontend
npm run build
npm run preview
# Visit http://localhost:4173
```

---

## 📝 Quick Reference

### Common Ports
```
Backend API:     http://localhost:3000
Frontend App:    http://localhost:5173
Database:        ./backend/data/moodtracker.db
```

### Important Files
```
Backend main:        backend/src/index.js
Frontend main:       frontend/src/App.jsx
Database config:     backend/src/utils/database.js
API endpoints:       backend/src/routes/*.js
React pages:         frontend/src/pages/*.jsx
```

### Environment Variables
```
Backend:  backend/.env
Frontend: Set in vite.config.js or fetch from env
```

---

## 🎯 Development Workflow

### Typical Day
```bash
# Morning - Start servers
cd backend && npm run dev        # Terminal 1
cd frontend && npm run dev       # Terminal 2

# During day - Make changes in VS Code
# (Files auto-reload with npm run dev)

# Before commit
git status
git add .
git commit -m "Add new feature"
git push origin main

# Evening - Stop servers
# Press Ctrl+C in both terminals
```

---

## 📦 Adding New Dependencies

### Add to Backend
```bash
cd backend
npm install package-name
# Then import in your files
import packageName from 'package-name'
```

### Add to Frontend
```bash
cd frontend
npm install package-name
# Then import in your files
import packageName from 'package-name'
```

---

## 🔄 Resetting Everything

### Complete Fresh Start
```bash
# Backend reset
cd backend
rm -rf node_modules data/
rm package-lock.json
npm install
npm run dev

# Frontend reset (new terminal)
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## 📱 Mobile Testing

### Test on Mobile (Local Network)
```bash
# Find your computer's IP
# macOS/Linux:
ipconfig getifaddr en0

# Windows:
ipconfig
# Look for IPv4 Address like 192.168.1.100

# Access from phone on same WiFi:
# http://YOUR_IP:5173
# Example: http://192.168.1.100:5173
```

### Mobile Device Debugging
```bash
# Chrome DevTools for mobile
# 1. Enable USB Debugging on phone
# 2. Connect via USB
# 3. chrome://inspect
```

---

## 🆘 Help Commands

### View Logs
```bash
# Backend console shows real-time logs
# Frontend console shows real-time logs

# View specific log file from bash
tail -f backend_output.log
```

### Test Specific Endpoint
```bash
# Using curl with custom headers
curl -X POST http://localhost:3000/api/moods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "mood": "happy",
    "intensity": 7,
    "notes": "Great day!"
  }'
```

---

## ⚡ Performance Tips

### Frontend Optimization
```bash
# Check bundle size
npm run build
cd dist
du -sh .

# Minify CSS/JS (automatic with build)
```

### Backend Optimization
```bash
# Monitor performance
# Node.js has built-in profiling
node --prof src/index.js
node --prof-process isolate-*.log > profile.txt
```

---

## 📚 Documentation Navigation

```bash
# From root directory
cat QUICKSTART.md              # 5-minute setup
cat README.md                  # Full documentation
cat IMPLEMENTATION.md          # What was built
cat SPOTIFY_INTEGRATION.md     # How to add Spotify
cat PROJECT_OVERVIEW.md        # Complete overview
cat COMMANDS.md               # This file!
```

---

## 🎯 Your Next Steps

1. **Run these commands**:
   ```bash
   cd backend && npm install && npm run dev
   ```

2. **In another terminal**:
   ```bash
   cd frontend && npm install && npm run dev
   ```

3. **Open**: http://localhost:5173

4. **Register & start tracking!** 🎭

---

## 💡 Pro Tips

- Use VS Code's integrated terminal (Ctrl+`)
- Split terminal vertically to see logs from both servers
- Use `npm run dev` not `npm start` for development
- Check browser console (F12) for frontend errors
- Check terminal output for backend errors
- Reload browser (F5) after backend changes
- Ctrl+C twice to force quit servers

---

**Copy a command, paste it, press Enter! Easy! 🚀**
