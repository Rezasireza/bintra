import React, { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AnimatedGridPatternProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeDasharray?: any;
    numSquares?: number;
    maxOpacity?: number;
    duration?: number;
    repeatDelay?: number;
    className?: string;
}

export default function AnimatedGridPattern({
    width = 32,
    height = 32,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    numSquares = 60,
    className,
    maxOpacity = 0.25,
    duration = 3,
    repeatDelay = 0.8,
    ...props
}: AnimatedGridPatternProps) {
    const id = useId();
    const [squareSpecs, setSquareSpecs] = useState<Array<{ id: number; x: number; y: number }>>([]);

    // Generate random squares on mount (client-side only to match "use client" behavior in Next/Vite)
    useEffect(() => {
        // Calculate how many squares to show based on window size roughly or just standard grid
        // For simplicity and performance, we'll just pick random positions
        // assuming a reasonably large grid canvas.
        // In a real resize observer scenario we might update, but a static set is fine for background.

        // We'll generate squares within a reasonable coordinate range. 
        // Since it's a repeating pattern, we need to pick x/y coordinates that align with the grid width/height.
        // We'll pick random indices.

        const specs = [];
        for (let i = 0; i < numSquares; i++) {
            specs.push({
                id: i,
                x: Math.floor(Math.random() * 20), // Random grid column index
                y: Math.floor(Math.random() * 20), // Random grid row index
            });
        }
        setSquareSpecs(specs);
    }, [numSquares]);


    return (
        <svg
            viewBox="0 0 100% 100%" // This might need adjustment based on container, but typical for full coverage
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/20 stroke-gray-400/40",
                className
            )}
            {...props}
        >
            <defs>
                <pattern
                    id={id}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x={x}
                    y={y}
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                    />
                </pattern>
            </defs>

            {/* Base Grid Lines */}
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />

            {/* Animated Squares */}
            <svg x={x} y={y} className="overflow-visible">
                {squareSpecs.map((spec) => (
                    <motion.rect
                        key={`${spec.id}-${spec.x}-${spec.y}`}
                        strokeWidth="0"
                        width={width - 1}
                        height={height - 1}
                        x={spec.x * width + 1}
                        y={spec.y * height + 1}
                        fill="currentColor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: maxOpacity }}
                        transition={{
                            duration,
                            repeat: Infinity,
                            delay: Math.random() * 2.5, // Random initial delay
                            repeatType: "reverse",
                            repeatDelay: Math.random() * repeatDelay + 0.2, // Random repeat delay
                        }}
                    />
                ))}
            </svg>
        </svg>
    );
}
