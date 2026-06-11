import React from 'react';
import { motion } from 'framer-motion';

interface SliceProps {
    index: number;
    total: number;
    separated: boolean;
    color?: string;
    radius?: number;
}

const PizzaSlice: React.FC<SliceProps> = ({ index, total, separated, color = '#f59e0b', radius = 100 }) => {
    // Calculate angles
    const anglePerSlice = 360 / total;
    const startAngle = index * anglePerSlice;
    const endAngle = (index + 1) * anglePerSlice;

    // Convert polar to cartesian
    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    const center = { x: 100, y: 100 };
    const start = polarToCartesian(center.x, center.y, radius, endAngle);
    const end = polarToCartesian(center.x, center.y, radius, startAngle);
    const largeArcFlag = anglePerSlice <= 180 ? "0" : "1";

    // Build the SVG path for a slice
    let d = `M ${center.x} ${center.y}`;
    if (total === 1) {
        d = `M ${center.x}, ${center.y - radius} A ${radius},${radius} 0 1,1 ${center.x - 0.1},${center.y - radius} Z`;
    } else if (total === 2) {
        if (index === 0) d = `M ${center.x} ${center.y - radius} A ${radius} ${radius} 0 0 1 ${center.x} ${center.y + radius} Z`;
        else d = `M ${center.x} ${center.y + radius} A ${radius} ${radius} 0 0 1 ${center.x} ${center.y - radius} Z`;
    } else {
        d = [
            "M", center.x, center.y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    }

    // Calculate direction to push the slice when separated
    const midAngle = startAngle + (anglePerSlice / 2);
    const pushDist = separated ? 15 : 0;

    const angleInRadians = (midAngle - 90) * Math.PI / 180.0;
    const targetX = pushDist * Math.cos(angleInRadians);
    const targetY = pushDist * Math.sin(angleInRadians);

    return (
        <motion.g
            initial={{ x: 0, y: 0 }}
            animate={{ x: targetX, y: targetY }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            <path
                d={d}
                fill={color}
                stroke="#d97706"
                strokeWidth="3"
                strokeLinejoin="round"
            />
            {/* Pepperoni details for charm */}
            {total <= 4 && (
                <>
                    <circle cx={center.x + (radius / 2) * Math.cos((midAngle - 15 - 90) * Math.PI / 180)} cy={center.y + (radius / 2) * Math.sin((midAngle - 15 - 90) * Math.PI / 180)} r="8" fill="#b91c1c" opacity="0.8" />
                    <circle cx={center.x + (radius / 1.4) * Math.cos((midAngle + 15 - 90) * Math.PI / 180)} cy={center.y + (radius / 1.4) * Math.sin((midAngle + 15 - 90) * Math.PI / 180)} r="6" fill="#b91c1c" opacity="0.8" />
                </>
            )}
        </motion.g>
    );
};

export interface LivePizzaProps {
    parts: number;
    separated?: boolean;
    className?: string;
}

export const LivePizza: React.FC<LivePizzaProps> = ({ parts, separated = false, className = "w-64 h-64" }) => {
    return (
        <div className={`relative ${className}`}>
            <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-xl">
                {Array.from({ length: Math.max(1, parts) }).map((_, i) => (
                    <PizzaSlice
                        key={i}
                        index={i}
                        total={Math.max(1, parts)}
                        separated={separated}
                    />
                ))}
            </svg>
        </div>
    );
};
