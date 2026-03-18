# 🎭 Mood Tracker

A full-stack web application for tracking mood, journaling, and learning coping skills based on emotional state. Features mood tracking, personal journal, recommended coping skills, and mood statistics.

## Features

✨ **Mood Tracking** - Log your daily mood with intensity level (1-10)  
📔 **Journal** - Write and reflect on your experiences  
🎯 **Coping Skills** - Learn and practice skills tailored to your mood  
📊 **Mood History** - View your mood patterns over time  
👤 **User Accounts** - Secure authentication with JWT  
🎨 **Modern UI** - Beautiful, responsive design  

### Planned Features
🎵 **Spotify Integration** - Play mood-based playlists  
🔊 **Ambient Sounds** - Background music and meditation sounds  
📈 **Advanced Analytics** - Mood trends and insights  

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling with custom CSS

### Backend
- **Express.js** - Web server
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **dotenv** - Environment variables

## Project Structure

```
mood-tracker/
├── frontend/                 # React + Vite application (Port 5173)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API calls
│   │   ├── styles/          # Global styles
│   │   ├── utils/           # Helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express.js server (Port 3000)
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Authentication, error handling
│   │   ├── utils/           # Database config
│   │   └── index.js         # Server entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── README.md
└── .gitignore
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/moodtracker.db
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
CORS_ORIGIN=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Frontend Setup

1. Open a new terminal and navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Usage

### First Time Setup

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Track Mood** - Click on Dashboard to log your current mood
4. **Explore Skills** - Visit the Skills page to discover coping techniques
5. **Journal** - Write entries to reflect on your feelings

### Main Features

#### 📊 Dashboard
- Log your current mood from 10 options
- Set intensity level (1-10)
- Add optional notes
- View recent mood history
- Get recommended skills based on your mood

#### 📔 Journal
- Create new journal entries
- Link entries to specific moods
- Edit and delete entries
- Reflect on your experiences

#### 🎯 Skills
- Browse all available coping skills
- Add skills to your personal collection
- Track how many times you've practiced each skill
- View detailed instructions for each skill
- Filter and search through skills

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user info
- `PUT /api/users/me` - Update user profile
- `POST /api/users/verify` - Verify JWT token

### Moods
- `GET /api/moods` - Get all mood entries
- `POST /api/moods` - Create mood entry
- `GET /api/moods/range/:startDate/:endDate` - Get moods by date range
- `GET /api/moods/stats/summary` - Get mood statistics
- `PUT /api/moods/:id` - Update mood entry
- `DELETE /api/moods/:id` - Delete mood entry

### Journal Entries
- `GET /api/entries` - Get all journal entries
- `POST /api/entries` - Create new entry
- `GET /api/entries/:id` - Get specific entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/for-mood/:mood` - Get skills for specific mood
- `GET /api/skills/my-skills` - Get user's skills
- `POST /api/skills/my-skills/:skillId` - Add skill to user
- `DELETE /api/skills/my-skills/:skillId` - Remove skill from user
- `POST /api/skills/my-skills/:skillId/practice` - Mark skill as practiced

## Default Coping Skills

The application comes with 8 pre-loaded coping skills:

1. **Deep Breathing** - Calming breathing technique for anxiety
2. **Journaling** - Writing for reflection and processing emotions
3. **Meditation** - Mindfulness practice for peace
4. **Physical Exercise** - Movement to release endorphins
5. **Gratitude Practice** - Focusing on positive things
6. **Creative Expression** - Art for emotional processing
7. **Social Connection** - Reaching out to others
8. **Time in Nature** - Outdoor activities for wellbeing

## Future Enhancements

### Spotify Integration
```javascript
// Example: Coming soon
- OAuth2 integration with Spotify
- Mood-based playlist recommendations
- One-click playback
```

### Sound Features
- Ambient background music
- Meditation audio guides
- Relaxation soundscapes

### Analytics
- Mood trends and patterns
- Weekly/monthly reports
- Emotion triggers analysis
- Recommended skills based on history

## Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DB_PATH=./data/moodtracker.db
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
SPOTIFY_CLIENT_ID=your_spotify_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

## Database Schema

### Users Table
- id (INTEGER, PRIMARY KEY)
- username (TEXT, UNIQUE)
- email (TEXT, UNIQUE)
- password (TEXT, hashed)
- created_at (DATETIME)
- updated_at (DATETIME)

### Mood Entries Table
- id (INTEGER, PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- mood (TEXT)
- intensity (INTEGER, 1-10)
- notes (TEXT)
- created_at (DATETIME)

### Journal Entries Table
- id (INTEGER, PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- title (TEXT)
- content (TEXT)
- mood_id (INTEGER, FOREIGN KEY)
- created_at (DATETIME)
- updated_at (DATETIME)

### Skills Table
- id (INTEGER, PRIMARY KEY)
- name (TEXT)
- description (TEXT)
- category (TEXT)
- for_moods (TEXT, comma-separated)
- instructions (TEXT)
- created_at (DATETIME)

### User Skills Table
- id (INTEGER, PRIMARY KEY)
- user_id (INTEGER, FOREIGN KEY)
- skill_id (INTEGER, FOREIGN KEY)
- practiced_count (INTEGER)
- last_practiced (DATETIME)
- created_at (DATETIME)

## Development

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Production Build

Frontend:
```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues or questions, please open an issue on the repository.

---

**Happy mood tracking!** 🎭✨
