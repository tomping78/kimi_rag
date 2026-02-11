import React, { useState } from 'react';

const Tooltip = ({ text, children, className = '', position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={`relative inline-flex items-center ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute left-1/2 transform -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none fade-in ${position === 'bottom'
                        ? 'top-full mt-2'
                        : 'bottom-full mb-2'
                    }`}>
                    {text}
                    {/* Arrow */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent ${position === 'bottom'
                            ? 'bottom-full border-b-zinc-800'
                            : 'top-full border-t-zinc-800'
                        }`}></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
