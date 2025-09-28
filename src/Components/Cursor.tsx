/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from "react";

const CLICKABLE_SELECTOR = [ "a", "button", "input", "textarea", "select", "summary", "label", "[role=button]", "[tabindex]:not([tabindex='-1'])", ".cursor-pointer" ].join(", ");
const VIEW_SELECTOR = "[data-cursor-view]";

const isClickable = (el: Element | null): boolean => !!el?.closest(CLICKABLE_SELECTOR);
const isViewable = (el: Element | null): boolean => !!el?.closest(VIEW_SELECTOR);

/**
 * Hook to detect if the user is on a touch-enabled device.
 */
const useIsTouchDevice = () => {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        const touch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
        setIsTouch(touch);
    }, []);
    return isTouch;
};

/**
 * Main hook to manage custom cursor logic.
 */
const useCursor = (dotRef: React.RefObject<HTMLDivElement>, ringRef: React.RefObject<HTMLDivElement>) => {
    const isTouchDevice = useIsTouchDevice();
    const [isVisible, setIsVisible] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const mouse = useRef({ x: 0, y: 0 });
    const ringPos = useRef({ x: 0, y: 0, scale: 1 });
    const animationFrame = useRef<number>();

    // Use a ref to get the latest hover state inside the animation loop without re-triggering the effect
    const isHoveringRef = useRef(isHovering);
    useEffect(() => {
        isHoveringRef.current = isHovering;
    }, [isHovering]);

    // Set body attribute for CSS targeting
    useEffect(() => {
        if (isTouchDevice) {
            document.body.removeAttribute("data-custom-cursor");
            return;
        }
        document.body.setAttribute("data-custom-cursor", "yes");
        return () => document.body.removeAttribute("data-custom-cursor");
    }, [isTouchDevice]);

    // Mouse movement and element detection
    useEffect(() => {
        if (isTouchDevice) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
            }
            const el = document.elementFromPoint(e.clientX, e.clientY);
            setIsHovering(isClickable(el));
            setIsViewing(isViewable(el));
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isTouchDevice, dotRef]);

    // Animation loop for the ring
    useEffect(() => {
        if (isTouchDevice) return;

        const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

        const animate = () => {
            const targetScale = isHoveringRef.current ? 1.4 : 1;
            ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.2);
            ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.2);
            ringPos.current.scale = lerp(ringPos.current.scale, targetScale, 0.2);

            if (ringRef.current) {
                const transform = `translate3d(${ringPos.current.x - 25}px, ${ringPos.current.y - 25}px, 0) scale(${ringPos.current.scale})`;
                ringRef.current.style.transform = transform;
            }
            animationFrame.current = requestAnimationFrame(animate);
        };

        animationFrame.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        };
    }, [isTouchDevice, ringRef]);

    // Cursor visibility on mouse enter/leave
    useEffect(() => {
        if (isTouchDevice) return;

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = (e: MouseEvent) => {
            setIsVisible(true);
            // Immediately update position on re-entry
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
            }
        };

        document.documentElement.addEventListener("mouseleave", handleMouseLeave);
        document.documentElement.addEventListener("mouseenter", handleMouseEnter);
        return () => {
            document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
            document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isTouchDevice, dotRef]);

    return { isTouchDevice, isVisible, isHovering, isViewing };
};

const Cursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const { isTouchDevice, isVisible, isHovering, isViewing } = useCursor(dotRef, ringRef);

    const introHide =
        typeof document !== "undefined" &&
        document.body.hasAttribute("data-intro-hide-cursor");

    if (isTouchDevice || introHide) return null;

    return (
        <>
            <style>
                {`
        /* Hide native cursor when custom one is active */
        body[data-custom-cursor="yes"] {
          cursor: none;
          --cursor-visibility: ${isVisible ? 'visible' : 'hidden'};
        }

        .custom-cursor-ring {
          position: fixed;
          pointer-events: none;
          border: 2px solid #fff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          /* Lerp in JS handles transform, CSS handles the rest */
          transition: border-width 0.3s, box-shadow 0.3s, background-color 0.3s;
          z-index: 9999;
          mix-blend-mode: difference;
          /* Add the glow effect */
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
          will-change: transform, opacity;
        }

        .custom-cursor-ring.is-hovering {
          border-width: 1px;
          /* Intensify glow on hover */
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.7), 0 0 30px rgba(255, 255, 255, 0.4);
        }

        .custom-cursor-view {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #000;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .custom-cursor-ring.is-viewing {
          background-color: rgba(255, 255, 255, 1);
        }
        .custom-cursor-ring.is-viewing .custom-cursor-view {
          opacity: 1;
        }

        .custom-cursor-dot {
          position: fixed;
          pointer-events: none;
          background: #fff;
          border-radius: 50%;
          width: 9px;
          height: 9px;
          z-index: 10000;
          mix-blend-mode: difference;
          /* Add a subtle glow to the dot */
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
          will-change: transform, opacity;
        }

        .custom-cursor-dot, .custom-cursor-ring {
            opacity: ${isVisible ? 1 : 0};
            transition: opacity 0.3s;
            visibility: var(--cursor-visibility);
        }
      `}
            </style>
            <div ref={ringRef} className={`custom-cursor-ring ${isHovering ? 'is-hovering' : ''} ${isViewing ? 'is-viewing' : ''}`}>
                <span className="custom-cursor-view">View</span>
            </div>
            <div ref={dotRef} className="custom-cursor-dot" />
        </>
    );
};

export default Cursor;
