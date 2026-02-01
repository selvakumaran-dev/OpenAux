import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import SongSearch from '../components/Guest/SongSearch';
import QueueList from '../components/Guest/QueueList';
import { MapPin, Users, AlertCircle } from 'lucide-react';
import { getCurrentLocation } from '../utils/geolocation';
import Logo from '../components/Logo';

const GuestView = () => {
    const { roomCode } = useParams();
    const { socket } = useSocket();
    const [userName, setUserName] = useState('');
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState('');
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        if (!socket || !joined) return;

        socket.on('user_joined', ({ userCount: count }) => {
            setUserCount(count);
        });

        socket.on('user_left', ({ userCount: count }) => {
            setUserCount(count);
        });

        socket.on('error', ({ message }) => {
            setError(message);
        });

        return () => {
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('error');
        };
    }, [socket, joined]);

    const joinRoom = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Get real location - REQUIRED for production
            const location = await getCurrentLocation();

            // Set up error listener before joining
            const handleJoinError = ({ message }) => {
                setError(message || 'Room not found. Please check the room code and try again.');
                setJoined(false);
            };

            socket.once('join_error', handleJoinError);
            socket.once('room_not_found', () => {
                setError('Room not found. Please check the room code and try again.');
                setJoined(false);
            });

            // Join room via socket
            socket.emit('join_room', {
                roomCode,
                isHost: false,
                userName: userName || 'Anonymous',
                location
            });

            setJoined(true);
        } catch (error) {
            console.error('Join room error:', error);
            if (error.message.includes('location') || error.message.includes('Location')) {
                setError('Location access is required to join this room. Please enable location permissions in your browser.');
            } else {
                setError(error.message || 'Failed to join room. Please try again.');
            }
        }
    };

    if (!joined) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4">
                            <Logo className="w-20 h-20" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Join Room</h1>
                        <p className="text-white text-lg font-medium">Room Code: {roomCode}</p>
                    </div>

                    <div className="glass-card p-8">
                        <form onSubmit={joinRoom} className="space-y-4">
                            <div>
                                <label className="block text-white font-semibold mb-2">
                                    Your Name (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="input-field w-full"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="bg-primary-500/20 border border-primary-500/50 rounded-lg p-3 text-primary-200 text-sm flex items-start gap-2">
                                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>
                                    You must be within 100m of the host to vote on songs.
                                </p>
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                Join Room
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Logo className="w-12 h-12" />
                        <div>
                            <h1 className="text-3xl font-bold text-white">OpenAux</h1>
                            <p className="text-white font-medium">Room: {roomCode}</p>
                        </div>
                    </div>

                    <div className="glass-card px-4 py-3 flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-400" />
                        <span className="text-white font-semibold">{userCount}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left - Search */}
                    <div className="glass-card p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Add Songs</h2>
                        <SongSearch roomCode={roomCode} />
                    </div>

                    {/* Right - Queue */}
                    <div className="glass-card p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Queue</h2>
                        <QueueList roomCode={roomCode} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestView;
