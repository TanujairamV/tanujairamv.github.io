import React, { useEffect, useRef, useState } from "react";

// Helpers
function isSpecialTile(el: Element | null): boolean {
  return !!el && !!el.closest(".certificate-tile, .project-tile");
}

function isClickable(el: Element | null): boolean {
  if (!el) return false;
  const clickableTags = ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "SUMMARY", "LABEL"];
  let curr: Element | null = el;
  while (curr) {
    if (clickableTags.includes(curr.tagName)) return true;
    if (curr.getAttribute("tabindex") && curr.getAttribute("tabindex") !== "-1") return true;
    if ((curr as HTMLElement).onclick || (curr as HTMLElement).onmousedown) return true;
    if (curr.classList.contains("cursor-pointer")) return true;
    if (curr.classList.contains("certificate-tile") || curr.classList.contains("project-tile")) return true;
    if (curr.closest("a,button,[role=button],.cursor-pointer")) return true;
    curr = curr.parentElement;
  }
  return false;
}

const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  const [shouldShow, setShouldShow] = useState(false);
  const [showView, setShowView] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0, scale: 1 });
  const animationFrame = useRef<number>();

  useEffect(() => {
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0);

    setShouldShow(!isTouch);

    const handleTouch = () => setShouldShow(false);
    const handleMouse = () => setShouldShow(true);

    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("mousemove", handleMouse);

    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      const isHovering = ringRef.current?.classList.contains("cursor-hover");
      const targetScale = isHovering ? 1.4 : 1;

      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.2);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.2);
      ring.current.scale = lerp(ring.current.scale, targetScale, 0.2);

      if (ringRef.current) {
        // Center the 50px ring on the cursor and apply scale
        const transform = `translate3d(${ring.current.x - 25}px, ${ring.current.y - 25}px, 0) scale(${ring.current.scale})`;
        ringRef.current.style.transform = transform;
        ringRef.current.style.opacity = showView || !isCursorVisible ? "0" : "1";
      }

      if (viewRef.current) {
        viewRef.current.style.transform = `translate3d(${ring.current.x - 48}px, ${ring.current.y - 24}px, 0)`;
        viewRef.current.style.opacity = showView && isCursorVisible ? "1" : "0";
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [shouldShow, showView, isCursorVisible]);

  useEffect(() => {
    if (!shouldShow) return;

    const handleMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
        dotRef.current.style.opacity = isCursorVisible ? "1" : "0";
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      setShowView(isSpecialTile(el));

      if (ringRef.current) {
        if (isClickable(el)) {
          ringRef.current.classList.add("cursor-hover");
        } else {
          ringRef.current.classList.remove("cursor-hover");
        }
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [shouldShow, isCursorVisible]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (shouldShow) {
        document.body.setAttribute("data-custom-cursor", "yes");
      } else {
        document.body.removeAttribute("data-custom-cursor");
      }
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.removeAttribute("data-custom-cursor");
      }
    };
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow) return;

    const handleMouseLeave = () => setIsCursorVisible(false);
    const handleMouseEnter = () => setIsCursorVisible(true);

    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [shouldShow]);

  const introHide =
    typeof document !== "undefined" &&
    document.body.hasAttribute("data-intro-hide-cursor");

  if (!shouldShow || introHide) return null;

  return (
    <>
      <style>{`
        .custom-cursor-ring {
          position: fixed;
          pointer-events: none;
          border: 2px solid #fff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          /* Lerp in JS handles transform, CSS handles the rest */
          transition: opacity 0.3s, border-width 0.3s, box-shadow 0.3s;
          z-index: 9999;
          mix-blend-mode: difference;
          /* Add the glow effect */
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
        }

        .custom-cursor-ring.cursor-hover {
          /* JS reads this class to trigger scale animation */
          border-width: 1px;
          /* Intensify glow on hover */
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.4);
        }

        .custom-cursor-dot {
          position: fixed;
          pointer-events: none;
          background: #fff;
          border-radius: 50%;
          width: 9px;
          height: 9px;
          transition: opacity 0.2s, box-shadow 0.3s;
          z-index: 10000;
          mix-blend-mode: difference;
          /* Add a subtle glow to the dot */
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        }

        .custom-cursor-view {
          position: fixed;
          pointer-events: none;
          z-index: 10000;
          background-color: #fff;
          color: #111;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          font-family: 'Space Grotesk', 'Poppins', sans-serif;
        }
      `}</style>
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={viewRef} className="custom-cursor-view">
        <span>View</span>
        <span>→</span>
      </div>
    </>
  );
};

export default Cursor;
