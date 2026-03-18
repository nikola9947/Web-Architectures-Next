# 🎵 Spotify Integration Guide

This guide explains how to add Spotify playback functionality to your Mood Tracker.

## ⚠️ Status: Optional Feature

Spotify integration is **not yet implemented** but the architecture supports it. This guide provides step-by-step instructions.

## 🎯 What You Can Build

### Option 1: Mood-Based Playlists (Recommended)
When user logs a mood, show recommended Spotify playlists and play directly in the app.

```
User logs "anxious" mood
    ↓
App searches Spotify for "relaxation playlists"
    ↓
Display results
    ↓
User clicks "Play"
    ↓
Spotify Web Playback SDK plays in browser
```

### Option 2: Background Music
Play ambient/meditation music while using the app based on current mood.

### Option 3: Journal Music
Let users choose background music while writing journal entries.

## 📋 Prerequisites

1. **Spotify Developer Account** (free)
   - Go to https://developer.spotify.com
   - Create an app
   - Get Client ID and Secret

2. **User Spotify Account** (free tier works)

3. **Packages to Install**
   ```bash
   cd backend
   npm install spotify-web-api-node

   cd ../frontend
   npm install spotify-web-api-js
   ```

## 🔑 Step 1: Spotify Developer Setup

### Create Spotify App
1. Visit https://developer.spotify.com/dashboard
2. Login/Create account (free)
3. Create an App
4. Accept terms
5. You'll get:
   - **Client ID**
   - **Client Secret**

### Set Redirect URI
1. In your app settings, add:
   ```
   http://localhost:5173/callback
   http://localhost:5173 (for development)
   ```

2. Update `.env`:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
   ```

## 🔌 Step 2: Backend Setup

### Create Spotify Service (`backend/src/utils/spotify.js`)

```javascript
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Authenticate with credentials flow (for backend)
export const authenticateSpotify = async () => {
  try {
    const data = await spotifyApi.clientCredentialsFlow();
    spotifyApi.setAccessToken(data.body.access_token);
    console.log('✅ Spotify authenticated');
  } catch (err) {
    console.error('❌ Spotify auth failed:', err);
  }
};

// Search for playlists by mood
export const getPlaylistsForMood = async (mood) => {
  try {
    const query = getMoodQuery(mood);
    const data = await spotifyApi.searchPlaylists(query, { limit: 5 });
    return data.body.playlists.items;
  } catch (err) {
    console.error('Error searching playlists:', err);
    return [];
  }
};

// Helper to map moods to Spotify queries
const getMoodQuery = (mood) => {
  const moodQueries = {
    happy: 'happy upbeat feel-good',
    sad: 'sad emotional heartbreak',
    anxious: 'calm relaxation meditation',
    angry: 'intense powerful rock',
    calm: 'peaceful chill ambient',
    stressed: 'stress relief relaxation',
    excited: 'upbeat energetic dance',
    confused: 'focus concentration study',
    lonely: 'inspirational motivational',
    sluggish: 'energizing wake up motivation'
  };
  
  return moodQueries[mood] || 'mood music';
};

export default spotifyApi;
```

### Add Spotify Routes (`backend/src/routes/spotify.js`)

```javascript
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getPlaylistsForMood } from '../utils/spotify.js';

const router = express.Router();

// Get playlists for a mood
router.get('/playlists/:mood', authenticateToken, async (req, res) => {
  try {
    const { mood } = req.params;
    const playlists = await getPlaylistsForMood(mood);
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Spotify auth token (for frontend)
router.post('/auth-url', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email', 'streaming'];
  const state = Math.random().toString(36).substring(7);
  
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes.join(' '))}` +
    `&state=${state}`;
  
  res.json({ authUrl });
});

export default router;
```

### Update Main Server (`backend/src/index.js`)

```javascript
// Add near top, after imports
import { authenticateSpotify } from './utils/spotify.js';
import spotifyRoutes from './routes/spotify.js';

// After initializing database
await authenticateSpotify();

// Add route (after other routes)
app.use('/api/spotify', spotifyRoutes);
```

## 🎹 Step 3: Frontend Setup

### Create Spotify Service (`frontend/src/services/spotify.js`)

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/spotify';

export const getSpotifyAuthUrl = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth-url`);
    return response.data.authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
};

export const getPlaylistsForMood = async (mood) => {
  try {
    const response = await axios.get(`${API_BASE}/playlists/${mood}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting playlists:', error);
    return [];
  }
};

export const saveSpotifyToken = (token) => {
  localStorage.setItem('spotify_token', token);
};

export const getSpotifyToken = () => {
  return localStorage.getItem('spotify_token');
};
```

### Create Playlist Component (`frontend/src/components/SpotifyPlayer.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import { getPlaylistsForMood } from '../services/spotify';
import './SpotifyPlayer.css';

export default function SpotifyPlayer({ mood }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mood) {
      loadPlaylists();
    }
  }, [mood]);

  const loadPlaylists = async () => {
    setLoading(true);
    try {
      const data = await getPlaylistsForMood(mood);
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
    setLoading(false);
  };

  if (!mood) return null;

  return (
    <div className="spotify-player">
      <h3>🎵 Recommended Music</h3>
      
      {loading ? (
        <p>Loading playlists...</p>
      ) : playlists.length > 0 ? (
        <div className="playlist-grid">
          {playlists.map(playlist => (
            <div key={playlist.id} className="playlist-card">
              {playlist.images[0] && (
                <img 
                  src={playlist.images[0].url} 
                  alt={playlist.name}
                  className="playlist-image"
                />
              )}
              <h4>{playlist.name}</h4>
              <p>{playlist.tracks.total} songs</p>
              <a 
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="play-btn"
              >
                ▶ Play on Spotify
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No playlists found for this mood</p>
      )}
    </div>
  );
}
```

### Add to Dashboard (`frontend/src/pages/Dashboard.jsx`)

```javascript
// Add import
import SpotifyPlayer from '../components/SpotifyPlayer';

// Add to render (around line where skills are shown)
{lastMood && (
  <div className="card">
    <SpotifyPlayer mood={lastMood.mood} />
  </div>
)}
```

### Style File (`frontend/src/components/SpotifyPlayer.css`)

```css
.spotify-player {
  padding: 1rem;
  background: linear-gradient(135deg, #1DB954 0%, #191414 100%);
  border-radius: 12px;
  color: white;
}

.spotify-player h3 {
  margin-top: 0;
  color: white;
}

.playlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.playlist-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.playlist-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.playlist-card h4 {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.playlist-card p {
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  opacity: 0.8;
}

.play-btn {
  display: inline-block;
  background: #1DB954;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.play-btn:hover {
  background: #1ed760;
  transform: scale(1.05);
}
```

## 🔐 Step 4: OAuth Flow (Advanced)

For user-specific recommendations:

### Backend OAuth Handler

```javascript
router.post('/callback', async (req, res) => {
  const { code } = req.body;
  
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;
    
    // Store in database (optional)
    // Save to user session
    
    res.json({ 
      access_token, 
      refresh_token, 
      expires_in 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### Frontend OAuth Handler

```javascript
// frontend/src/pages/SpotifyCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('Spotify auth error:', error);
      navigate('/dashboard');
      return;
    }
    
    if (code) {
      // Exchange code for token
      // Then redirect to dashboard
      navigate('/dashboard');
    }
  }, [searchParams, navigate]);

  return <div>Authenticating with Spotify...</div>;
}
```

## 🧪 Testing

```bash
# Test playlist endpoint
curl "http://localhost:3000/api/spotify/playlists/happy" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Deployment Notes

### Environment Variables
```env
# Add to production .env
SPOTIFY_CLIENT_ID=prod_client_id
SPOTIFY_CLIENT_SECRET=prod_client_secret
SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
```

### Rate Limiting
Spotify has rate limits. Implement caching:
```javascript
const cache = new Map();

export const getPlaylistsForMood = async (mood) => {
  if (cache.has(mood)) {
    return cache.get(mood);
  }
  
  const playlists = await searchSpotify(mood);
  cache.set(mood, playlists);
  
  // Clear cache after 1 hour
  setTimeout(() => cache.delete(mood), 3600000);
  
  return playlists;
};
```

## 📚 Resources

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api)
- [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk)
- [Spotify Node Client](https://github.com/thelinmichael/spotify-web-api-node)

## ✅ Checklist for Implementation

- [ ] Create Spotify Developer app
- [ ] Get Client ID & Secret
- [ ] Install spotify-web-api-node in backend
- [ ] Create backend `spotify.js` utility
- [ ] Create `spotify.js` routes
- [ ] Add Spotify routes to main server
- [ ] Create frontend spotify service
- [ ] Create SpotifyPlayer component
- [ ] Add to Dashboard
- [ ] Test with sample mood
- [ ] Handle errors gracefully
- [ ] Deploy with production credentials

## 🎯 Next Level Features

After basic implementation:

1. **Web Playback SDK** - Play directly in browser
2. **User Recommendations** - Based on mood history
3. **Playlist Caching** - Improve performance
4. **Custom Mood Playlists** - Users create playlists for moods
5. **Song Logging** - Track which songs helped
6. **Sharing** - Share mood playlists with friends

---

**Happy streaming! 🎵**
