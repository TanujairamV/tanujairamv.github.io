import React, { ReactElement, useRef } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiCode, FiServer, FiZap, FiPackage } from "react-icons/fi";
import { Project } from "../Data/Data";

const projects: Project[] = [
  {
    id: "1",
    title: "joylib – Python Mini-Games & Fun Tools Library",
    url: "https://github.com/TanujairamV/joylib",
    techStack: ["Python", "Tkinter", "Games", "FLAMES", "Chess"],
    description:
      "A Python package bundling mini-games and fun utilities: Includes FLAMES calculator, Tic-Tac-Toe (Tkinter GUI), and a beta Chess GUI. Designed with easy-to-use functions like from joylib import flames. Lightweight, beginner-friendly, and expanding.",
  },
  {
    id: "2",
    title: "gr11prctl – Grade 11 Practical Programs Library",
    url: "https://github.com/TanujairamV/gr11prctl",
    techStack: ["Python", "CBSE", "snippets.py", "index.py"],
    description:
      "A Python library for CBSE-style practical programs: 20+ useful programs like pattern printing, palindrome check, tuple search, etc. Features snippets.py for core logic and an upcoming index.py for program listing. Made for students to practice efficiently.",
  },
  {
    id: "3",
    title: "lastfm-proxy – Last.fm API Proxy Server",
    url: "https://github.com/TanujairamV/lastfm-proxy",
    techStack: ["Express.js", "TypeScript", "API", "Proxy", "Node.js"],
    description:
      "A secure proxy layer to access Last.fm’s API without exposing keys: Built using Express.js with TypeScript. Can be used in bots, dashboards, or client-side apps. Handles API calls, caching, and error responses.",
  },
  {
    id: "4",
    title: "Instagram Account Creator Bot – Selenium Automation",
    url: "https://github.com/TanujairamV/insta-creator-bot",
    techStack: ["Selenium", "Python", "Automation", "mail.tm"],
    description:
      "An Instagram automation bot using Selenium and the mail.tm API: Handles registration, DOB selection, and manual email code verification. Features logging and delay controls to mimic human behavior. Ideal for automation testing or bulk creation setups.",
  },
];

const techIconMap: Record<string, ReactElement> = {
  python: <FiCode className="text-white text-2xl" />,
  "express.js": <FiServer className="text-gray-200 text-2xl" />,
  selenium: <FiZap className="text-gray-300 text-2xl" />,
  automation: <FiZap className="text-gray-300 text-2xl" />,
};

const getProjectIcon = (techStack: string[]): ReactElement => {
  for (const tech of techStack) {
    const icon = techIconMap[tech.toLowerCase()];
    if (icon) {
      return icon;
    }
  }
  // Fallback icon
  return <FiPackage className="text-gray-300 text-2xl" />;
};

interface GlareHoverProps {
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const GlareHover: React.FC<GlareHoverProps> = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const overlayRef = useRef<HTMLDivElement | null>(null);

  const animateIn = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = overlayRef.current;
    if (!el) return;

    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';
    if (onMouseEnter) onMouseEnter(e);
  };

  const animateOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = overlayRef.current;
    if (!el) return;

    if (playOnce) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%, 0 0';
    } else {
      el.style.transition = `${transitionDuration}ms ease`;
      el.style.backgroundPosition = '-100% -100%, 0 0';
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '-100% -100%, 0 0',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={style} onMouseEnter={animateIn} onMouseLeave={animateOut}>
      <div ref={overlayRef} style={overlayStyle} />
      {children}
    </div>
  );
};

const gradientTextClass =
  "bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-400 invert-on-hover";

const Projects: React.FC = () => (
  <div>
    {/* Removed the Projects heading as requested */}
    <div className="grid md:grid-cols-2 gap-8">
      {projects.map((project, idx) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
        >
          <GlareHover
            className="h-full rounded-2xl"
            glareColor="#ffffff"
            glareOpacity={0.1}
            glareSize={400}
            transitionDuration={1200}
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group 
                cursor-pointer 
                rounded-2xl 
                p-6 
                shadow-xl 
                border border-white/10
                transition-transform 
                duration-300 
                hover:scale-105 
                fade-in-up 
                outline-none 
                focus:ring-2 
                focus:ring-gray-300
                bg-white/5 dark:bg-neutral-900/30
                backdrop-blur-[18px]
                h-full flex flex-col
              "
              style={{ WebkitBackdropFilter: "blur(18px) saturate(1.15)" }}
              aria-label={`Visit ${project.title}`}
              title={`Visit ${project.title}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {getProjectIcon(project.techStack)}
                <h3 className={`text-2xl font-bold font-manrope mb-0 ${gradientTextClass}`}>{project.title}</h3>
              </div>
              <p className={`text-lg mb-4 font-light ${gradientTextClass}`}>{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-1 mt-auto">
                {project.techStack.map((t: string) => (
                  <span key={t} className={`inline-block bg-white/10 text-gray-100 px-3 py-1 rounded-full text-lg font-manrope ${gradientTextClass}`}>{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-gray-400 dark:text-gray-200 text-sm font-medium mt-3 opacity-70 group-hover:opacity-100 transition">
                <FiGithub className="mr-1" />
                GitHub
              </div>
            </a>
          </GlareHover>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Projects;
