import { motion } from 'framer-motion';
import React from 'react';
import {
  FaJs, FaPython, FaHtml5, FaCss3Alt, FaNodeJs, FaGitAlt, FaGithub,
  FaBug, FaTerminal, FaCodeBranch, FaCogs
} from 'react-icons/fa';
import {
  SiTypescript, SiTailwindcss, SiExpress, SiPython
  // Note: SiVisualstudiocode is not present in your react-icons version, so fallback to FaTerminal or another icon for VS Code
} from 'react-icons/si';
import { TbApi } from "react-icons/tb";
import { MdSettingsSystemDaydream, MdSecurity, MdExtension } from "react-icons/md";

// Extended skills from your list (including the original and new ones)
const skills = [
  "Python", "JavaScript", "TypeScript", "HTML", "CSS", "TailwindCSS", "Bash", "Selenium", "Tkinter", "Git", "GitHub", "GitHub Actions", "VS Code",
  "REST APIs", "GitHub Pages", "Custom ROMs", "TWRP", "ADB", "Fastboot", "Node.js", "Express.js", "Open-source collaboration", "Debugging", "CI/CD workflows"
];

// Map skills to icons
const skillIconMap: Record<string, React.ReactNode> = {
  Python: <FaPython className="text-yellow-300" />,
  JavaScript: <FaJs className="text-yellow-400" />,
  TypeScript: <SiTypescript className="text-blue-300" />,
  HTML: <FaHtml5 className="text-orange-400" />,
  CSS: <FaCss3Alt className="text-blue-400" />,
  TailwindCSS: <SiTailwindcss className="text-cyan-300" />,
  Bash: <FaTerminal className="text-green-300" />,
  Selenium: <FaBug className="text-green-400" />,
  Tkinter: <SiPython className="text-yellow-200" />, // Uses Python icon for Tkinter
  Git: <FaGitAlt className="text-orange-500" />,
  GitHub: <FaGithub />,
  "GitHub Actions": <FaCodeBranch className="text-blue-400" />,
  "VS Code": <FaTerminal className="text-blue-400" />, // Fallback, since SiVisualstudiocode is not available
  "REST APIs": <TbApi className="text-emerald-300" />,
  "GitHub Pages": <FaGithub className="text-purple-300" />,
  "Custom ROMs": <MdExtension className="text-pink-400" />,
  TWRP: <MdSettingsSystemDaydream className="text-blue-400" />,
  ADB: <FaTerminal className="text-gray-300" />,
  Fastboot: <FaTerminal className="text-gray-300" />,
  "Node.js": <FaNodeJs className="text-green-600" />,
  "Express.js": <SiExpress className="text-gray-100" />,
  "Open-source collaboration": <FaCogs className="text-green-200" />,
  Debugging: <FaBug className="text-red-400" />,
  "CI/CD workflows": <MdSecurity className="text-yellow-400" />,
};

const gradientTextClass =
  'bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 invert-on-hover';

const Skillchip: React.FC = () => {
  // Duplicate skills to enable smooth infinite scrolling
  const scrollingSkills = [...skills, ...skills];

  return (
    // Changed from section to div to avoid nested sections and removed redundant title
    <div className="w-full pt-2 pb-4">
      <div className="overflow-x-auto scrollbar-hide w-full">
        <div
          className="flex flex-nowrap gap-3 px-2 py-3"
          style={{
            animation: "scroll-left 40s linear infinite",
            minWidth: "100%",
            whiteSpace: "nowrap",
          }}
        >
          {scrollingSkills.map((skill, idx) => {
            const icon = skillIconMap[skill] || null;
            return (
              <motion.span
                className={`inline-flex items-center gap-2 bg-foreground/10 text-foreground px-3 py-1 rounded-full text-base font-space-grotesk ${gradientTextClass} mr-2 mb-2`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                aria-label={skill}
                title={skill}
                key={skill + idx}
              >
                {icon}
                <span>{skill}</span>
              </motion.span>
            );
          })}
        </div>
      </div>
      {/* Add this keyframes style globally or here */}
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default React.memo(Skillchip);
