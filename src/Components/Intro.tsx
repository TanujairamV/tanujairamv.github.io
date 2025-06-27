import React, { useEffect, useState } from "react";
import "./Intro.css";

// Scramble animation settings
const SCRAMBLE_TEXT = "Tanujairam V";
const SCRAMBLE_DURATION = 1600; // ms
const INTRO_DURATION = 2300; // ms

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
  const [show, setShow] = useState(true);
  const [scrambleProgress, setScrambleProgress] = useState(0);

  // Hide system and custom cursor when Intro is showing
  useEffect(() => {
    if (!show) return;
    // Hide system cursor
    const prevCursor = document.body.style.cursor;
    document.body.style.cursor = "none";
    // Hide custom cursor (using data attribute for CSS)
    document.body.setAttribute("data-intro-hide-cursor", "yes");
    return () => {
      document.body.style.cursor = prevCursor;
      document.body.removeAttribute("data-intro-hide-cursor");
    };
  }, [show]);

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

    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, INTRO_DURATION);

    return () => {
      running = false;
      clearTimeout(timer);
      cancelAnimationFrame(scrambleFrame);
    };
  }, [onFinish]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black hide-cursor"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        overflow: "hidden",
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
          className="text-4xl md:text-6xl font-bold text-center intro-title"
          style={{
            background: "linear-gradient(90deg, #fff 60%, #b0b0b0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Montserrat', 'Quicksand', sans-serif",
            letterSpacing: "0.07em",
            userSelect: "none",
            textShadow: "0 4px 40px #000a",
            overflow: "visible",              // Fix clipped descenders
            lineHeight: 1.15,                 // Improve descender visibility (e.g. for "j")
            paddingBottom: "0.18em",          // Extra space for descenders like "j"
          }}
        >
          {scramble(SCRAMBLE_TEXT, scrambleProgress)}
        </h1>
        <p
          className="mt-6 max-w-xl text-center text-lg md:text-2xl text-gray-400 font-normal"
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Montserrat', 'Quicksand', sans-serif",
            textShadow: "0 2px 20px #000a",
          }}
        >
          I build software and digital experiences.<br />
          Currently focused on web, cloud, and AI.
        </p>
      </div>
    </div>
  );
};

export default Intro;
