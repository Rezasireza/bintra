import React from 'react';

const SkewedRectanglesBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none h-full w-full">
            {/* Skewed Grid Layer */}
            <div
                className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%]"
                style={{
                    transform: 'skewY(-12deg) rotate(-5deg) scale(1.2)',
                    backgroundImage: `
            repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 1px, transparent 30px),
            repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, transparent 1px, transparent 30px)
          `,
                    opacity: 0.15,
                }}
            />

            {/* Vignette / Mask to fade edges */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, white 90%)',
                    mixBlendMode: 'lighten'
                }}
            />

            {/* Additional soft fade for top/bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/60" />
        </div>
    );
};

export default SkewedRectanglesBackground;
