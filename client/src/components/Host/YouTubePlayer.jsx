import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';

const YouTubePlayer = ({ roomCode }) => {
    const playerRef = useRef(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const { socket } = useSocket();

    // Load YouTube IFrame API
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            setIsPlayerReady(true);
        };
    }, []);

    // Initialize player when API is ready
    useEffect(() => {
        if (!isPlayerReady || !currentSong) return;

        playerRef.current = new window.YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: currentSong.youtubeId,
            playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onStateChange: onPlayerStateChange
            }
        });

        return () => {
            if (playerRef.current && playerRef.current.destroy) {
                playerRef.current.destroy();
            }
        };
    }, [isPlayerReady, currentSong]);

    // Handle player state changes
    const onPlayerStateChange = (event) => {
        // YT.PlayerState.ENDED = 0
        if (event.data === 0) {
            console.log('Song ended, requesting next song...');
            socket.emit('song_ended', {
                roomCode,
                songId: currentSong._id
            });
        }
    };

    // Listen for next song from server
    useEffect(() => {
        if (!socket) return;

        socket.on('play_next_song', ({ song }) => {
            console.log('Playing next song:', song.title);
            setCurrentSong(song);
        });

        socket.on('queue_empty', () => {
            console.log('Queue is empty');
            setCurrentSong(null);
        });

        return () => {
            socket.off('play_next_song');
            socket.off('queue_empty');
        };
    }, [socket]);

    return (
        <div className="w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl">
            {currentSong ? (
                <div className="relative w-full h-full">
                    <div id="youtube-player" className="w-full h-full"></div>

                    {/* Now Playing Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-primary-400 text-sm font-medium mb-1">Now Playing</p>
                                <h3 className="text-white text-2xl font-bold truncate mb-2">
                                    {currentSong.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <span className="text-green-400">👤</span>
                                        {currentSong.addedBy}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <span className="text-primary-400">🔥</span>
                                        {currentSong.votes} votes
                                    </span>
                                </div>
                            </div>
                            <div className="animate-pulse-slow">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                                    <span className="text-3xl">🎵</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-dark-800 to-dark-900">
                    <div className="text-center p-8">
                        <div className="text-8xl mb-6 animate-bounce-slow">🎵</div>
                        <h3 className="text-white text-3xl font-bold mb-3">Queue is Empty</h3>
                        <p className="text-gray-400 text-lg">Waiting for guests to add songs...</p>
                        <div className="mt-6 flex justify-center gap-2">
                            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse delay-75"></div>
                            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YouTubePlayer;
