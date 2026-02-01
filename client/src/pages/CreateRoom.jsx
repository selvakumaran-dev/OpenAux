import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Loader } from 'lucide-react';
import api from '../utils/api';
import { getCurrentLocation } from '../utils/geolocation';
import Logo from '../components/Logo';

const CreateRoom = () => {
    const [hostName, setHostName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const createRoom = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Get real location - REQUIRED for production
            const location = await getCurrentLocation();

            const response = await api.post('/rooms', {
                hostName: hostName || 'Anonymous Host',
                location,
                settings: {
                    bannedKeywords: [],
                    geofenceRadius: 100,
                    maxQueueSize: 50
                }
            });

            const { roomCode } = response.data.room;
            navigate(`/host/${roomCode}`);
        } catch (error) {
            console.error('Create room error:', error);
            if (error.message.includes('location') || error.message.includes('Location')) {
                setError('Location access is required to create a room. Please enable location permissions in your browser.');
            } else {
                setError(error.message || 'Failed to create room. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <Logo className="w-20 h-20" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-3">
                        OpenAux
                    </h1>
                    <p className="text-white text-lg">Democratic Jukebox</p>
                </div>

                {/* Create Room Form */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Create a Room</h2>

                    <form onSubmit={createRoom} className="space-y-4">
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Your Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={hostName}
                                onChange={(e) => setHostName(e.target.value)}
                                placeholder="Enter your name"
                                className="input-field w-full"
                                maxLength={50}
                            />
                        </div>

                        {/* Location Notice */}
                        <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-white mb-1">
                                        Location Required
                                    </p>
                                    <p className="text-xs text-gray-300">
                                        Guests must be within 100m to vote
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Create Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin inline mr-2" />
                                    Creating Room...
                                </>
                            ) : (
                                'Create Room'
                            )}
                        </button>

                        {/* Join Button */}
                        <button
                            type="button"
                            onClick={() => navigate('/join')}
                            className="btn-secondary w-full"
                        >
                            Join as Guest
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRoom;
