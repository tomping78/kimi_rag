import React, { useEffect, useRef } from 'react';

const Hologram = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const cx = size / 2;
        const cy = size / 2;

        let animationFrameId;
        let time = 0;

        // Configuration for the blobs
        const blobs = [
            { color: 'rgba(30, 58, 138, 0.4)', speed: 0.02, radius: 60, complexity: 3 }, // Blue 900
            { color: 'rgba(37, 99, 235, 0.5)', speed: 0.03, radius: 55, complexity: 4 }, // Blue 600
            { color: 'rgba(96, 165, 250, 0.3)', speed: 0.015, radius: 65, complexity: 2 }, // Blue 400
        ];

        const drawBlob = (blob, t) => {
            ctx.fillStyle = blob.color;
            ctx.beginPath();

            // Optimize: Draw fewer segments (every 5 degrees instead of 1)
            // 360 / 5 = 72 segments, visually similar but much faster
            const step = 5;
            for (let i = 0; i <= 360; i += step) {
                const angle = (i * Math.PI) / 180;

                // Create organic distortion
                // Multiple sine waves to create randomness
                const distortion =
                    Math.sin(angle * blob.complexity + t * blob.speed) * 5 +
                    Math.cos(angle * (blob.complexity + 1) - t * blob.speed * 0.8) * 5 +
                    Math.sin(angle * 2 + t * 2) * 2;

                const r = blob.radius + distortion;

                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);

                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        };

        const animate = () => {
            ctx.clearRect(0, 0, size, size);
            time += 1;

            // Use blend mode for "glowing/mixing" effect
            ctx.globalCompositeOperation = 'multiply'; // distinct layers in light mode

            blobs.forEach(blob => {
                drawBlob(blob, time);
            });

            // Reset blend mode
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup function to prevent zombie loops
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
            {/* Soft Ambient Glow */}
            <div className="absolute inset-0 bg-blue-300 opacity-30 blur-3xl rounded-full animate-pulse"></div>
            <canvas ref={canvasRef} className="relative z-10" />
        </div>
    );
};

export default Hologram;
