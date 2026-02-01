import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import SongSearch from '../components/Guest/SongSearch';
import QueueList from '../components/Guest/QueueList';
import UserListModal from '../components/UserListModal';
import { MapPin, AlertCircle } from 'lucide-react';
import { getCurrentLocation } from '../utils/geolocation';
import { useGuestSession } from '../hooks/useGuestSession';
import Logo from '../components/Logo';

const GuestView = () => {
    const { roomCode } = useParams();
    const { socket } = useSocket();
    const { sessionInfo, isExistingSession, createSession, clearSession } = useGuestSession(roomCode);
    const [userName, setUserName] = useState('');
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState('');
    const [userCount, setUserCount] = useState(0);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!socket || !joined) return;

        socket.on('user_joined', ({ userCount: count, users: userList }) => {
            setUserCount(count);
            if (userList) setUsers(userList);
        });

        socket.on('user_left', ({ userCount: count, users: userList }) => {
            setUserCount(count);
            if (userList) setUsers(userList);
        });

        socket.on('users_updated', ({ users: userList, userCount: count }) => {
            setUsers(userList);
            setUserCount(count);
        });

        socket.on('error', ({ message }) => {
            setError(message);
        });

        return () => {
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('users_updated');
            socket.off('error');
        };
    }, [socket, joined]);

    // Auto-rejoin if existing session
    useEffect(() => {
        if (isExistingSession && sessionInfo && socket && !joined) {
            setUserName(sessionInfo.userName);
            setJoined(true);

            // Rejoin with existing session
            socket.emit('join_room', {
                roomCode,
                isHost: false,
                userName: sessionInfo.userName,
                location: sessionInfo.location
            });
        }
    }, [isExistingSession, sessionInfo, socket, joined, roomCode]);

    const joinRoom = async (e) => {
        e.preventDefault();
        setError('');

        // Prevent multiple accounts from same device
        if (isExistingSession) {
            setError('⚠️ You are already in this room! Only one account per device is allowed.');
            return;
        }

        try {
            // Get real location - REQUIRED for production
            const location = await getCurrentLocation();

            // Set up error listener before joining
            const handleJoinError = ({ message }) => {
                setError(message || 'Room not found. Please check the room code and try again.');
                setJoined(false);
                clearSession(); // Clear session on error
            };

            socket.once('join_error', handleJoinError);
            socket.once('room_not_found', () => {
                setError('Room not found. Please check the room code and try again.');
                setJoined(false);
                clearSession(); // Clear session on error
            });

            // Create session
            createSession(userName || 'Anonymous', location);

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
        <div className="min-h-screen p-3 sm:p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">OpenAux</h1>
                            <p className="text-sm sm:text-base text-white font-medium">Room: {roomCode}</p>
                        </div>
                    </div>

                    {/* User List Modal */}
                    <UserListModal users={users} userCount={userCount} />
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Left - Search */}
                    <div className="glass-card p-4 sm:p-6 order-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Add Songs</h2>
                        <SongSearch roomCode={roomCode} />
                    </div>

                    {/* Right - Queue */}
                    <div className="glass-card p-4 sm:p-6 order-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Queue</h2>
                        <QueueList roomCode={roomCode} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestView;
