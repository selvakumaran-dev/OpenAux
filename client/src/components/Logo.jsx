const Logo = ({ className = "w-12 h-12" }) => {
    return (
        <div className={`${className} relative`}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl"
            >
                {/* Gradient Definitions */}
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f9ac12" />
                        <stop offset="50%" stopColor="#f57c05" />
                        <stop offset="100%" stopColor="#ff6b35" />
                    </linearGradient>

                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.2" />
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer glow circle */}
                <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" opacity="0.3" />

                {/* Main background circle */}
                <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" filter="url(#glow)" />

                {/* Waveform + Arrow Design */}
                <g transform="translate(50, 50)" filter="url(#glow)">
                    {/* Waveform that transforms into upward arrow */}
                    <path
                        d="M -25 5 L -20 5 Q -18 5 -17 0 L -15 -8 Q -14 -12 -12 -8 L -10 0 Q -9 5 -7 5 L -2 5 Q 0 5 2 0 L 8 -15 L 14 0 Q 16 5 18 5 L 20 5"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        opacity="0.9"
                    />

                    {/* Upward arrow */}
                    <path
                        d="M 8 -15 L 8 -25 M 8 -25 L 3 -20 M 8 -25 L 13 -20"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                    />

                    {/* Accent dots for rhythm */}
                    <circle cx="-20" cy="8" r="1.5" fill="white" opacity="0.7" />
                    <circle cx="-10" cy="8" r="1.5" fill="white" opacity="0.7" />
                    <circle cx="0" cy="8" r="1.5" fill="white" opacity="0.7" />
                    <circle cx="18" cy="8" r="1.5" fill="white" opacity="0.7" />
                </g>
            </svg>
        </div>
    );
};

export default Logo;
