import React, { useEffect, useState } from "react";
import ShinyText from "./gradient";

// Scramble animation settings
const SCRAMBLE_TEXT = "Tanujairam V";
const SCRAMBLE_DURATION = 1600; // ms
const FADE_OUT_DURATION = 500; // ms for fade-out
const INTRO_DURATION = 2300; // ms before fade-out starts

// Scramble logic
function scramble(text: string, progress: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let scrambled = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === " ") {
      scrambled += " ";
    } else if (progress < i / text.length) {
      scrambled += chars.charAt(Math.floor(Math.random() * chars.length));
    } else {
      scrambled += text[i];
    }
  }
  return scrambled;
}

const Intro: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [isMounted, setIsMounted] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [scrambleProgress, setScrambleProgress] = useState(0);

  // Hide system and custom cursor when Intro is showing
  useEffect(() => {
    if (!isMounted) return;
    // Hide system cursor
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    // Hide custom cursor (using data attribute for CSS)
    document.body.setAttribute("data-intro-hide-cursor", "yes");
    return () => {
      document.body.style.cursor = prevCursor;
      document.body.removeAttribute("data-intro-hide-cursor");
    };
  }, [isMounted]);

  useEffect(() => {
    let running = true;
    let start = performance.now();
    let scrambleFrame: number;

    function animate(now: number) {
      if (!running) return;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / SCRAMBLE_DURATION);
      setScrambleProgress(progress);
      if (progress < 1) {
        scrambleFrame = requestAnimationFrame(animate);
      }
    }
    scrambleFrame = requestAnimationFrame(animate);

    // Timer to start fading out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, INTRO_DURATION);

    // Timer to unmount the component after fade-out
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
      if (onFinish) onFinish();
    }, INTRO_DURATION + FADE_OUT_DURATION);

    return () => {
      running = false;
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      cancelAnimationFrame(scrambleFrame);
    };
  }, [onFinish]);

  if (!isMounted) return null;

  return (
    <>
      <style>{`
        .hide-cursor, .hide-cursor * {
          cursor: none !important;
        }

        /* Hide custom cursor (dot, ring, view) when Intro is open */
        [data-intro-hide-cursor] .custom-cursor-dot,
        [data-intro-hide-cursor] .custom-cursor-ring,
        [data-intro-hide-cursor] .custom-cursor-view {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        /* Prevent letter descenders from being clipped in the Intro title */
        .intro-title {
          overflow: visible !important;
          line-height: 1.15 !important;
          padding-bottom: 0.18em !important;
        }

        .intro-container.fading-out {
          opacity: 0;
          transition: opacity ${FADE_OUT_DURATION}ms ease-out;
        }
      `}</style>
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black hide-cursor intro-container ${isFadingOut ? 'fading-out' : ''}`}
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          overflow: "hidden",
          transition: `opacity ${FADE_OUT_DURATION}ms ease-out`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "#000",
            filter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            backdropFilter: "blur(32px)",
            zIndex: 1,
          }}
          aria-hidden
        />
        <div
          className="relative z-10 flex flex-col items-center"
          style={{
            padding: "2.8rem 3.2rem",
            borderRadius: "2.2rem",
            background: "rgba(10,10,10,0.50)",
            boxShadow: "0 8px 60px 0 #111a, 0 1px 10px #fff1",
          }}
        >
          <h1
            className="text-4xl md:text-6xl font-bold text-center intro-title font-mono tracking-wider"
            style={{
              userSelect: "none",
              textShadow: "0 4px 40px #000a",
            }}
          >
            <ShinyText speed={4} disabled={scrambleProgress < 1}>
              {scramble(SCRAMBLE_TEXT, scrambleProgress)}
            </ShinyText>
          </h1>
          <p
            className="mt-6 max-w-xl text-center text-lg md:text-2xl text-gray-400 font-normal font-caviar"
            style={{
              textShadow: "0 2px 20px #000a",
            }}
          >
            <ShinyText speed={5} disabled={scrambleProgress < 1}>
              I build software and digital experiences.<br />
              Currently focused on web, cloud, and AI.
            </ShinyText>
          </p>
        </div>
      </div>
    </>
  );
};

export default Intro;
