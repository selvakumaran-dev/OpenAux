import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import YouTubePlayer from '../components/Host/YouTubePlayer';
import QRCodeDisplay from '../components/Host/QRCodeDisplay';
import RoomSettings from '../components/Host/RoomSettings';
import QueueList from '../components/Guest/QueueList';
import UserListModal from '../components/UserListModal';
import Logo from '../components/Logo';
import api from '../utils/api';

const HostDashboard = () => {
    const { roomCode } = useParams();
    const { socket } = useSocket();
    const [userCount, setUserCount] = useState(1);
    const [users, setUsers] = useState([]);
    const [roomSettings, setRoomSettings] = useState(null);

    useEffect(() => {
        if (!socket) return;

        // Join room as host
        socket.emit('join_room', {
            roomCode,
            isHost: true,
            userName: 'Host'
        });

        // Listen for user join/leave events
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

        // Fetch room settings
        fetchRoomSettings();

        return () => {
            socket.off('user_joined');
            socket.off('user_left');
            socket.off('users_updated');
        };
    }, [socket, roomCode]);

    const fetchRoomSettings = async () => {
        try {
            const response = await api.get(`/rooms/${roomCode}`);
            setRoomSettings(response.data.room.settings);
        } catch (error) {
            console.error('Failed to fetch room settings:', error);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            await api.put(`/rooms/${roomCode}/settings`, newSettings);
            setRoomSettings(newSettings);
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen p-3 sm:p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Logo className="w-10 h-10 sm:w-12 sm:h-12" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Host Dashboard</h1>
                            <p className="text-sm sm:text-base text-white font-medium">Room: {roomCode}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {/* User List Modal */}
                        <UserListModal users={users} userCount={userCount} />

                        {/* Settings */}
                        {roomSettings && (
                            <RoomSettings
                                roomCode={roomCode}
                                initialSettings={roomSettings}
                                onUpdate={updateSettings}
                            />
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Player & Queue */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* YouTube Player */}
                        <div className="aspect-video">
                            <YouTubePlayer roomCode={roomCode} />
                        </div>

                        {/* Queue */}
                        <div className="glass-card p-4 sm:p-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Queue</h2>
                            <QueueList roomCode={roomCode} />
                        </div>
                    </div>

                    {/* Right Column - QR Code */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-4">
                            <QRCodeDisplay roomCode={roomCode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;
