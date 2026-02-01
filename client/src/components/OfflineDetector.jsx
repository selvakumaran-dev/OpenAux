import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineDetector = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showOfflineMessage, setShowOfflineMessage] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            console.log('✅ Back online');
            setIsOnline(true);
            setShowOfflineMessage(false);
        };

        const handleOffline = () => {
            console.log('❌ Gone offline');
            setIsOnline(false);
            setShowOfflineMessage(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Check initial status
        if (!navigator.onLine) {
            setShowOfflineMessage(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showOfflineMessage && isOnline) return null;

    return (
        <>
            {/* Offline Banner */}
            {!isOnline && (
                <div className="fixed bottom-0 left-0 right-0 bg-red-500/95 text-white px-4 py-3 z-50 shadow-2xl">
                    <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
                        <WifiOff className="w-6 h-6 animate-pulse" />
                        <div className="flex-1 text-center">
                            <p className="font-bold">You are offline</p>
                            <p className="text-sm text-white/90">
                                Please check your internet connection. Some features may not work.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Back Online Notification */}
            {isOnline && showOfflineMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-slide-up">
                    <div className="flex items-center gap-3">
                        <Wifi className="w-6 h-6" />
                        <div>
                            <p className="font-bold">Back online!</p>
                            <p className="text-sm text-white/90">Your connection has been restored.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OfflineDetector;
