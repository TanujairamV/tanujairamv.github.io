/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef, useState } from "react";

// Helpers
const CLICKABLE_SELECTOR = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "summary",
    "label",
    "[role=button]",
    "[tabindex]:not([tabindex='-1'])",
    ".cursor-pointer",
].join(", ");

const isClickable = (el: Element | null): boolean => !!el?.closest(CLICKABLE_SELECTOR);

const Cursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isCursorVisible, setIsCursorVisible] = useState(true);

    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0, scale: 1 });
    const animationFrame = useRef<number>();

    useEffect(() => {
        const touch =
            typeof window !== "undefined" &&
            ("ontouchstart" in window ||
                navigator.maxTouchPoints > 0 ||
                // @ts-ignore
                (navigator.msMaxTouchPoints > 0));
        setIsTouchDevice(touch);
    }, []);

    useEffect(() => {
        if (isTouchDevice) {
            document.body.removeAttribute("data-custom-cursor");
            return;
        };

        document.body.setAttribute("data-custom-cursor", "yes");

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
                ringRef.current.style.opacity = !isCursorVisible ? "0" : "1";
            }

            animationFrame.current = requestAnimationFrame(animate);
        };

        animationFrame.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
            document.body.removeAttribute("data-custom-cursor");
        };
    }, [isTouchDevice, isCursorVisible]);

    useEffect(() => {
        if (isTouchDevice) return;

        const handleMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
                dotRef.current.style.opacity = isCursorVisible ? "1" : "0";
            }

            const el = document.elementFromPoint(e.clientX, e.clientY);

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
    }, [isTouchDevice, isCursorVisible]);

    useEffect(() => {
        if (isTouchDevice) return;

        const handleMouseLeave = () => {
            setIsCursorVisible(false);
        };
        const handleMouseEnter = (e: MouseEvent) => {
            setIsCursorVisible(true);
            // On re-entry, we must immediately update the dot's position and visibility
            // as a `mousemove` event may not have fired yet.
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
                dotRef.current.style.opacity = "1";
            }
        };

        document.documentElement.addEventListener("mouseleave", handleMouseLeave);
        document.documentElement.addEventListener("mouseenter", handleMouseEnter as EventListener);

        return () => {
            document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
            document.documentElement.removeEventListener("mouseenter", handleMouseEnter as EventListener);
        };
    }, [isTouchDevice]);

    const introHide =
        typeof document !== "undefined" &&
        document.body.hasAttribute("data-intro-hide-cursor");

    if (isTouchDevice || introHide) return null;

    return (
        <>
            <style>{`
        /* Hide native cursor when custom one is active */
        body[data-custom-cursor="yes"] {
          cursor: none;
        }

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
          will-change: transform, opacity;
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
          will-change: transform, opacity;
        }
      `}</style>
            <div ref={ringRef} className="custom-cursor-ring" />
            <div ref={dotRef} className="custom-cursor-dot" />
        </>
    );
};

export default Cursor;
