import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10, // Increased from 5
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
            autoConnect: true
        });

        // Connection successful
        newSocket.on('connect', () => {
            console.log('✅ Socket connected:', newSocket.id);
            setConnected(true);
            setReconnecting(false);
            setConnectionError(null);
        });

        // Disconnected
        newSocket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
            setConnected(false);

            if (reason === 'io server disconnect') {
                // Server forcefully disconnected, reconnect manually
                newSocket.connect();
            }
        });

        // Connection error
        newSocket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
            setConnectionError(error.message);
            setConnected(false);
        });

        // Reconnection attempt
        newSocket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
            setReconnecting(true);
        });

        // Reconnection successful
        newSocket.on('reconnect', (attemptNumber) => {
            console.log(`✅ Reconnected successfully after ${attemptNumber} attempts`);
            setConnected(true);
            setReconnecting(false);
            setConnectionError(null);
        });

        // Reconnection failed
        newSocket.on('reconnect_failed', () => {
            console.error('❌ Reconnection failed after maximum attempts');
            setReconnecting(false);
            setConnectionError('Failed to connect to server. Please refresh the page.');
        });

        // General error
        newSocket.on('error', (error) => {
            console.error('❌ Socket error:', error);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Connection status indicator (optional - can be used in UI)
    const connectionStatus = {
        connected,
        reconnecting,
        error: connectionError
    };

    return (
        <SocketContext.Provider value={{ socket, ...connectionStatus }}>
            {/* Connection Status Banner */}
            {reconnecting && (
                <div className="fixed top-0 left-0 right-0 bg-yellow-500/90 text-white px-4 py-2 text-center z-50 animate-pulse">
                    🔄 Reconnecting to server...
                </div>
            )}
            {connectionError && !reconnecting && (
                <div className="fixed top-0 left-0 right-0 bg-red-500/90 text-white px-4 py-2 text-center z-50">
                    ❌ Connection error: {connectionError}
                    <button
                        onClick={() => window.location.reload()}
                        className="ml-4 underline hover:no-underline"
                    >
                        Refresh Page
                    </button>
                </div>
            )}
            {children}
        </SocketContext.Provider>
    );
};
