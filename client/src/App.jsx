import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import CreateRoom from './pages/CreateRoom';
import HostDashboard from './pages/HostDashboard';
import GuestView from './pages/GuestView';
import JoinRoom from './pages/JoinRoom';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineDetector from './components/OfflineDetector';

function App() {
    return (
        <ErrorBoundary>
            <SocketProvider>
                <OfflineDetector />
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Routes>
                        <Route path="/" element={<CreateRoom />} />
                        <Route path="/join" element={<JoinRoom />} />
                        <Route path="/host/:roomCode" element={<HostDashboard />} />
                        <Route path="/join/:roomCode" element={<GuestView />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </BrowserRouter>
            </SocketProvider>
        </ErrorBoundary>
    );
}

export default App;
