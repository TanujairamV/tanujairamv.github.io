import React, { useEffect, useState, useMemo, useRef } from "react";
import { FaSpotify } from "react-icons/fa";
import { TrackInfo } from "../Data/types";
import ShinyText from "./gradient";
import TiltedCard from "./TiltedCard";

interface SpotifyNowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  progress: number | null;
  duration: number;
  playedAt?: string;
}

const fallbackTrack: TrackInfo = {
  artist: "",
  name: "Not playing",
  album: "",
  // Changed placeholder image to a more reliable service
  image: "https://placehold.co/120x120?text=No+Art",
  url: "#",
};

const SwigglyProgressBar: React.FC<{ progress: number; mobile?: boolean; isPlaying: boolean }> = ({ progress, mobile, isPlaying }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pinPosition, setPinPosition] = useState({ x: 0, y: 0 });
  const [wavePath, setWavePath] = useState('');
  const width = mobile ? 180 : 240;
  const height = mobile ? 14 : 18;
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const yOffset = height / 2;

    // "Uniform" wave parameters
    const amplitude = mobile ? 3 : 4;
    const frequency = 5;
    const speed = 1.5;

    const getWavePath = (time: number) => {
      let path = `M 0 ${yOffset}`;
      for (let x = 0; x <= width; x++) {
        const angle = (x / width) * (frequency * Math.PI * 2) + time * speed;
        const y = yOffset + amplitude * Math.sin(angle);
        path += ` L ${x} ${y}`;
      }
      return path;
    };

    const updatePinPosition = (time: number) => {
      const pinX = width * (progress / 100);
      const angle = (pinX / width) * (frequency * Math.PI * 2) + time * speed;
      const y = yOffset + amplitude * Math.sin(angle);
      const pinY = y;
      setPinPosition({ x: pinX, y: pinY });
    };

    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setWavePath(getWavePath(0));
      updatePinPosition(0);
      return;
    }

    const animate = (timestamp: number) => {
      const time = timestamp / 1000;
      setWavePath(getWavePath(time));
      updatePinPosition(time);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [progress, isPlaying, width, height, mobile]);

  const clipId = useMemo(() => `progress-clip-${Math.random().toString(16).slice(2)}`, []);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: mobile ? 12 : 16 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={pinPosition.x} height={height} />
          </clipPath>
        </defs>

        {/* Background (unplayed) part of the wave */}
        <path
          d={wavePath}
          fill="none"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth={mobile ? 2.5 : 3}
          strokeLinecap="round"
        />

        {/* Foreground (played) part of the wave */}
        <path
          ref={pathRef}
          d={wavePath}
          fill="none"
          stroke="#fff"
          strokeWidth={mobile ? 2.5 : 3}
          strokeLinecap="round"
          clipPath={`url(#${clipId})`}
          style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.6))' }}
        />

        {/* Thumb/Pin */}
        <circle cx={pinPosition.x} cy={pinPosition.y} r={mobile ? 4.5 : 5.5} fill="#fff" className="progress-pin" style={{ transition: 'cx 1s linear', filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
      </svg>
    </div>
  );
};

const MarqueeText: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({ children, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Use useLayoutEffect for immediate measurement after render
  React.useLayoutEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.scrollWidth;
        const newIsOverflowing = textWidth > containerWidth;
        if (newIsOverflowing !== isOverflowing) {
          setIsOverflowing(newIsOverflowing);
        }
      }
    };

    // Check on mount and when children change
    checkOverflow();

    // Use ResizeObserver for robust overflow detection
    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [children, isOverflowing]);

  return (
    <div ref={containerRef} className="marquee-container" style={style}>
      <div className={`marquee-content ${isOverflowing ? 'is-overflowing' : ''}`}>
        <span ref={textRef} className={`marquee-text ${className}`}>
          {children}
        </span>
        {isOverflowing && (
          <span className={`marquee-text ${className}`} aria-hidden="true">
            {children}
          </span>
        )}
      </div>
    </div>
  );
};

const isMobile = () =>
  typeof window !== "undefined" &&
  (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) ||
    window.innerWidth < 768);

const NowListening: React.FC = () => {
  const [track, setTrack] = useState<TrackInfo | null>(null);
  const [img, setImg] = useState<string>(fallbackTrack.image);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [mobileView, setMobileView] = useState(isMobile());
  const [headerText, setHeaderText] = useState("Now Listening");
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchSpotifyNowPlaying = async () => {
      if (!isMounted) return;
      fetch("https://spotify-now-playing-alpha.vercel.app/api")
        .then(response => {
          if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
          return response.json();
        })
        .then(async (data: SpotifyNowPlaying) => {
          if (!isMounted) return;
          console.debug("[Debug] Spotify data fetched:", data);

          // If a track title is present, we have something to show.
          if (data.title) {
            const newTrack: TrackInfo = {
              name: data.title,
              artist: data.artist,
              album: data.album,
              image: data.albumImageUrl,
              url: data.songUrl,
              progressMs: data.progress === null ? undefined : data.progress,
              durationMs: data.duration,
            };

            // Update header and visualizer based on playing status
            setHeaderText(data.isPlaying ? "Now Listening" : "Recently Played");
            setShowVisualizer(data.isPlaying);

            setTrack(currentTrack => {
              // Only update image if the song has changed
              if (currentTrack?.url !== newTrack.url) {
                setImg(newTrack.image || fallbackTrack.image);
                setImgLoaded(false);
                return newTrack;
              }
              return currentTrack;
            });
          } else {
            // Nothing is playing and no recent track available
            setTrack(currentTrack => {
              if (currentTrack !== null) {
                setImg(fallbackTrack.image);
                setImgLoaded(true);
              }
              return null;
            });
            setHeaderText("Now Listening");
            setShowVisualizer(false);
          }
        })
        .catch(err => {
          console.error("[Debug] Error fetching Spotify now playing track:", err);
          if (!isMounted) return;
          setTrack(null);
          setImg(fallbackTrack.image);
          setImgLoaded(true);
          setHeaderText("Now Listening");
          setShowVisualizer(false);
        });
    };

    fetchSpotifyNowPlaying();
    const intervalId = setInterval(fetchSpotifyNowPlaying, 30000); // Poll every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setMobileView(isMobile());
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Progress bar timer
  useEffect(() => {
    if (!showVisualizer || !track?.durationMs || typeof track.progressMs !== 'number') {
      setProgress(0);
      return;
    }

    let interval: NodeJS.Timeout;
    const { durationMs } = track;
    let currentProgress = track.progressMs;

    const tick = () => {
      currentProgress += 1000;
      if (currentProgress > durationMs) {
        currentProgress = durationMs;
        clearInterval(interval);
      }
      setProgress((currentProgress / durationMs) * 100);
    };

    // Set initial progress and start timer
    setProgress((currentProgress / durationMs) * 100);
    interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [track, showVisualizer]);

  const t: TrackInfo = track || fallbackTrack;
  const blurStrength = mobileView ? 7 : 11;
  const mainArtist = t.artist ? t.artist.split(',')[0].trim() : "";

  const songTitleContent = useMemo(() => {
    if (!t.name) return "";

    let title = t.name;

    // Remove (feat. ...) notations
    title = title.replace(/\s+\(feat\..*?\)/i, "").trim();

    // Remove text after " - " (e.g., "- From 'Movie'", "- Remix")
    const hyphenIndex = title.indexOf(" - ");
    if (hyphenIndex !== -1) {
      title = title.substring(0, hyphenIndex).trim();
    }

    return title;
  }, [t.name]);

  // Debug: Log when component renders and what image is used
  useEffect(() => {
    console.debug("[Debug] NowListening component rendered. Img:", img, "Track:", t);
  }, [img, t]);

  const handleContainerClick = () => {
    if (t.url && t.url !== "#") {
      window.open(t.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`now-listening-wrapper mx-auto ${mobileView ? "mb-4" : "mb-8"}`}
      style={{
        width: mobileView ? "calc(100% - 2rem)" : "460px",
        height: "auto",
      }}
    >
      <TiltedCard
        className={`${t.url && t.url !== "#" ? "cursor-pointer" : ""}`}
        showMobileWarning={false}
        showTooltip={false}
        scaleOnHover={mobileView ? 1 : 1.04}
        rotateAmplitude={mobileView ? 0 : 5}
        onClick={handleContainerClick}
        tabIndex={0}
      >
        <div
          className={`now-listening-container relative w-full`}
          style={{
            borderRadius: mobileView ? "1.15rem" : "2rem",
            overflow: "hidden",
            boxShadow: mobileView
              ? "0 4px 16px rgba(60,60,60,0.14), 0 1px 6px rgba(200,200,200,0.07)"
              : "0 6px 22px rgba(60,60,60,0.12), 0 2px 10px rgba(200,200,200,0.08)",
            fontFamily: "'Space Grotesk', 'Poppins', 'Montserrat', sans-serif",
            background: "rgba(255,255,255,0.05)",
            position: "relative",
          }}
        >
          {/* Constant Particles Blur Ripple Android 15 style */}
          <span className="particle-blur-bg" aria-hidden="true">
            <span className="particle p1"></span>
            <span className="particle p2"></span>
            <span className="particle p3"></span>
            <span className="particle p4"></span>
            <span className="particle p5"></span>
            <span className="particle p6"></span>
            <span className="particle p7"></span>
            <span className="particle p8"></span>
          </span>
          {/* Blurred thumbnail bg */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${img})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              transform: "scale(1.15)",
              opacity: 0.8
            }}
            aria-hidden
          />
          {/* Main content */}
          <div
            className={`relative z-10 flex items-center ${mobileView ? "gap-2 px-2.5 py-2.5" : "gap-7 px-8 py-6"}`}
            style={{
              background: "rgba(25, 28, 42, 0.50)",
              backdropFilter: "blur(24px) saturate(1.5)",
              WebkitBackdropFilter: "blur(24px) saturate(1.5)",
              borderRadius: mobileView ? "1.15rem" : "1.9rem",
              border: "1.5px solid rgba(180,180,180,0.16)",
              minHeight: mobileView ? "80px" : "120px",
              boxShadow: "0 1px 8px 0 rgba(100,100,100,0.08)",
              transition: "background 0.2s, box-shadow 0.2s"
            }}
          >
            {/* Album art */}
            <div
              style={{
                position: "relative",
                flexShrink: 0,
                width: mobileView ? "68px" : "104px",
                height: mobileView ? "68px" : "104px",
                borderRadius: mobileView ? "1.15rem" : "1.9rem",
                overflow: "hidden",
                transition: "box-shadow .19s, transform .19s"
              }}
              className="thumbnail-wrapper group"
            >
              <img
                src={img}
                alt={`Album art for ${t.name}`}
                className="object-cover thumbnail-img"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: mobileView ? "1.15rem" : "1.9rem",
                  border: mobileView ? "1.1px solid rgba(225,225,225,0.11)" : "2px solid rgba(225,225,225,0.16)",
                  boxShadow: "0 3px 11px 0 rgba(80,80,80,0.09), 0 1px 7px #fff2",
                  opacity: imgLoaded ? 1 : 0,
                  transition: "opacity .35s, transform .23s cubic-bezier(.33,1.4,.55,1)",
                zIndex: 1
                }}
                onLoad={() => setImgLoaded(true)}
                tabIndex={mobileView ? -1 : 0}
                onError={() => {
                  console.warn("[Debug] Image failed to load, using fallback.");
                  setImg(fallbackTrack.image);
                  setImgLoaded(true);
                }}
              />
              {!imgLoaded && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: mobileView ? "1.15rem" : "1.9rem",
                    background: "linear-gradient(135deg,#e8e8e8 10%,#bbb 90%)",
                    position: "absolute", left: 0, top: 0
                  }}
                />
              )}
            </div>
            {/* Info block */}
            <div className="flex flex-col min-w-0 flex-1" style={{ marginLeft: mobileView ? 10 : 22, position: "relative" }}>
              <ShinyText
                speed={5}
                className="text-[0.75rem] uppercase tracking-widest mb-1 opacity-90"
                style={{
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                }}
              >
                {headerText}
              </ShinyText>
              <MarqueeText
                className="font-bold text-[1.15rem] md:text-[1.24rem] max-w-full relative"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.17,
                  letterSpacing: "0.01em",
                }}
              >
                <ShinyText speed={6} disabled={!showVisualizer}>
                  {songTitleContent}
                </ShinyText>
              </MarqueeText>
              <MarqueeText
                className="text-[1.03rem] md:text-[1.11rem] mt-1 max-w-full"
                style={{
                  lineHeight: 1.13,
                  fontWeight: 500
                }}
              >
                <ShinyText speed={7} disabled={!showVisualizer}>
                  {mainArtist}
                </ShinyText>
              </MarqueeText>
              {showVisualizer && <SwigglyProgressBar progress={progress} mobile={mobileView} isPlaying={showVisualizer} />}
            </div>
            {/* Music Icon right */}
            <span style={{
              color: "#fff",
              fontSize: mobileView ? 20 : 28,
              marginLeft: mobileView ? 4 : 12,
              filter: "drop-shadow(0 2px 6px #fff5)",
              opacity: 0.92,
              flexShrink: 0
            }}>
              <FaSpotify />
            </span>
          </div>
        </div>
        <style>{`
        .box-wide-visualizer {
          user-select: none;
        }
        .thumbnail-wrapper::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1), rgba(255,255,255,0.6));
          background-size: 200% 200%;
          opacity: 0;
          z-index: 0;
          transition: opacity 0.3s ease, background-position 0.5s ease;
          animation: bg-pan 4s linear infinite;
        }
        .thumbnail-wrapper:hover .thumbnail-img,
        .thumbnail-wrapper:focus .thumbnail-img {
          transform: scale(1.06);
          box-shadow: 0 7px 31px #fff5, 0 2px 10px #9997;
        }
        .thumbnail-wrapper:hover::after {
          opacity: 1;
        }
        .thumbnail-img {
          will-change: transform;
        }
        .progress-pin {
          animation: pin-pulse 2.5s infinite ease-in-out;
        }
        /* --- Marquee Effect --- */
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
        }
        .marquee-content.is-overflowing {
          animation: marquee 10s linear infinite;
        }
        .marquee-text {
          padding-right: 2rem; /* Space between repeated text */
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(0); } /* Pause at the start */
          100% { transform: translateX(-50%); }
        }
        @keyframes bg-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pin-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)); }
          50% { filter: drop-shadow(0 0 7px rgba(255,255,255,1)); }
        }
        /* --- Android 15 style: constant particles blur ripple effect --- */
        .particle-blur-bg {
          pointer-events: none;
          position: absolute;
          left: 0; top: 0; width: 100%; height: 100%;
          z-index: 0;
          overflow: hidden;
        }
        .particle-blur-bg .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0.37;
          filter: blur(14px);
          background: radial-gradient(circle,rgba(255,255,255,0.13) 0%,rgba(255,255,255,0.06) 70%,rgba(180,180,220,0.04) 100%);
          animation: particle-float 4.5s linear infinite;
          pointer-events: none;
          will-change: transform, opacity;
        }
        .particle-blur-bg .particle.p1 { left: 8%; top: 18%; width: 60px; height: 60px; animation-delay: 0s; }
        .particle-blur-bg .particle.p2 { left: 65%; top: 9%; width: 82px; height: 82px; animation-delay: 1.3s;}
        .particle-blur-bg .particle.p3 { left: 33%; top: 62%; width: 75px; height: 75px; animation-delay: 2.2s;}
        .particle-blur-bg .particle.p4 { left: 77%; top: 72%; width: 44px; height: 44px; animation-delay: 3.1s;}
        .particle-blur-bg .particle.p5 { left: 18%; top: 78%; width: 38px; height: 38px; animation-delay: 1.7s;}
        .particle-blur-bg .particle.p6 { left: 82%; top: 40%; width: 72px; height: 72px; animation-delay: 2.7s;}
        .particle-blur-bg .particle.p7 { left: 41%; top: 33%; width: 52px; height: 52px; animation-delay: 0.8s;}
        .particle-blur-bg .particle.p8 { left: 60%; top: 53%; width: 40px; height: 40px; animation-delay: 2.5s;}

        @keyframes particle-float {
          0%   { transform: scale(1) translateY(0px); opacity: 0.22; }
          18%  { opacity: 0.4; }
          50%  { transform: scale(1.18) translateY(-14px); opacity: 0.46; }
          80%  { opacity: 0.25; }
          100% { transform: scale(1) translateY(0px); opacity: 0.22; }
        }
        @media (max-width: 767px) {
          .now-listening-container {
            max-width: 99vw !important;
            margin-bottom: 1rem !important;
            border-radius: 1.15rem !important;
          }
          .now-listening-container .thumbnail-wrapper {
            min-width: 49px !important;
            min-height: 49px !important;
          }
        }
      `}</style>
      </TiltedCard>
    </div>
  );
};

export default NowListening;
