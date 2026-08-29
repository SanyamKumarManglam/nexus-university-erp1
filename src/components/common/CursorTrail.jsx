import React, { useEffect, useRef } from 'react';

export function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer:fine)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let w, h, dpr;
    let points = [];
    let mouse = { x: -999, y: -999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onPointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      points.push({
        x: mouse.x,
        y: mouse.y,
        life: 1,
        size: 20 + Math.random() * 18
      });
      if (points.length > 28) points.shift();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.life *= 0.92;
        p.size *= 0.985;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, `rgba(0, 210, 255, ${p.life * 0.28})`);
        g.addColorStop(0.4, `rgba(124, 58, 237, ${p.life * 0.12})`);
        g.addColorStop(1, 'rgba(0, 80, 255, 0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      points = points.filter((p) => p.life > 0.03);

      if (mouse.x > -100) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        g.addColorStop(0, 'rgba(180, 245, 255, 0.12)');
        g.addColorStop(0.3, 'rgba(60, 180, 255, 0.05)');
        g.addColorStop(1, 'rgba(0, 90, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="cursorTrail" ref={canvasRef} aria-hidden="true" />;
}
