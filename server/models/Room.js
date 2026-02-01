const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String },
  duration: { type: String }, // e.g., "3:45"
  votes: { type: Number, default: 0 },
  addedBy: { type: String, required: true }, // Guest's socket ID or name
  addedAt: { type: Date, default: Date.now },
  votedBy: [{ socketId: String, vote: Number }] // Track who voted (+1 or -1)
});

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    minlength: 6,
    maxlength: 6
  },
  hostId: { type: String, required: true }, // Socket ID of host
  hostName: { type: String, default: 'Anonymous Host' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  settings: {
    bannedKeywords: [{ type: String, lowercase: true }],
    geofenceRadius: { type: Number, default: 200 }, // meters (200m = ~2 football fields)
    maxQueueSize: { type: Number, default: 50 }
  },
  queue: [songSchema], // Embedded songs array
  currentlyPlaying: { type: mongoose.Schema.Types.ObjectId }, // Reference to song in queue
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 } // 24 hours
});

// Auto-delete expired rooms
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to get top-voted song
roomSchema.methods.getNextSong = function () {
  if (this.queue.length === 0) return null;

  // Sort by votes (descending), then by addedAt (ascending)
  const sorted = this.queue.sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return new Date(a.addedAt) - new Date(b.addedAt);
  });

  return sorted[0];
};

module.exports = mongoose.model('Room', roomSchema);
