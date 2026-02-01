import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/Logo';

const JoinRoom = () => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (roomCode.length === 6) {
            navigate(`/join/${roomCode.toUpperCase()}`);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length <= 6) {
            setRoomCode(value);
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
                    <p className="text-white text-lg">Join a Room</p>
                </div>

                {/* Join Form */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Enter Room Code</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Room Code
                            </label>
                            <input
                                type="text"
                                value={roomCode}
                                onChange={handleChange}
                                placeholder="ABC123"
                                className="input-field w-full text-center text-2xl tracking-widest uppercase"
                                maxLength={6}
                                autoFocus
                            />
                            <p className="text-gray-400 text-sm mt-2 text-center">
                                {roomCode.length}/6 characters
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={roomCode.length !== 6}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Join Room
                            <ArrowRight className="w-5 h-5 inline ml-2" />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="btn-secondary w-full"
                        >
                            Back to Home
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinRoom;
