import React from "react";
import { FaGithub, FaBolt } from "react-icons/fa";
import { SiWhatsapp, SiHtml5 } from "react-icons/si";

const EXPERIENCES = [
  {
    title: "A17 WhatsApp Userbot Contributor",
    period: "2024 – Project Closed",
    icon: <SiWhatsapp className="text-green-400 text-2xl" />,
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
    icon: <FaGithub className="text-gray-200 text-2xl" />,
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
    icon: <SiHtml5 className="text-orange-400 text-2xl" />,
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
    icon: <FaBolt className="text-blue-400 text-2xl" />,
    description: [
      "Developed an Instagram account creator bot using Selenium and the mail.tm API with support for manual email/code entry.",
      "Automated birthday handling, improved error handling, and ensured logging at every step.",
      "Focused on keeping all core features intact while fixing broken interactions."
    ],
    tags: ["Python", "Selenium", "Automation", "APIs"]
  }
];

const Experience: React.FC = () => (
  <section id="experience" className="w-full">
    <div className="flex flex-col gap-10">
      {EXPERIENCES.map((exp, idx) => (
        <div
          key={exp.title}
          className={`relative group transition-all duration-400 rounded-2xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-md px-7 py-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-8
            ${idx === 0 ? "ring-1 ring-blue-300/30" : ""}
          `}
        >
          <div className="flex-shrink-0 flex flex-col items-center justify-start pt-1">
            <div className="rounded-full bg-black/60 border border-white/15 p-3 mb-2">
              {exp.icon}
            </div>
            <span className="text-xs text-blue-200 font-caviar font-bold">{exp.period}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl font-caviar mb-1 text-blue-100" style={{letterSpacing: "0.01em"}}>
              {exp.title}
            </h3>
            <ul className="list-disc ml-5 mb-2 text-gray-200 font-caviar space-y-1 text-base">
              {exp.description.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-2">
              {exp.tags.map((tag) => (
                <span key={tag}
                  className="bg-blue-900/60 text-blue-200 font-semibold text-xs px-2 py-1 rounded-lg uppercase tracking-wide border border-blue-400/10"
                >{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Experience;
