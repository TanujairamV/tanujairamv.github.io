import React, { useRef, useState } from "react";
import { FiGithub, FiZap, FiCode, FiMessageSquare } from "react-icons/fi";
import AnimatedList from "../Components/AnimatedList";
import ShinyText from "../Components/gradient";

const EXPERIENCES = [
  {
    title: "A17 WhatsApp Userbot Contributor",
    period: "2024 – Project Closed",
    icon: <FiMessageSquare className="text-cyan-300 text-2xl" />,
    description: [
      "Contributed to the development and maintenance of A17, a modular WhatsApp userbot project built for automation and custom command handling.",
      "Implemented and improved features like custom commands, logging, and bot management tools.",
      "Assisted with debugging, codebase cleanup, and handling user requests before the project was archived.",
      "Worked extensively with Python, Telethon, and WhatsApp automation workflows."
    ],
    tags: ["Python", "Telethon", "Automation", "Open Source"]
  },
  {
    title: "Open Source Contributor & Python Developer",
    period: "Jan 2023 – Present",
    icon: <FiGithub className="text-gray-300 text-2xl" />,
    description: [
      "Created rupi, a Python library including games and utility programs like FLAMES, Tic Tac Toe (Tkinter), and a GUI-based Chess app.",
      "Developed gr11prctl, a Grade 11–oriented practice library with indexed Python programs and student-focused logic problems.",
      "Maintained repo hygiene, implemented index.py for dynamic indexing, and collaborated through GitHub."
    ],
    tags: ["Python", "Tkinter", "GitHub", "Open Source"]
  },
  {
    title: "Frontend & Portfolio Developer",
    period: "2024 – Present",
    icon: <FiCode className="text-blue-300 text-2xl" />,
    description: [
      "Designed a minimalist developer portfolio using HTML, TailwindCSS, and automated deployment via GitHub Actions.",
      "Integrated cursor animations and mobile-first responsiveness while keeping page speed and clean UX a priority.",
      "Wrote a clear README.md and ensured maintainability of the codebase."
    ],
    tags: ["HTML", "TailwindCSS", "Deployment", "Frontend"]
  },
  {
    title: "Automation & Scripting Engineer",
    period: "2024 – Present",
    icon: <FiZap className="text-purple-300 text-2xl" />,
    description: [
      "Developed an Instagram account creator bot using Selenium and the mail.tm API with support for manual email/code entry.",
      "Automated birthday handling, improved error handling, and ensured logging at every step.",
      "Focused on keeping all core features intact while fixing broken interactions."
    ],
    tags: ["Python", "Selenium", "Automation", "APIs"]
  }
];

const ExperienceItem = ({ item, isSelected }: { item: typeof EXPERIENCES[0], isSelected: boolean }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative group transition-all duration-300 rounded-2xl shadow-xl shadow-gray-700/10 p-px 
        overflow-hidden cursor-pointer
        ${isSelected ? 'scale-[1.02]' : ''}
      `}
    >
      {/* Star Border Effect */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, white, transparent 10%)`,
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, white, transparent 10%)`,
        }}
      ></div>

      {/* Inner container for content */}
      <div
        className={`
          relative rounded-[15px] backdrop-blur-xl px-7 py-6 z-10
          flex flex-col md:flex-row md:items-start gap-5 md:gap-8 border-2
          ${isSelected ? 'border-blue-300/70 bg-white/70 dark:bg-neutral-900/60' : 'border-transparent bg-white/40 dark:bg-neutral-900/40'}
        `}
        style={{
          backdropFilter: "blur(18px) saturate(1.2)",
          WebkitBackdropFilter: "blur(18px) saturate(1.2)",
        }}>
        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[15px]"
          style={{
            background: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrE+eYIqCqNEo2Qpd4u7toyJETIDGmcUo2LGKc2iVwiAkaFfRxNCMZIiaaAiCWKAYUBcwgF8OpVFzAKMKA+CEUBgnANAjaSDKlneEI4mGdUODsRlGeQjloOCweTwORoGgGDbtDADeIL4A6iM5iBE4RggdeI0A6g+8GBAREB7ARQhALNF2gebfMeqAaA45BTKgwE4HRaaACbA4bQApeYRAQORAYmF8CAY5I+gUARgVo1ACoH4uSsUQD1AIsoSpYARQBERADQCMA30BwFB4B6AhQNY+SRgJgBYDsOYAU4B+gAESDNADUACdDFH2_ARQLwA6gB4JGAiE3L1gURTy2AGb5HAEHnsAlw1o5AIBE0AowBl5MwCg2gA3A9MA5ABsE8AIwA3gAwkM0G2Oor7G4A264x6s8AI8rGD6RGDScGACeXAXgPQOAPg1YKA==')`,
            opacity: 0.1,
            zIndex: 1, 
          }}
        />
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 229, 255, 0.2), transparent 40%)`,
            zIndex: 2, // Ensure spotlight is above noise
          }} 
        />
        <div className="relative z-10 flex-shrink-0 flex flex-col items-center justify-start pt-1">
          <div className="rounded-full bg-black/60 border border-white/15 p-3 mb-2">
            {item.icon}
          </div>
          <span className="text-xs text-blue-200 font-caviar font-bold">{item.period}</span>
        </div>
        <div className="relative z-10 flex-1">
          <h3 className="mb-2">
            <ShinyText disabled={!isSelected} speed={5} className="font-bold text-xl font-caviar" style={{ letterSpacing: "0.01em" }}>
              {item.title}
            </ShinyText>
          </h3>
          <ul className="list-disc ml-5 mb-3 text-gray-200 font-caviar space-y-1 text-base">
            {item.description.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-2">
            {item.tags.map((tag) => (
              <span key={tag} 
                className="bg-cyan-400/10 text-cyan-300 font-semibold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider border border-cyan-400/20"
              >{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Experience: React.FC = () => (
  <div className="w-full">
    <AnimatedList
      items={EXPERIENCES}
      renderItem={(item, isSelected) => <ExperienceItem item={item} isSelected={isSelected} />}
      getKey={(item) => item.title}
    />
  </div>
);

export default Experience;
