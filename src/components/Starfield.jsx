import React, { useEffect, useRef } from 'react';

const Starfield = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Set initial size
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Initialize stars
        const stars = Array.from({ length: 400 }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5,
            opacity: Math.random(),
            speed: Math.random() * 0.2 + 0.05,
            oscillation: Math.random() * 0.5 // For slight horizontal movement
        }));

        let animationFrameId;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            stars.forEach(star => {
                // Draw star
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Update position (move up slowly like bubbles/space dust)
                star.y -= star.speed;

                // Reset if out of bounds
                if (star.y < 0) {
                    star.y = height;
                    star.x = Math.random() * width;
                    star.opacity = Math.random();
                }

                // Slight twinkle effect
                star.opacity += (Math.random() - 0.5) * 0.02;
                if (star.opacity > 1) star.opacity = 1;
                if (star.opacity < 0.1) star.opacity = 0.1;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-black"
        />
    );
};

export default Starfield;
