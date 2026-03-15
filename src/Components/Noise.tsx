import React, { useRef, useEffect } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  className?: string;
}

const Noise: React.FC<NoiseProps> = ({
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className = ''
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId: number;

    const canvasSize = 256; // Using a smaller canvas size for performance

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame = (frame + 1) % patternRefreshInterval;
      animationId = window.requestAnimationFrame(loop);
    };

    resize();
    loop();

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      className={`pointer-events-none fixed top-0 left-0 h-screen w-screen opacity-50 ${className}`}
      ref={grainRef}
      style={{
        imageRendering: 'pixelated',
        zIndex: 100, // High z-index to overlay everything
      }}
    />
  );
};

export default Noise;