import { useState, useEffect } from 'react';

/**
 * Custom hook to manage guest sessions and prevent multiple accounts
 * from the same device in the same room
 */
export const useGuestSession = (roomCode) => {
    const [sessionInfo, setSessionInfo] = useState(null);
    const [isExistingSession, setIsExistingSession] = useState(false);

    const SESSION_KEY = `openaux_session_${roomCode}`;
    const DEVICE_ID_KEY = 'openaux_device_id';

    // Generate or get device ID
    const getDeviceId = () => {
        let deviceId = localStorage.getItem(DEVICE_ID_KEY);

        if (!deviceId) {
            // Create unique device ID
            deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }

        return deviceId;
    };

    // Check for existing session
    useEffect(() => {
        const existingSession = localStorage.getItem(SESSION_KEY);

        if (existingSession) {
            try {
                const session = JSON.parse(existingSession);
                setSessionInfo(session);
                setIsExistingSession(true);
            } catch (error) {
                console.error('Failed to parse session:', error);
                localStorage.removeItem(SESSION_KEY);
            }
        }
    }, [SESSION_KEY]);

    // Create new session
    const createSession = (userName, location) => {
        const session = {
            userName: userName || 'Anonymous',
            location,
            deviceId: getDeviceId(),
            joinedAt: new Date().toISOString(),
            roomCode
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        setSessionInfo(session);
        setIsExistingSession(true);

        return session;
    };

    // Clear session
    const clearSession = () => {
        localStorage.removeItem(SESSION_KEY);
        setSessionInfo(null);
        setIsExistingSession(false);
    };

    // Cleanup on unmount or page close
    useEffect(() => {
        const handleBeforeUnload = () => {
            clearSession();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return {
        sessionInfo,
        isExistingSession,
        createSession,
        clearSession,
        deviceId: getDeviceId()
    };
};

export default useGuestSession;
