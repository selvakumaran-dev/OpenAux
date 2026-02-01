import { useState } from 'react';
import QRCode from 'qrcode.react';
import { Copy, Check } from 'lucide-react';

const QRCodeDisplay = ({ roomCode }) => {
    const [copiedCode, setCopiedCode] = useState(false);
    const roomUrl = `${window.location.origin}/join/${roomCode}`;

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    return (
        <div className="glass-card">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
                Share Room
            </h3>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl mb-6 flex justify-center shadow-xl">
                <QRCode
                    value={roomUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                />
            </div>

            {/* Room Code with Copy Button */}
            <div className="text-center">
                <p className="text-white text-sm mb-3 font-bold uppercase tracking-wide">Room Code</p>
                <div
                    onClick={copyRoomCode}
                    className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white text-4xl font-black py-4 px-8 rounded-2xl tracking-[0.3em] cursor-pointer hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-primary-500/50 relative overflow-hidden group"
                >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                    <span className="relative z-10">{roomCode}</span>
                    {copiedCode ? (
                        <Check className="w-8 h-8 animate-bounce relative z-10" />
                    ) : (
                        <Copy className="w-7 h-7 opacity-70 group-hover:opacity-100 transition-opacity relative z-10" />
                    )}
                </div>
                <p className="text-primary-200 text-sm mt-3 font-semibold">
                    {copiedCode ? '✓ Copied to clipboard!' : 'Tap to copy code'}
                </p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-gray-300 text-xs text-center">
                    🎯 Guests must be within 100m to vote
                </p>
            </div>
        </div>
    );
};

export default QRCodeDisplay;

