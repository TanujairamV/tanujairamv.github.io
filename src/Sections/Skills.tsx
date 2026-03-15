import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import {
  FiCode, FiTerminal, FiGitBranch, FiGithub, FiPlayCircle, FiGlobe, FiBox, FiServer, FiLink, FiTool, FiRefreshCw, FiUsers, FiGitMerge, FiSmartphone, FiSettings, FiZap
} from "react-icons/fi";
import {
  SiTypescript, SiTailwindcss, SiExpress
} from 'react-icons/si';

const skills = [
  // Programming Languages
  "Python", "JavaScript", "TypeScript", "HTML", "CSS", "Bash",
  // Frameworks & Libraries
  "Tailwind CSS", "Tkinter", "Express.js", "Selenium",
  // Tools & Platforms
  "Git", "GitHub", "GitHub Actions", "GitHub Pages", "VS Code", "Docker", "Node.js",
  // Developer Skills
  "REST API Integration", "Debugging & Troubleshooting", "CI/CD Workflow Setup", "Open-Source Collaboration", "Version Control",
  // System & Android Tools
  "ADB", "Fastboot", "TWRP", "Custom ROMs", "Linux System Management"
];

const skillIconMap: Record<string, React.ReactNode> = {
  // Programming Languages
  Python: <FiCode className="text-yellow-300" />,
  JavaScript: <FiCode className="text-yellow-400" />,
  TypeScript: <SiTypescript className="text-blue-300" />,
  HTML: <FiCode className="text-orange-400" />,
  CSS: <FiCode className="text-blue-400" />,
  Bash: <FiTerminal className="text-gray-300" />,
  // Frameworks & Libraries
  "Tailwind CSS": <SiTailwindcss className="text-cyan-300" />,
  Tkinter: <FiCode className="text-yellow-200" />,
  "Express.js": <SiExpress className="text-gray-100" />,
  Selenium: <FiZap className="text-green-400" />,
  // Tools & Platforms
  Git: <FiGitBranch className="text-orange-400" />,
  GitHub: <FiGithub className="text-gray-200" />,
  "GitHub Actions": <FiPlayCircle className="text-cyan-400" />,
  "GitHub Pages": <FiGlobe className="text-purple-300" />,
  "VS Code": <FiCode className="text-blue-400" />,
  Docker: <FiBox className="text-blue-400" />,
  "Node.js": <FiServer className="text-green-500" />,
  // Developer Skills
  "REST API Integration": <FiLink className="text-emerald-300" />,
  "Debugging & Troubleshooting": <FiTool className="text-red-400" />,
  "CI/CD Workflow Setup": <FiRefreshCw className="text-yellow-400" />,
  "Open-Source Collaboration": <FiUsers className="text-green-300" />,
  "Version Control": <FiGitMerge className="text-orange-300" />,
  // System & Android Tools
  ADB: <FiTerminal className="text-green-400" />,
  Fastboot: <FiZap className="text-gray-300" />,
  TWRP: <FiSettings className="text-blue-400" />,
  "Custom ROMs": <FiSmartphone className="text-pink-400" />,
  "Linux System Management": <FiTerminal className="text-gray-200" />,
};

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: React.ReactNode[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts = [],
  velocity = 25,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 4,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }: VelocityTextProps) {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );

    const copyRef = useRef<HTMLSpanElement>(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min: number, max: number, v: number): number {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }

    const x = useTransform(baseX, (v) => {
      if (copyWidth === 0) return "0px";
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef<number>(1);
    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < numCopies!; i++) {
      spans.push(
        <span
          className={`flex-shrink-0 ${className}`}
          key={i}
          ref={i === 0 ? copyRef : null}
        >
          {children}
        </span>
      );
    }

    return (
      <div
        className={`${parallaxClassName} relative overflow-hidden`}
        style={parallaxStyle}
      >
        <motion.div
          className={`${scrollerClassName} flex whitespace-nowrap`}
          style={{ x, ...scrollerStyle }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {texts.map((text: React.ReactNode, index: number) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity! : velocity!}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityText>
      ))}
    </div>
  );
};

const gradientTextClass = 'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400';

const Skillchip: React.FC = () => {
  const half = Math.ceil(skills.length / 2);
  const skills1 = skills.slice(0, half);
  const skills2 = skills.slice(half);

  const renderSkills = (skillList: string[]) => (
    <React.Fragment>
      {skillList.map((skill) => {
        const icon = skillIconMap[skill] || null;
        return (
          <span
            key={skill}
            className={`inline-flex items-center gap-2 bg-foreground/10 text-foreground px-4 py-2 rounded-full text-lg font-manrope ${gradientTextClass} mx-2`}
            title={skill}
          >
            {icon}
            <span>{skill}</span>
          </span>
        );
      })}
    </React.Fragment>
  );

  const skillSets = [renderSkills(skills1), renderSkills(skills2)];

  return (
    <div className="w-full py-4 space-y-4">
      <ScrollVelocity texts={skillSets} velocity={25} className="flex" />
    </div>
  );
};

export default React.memo(Skillchip);
