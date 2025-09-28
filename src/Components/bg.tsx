import { useRef, useEffect, useState } from 'react';

// Particle class adapted from Particles.tsx
class Particle {
  x: number; y: number; size: number; speedX: number; speedY: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
  }

  update(mouseX: number, mouseY: number, width: number, height: number) {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 170;
    if (distance < maxDistance && mouseX !== -1 && mouseY !== -1) {
      const force = (maxDistance - distance) / maxDistance;
      const deflect = Math.pow(force, 2) * 8;
      this.x += (dx / (distance || 1)) * deflect;
      this.y += (dy / (distance || 1)) * deflect;
    }
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

interface ParticlesProps {
  followMouse?: boolean;
  className?: string;
  showParticles?: boolean;
  particleCount?: number;
}

const Background: React.FC<ParticlesProps> = ({
  followMouse = true,
  className = '',
  showParticles = true,
  particleCount = 60,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1, y: -1, normalizedX: 0.5, normalizedY: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Refs for particle effect
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    // --- Particle Initialization ---
    const container = containerRef.current;

    const initParticles = () => {
      if (!showParticles) return;
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%;';
      container.appendChild(canvas);
      particleCanvasRef.current = canvas;
      particleCtxRef.current = canvas.getContext('2d');
    };

    initParticles();

    const updatePlacement = () => {
      if (!containerRef.current) return;
      const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;

      if (showParticles && particleCanvasRef.current && particleCtxRef.current) {
        particleCanvasRef.current.width = wCSS;
        particleCanvasRef.current.height = hCSS;
        particlesRef.current = Array.from({ length: particleCount }, () => new Particle(wCSS, hCSS));
      }
    };

    const animateParticles = () => {
      if (!showParticles || !particleCtxRef.current || !particleCanvasRef.current) return;
      const pCanvas = particleCanvasRef.current;
      const pCtx = particleCtxRef.current;
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

      if (mouseRef.current.x !== -1) {
        const grad = pCtx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 180
        );
        grad.addColorStop(0, "rgba(255,255,255,0.28)");
        grad.addColorStop(0.12, "rgba(255,255,255,0.18)");
        grad.addColorStop(0.35, "rgba(255,255,255,0.09)");
        grad.addColorStop(0.85, "rgba(255,255,255,0.01)");
        grad.addColorStop(1, "rgba(255,255,255,0.00)");
        pCtx.fillStyle = grad;
        pCtx.beginPath();
        pCtx.arc(mouseRef.current.x, mouseRef.current.y, 180, 0, 2 * Math.PI);
        pCtx.fill();
      }

      particlesRef.current.forEach((p) => {
        p.update(mouseRef.current.x, mouseRef.current.y, pCanvas.width, pCanvas.height);
        p.draw(pCtx);
      });
    };

    const loop = () => {
      animateParticles();
      animationIdRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', updatePlacement);
    updatePlacement();
    animationIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', updatePlacement);

      // Clear container
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Reset refs
      particleCanvasRef.current = null;
      particleCtxRef.current = null;
      particlesRef.current = [];
    };
  }, [isVisible, showParticles, particleCount]);

  // Effect for mouse listeners
  useEffect(() => {
    const container = containerRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        normalizedX: (e.clientX - rect.left) / rect.width,
        normalizedY: (e.clientY - rect.top) / rect.height,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1;
      mouseRef.current.y = -1;
    };

    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove);
      container?.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        container?.removeEventListener('mouseleave', handleMouseLeave);
      }
    }
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`.trim()}
    />
  );
};

export default Background;
