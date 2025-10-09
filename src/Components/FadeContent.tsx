import { useRef, useEffect, useState, ReactNode } from "react";

interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  slide?: boolean;
  slideOffset?: number;
  duration?: number;
  easing?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  slide = false,
  slideOffset = 20,
  duration = 1000,
  easing = "ease-out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = "",
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // The observer will set the inView state, but the animation is controlled by CSS.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: "opacity, filter, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easing,
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : initialOpacity,
        transform: slide ? (inView ? "translateY(0)" : `translateY(${slideOffset}px)`) : "none",
        filter: blur ? (inView ? "blur(0px)" : "blur(10px)") : "none",
      }}>
      {children}
    </div>
  );
};

export default FadeContent;

/**
 * Call this function after the intro screen is finished to enable animations.
 */
export const enableAnimations = () => {
  document.body.classList.add("animations-enabled");
};