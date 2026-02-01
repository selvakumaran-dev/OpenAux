import { useState } from 'react';
import { Search, Loader, Plus, Check } from 'lucide-react';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';

const SongSearch = ({ roomCode }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addedSongs, setAddedSongs] = useState(new Set());
    const { socket } = useSocket();

    const searchSongs = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const response = await api.get('/songs/search', {
                params: { query, roomCode }
            });
            setResults(response.data.results);
        } catch (error) {
            console.error('Search error:', error);
            alert('Failed to search songs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addToQueue = (song) => {
        socket.emit('add_song', { roomCode, song });
        setAddedSongs(prev => new Set([...prev, song.youtubeId]));

        // Show success feedback
        setTimeout(() => {
            setAddedSongs(prev => {
                const newSet = new Set(prev);
                newSet.delete(song.youtubeId);
                return newSet;
            });
        }, 3000);
    };

    return (
        <div className="space-y-4">
            {/* Search Form */}
            <form onSubmit={searchSongs} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for songs..."
                    className="input-field w-full pl-12 pr-4"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4"
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Search'}
                </button>
            </form>

            {/* Search Results */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {loading ? (
                    // Skeleton Loading State
                    Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="glass-card p-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                {/* Skeleton Thumbnail */}
                                <div className="w-20 h-14 bg-gray-700 rounded-lg flex-shrink-0"></div>

                                {/* Skeleton Text */}
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-2 bg-gray-700 rounded w-1/4"></div>
                                </div>

                                {/* Skeleton Button */}
                                <div className="w-10 h-10 bg-gray-700 rounded-xl flex-shrink-0"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    results.map((song) => {
                        const isAdded = addedSongs.has(song.youtubeId);

                        return (
                            <div
                                key={song.youtubeId}
                                className="glass-card p-4 hover:bg-white/20 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Thumbnail */}
                                    <img
                                        src={song.thumbnail}
                                        alt={song.title}
                                        className="w-20 h-14 object-cover rounded-lg shadow-md flex-shrink-0"
                                    />

                                    {/* Song Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-white truncate">
                                            {song.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 truncate">
                                            {song.channelTitle}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {song.duration}
                                        </p>
                                    </div>

                                    {/* Add Button */}
                                    <button
                                        onClick={() => addToQueue(song)}
                                        disabled={isAdded}
                                        className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${isAdded
                                            ? 'bg-green-500 text-white'
                                            : 'bg-primary-500 hover:bg-primary-600 text-white hover:scale-105'
                                            }`}
                                    >
                                        {isAdded ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Plus className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {results.length === 0 && !loading && (
                <div className="text-center py-12 glass-card">
                    <Search className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-400">Search for songs to add to the queue</p>
                </div>
            )}
        </div>
    );
};

export default SongSearch;
