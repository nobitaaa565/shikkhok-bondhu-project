import React from 'react';
import { motion } from 'framer-motion';

export interface LiveChocolateProps {
    // A 2x3 grid of chocolate squares (6 pieces total)
    // Which pieces have flown away to their targets
    flownPieces: number[];
    className?: string;
}

export const LiveChocolate: React.FC<LiveChocolateProps> = ({ flownPieces, className = "w-48 h-32" }) => {
    // 2 rows, 3 columns
    const pieces = [
        { id: 0, x: 0, y: 0 },
        { id: 1, x: 60, y: 0 },
        { id: 2, x: 120, y: 0 },
        { id: 3, x: 0, y: 60 },
        { id: 4, x: 60, y: 60 },
        { id: 5, x: 120, y: 60 },
    ];

    return (
        <div className={`relative ${className}`}>
            <svg viewBox="0 0 180 120" className="w-full h-full overflow-visible drop-shadow-lg">
                {pieces.map((p) => {
                    const hasFlown = flownPieces.includes(p.id);
                    // If it has flown, we animate it flying down and fading out (or moving towards an avatar target if we wanted to pass in targets)
                    const targetY = hasFlown ? p.y + 200 : p.y;
                    const targetX = hasFlown ? p.x + (p.id % 2 === 0 ? -100 : 100) : p.x;
                    const targetOpacity = hasFlown ? 0 : 1;

                    return (
                        <motion.g
                            key={p.id}
                            initial={{ x: p.x, y: p.y, opacity: 1 }}
                            animate={{ x: targetX, y: targetY, opacity: targetOpacity }}
                            transition={{ type: "spring", stiffness: 60, damping: 12 }}
                        >
                            {/* Main block */}
                            <rect
                                width="56"
                                height="56"
                                rx="6"
                                fill="#78350f"
                                stroke="#451a03"
                                strokeWidth="2"
                            />
                            {/* Inner indent for chocolate look */}
                            <rect
                                x="6"
                                y="6"
                                width="44"
                                height="44"
                                rx="4"
                                fill="#92400e"
                            />
                        </motion.g>
                    );
                })}
            </svg>
        </div>
    );
};
