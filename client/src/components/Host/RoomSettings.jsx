import { useState } from 'react';
import { Settings, X, Plus, Trash2 } from 'lucide-react';

const RoomSettings = ({ roomCode, initialSettings, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [bannedKeywords, setBannedKeywords] = useState(initialSettings?.bannedKeywords || []);
    const [newKeyword, setNewKeyword] = useState('');
    const [geofenceRadius, setGeofenceRadius] = useState(initialSettings?.geofenceRadius || 100);

    const addKeyword = () => {
        if (newKeyword.trim() && !bannedKeywords.includes(newKeyword.toLowerCase())) {
            const updated = [...bannedKeywords, newKeyword.toLowerCase()];
            setBannedKeywords(updated);
            setNewKeyword('');
        }
    };

    const removeKeyword = (keyword) => {
        setBannedKeywords(bannedKeywords.filter(k => k !== keyword));
    };

    const saveSettings = async () => {
        try {
            await onUpdate({ bannedKeywords, geofenceRadius });
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    return (
        <>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="glass-card p-4 hover:bg-white/20 transition-all duration-300"
            >
                <Settings className="w-6 h-6 text-white" />
            </button>

            {/* Settings Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Room Settings</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Geofence Radius */}
                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">
                                Geofence Radius (meters)
                            </label>
                            <input
                                type="number"
                                value={geofenceRadius}
                                onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                                className="input-field w-full"
                                min="10"
                                max="1000"
                            />
                            <p className="text-gray-400 text-sm mt-1">
                                Guests must be within this distance to vote
                            </p>
                        </div>

                        {/* Banned Keywords */}
                        <div className="mb-6">
                            <label className="block text-white font-semibold mb-2">
                                Banned Keywords (Vibe Control)
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                                    placeholder="e.g., explicit, metal"
                                    className="input-field flex-1"
                                />
                                <button
                                    onClick={addKeyword}
                                    className="bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-xl transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Keywords List */}
                            <div className="space-y-2">
                                {bannedKeywords.length === 0 ? (
                                    <p className="text-gray-400 text-sm italic">No banned keywords</p>
                                ) : (
                                    bannedKeywords.map((keyword) => (
                                        <div
                                            key={keyword}
                                            className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2"
                                        >
                                            <span className="text-white">{keyword}</span>
                                            <button
                                                onClick={() => removeKeyword(keyword)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={saveSettings}
                            className="btn-primary w-full"
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoomSettings;
