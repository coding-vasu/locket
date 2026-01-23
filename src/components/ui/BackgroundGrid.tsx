import { useEffect, useRef } from 'react';

export function BackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Update dimensions
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw static grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      // Vertical lines
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw static orbs (simplified from previous animation)
      const orbs = [
        { x: 0.2, y: 0.3, radius: 200, color: 'rgba(99, 102, 241, 0.15)' },
        { x: 0.7, y: 0.6, radius: 250, color: 'rgba(168, 85, 247, 0.12)' },
        { x: 0.5, y: 0.8, radius: 180, color: 'rgba(236, 72, 153, 0.1)' },
      ];

      orbs.forEach((orb) => {
        const orbX = width * orb.x;
        const orbY = height * orb.y;

        const gradient = ctx.createRadialGradient(
          orbX, orbY, 0,
          orbX, orbY, orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });
    };

    // Initial draw
    draw();

    // Re-draw on resize
    const resizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(draw);
    });
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
