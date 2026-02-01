const Room = require('../models/Room');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // ==================== JOIN ROOM ====================
        socket.on('join_room', async ({ roomCode, isHost, userName }) => {
            try {
                const room = await Room.findOne({ roomCode, isActive: true });

                if (!room) {
                    socket.emit('join_error', { message: 'Room not found. Please check the room code and try again.' });
                    socket.emit('room_not_found');
                    return socket.emit('error', { message: 'Room not found' });
                }

                socket.join(roomCode);
                socket.roomCode = roomCode;
                socket.isHost = isHost;
                socket.userName = userName || 'Anonymous';

                console.log(`👤 ${userName} joined room ${roomCode}`);

                // Send current queue to the new user
                socket.emit('queue_updated', { queue: room.queue });

                // Notify others
                socket.to(roomCode).emit('user_joined', {
                    userName: socket.userName,
                    userCount: io.sockets.adapter.rooms.get(roomCode)?.size || 1
                });
            } catch (error) {
                console.error('Join room error:', error);
                socket.emit('join_error', { message: 'Failed to join room. Please try again.' });
                socket.emit('error', { message: 'Failed to join room' });
            }
        });

        // ==================== ADD SONG ====================
        socket.on('add_song', async ({ roomCode, song }) => {
            try {
                const room = await Room.findOne({ roomCode, isActive: true });

                if (!room) {
                    return socket.emit('error', { message: 'Room not found' });
                }

                // Check queue size limit
                if (room.queue.length >= room.settings.maxQueueSize) {
                    return socket.emit('error', { message: 'Queue is full' });
                }

                // Check for duplicates
                const isDuplicate = room.queue.some(s => s.youtubeId === song.youtubeId);
                if (isDuplicate) {
                    return socket.emit('error', { message: 'Song already in queue' });
                }

                // Add song
                room.queue.push({
                    ...song,
                    addedBy: socket.userName,
                    votes: 0,
                    votedBy: []
                });

                await room.save();

                // Broadcast updated queue to all users in room
                io.to(roomCode).emit('queue_updated', { queue: room.queue });

                console.log(`🎵 ${socket.userName} added "${song.title}" to ${roomCode}`);
            } catch (error) {
                console.error('Add song error:', error);
                socket.emit('error', { message: 'Failed to add song' });
            }
        });

        // ==================== VOTE SONG ====================
        socket.on('vote_song', async ({ roomCode, songId, voteType }) => {
            try {
                const room = await Room.findOne({ roomCode, isActive: true });

                if (!room) {
                    return socket.emit('error', { message: 'Room not found' });
                }

                const song = room.queue.id(songId);
                if (!song) {
                    return socket.emit('error', { message: 'Song not found' });
                }

                // Check if user already voted
                const existingVote = song.votedBy.find(v => v.socketId === socket.id);

                if (existingVote) {
                    // Remove previous vote
                    song.votes -= existingVote.vote;
                    song.votedBy = song.votedBy.filter(v => v.socketId !== socket.id);
                }

                // Add new vote (1 for upvote, -1 for downvote)
                const voteValue = voteType === 'up' ? 1 : -1;
                song.votes += voteValue;
                song.votedBy.push({ socketId: socket.id, vote: voteValue });

                await room.save();

                // Broadcast updated queue
                io.to(roomCode).emit('queue_updated', { queue: room.queue });

                console.log(`👍 ${socket.userName} voted ${voteType} on "${song.title}"`);
            } catch (error) {
                console.error('Vote error:', error);
                socket.emit('error', { message: 'Failed to vote' });
            }
        });

        // ==================== SONG ENDED (Host Only) ====================
        socket.on('song_ended', async ({ roomCode, songId }) => {
            try {
                if (!socket.isHost) {
                    return socket.emit('error', { message: 'Only host can end songs' });
                }

                const room = await Room.findOne({ roomCode, isActive: true });

                if (!room) {
                    return socket.emit('error', { message: 'Room not found' });
                }

                // Remove the finished song from queue
                room.queue = room.queue.filter(s => s._id.toString() !== songId);
                await room.save();

                // Get next song
                const nextSong = room.getNextSong();

                // Broadcast to all users
                io.to(roomCode).emit('queue_updated', { queue: room.queue });

                if (nextSong) {
                    io.to(roomCode).emit('play_next_song', { song: nextSong });
                    console.log(`▶️ Now playing: "${nextSong.title}" in ${roomCode}`);
                } else {
                    io.to(roomCode).emit('queue_empty');
                    console.log(`⏸️ Queue empty in ${roomCode}`);
                }
            } catch (error) {
                console.error('Song ended error:', error);
                socket.emit('error', { message: 'Failed to process song end' });
            }
        });

        // ==================== DISCONNECT ====================
        socket.on('disconnect', () => {
            if (socket.roomCode) {
                socket.to(socket.roomCode).emit('user_left', {
                    userName: socket.userName,
                    userCount: io.sockets.adapter.rooms.get(socket.roomCode)?.size || 0
                });
                console.log(`❌ ${socket.userName} left ${socket.roomCode}`);
            }
        });
    });
};
