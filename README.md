# 🎵 OpenAux

<div align="center">

**A GPS-Verified Real-Time Democratic Music Platform**

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-blue?style=for-the-badge)](https://socket.io/)
[![YouTube API](https://img.shields.io/badge/API-YouTube%20Data%20v3-red?style=for-the-badge)](https://developers.google.com/youtube/v3)
[![Geofencing](https://img.shields.io/badge/Geofencing-200m%20GPS-orange?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#%EF%B8%8F-tech-stack) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 Overview

**OpenAux** is a location-verified collaborative music platform that democratizes playlist control at venues, parties, and events. Hosts create rooms with GPS-based geofenced boundaries, while guests within a 200-meter radius can search, add, and vote on songs in real-time. The most popular songs automatically play next, creating a truly democratic music experience secured by location validation.

### 🎯 Key Highlights

- **🌍 GPS Geofencing (200m)** - Location-verified participation using Haversine distance calculation
- **🎵 Democratic Voting** - One vote per guest, fair community-driven playlists
- **⚡ Real-Time Sync** - Instant queue updates via WebSocket connections
- **🔒 Session Management** - Prevents multiple accounts from the same device
- **🎨 Premium UI/UX** - Modern glassmorphism design with smooth animations
- **📱 Mobile-First** - Fully responsive, touch-optimized interface
- **🆓 Free Tier** - Uses YouTube Data API (no Spotify Premium required)

---

## ✨ Features

### 🎭 For Hosts

- **Room Creation** - Generate unique 6-character room codes with GPS location capture
- **QR Code Sharing** - Instant guest invitations via scannable QR codes
- **Playback Control** - Integrated YouTube player with auto-play next song
- **Queue Management** - View real-time song requests with vote counts
- **User Management** - See all active users with host/guest indicators
- **Settings Dashboard** - Configure geofence radius (50m-1000m) and queue limits
- **Vibe Control** - Ban keywords to filter unwanted genres

### 👥 For Guests

- **Quick Join** - Enter room code or scan QR code (location verified)
- **Song Search** - Search YouTube's music library with instant results
- **Add to Queue** - Request songs with one tap (duplicate prevention)
- **Democratic Voting** - One active vote per guest (upvote/downvote)
- **Real-Time Updates** - See queue changes and vote counts instantly
- **Visual Feedback** - Rank badges, vote animations, and status indicators
- **User List** - View all active participants in the room

### 🔧 Technical Features

- **GPS Validation** - Location checked on join AND vote (Haversine formula)
- **Session Persistence** - Auto-rejoin on page refresh
- **Device Tracking** - Prevents multiple accounts from same device
- **Auto-Reconnection** - Handles network interruptions gracefully
- **Skeleton Loaders** - Professional loading states
- **Offline Detection** - Network status monitoring
- **Error Boundaries** - Graceful error handling
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
│   │   │   ├── UserListModal.jsx    # Active users display
│   │   │   ├── ErrorBoundary.jsx    # Error handling
│   │   │   ├── Logo.jsx             # Branding component
│   │   │   └── OfflineDetector.jsx  # Network monitoring
│   │   ├── context/
│   │   │   └── SocketContext.jsx    # Socket.io provider
│   │   ├── hooks/
│   │   │   └── useGuestSession.js   # Session management hook
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
│   │   └── geofence.js              # Location validation (Haversine)
│   ├── models/
│   │   └── Room.js                  # MongoDB schemas
│   ├── routes/
│   │   ├── roomRoutes.js            # Room endpoints
│   │   └── songRoutes.js            # Song endpoints
│   ├── socket/
│   │   └── socketHandlers.js        # Socket.io events + geofencing
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
- **Browser Geolocation API** - User location tracking (GPS)
- **MongoDB Atlas** - Cloud database hosting

---

## 🔧 Core Technical Implementations

### 1. GPS Geofencing with Haversine Formula (200m Radius)

Validates that guests are within 200 meters of the host's location using accurate spherical distance calculation.

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

  return R * c; // Distance in meters (±5m accuracy)
}
```

**Location Validation Points:**
- ✅ Validated on room join
- ✅ Re-validated on every vote
- ✅ Host exempt from restrictions
- ✅ Configurable radius (default: 200m)

### 2. One Vote Per Guest System

Ensures fair democratic voting by allowing only one active vote per guest at a time.

```javascript
// client/src/components/Guest/QueueList.jsx
const [currentVotedSong, setCurrentVotedSong] = useState(null);

const handleVote = (songId, voteType) => {
    // If clicking same song with same vote type, unvote
    if (currentVotedSong?.songId === songId && currentVotedSong?.voteType === voteType) {
        socket.emit('vote_song', { roomCode, songId, voteType });
        setCurrentVotedSong(null);
        return;
    }

    // If there's a previous vote on different song, remove it first
    if (currentVotedSong && currentVotedSong.songId !== songId) {
        socket.emit('vote_song', { 
            roomCode, 
            songId: currentVotedSong.songId, 
            voteType: currentVotedSong.voteType 
        });
    }

    // Cast new vote
    socket.emit('vote_song', { roomCode, songId, voteType });
    setCurrentVotedSong({ songId, voteType });
};
```

### 3. Session Management & Device Tracking

Prevents multiple accounts from the same device using localStorage and device ID tracking.

```javascript
// client/src/hooks/useGuestSession.js
export const useGuestSession = (roomCode) => {
    const SESSION_KEY = `openaux_session_${roomCode}`;
    const DEVICE_ID_KEY = 'openaux_device_id';

    // Generate or get device ID
    const getDeviceId = () => {
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);
        
        if (!deviceId) {
            deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
        
        return deviceId;
    };

    // Create session with device tracking
    const createSession = (userName, location) => {
        const session = {
            userName,
            location,
            deviceId: getDeviceId(),
            joinedAt: new Date().toISOString(),
            roomCode
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return session;
    };

    // Auto-rejoin on page refresh
    // Clear session on tab close
};
```

### 4. Real-Time Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join_room` | Client → Server | `{ roomCode, isHost, userName, location }` | Join room with GPS validation |
| `add_song` | Client → Server | `{ roomCode, song }` | Add song to queue |
| `vote_song` | Client → Server | `{ roomCode, songId, voteType }` | Upvote/downvote with location check |
| `song_ended` | Host → Server | `{ roomCode, songId }` | Notify song completion |
| `queue_updated` | Server → All Clients | `{ queue }` | Broadcast queue changes |
| `play_next_song` | Server → Host | `{ song }` | Trigger next song playback |
| `user_joined` | Server → All Clients | `{ userName, userCount, users }` | Notify new user |
| `user_left` | Server → All Clients | `{ userName, userCount, users }` | Notify user departure |
| `users_updated` | Server → Client | `{ users, userCount }` | Send user list |
| `join_error` | Server → Client | `{ message, distance, maxDistance }` | Location validation error |
| `error` | Server → Client | `{ message }` | General error notification |

### 5. YouTube Auto-Play System

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

### 6. Socket Reconnection Logic

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
    geofenceRadius: { type: Number, default: 200 }, // meters (200m = ~2 football fields)
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

## 🎯 Usage Guide

### For Hosts

1. **Create Room**
   - Click "Create Room" on homepage
   - Allow location access when prompted (GPS required)
   - Enter your name (optional)
   - Click "Create Room"

2. **Share Room**
   - Display QR code for guests to scan
   - Or share the 6-character room code
   - Copy join link for easy sharing

3. **Manage Queue**
   - View all requested songs with vote counts
   - See real-time vote updates
   - Songs auto-play based on votes
   - Top song (🏆 crown icon) plays next

4. **View Users**
   - Click user count to see all active participants
   - Host indicated with 👑 crown icon
   - Guests shown with 🎵 music icon

5. **Configure Settings** (Optional)
   - Add banned keywords (e.g., "country", "metal")
   - Adjust geofence radius (50m-1000m)
   - Set maximum queue size

### For Guests

1. **Join Room**
   - Scan QR code or enter room code
   - Allow location access (must be within 200m)
   - Enter your name (optional)
   - System validates GPS location

2. **Add Songs**
   - Search for songs using the search bar
   - Click **+** button to add to queue
   - Button turns green when added
   - Duplicate songs prevented

3. **Vote on Songs**
   - Click **↑** to upvote (increases priority)
   - Click **↓** to downvote (decreases priority)
   - **One vote at a time** - voting on new song removes previous vote
   - Vote count updates instantly for all users
   - Click same button again to unvote

4. **Watch Queue**
   - See songs ranked by votes
   - Top song (🏆 crown icon) plays next
   - Real-time updates as others vote
   - Your active vote highlighted in green/red

---

## 🐛 Troubleshooting

### Location Access Issues

**Problem**: "Location access required" or "You are too far from the party" error

**Solutions**:
- Ensure you're using **HTTPS** (required in production)
- Check browser location permissions:
  - Chrome: Settings → Privacy → Site Settings → Location
  - Safari: Settings → Privacy → Location Services
- Ensure location services are enabled on your device
- Move closer to the host (within 200m)
- GPS accuracy can vary (±5-50m typically)
- Wait for GPS to stabilize (can take 30 seconds)
- Ensure clear view of sky (GPS works better outdoors)

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

### Multiple Account Prevention

**Problem**: "You are already in this room" error

**Solutions**:
- This is intentional - one account per device per room
- Close all tabs of the room and try again
- Clear browser localStorage if needed
- Use different device or browser for second account

### Songs Not Searching

**Problem**: No results when searching

**Solutions**:
- Check YouTube API key in `server/.env`
- Verify API quota not exceeded
- Check server console for errors
- Ensure internet connection is stable

---

## 📚 Documentation

### Key Features Summary

| Feature | Description | Status |
|---------|-------------|--------|
| **GPS Geofencing** | 200m radius validation using Haversine formula | ✅ Implemented |
| **One Vote Per Guest** | Fair democratic voting system | ✅ Implemented |
| **Session Management** | Prevents multiple accounts from same device | ✅ Implemented |
| **Real-Time Sync** | WebSocket-based instant updates | ✅ Implemented |
| **QR Code Join** | Instant room access via QR scanning | ✅ Implemented |
| **User List** | View all active participants | ✅ Implemented |
| **Auto-Play** | Automatic next song playback | ✅ Implemented |
| **Mobile Responsive** | Touch-optimized interface | ✅ Implemented |

### Architecture Diagram

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
│   API (GPS) │         │   API v3    │
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

**Secured by GPS • Powered by Democracy • Connected in Real-Time**

[⬆ Back to Top](#-openaux)

</div>
