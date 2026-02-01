import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import YouTubePlayer from '../components/Host/YouTubePlayer';
import QRCodeDisplay from '../components/Host/QRCodeDisplay';
import RoomSettings from '../components/Host/RoomSettings';
import QueueList from '../components/Guest/QueueList';
import { Users } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../utils/api';

const HostDashboard = () => {
    const { roomCode } = useParams();
    const { socket } = useSocket();
    const [userCount, setUserCount] = useState(1);
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
        socket.on('user_joined', ({ userCount: count }) => {
            setUserCount(count);
        });

        socket.on('user_left', ({ userCount: count }) => {
            setUserCount(count);
        });

        // Fetch room settings
        fetchRoomSettings();

        return () => {
            socket.off('user_joined');
            socket.off('user_left');
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
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Logo className="w-12 h-12" />
                        <div>
                            <h1 className="text-3xl font-bold text-white">Host Dashboard</h1>
                            <p className="text-white font-medium">Room: {roomCode}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User Count */}
                        <div className="glass-card px-4 py-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-400" />
                            <span className="text-white font-semibold">{userCount}</span>
                        </div>

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
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Player & QR Code */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* YouTube Player */}
                        <div className="aspect-video">
                            <YouTubePlayer roomCode={roomCode} />
                        </div>

                        {/* Queue */}
                        <div className="glass-card p-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Queue</h2>
                            <QueueList roomCode={roomCode} />
                        </div>
                    </div>

                    {/* Right Column - QR Code */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            <QRCodeDisplay roomCode={roomCode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HostDashboard;
