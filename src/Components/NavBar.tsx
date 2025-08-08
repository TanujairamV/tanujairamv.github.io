import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-scroll";
import { MdHome, MdWork, MdSchool, MdStar, MdBuild, MdAssignment } from "react-icons/md";
import ShinyText from "../Components/gradient";

const NAV_LINKS = [
  { to: "hero", label: "Home", icon: <MdHome size={22} /> },
  { to: "skills", label: "Skills", icon: <MdBuild size={22} /> },
  { to: "experience", label: "Experience", icon: <MdWork size={22} /> },
  { to: "education", label: "Education", icon: <MdSchool size={22} /> },
  { to: "certificates", label: "Certificates", icon: <MdStar size={22} /> },
  { to: "projects", label: "Projects", icon: <MdAssignment size={22} /> }
];

const isMobile = () =>
  typeof window !== "undefined" &&
  (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) ||
    window.innerWidth < 768);

const NavBar: React.FC = () => {
  const [mobile, setMobile] = useState(isMobile());
  const [activeSection, setActiveSection] = useState<string>("hero");

  // For underline animation
  const underlineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({ opacity: 0 });

  // Prevent UI bug: ensure underline is only shown after first mount and layout is stable
  const [navReady, setNavReady] = useState(false);
  useEffect(() => {
    // Give layout a tick to stabilize before showing underline
    const t = setTimeout(() => setNavReady(true), 30);
    return () => clearTimeout(t);
  }, [mobile]);

  useEffect(() => {
    const handleResize = () => setMobile(isMobile());
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll spy for active section underline
  useEffect(() => {
    const handleScroll = () => {
      let found = "hero";
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.to);
        if (el) {
          const { top } = el.getBoundingClientRect();
          if (top <= 80) found = link.to;
        }
      }
      setActiveSection(found);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated underline effect (now also on mobile)
  useEffect(() => {
    if (!navReady) {
      setUnderlineStyle({ opacity: 0 });
      return;
    }
    const idx = NAV_LINKS.findIndex(l => l.to === activeSection);
    const ref = underlineRefs.current[idx];
    if (ref && navBarRef.current) {
      const rect = ref.getBoundingClientRect();
      const navRect = navBarRef.current.getBoundingClientRect();
      setUnderlineStyle({
        opacity: 1,
        left: rect.left - navRect.left + "px",
        width: rect.width + "px",
        height: "3px",
        bottom: "0px",
        position: "absolute",
        borderRadius: "2px",
        background: "linear-gradient(90deg, #fff 70%, #e4e4e7 100%)",
        transition: "left 0.33s cubic-bezier(.62,.04,.31,1.09), width 0.23s cubic-bezier(.62,.04,.31,1.09), opacity 0.18s",
        zIndex: 2,
        pointerEvents: "none"
      });
    } else {
      setUnderlineStyle({ opacity: 0 });
    }
  }, [activeSection, mobile, navReady]);

  // Ripple Handler for NavBar links
  const handleRipple = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const target = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(target.clientWidth, target.clientHeight);
    const radius = diameter / 2;
    circle.classList.add("ripple-span");
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - target.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${e.clientY - target.getBoundingClientRect().top - radius}px`;

    // Remove existing ripples
    const ripple = target.getElementsByClassName("ripple-span")[0];
    if (ripple) ripple.remove();

    target.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 500);
  };

  return (
    <>
    <style>{`
      /* Glassmorphic Navbar */
      .glass-navbar {
        background: linear-gradient(120deg, rgba(30,32,40,0.86) 70%, rgba(255,255,255,0.12) 100%);
        border: 1.8px solid rgba(255,255,255,0.22);
        box-shadow: 0 6px 24px 0 rgba(25, 25, 37, 0.18), 0 2px 32px 0 rgba(255,255,255,0.09);
        backdrop-filter: blur(22px) saturate(1.4);
        -webkit-backdrop-filter: blur(22px) saturate(1.4);
      }

      /* Improved NavBar Hover */
      .nav-link {
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 0.5em 1.2em;
        border-radius: 1.3em;
        transition: 
          background 0.19s cubic-bezier(.61,.13,.45,.87),
          box-shadow 0.18s,
          color 0.19s,
          transform 0.18s;
        background: transparent;
        color: #fff;
        cursor: none;
      }
      .nav-link:focus {
        outline: none;
      }
      .nav-link .nav-arrow {
        opacity: 0;
        transform: translateX(-4px) scale(0.85);
        margin-left: 0.6em;
        transition: opacity 0.17s, transform 0.19s;
        display: inline-flex;
        align-items: center;
      }
      .nav-link:hover,
      .nav-link:focus {
        background: linear-gradient(90deg,rgba(255,255,255,0.09) 65%,rgba(255,255,255,0.28) 100%);
        box-shadow: 0 2px 16px 0 #fff1, 0 0 0 2px #fff2;
        color: #fff !important;
        transform: scale(1.10);
        border-radius: 2em;
      }
      .nav-link:hover .nav-arrow,
      .nav-link:focus .nav-arrow {
        opacity: 1;
        transform: translateX(0) scale(1.09);
      }
      .nav-link .active {
        color: #c0c0c0 !important;
        text-shadow: 0 2px 8px #fff5;
      }

      /* Hide custom cursor when hovering a nav-link */
      .nav-link:hover ~ .custom-cursor,
      .nav-link:focus ~ .custom-cursor {
        opacity: 0 !important;
        visibility: hidden !important;
      }

      /* Animated underline for navbar */
      .navbar-underline {
        pointer-events: none;
        background: linear-gradient(90deg, #fff 70%, #e4e4e7 100%);
        height: 3px;
        border-radius: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        opacity: 1;
        transition:
          left 0.33s cubic-bezier(.62,.04,.31,1.09),
          width 0.23s cubic-bezier(.62,.04,.31,1.09),
          opacity 0.2s;
        z-index: 2;
        box-shadow: 0 2px 12px #fff2;
      }

      @media (max-width: 767px) {
        #navbar {
          min-width: 0 !important;
          max-width: 97vw !important;
          width: auto !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          padding: 0.25rem 0.5rem !important;
          border-radius: 1.5rem !important;
        }
        #navbar ul {
          width: 100% !important;
          left: 0 !important;
          right: 0 !important;
        }
        .navbar-underline {
          display: none !important;
          opacity: 0 !important;
        }
      }
    `}</style>
      <nav
        id="navbar"
        className="glass-navbar fixed top-5 left-1/2 z-50 transition-all duration-300"
        style={{
          transform: "translateX(-50%)",
          padding: mobile ? "0.18rem 0.5rem" : "0.55rem 2.2rem",
          borderRadius: "2.2rem",
          minWidth: mobile ? "auto" : "400px",
          minHeight: mobile ? "46px" : "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Space Grotesk', 'Poppins', sans-serif",
          position: "fixed",
          left: "50%",
          top: "1.25rem",
          zIndex: 50,
          // Enhanced glassmorphism for a more premium feel
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
          backdropFilter: "blur(24px) saturate(1.5)",
          WebkitBackdropFilter: "blur(24px) saturate(1.5)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
          overflow: "visible"
        }}
        ref={navBarRef}
      >
        {navReady && (
          <span
            className="navbar-underline"
            style={underlineStyle}
          />
        )}
        <ul
          className="flex flex-row items-center justify-center w-full"
          style={{
            gap: mobile ? "0.7rem" : "0.8rem",
            margin: 0,
            padding: 0,
            width: "100%"
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.to}
              className="nav-link ripple fade-in group"
              data-fade-delay={i + 1}
              style={{
                cursor: "pointer",
                borderRadius: "1.2rem",
                display: "flex",
                alignItems: "center",
                background: "none",
                // Add padding here for a larger ripple area
                padding: mobile ? "0.5rem 0.3rem" : "0.5rem 0.7rem",
                // Use a transparent outline for focus states for better accessibility
                outline: "2px solid transparent",
                outlineOffset: "2px",
                transition: "background 0.13s, color 0.13s, transform 0.16s",
                position: "relative",
                overflow: "hidden"
              }}
              onClick={handleRipple}
              tabIndex={0}
            >
              <Link
                to={link.to}
                smooth={true}
                duration={600}
                offset={-60}
                spy={true}
                activeClass="active"
                className="flex items-center"
                style={{
                  gap: "0.5rem",
                  fontFamily: "'Space Grotesk', 'Poppins', sans-serif",
                  fontWeight: 700,
                  textTransform: "capitalize",
                  fontSize: mobile ? "1.3rem" : "1.05rem",
                  letterSpacing: "0.04em",
                }}
                tabIndex={-1} // The parent li is already focusable
                aria-label={link.label}
              >
                <span
                  ref={el => underlineRefs.current[i] = el}
                  className="relative z-10"
                >
                  <ShinyText speed={5} disabled={activeSection !== link.to}>
                    {mobile ? link.icon : link.label}
                  </ShinyText>
                </span>
                {!mobile && (
                  <span className="nav-arrow text-gray-300 opacity-70 group-hover:opacity-100 transition-opacity" style={{ marginLeft: "0.1rem", display: "inline-flex", alignItems: "center" }}>
                    <svg width="17" height="17" viewBox="0 0 17 17">
                      <path d="M5 12 L12 12 L12 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
