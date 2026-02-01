import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { ChevronUp, ChevronDown, Music, Clock, Crown } from 'lucide-react';

const QueueList = ({ roomCode }) => {
    const [queue, setQueue] = useState([]);
    const [currentVotedSong, setCurrentVotedSong] = useState(null); // Only track ONE voted song
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('queue_updated', ({ queue }) => {
            // Sort by votes (descending)
            const sorted = [...queue].sort((a, b) => {
                if (b.votes !== a.votes) return b.votes - a.votes;
                return new Date(a.addedAt) - new Date(b.addedAt);
            });
            setQueue(sorted);
        });

        return () => {
            socket.off('queue_updated');
        };
    }, [socket]);

    const handleVote = (songId, voteType) => {
        // If clicking on the same song with same vote type, unvote
        if (currentVotedSong?.songId === songId && currentVotedSong?.voteType === voteType) {
            // Unvote
            socket.emit('vote_song', { roomCode, songId, voteType });
            setCurrentVotedSong(null);
            return;
        }

        // If there's a previous vote on a different song, remove it first
        if (currentVotedSong && currentVotedSong.songId !== songId) {
            // Remove previous vote
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

    return (
        <div className="space-y-3">
            {queue.length === 0 ? (
                <div className="text-center py-8 sm:py-16">
                    <div className="glass-card p-8 sm:p-12">
                        <Music className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-primary-400 mb-3 sm:mb-4 animate-pulse" />
                        <p className="text-white text-lg sm:text-xl font-semibold mb-2">No songs in queue yet</p>
                        <p className="text-gray-400 text-sm sm:text-base">Be the first to add a song!</p>
                    </div>
                </div>
            ) : (
                queue.map((song, index) => (
                    <div
                        key={song._id}
                        className={`glass-card overflow-hidden transition-all duration-300 hover:scale-[1.01] ${index === 0 ? 'ring-2 ring-primary-500 shadow-2xl shadow-primary-500/50' : ''
                            }`}
                    >
                        <div className="flex items-center p-3 sm:p-4 gap-2 sm:gap-4">
                            {/* Rank Badge */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-lg ${index === 0
                                    ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white animate-pulse'
                                    : index === 1
                                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                                        : index === 2
                                            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                            : 'bg-white/20 text-gray-300'
                                    }`}
                            >
                                {index === 0 ? <Crown className="w-5 h-5 sm:w-6 sm:h-6" /> : index + 1}
                            </div>

                            {/* Thumbnail */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={song.thumbnail}
                                    alt={song.title}
                                    className="w-16 h-12 sm:w-24 sm:h-16 object-cover rounded-lg shadow-md"
                                />
                                {index === 0 && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </div>

                            {/* Song Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate text-sm sm:text-base md:text-lg">
                                    {song.title}
                                </h4>
                                <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {song.duration}
                                    </span>
                                    <span>•</span>
                                    <span className="truncate">by {song.addedBy}</span>
                                </div>
                            </div>

                            {/* Vote Buttons */}
                            <div className="flex flex-col items-center gap-0.5 sm:gap-1 flex-shrink-0">
                                <button
                                    onClick={() => handleVote(song._id, 'up')}
                                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation ${currentVotedSong?.songId === song._id && currentVotedSong?.voteType === 'up'
                                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-110'
                                            : 'bg-white/10 text-gray-300 hover:bg-green-500/30 hover:text-green-400 active:scale-95'
                                        }`}
                                >
                                    <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                <span
                                    className={`font-bold text-base sm:text-xl min-w-[2.5rem] sm:min-w-[3rem] text-center ${song.votes > 0
                                            ? 'text-green-400'
                                            : song.votes < 0
                                                ? 'text-red-400'
                                                : 'text-gray-400'
                                        }`}
                                >
                                    {song.votes > 0 ? '+' : ''}
                                    {song.votes}
                                </span>

                                <button
                                    onClick={() => handleVote(song._id, 'down')}
                                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 touch-manipulation ${currentVotedSong?.songId === song._id && currentVotedSong?.voteType === 'down'
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110'
                                            : 'bg-white/10 text-gray-300 hover:bg-red-500/30 hover:text-red-400 active:scale-95'
                                        }`}
                                >
                                    <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default QueueList;
