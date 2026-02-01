import { useState } from 'react';
import { Users, X } from 'lucide-react';

const UserListModal = ({ users, userCount }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* User Count Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="glass-card px-4 py-2 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            >
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-400 group-hover:scale-110 transition-transform" />
                    <span className="text-white font-semibold">{userCount}</span>
                </div>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-primary-400" />
                                <h3 className="text-xl font-bold text-white">
                                    Active Users ({userCount})
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        {/* User List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-3">
                            {users && users.length > 0 ? (
                                users.map((user, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300"
                                    >
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                            {user.userName ? user.userName[0].toUpperCase() : '?'}
                                        </div>

                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-semibold truncate">
                                                {user.userName || 'Anonymous'}
                                            </p>
                                            <p className="text-gray-400 text-xs">
                                                {user.isHost ? '👑 Host' : '🎵 Guest'}
                                            </p>
                                        </div>

                                        {/* Online Indicator */}
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 mx-auto text-gray-600 mb-3" />
                                    <p className="text-gray-400">No users in the room</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full btn-primary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserListModal;
