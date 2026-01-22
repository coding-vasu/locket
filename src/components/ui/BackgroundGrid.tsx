import { useEffect, useRef } from 'react';

export function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Grid configuration
    const gridSize = 50;
    let offset = 0;

    // Glowing orbs
    const orbs = [
      { x: 0.2, y: 0.3, radius: 200, color: 'rgba(99, 102, 241, 0.15)', speed: 0.3 },
      { x: 0.7, y: 0.6, radius: 250, color: 'rgba(168, 85, 247, 0.12)', speed: 0.2 },
      { x: 0.5, y: 0.8, radius: 180, color: 'rgba(236, 72, 153, 0.1)', speed: 0.25 },
    ];

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw animated grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = offset; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = offset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update offset for animation
      offset += 0.2;
      if (offset >= gridSize) {
        offset = 0;
      }

      // Draw glowing orbs
      orbs.forEach((orb, index) => {
        const orbX = canvas.width * orb.x + Math.sin(time * orb.speed + index) * 100;
        const orbY = canvas.height * orb.y + Math.cos(time * orb.speed + index) * 100;

        const gradient = ctx.createRadialGradient(
          orbX, orbY, 0,
          orbX, orbY, orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      time += 0.01;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
