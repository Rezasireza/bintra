import React, { useState, useEffect } from 'react';

interface TypewriterHeadlineProps {
    line1: string;
    line2: string;
    className?: string;       // Applied to the container h1
    line2ClassName?: string;  // Applied to the second line span
    speed?: number;           // Typing speed in ms (default 35)
    startDelay?: number;      // Initial delay before typing starts (default 150)
}

const TypewriterHeadline: React.FC<TypewriterHeadlineProps> = ({
    line1,
    line2,
    className = "",
    line2ClassName = "",
    speed = 35,
    startDelay = 150
}) => {
    const [displayedLine1, setDisplayedLine1] = useState('');
    const [displayedLine2, setDisplayedLine2] = useState('');
    const [hasStartedLine2, setHasStartedLine2] = useState(false);

    useEffect(() => {
        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            setDisplayedLine1(line1);
            setDisplayedLine2(line2);
            setHasStartedLine2(true);
            return;
        }

        let timeoutId: NodeJS.Timeout;

        const startTyping = () => {
            let current1 = '';
            let current2 = '';
            let index1 = 0;
            let index2 = 0;

            const typeChar = () => {
                if (index1 < line1.length) {
                    // Typing Line 1
                    current1 += line1[index1];
                    setDisplayedLine1(current1);
                    index1++;
                    timeoutId = setTimeout(typeChar, speed);
                } else if (index2 < line2.length) {
                    // Typing Line 2
                    setHasStartedLine2(true);
                    current2 += line2[index2];
                    setDisplayedLine2(current2);
                    index2++;
                    timeoutId = setTimeout(typeChar, speed);
                } else {
                    // Done
                    setHasStartedLine2(true);
                }
            };

            // Initial delay
            timeoutId = setTimeout(typeChar, startDelay);
        };

        startTyping();

        return () => clearTimeout(timeoutId);
    }, [line1, line2, speed, startDelay]);

    // Derive cursor states
    const isLine1Done = displayedLine1.length === line1.length;

    // Custom cursor style for the blinking caret
    const cursorStyle: React.CSSProperties = {
        display: 'inline-block',
        width: '0.1em',        // Responsive width relative to font-size
        minWidth: '2px',
        height: '0.85em',      // Height slightly less than line-height
        backgroundColor: 'currentColor',
        marginLeft: '0.1em',
        verticalAlign: 'baseline',
        animation: 'typewriter-blink 1s step-end infinite',
        marginBottom: '-0.1em' // Adjustment for baseline alignment
    };

    return (
        <h1 className={`${className} relative`} aria-label={`${line1} ${line2}`}>
            {/* Invisible Phantom Text to reserve layout space and prevent shifts */}
            <span className="invisible select-none" aria-hidden="true">
                {line1}
                <br />
                <span className={line2ClassName}>{line2}</span>
            </span>

            {/* Visible Typing Overlay */}
            <span className="absolute top-0 left-0 w-full h-full text-left">
                {displayedLine1}
                {/* Cursor for Line 1 - Only show if line 1 is NOT done */}
                {!isLine1Done && (
                    <span style={cursorStyle} aria-hidden="true" />
                )}

                <br />

                <span className={line2ClassName}>
                    {displayedLine2}
                    {/* Cursor for Line 2 - Only show if line 1 IS done */}
                    {isLine1Done && (
                        <span style={cursorStyle} aria-hidden="true" />
                    )}
                </span>
            </span>

            {/* Global style injection for the keyframes (efficient for single usage) */}
            <style>{`
        @keyframes typewriter-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </h1>
    );
};

export default TypewriterHeadline;
