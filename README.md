# 🎵 OpenAux

<div align="center">

**A Real-Time, Geofenced Democratic Music Platform**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-blue?style=for-the-badge)](https://socket.io/)
[![YouTube API](https://img.shields.io/badge/API-YouTube%20Data%20v3-red?style=for-the-badge)](https://developers.google.com/youtube/v3)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**OpenAux** is a location-based collaborative music platform that democratizes playlist control at venues, parties, and events. Hosts create rooms with geofenced boundaries, while guests within range can search, add, and vote on songs in real-time. The most popular songs automatically play next, creating a truly democratic music experience.

### 🎯 Key Highlights

- **🌍 Geofenced Access** - Guests must be within 100m radius to participate
- **🎵 Democratic Voting** - Community-driven playlist through upvotes/downvotes
- **⚡ Real-Time Sync** - Instant queue updates via WebSocket connections
- **🎨 Premium UI/UX** - Modern glassmorphism design with smooth animations
- **🔒 Vibe Control** - Keyword filtering to maintain desired atmosphere
- **📱 Mobile-First** - Fully responsive design for all devices
- **🆓 Free Tier** - Uses YouTube Data API (no Spotify Premium required)

---

## ✨ Features

### 🎭 For Hosts

- **Room Creation** - Generate unique 6-character room codes
- **QR Code Sharing** - Instant guest invitations via QR codes
- **Playback Control** - Integrated YouTube player with auto-play
- **Queue Management** - View and manage song requests
- **Vibe Guardrails** - Ban keywords to filter unwanted genres
- **Settings Dashboard** - Configure geofence radius and queue limits

### 👥 For Guests

- **Quick Join** - Enter room code or scan QR code
- **Song Search** - Search YouTube's music library
- **Add to Queue** - Request songs with one tap
- **Democratic Voting** - Upvote/downvote songs to influence order
- **Real-Time Updates** - See queue changes instantly
- **Visual Feedback** - Rank badges, vote counts, and animations

### 🔧 Technical Features

- **Auto-Reconnection** - Handles network interruptions gracefully
- **Skeleton Loaders** - Professional loading states
- **Offline Detection** - Network status monitoring
- **Error Boundaries** - Graceful error handling
- **Responsive Design** - Works on phones, tablets, and desktops
- **HTTPS Ready** - Production-ready security

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas/register))
- **YouTube Data API** key ([Get API key](https://console.cloud.google.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/openaux.git
cd openaux
```

#### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

#### 3. Configure Environment Variables

**Server Configuration** (`server/.env`):

```env
# Environment
NODE_ENV=development
PORT=5000

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/openaux?retryWrites=true&w=majority

# YouTube Data API v3
YOUTUBE_API_KEY=AIzaSyA...your_api_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Client Configuration** (`client/.env`):

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Socket.io URL
VITE_SOCKET_URL=http://localhost:5000
```

#### 4. Obtain API Keys

##### YouTube Data API v3

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Library**
4. Search for "YouTube Data API v3" and enable it
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Copy the API key to `server/.env`

##### MongoDB Atlas

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get connection string and replace `<password>` with your database user password
6. Paste into `server/.env`

#### 5. Run Development Servers

**Option 1: Separate Terminals**

```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Client
cd client
npm run dev
```

**Option 2: Concurrently (if configured)**

```bash
npm run dev
```

#### 6. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📁 Project Structure

```
OpenAux/
├── client/                          # Frontend React application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Guest/
│   │   │   │   ├── SongSearch.jsx   # YouTube search interface
│   │   │   │   └── QueueList.jsx    # Voting and queue display
│   │   │   ├── Host/
│   │   │   │   ├── YouTubePlayer.jsx    # Embedded player
│   │   │   │   ├── QRCodeDisplay.jsx    # Room invitation
│   │   │   │   └── RoomSettings.jsx     # Configuration panel
│   │   │   ├── ErrorBoundary.jsx    # Error handling
│   │   │   ├── Logo.jsx             # Branding component
│   │   │   └── OfflineDetector.jsx  # Network monitoring
│   │   ├── context/
│   │   │   └── SocketContext.jsx    # Socket.io provider
│   │   ├── pages/
│   │   │   ├── CreateRoom.jsx       # Host landing page
│   │   │   ├── JoinRoom.jsx         # Guest entry point
│   │   │   ├── HostDashboard.jsx    # Host control panel
│   │   │   └── GuestView.jsx        # Guest interface
│   │   ├── utils/
│   │   │   ├── api.js               # Axios configuration
│   │   │   └── geolocation.js       # Location utilities
│   │   ├── App.jsx                  # Root component
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Environment variables
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── vite.config.js               # Vite configuration
│   └── package.json
│
├── server/                          # Backend Node.js application
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── roomController.js        # Room CRUD operations
│   │   └── songController.js        # YouTube search logic
│   ├── middleware/
│   │   ├── errorHandler.js          # Error middleware
│   │   └── geofence.js              # Location validation
│   ├── models/
│   │   └── Room.js                  # MongoDB schemas
│   ├── routes/
│   │   ├── roomRoutes.js            # Room endpoints
│   │   └── songRoutes.js            # Song endpoints
│   ├── socket/
│   │   └── socketHandlers.js        # Socket.io events
│   ├── utils/
│   │   └── youtubeFilter.js         # Keyword filtering
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express + Socket.io setup
│   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.3.1 |
| **Vite** | Build Tool | 5.4.11 |
| **Tailwind CSS** | Styling | 3.4.17 |
| **Socket.io Client** | Real-Time Communication | 4.8.1 |
| **Axios** | HTTP Client | 1.7.9 |
| **React Router** | Routing | 7.1.1 |
| **Lucide React** | Icons | 0.469.0 |
| **QRCode.react** | QR Code Generation | 4.1.0 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **Express.js** | Web Framework | 4.21.2 |
| **Socket.io** | WebSocket Server | 4.8.1 |
| **MongoDB** | Database | Atlas (Cloud) |
| **Mongoose** | ODM | 8.9.3 |
| **Express Validator** | Input Validation | 7.2.1 |
| **CORS** | Cross-Origin Requests | 2.8.5 |
| **Dotenv** | Environment Variables | 16.4.7 |

### APIs & Services

- **YouTube Data API v3** - Music search and metadata
- **YouTube IFrame Player API** - Embedded video playback
- **Browser Geolocation API** - User location tracking
- **MongoDB Atlas** - Cloud database hosting

---

## 🔧 Core Technical Implementations

### 1. Geofencing with Haversine Formula

Validates that guests are within the specified radius of the host's location.

```javascript
// server/middleware/geofence.js
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
```

### 2. Real-Time Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_room` | Client → Server | `{ roomCode, isHost, userName, location }` | Join room with location |
| `add_song` | Client → Server | `{ roomCode, song }` | Add song to queue |
| `vote_song` | Client → Server | `{ roomCode, songId, voteType }` | Upvote/downvote song |
| `song_ended` | Host → Server | `{ roomCode, songId }` | Notify song completion |
| `queue_updated` | Server → All Clients | `{ queue }` | Broadcast queue changes |
| `play_next_song` | Server → Host | `{ song }` | Trigger next song playback |
| `user_joined` | Server → All Clients | `{ userName, userCount }` | Notify new user |
| `user_left` | Server → All Clients | `{ userName, userCount }` | Notify user departure |
| `error` | Server → Client | `{ message }` | Error notification |

### 3. YouTube Auto-Play System

```javascript
// client/src/components/Host/YouTubePlayer.jsx
const onPlayerStateChange = (event) => {
  if (event.data === window.YT.PlayerState.ENDED) {
    // Song finished - notify server to play next
    socket.emit('song_ended', { 
      roomCode, 
      songId: currentSong._id 
    });
  }
};

// Server automatically broadcasts next song
socket.on('play_next_song', ({ song }) => {
  playerRef.current.loadVideoById(song.youtubeId);
});
```

### 4. Vibe Control (Keyword Filtering)

```javascript
// server/utils/youtubeFilter.js
async function searchYouTubeWithFilter(query, bannedKeywords = []) {
  // Fetch search results from YouTube
  const searchResponse = await axios.get(
    'https://www.googleapis.com/youtube/v3/search',
    { params: { q: query, type: 'video', videoCategoryId: '10' } }
  );

  // Filter out banned content
  const filtered = results.filter(video => {
    const title = video.snippet.title.toLowerCase();
    const description = video.snippet.description.toLowerCase();
    const tags = (video.snippet.tags || []).map(tag => tag.toLowerCase());

    const hasBannedContent = bannedKeywords.some(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      return (
        title.includes(lowerKeyword) ||
        description.includes(lowerKeyword) ||
        tags.some(tag => tag.includes(lowerKeyword))
      );
    });

    return !hasBannedContent;
  });

  return filtered;
}
```

### 5. Socket Reconnection Logic

```javascript
// client/src/context/SocketContext.jsx
const newSocket = io(socketUrl, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  autoConnect: true
});

// Handle reconnection events
newSocket.on('reconnect', (attemptNumber) => {
  console.log(`✅ Reconnected after ${attemptNumber} attempts`);
  // Re-join room if needed
});
```

---

## 🌐 Deployment

### Backend Deployment (Render)

1. **Create Account** at [Render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Select the `server` directory

3. **Configure Build Settings**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

4. **Add Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   YOUTUBE_API_KEY=AIzaSy...
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy** - Render will automatically deploy on push

### Frontend Deployment (Vercel)

1. **Create Account** at [Vercel.com](https://vercel.com)

2. **Import Project**
   - Connect GitHub repository
   - Framework Preset: **Vite**
   - Root Directory: `client`

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```env
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

5. **Deploy** - Vercel will auto-deploy on push

### Alternative Platforms

- **Backend**: Railway, Heroku, AWS EC2, DigitalOcean
- **Frontend**: Netlify, Cloudflare Pages, AWS Amplify
- **Database**: MongoDB Atlas (recommended), self-hosted MongoDB

### Important Notes

- ⚠️ **HTTPS Required** - Geolocation API only works on HTTPS in production
- ⚠️ **CORS Configuration** - Ensure `CLIENT_URL` matches your frontend domain
- ⚠️ **API Quotas** - YouTube Data API has 10,000 units/day on free tier

---

## 📊 Database Schema

### Room Model

```javascript
{
  roomCode: {
    type: String,
    required: true,
    unique: true,
    length: 6,
    uppercase: true
  },
  hostId: String,
  hostName: String,
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  settings: {
    bannedKeywords: [String],
    geofenceRadius: { type: Number, default: 100 }, // meters
    maxQueueSize: { type: Number, default: 50 }
  },
  queue: [SongSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours
  }
}
```

### Song Schema (Embedded in Room)

```javascript
{
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: String,
  duration: String,
  channelTitle: String,
  votes: { type: Number, default: 0 },
  addedBy: String,
  addedAt: { type: Date, default: Date.now },
  votedBy: [{
    socketId: String,
    vote: Number // 1 for upvote, -1 for downvote
  }]
}
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary (Orange) */
--primary-50: #fef3e2;
--primary-500: #f9ac12;
--primary-900: #f57c05;

/* Dark (Navy) */
--dark-700: #3e4c59;
--dark-800: #323f4b;
--dark-900: #1f2933;

/* Semantic Colors */
--success: #10b981;  /* Green */
--error: #ef4444;    /* Red */
--warning: #f59e0b;  /* Amber */
```

### Typography

- **Font Family**: System fonts (`-apple-system, BlinkMacSystemFont, 'Segoe UI', ...`)
- **Headings**: Bold, gradient text effects
- **Body**: 16px minimum (prevents iOS zoom)

### Components

#### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}
```

#### Gradient Button
```css
.btn-primary {
  background: linear-gradient(135deg, #f9ac12 0%, #f57c05 100%);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 40px rgba(249, 172, 18, 0.4);
}
```

---

## 🎯 Usage Guide

### For Hosts

1. **Create Room**
   - Click "Create Room" on homepage
   - Allow location access when prompted
   - Enter your name (optional)
   - Click "Create Room"

2. **Share Room**
   - Display QR code for guests to scan
   - Or share the 6-character room code

3. **Manage Queue**
   - View all requested songs
   - See vote counts in real-time
   - Songs auto-play based on votes

4. **Configure Settings** (Optional)
   - Add banned keywords (e.g., "country", "metal")
   - Adjust geofence radius
   - Set maximum queue size

### For Guests

1. **Join Room**
   - Scan QR code or enter room code
   - Allow location access (must be within 100m)
   - Enter your name (optional)

2. **Add Songs**
   - Search for songs using the search bar
   - Click **+** button to add to queue
   - Button turns green when added

3. **Vote on Songs**
   - Click **↑** to upvote (increases priority)
   - Click **↓** to downvote (decreases priority)
   - Vote count updates instantly for all users

4. **Watch Queue**
   - See songs ranked by votes
   - Top song (🏆 crown icon) plays next
   - Real-time updates as others vote

---

## 🐛 Troubleshooting

### Location Access Issues

**Problem**: "Location access required" error

**Solutions**:
- Ensure you're using **HTTPS** (required in production)
- Check browser location permissions:
  - Chrome: Settings → Privacy → Site Settings → Location
  - Safari: Settings → Privacy → Location Services
- Try a different browser
- Ensure location services are enabled on your device

### YouTube Player Not Loading

**Problem**: Black screen or "Video unavailable"

**Solutions**:
- Verify YouTube API key is valid
- Check API quota (10,000 units/day free tier)
- Ensure video is not age-restricted or region-blocked
- Check browser console for errors

### Socket Connection Failed

**Problem**: "Failed to connect to server" or no real-time updates

**Solutions**:
- Verify server is running
- Check `VITE_SOCKET_URL` in client `.env`
- Ensure CORS is configured correctly in `server.js`
- Check firewall/network settings
- Look for reconnection banner (yellow)

### Songs Not Searching

**Problem**: No results when searching

**Solutions**:
- Check YouTube API key in `server/.env`
- Verify API quota not exceeded
- Check server console for errors
- Ensure internet connection is stable

### Geofence Validation Failing

**Problem**: "You must be within 100m" error when nearby

**Solutions**:
- GPS accuracy can vary (5-50m typically)
- Move closer to the host
- Ensure clear view of sky (GPS works better outdoors)
- Wait for GPS to stabilize (can take 30 seconds)

---

## 📚 Documentation

### Additional Resources

- **[API Documentation](./docs/API.md)** - REST and Socket.io endpoints
- **[Deployment Guide](./DEPLOY_AND_TEST.md)** - Step-by-step deployment
- **[Bug Analysis](./PRE_DEPLOYMENT_REPORT.md)** - Known issues and fixes
- **[Enhancement Guide](./ENHANCEMENTS_COMPLETE.md)** - Recent improvements
- **[YouTube API Setup](./YOUTUBE_API_SETUP.md)** - Detailed API configuration

### Architecture Diagrams

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │◄───────►│   Server    │◄───────►│  MongoDB    │
│  (React)    │ Socket  │  (Express)  │  Mongoose│   Atlas     │
└─────────────┘         └─────────────┘         └─────────────┘
       │                       │
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  Geolocation│         │  YouTube    │
│     API     │         │   API v3    │
└─────────────┘         └─────────────┘
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use **ESLint** and **Prettier** for formatting
- Follow **Airbnb JavaScript Style Guide**
- Write meaningful commit messages
- Add comments for complex logic

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 🙏 Acknowledgments

- **YouTube Data API v3** - Free music search and metadata
- **Socket.io** - Real-time bidirectional communication
- **Tailwind CSS** - Rapid UI development
- **MongoDB Atlas** - Free cloud database hosting
- **Lucide Icons** - Beautiful open-source icons
- **Vercel & Render** - Free hosting platforms

---

## 📧 Contact & Support

- **Developer**: [Your Name](https://github.com/yourusername)
- **Email**: your.email@example.com
- **Project Link**: [https://github.com/yourusername/openaux](https://github.com/yourusername/openaux)
- **Live Demo**: [https://openaux.vercel.app](https://openaux.vercel.app)

### Found a Bug?

Please [open an issue](https://github.com/yourusername/openaux/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for music lovers and developers**

[⬆ Back to Top](#-openaux)

</div>
