import { useEffect, useRef } from 'react';

// Particle class with bigger deflection near the mouse
class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;

  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
  }

  update(mouseX: number, mouseY: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 170; // increased area of effect
    if (distance < maxDistance && mouseX !== -1 && mouseY !== -1) {
      // Stronger force, falls off with distance squared
      const force = (maxDistance - distance) / maxDistance;
      const deflect = Math.pow(force, 2) * 8; // more aggressive deflection
      this.x += (dx / (distance || 1)) * deflect;
      this.y += (dy / (distance || 1)) * deflect;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = window.innerWidth;
    if (this.x > window.innerWidth) this.x = 0;
    if (this.y < 0) this.y = window.innerHeight;
    if (this.y > window.innerHeight) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  // Start with mouse "not found" (-1,-1)
  const mousePosition = useRef({ x: -1, y: -1 });

  const particleCount = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mousePosition.current.x = -1;
      mousePosition.current.y = -1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw magnetic white "field" at cursor
      if (mousePosition.current.x !== -1 && mousePosition.current.y !== -1) {
        // Radial gradient: strong white near cursor, soft falloff
        const grad = ctx.createRadialGradient(
          mousePosition.current.x, mousePosition.current.y, 0,
          mousePosition.current.x, mousePosition.current.y, 180
        );
        grad.addColorStop(0, "rgba(255,255,255,0.28)");
        grad.addColorStop(0.12, "rgba(255,255,255,0.18)");
        grad.addColorStop(0.35, "rgba(255,255,255,0.09)");
        grad.addColorStop(0.85, "rgba(255,255,255,0.01)");
        grad.addColorStop(1, "rgba(255,255,255,0.00)");
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        ctx.arc(mousePosition.current.x, mousePosition.current.y, 180, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        ctx.restore();
      }

      // Draw particles
      particlesRef.current.forEach((particle) => {
        particle.update(mousePosition.current.x, mousePosition.current.y);
        particle.draw(ctx);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ inset: 0, width: "100vw", height: "100vh" }}
    />
  );
};

export default ParticlesBackground;
