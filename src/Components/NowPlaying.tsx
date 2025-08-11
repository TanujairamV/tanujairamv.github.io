import React, { useEffect, useState } from "react";
import { FaMusic } from "react-icons/fa";
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

const BoxWideVisualizer: React.FC<{ mobile?: boolean }> = ({ mobile }) => {
  const barCount = mobile ? 8 : 16;
  const [heights, setHeights] = useState(Array(barCount).fill(8));
  useEffect(() => {
    let raf: number;
    let anim = true;
    const animate = () => {
      setHeights(
        Array(barCount)
          .fill(0)
          .map((_, i) =>
            10 +
            Math.abs(
              Math.sin(Date.now() / (330 + i * 13)) +
              Math.cos(Date.now() / (210 + i * 41))
            ) * (mobile ? 14 : 20)
          )
      );
      if (anim) raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      anim = false;
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line
  }, [barCount, mobile]);
  return (
    <div
      className="box-wide-visualizer"
      style={{
        display: "flex",
        alignItems: "flex-end",
        width: "100%",
        height: mobile ? 18 : 28,
        marginTop: mobile ? 9 : 13,
        gap: mobile ? 3 : 5,
        justifyContent: "center",
        pointerEvents: "none"
      }}
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: mobile ? 6 : 9,
            height: h,
            borderRadius: 5,
            background: "linear-gradient(90deg,#fff 80%,#b0b0b0 100%)",
            opacity: 0.88,
            boxShadow: "0 1.5px 7px 0 rgba(255,255,255,0.19)",
            transition: "height 0.17s cubic-bezier(.2,1.2,.41,.8)"
          }}
        />
      ))}
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
              background: "rgba(25, 28, 42, 0.55)",
              backdropFilter: "blur(18px) saturate(1.4)",
              WebkitBackdropFilter: "blur(18px) saturate(1.4)",
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
                  zIndex: 2
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
              <ShinyText
                speed={4}
                className="truncate font-bold text-[1.15rem] md:text-[1.24rem] max-w-full relative"
                style={{
                  fontWeight: 700,
                  lineHeight: 1.17,
                  letterSpacing: "0.01em",
                }}
              >
                {t.name}
              </ShinyText>
              <ShinyText
                speed={5}
                className="truncate text-[1.03rem] md:text-[1.11rem] mt-1 max-w-full"
                style={{
                  lineHeight: 1.13,
                  fontWeight: 500
                }}
              >
                {t.artist}
              </ShinyText>
              {showVisualizer && <BoxWideVisualizer mobile={mobileView} />}
              {showVisualizer && track?.durationMs && (
                <div
                  className="progress-bar-container"
                  style={{
                    position: "relative",
                    width: "100%",
                    height: mobileView ? 3 : 4,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 4,
                    marginTop: mobileView ? 9 : 13,
                  }}
                >
                  <div
                    className="progress-bar-inner"
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: "#fff",
                      borderRadius: 4,
                      transition: "width 1s linear",
                      boxShadow: "0 0 10px 0 #fff8",
                    }}
                  />
                  <div
                    className="progress-bar-pin"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${progress}%`,
                      width: mobileView ? 10 : 12,
                      height: mobileView ? 10 : 12,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      transform: "translate(-50%, -50%)",
                      transition: "left 1s linear",
                      boxShadow: "0 0 8px 1px rgba(255, 255, 255, 0.7)",
                    }}
                  />
                </div>
              )}
            </div>
            {/* Music Icon right */}
            <span style={{
              color: "#fff",
              fontSize: mobileView ? 22 : 32,
              marginLeft: mobileView ? 7 : 15,
              filter: "drop-shadow(0 2px 6px #fff5)",
              opacity: 0.92,
              flexShrink: 0
            }}>
              <FaMusic />
            </span>
          </div>
        </div>
        <style>{`
        .box-wide-visualizer {
          user-select: none;
        }
        .thumbnail-wrapper:hover .thumbnail-img,
        .thumbnail-wrapper:focus .thumbnail-img {
          transform: scale(1.06);
          z-index: 3;
          box-shadow: 0 7px 31px #fff5, 0 2px 10px #9997;
        }
        .thumbnail-img {
          will-change: transform;
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
