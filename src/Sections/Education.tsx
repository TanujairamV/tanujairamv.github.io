import React from "react";
import { FaSchool, FaGraduationCap } from "react-icons/fa";

// Your education data
const educationData = [
  {
    school: "St. Joseph’s Matriculation Higher Secondary School",
    location: "Hosur, Tamil Nadu, India",
    period: "2013 – 2017",
    details: [
      "Early foundational education",
      "Developed interest in mathematics and computers at a young age",
    ],
    grade: "Grade 1 to 4",
    icon: <FaSchool className="text-2xl text-indigo-300" />,
  },
  {
    school: "Sri Balaji Gurukulam Matriculation Higher Secondary School",
    location: "Srimushnam, Tamil Nadu, India",
    period: "2017 – 2023",
    details: [
      "Completed Middle and High School education under Tamil Nadu State Board",
      "Actively participated in science fairs and inter-school competitions",
    ],
    grade: "Grade 5 to 10",
    icon: <FaSchool className="text-2xl text-teal-300" />,
  },
  {
    school: "FIITJEE, Chennai",
    location: "Chennai, Tamil Nadu, India",
    period: "2023 – Present",
    details: [
      "Enrolled in the prestigious IIT-JEE preparation program",
      "Focus on Physics, Chemistry, Mathematics, and Computer Science",
    ],
    grade: "Grade 11 to Present",
    icon: <FaGraduationCap className="text-2xl text-blue-300" />,
  },
];

// Animation on scroll hook (Intersection Observer)
const useScrollFadeIn = () => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.classList.add("in-view");
      },
      { threshold: 0.18 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
};

const Education: React.FC = () => {
  return (
    <section
      id="education"
      className="relative py-12 flex flex-col items-center"
    >
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Vertical timeline line */}
        <div
          className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-200/80 via-gray-400/30 to-gray-100/0 z-0"
          aria-hidden="true"
          style={{ borderRadius: "10px" }}
        ></div>
        <ol className="flex flex-col gap-14 md:gap-20">
          {educationData.map((item, idx) => {
            const fadeRef = useScrollFadeIn();
            return (
              <li
                key={idx}
                className={`
                  group relative flex flex-row items-start fade-in-up
                `}
                style={{ animationDelay: `${idx * 0.1 + 0.2}s` }}
                data-animate
                ref={fadeRef as any}
              >
                {/* Timeline dot and connector */}
                <div className="flex flex-col items-center z-10" style={{ minWidth: "56px" }}>
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span
                      className={`
                        animate-pulse
                        absolute inline-flex h-full w-full rounded-full bg-gradient-to-br from-indigo-200 via-blue-100 to-gray-100 opacity-60
                        group-hover:scale-110 group-hover:opacity-80 transition
                      `}
                    ></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-white via-indigo-400 to-blue-300 shadow"></span>
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      {item.icon}
                    </span>
                  </span>
                  {idx !== educationData.length - 1 && (
                    <span className="h-[90px] w-0.5 bg-gradient-to-b from-indigo-200/90 to-gray-100/0"></span>
                  )}
                </div>
                {/* Glassy School Card */}
                <div
                  className={`
                    relative mt-2 ml-6 md:w-[calc(100%-56px)] w-full
                    rounded-2xl bg-white/40 dark:bg-neutral-900/40 shadow-xl shadow-gray-700/10
                    px-6 py-5 md:py-7
                    transition-transform
                    hover:scale-[1.027] hover:bg-white/70 dark:hover:bg-neutral-900/60 hover:shadow-2xl
                    backdrop-blur-xl
                    text-left
                    cursor-pointer
                  `}
                  style={{
                    // Glassmorphism effect
                    backdropFilter: "blur(18px) saturate(1.2)",
                    WebkitBackdropFilter: "blur(18px) saturate(1.2)",
                    border: "1.5px solid rgba(255,255,255,0.10)",
                  }}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {item.school}
                    </span>
                  </div>
                  <div className="text-md font-medium text-gray-600 dark:text-gray-300 mb-0.5">
                    {item.grade}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.location}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">{item.period}</div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside mt-1">
                    {item.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {/* Animation styles */}
      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(44px) scale(0.98);
          transition: opacity 0.7s cubic-bezier(.42,.03,.36,1), transform 0.7s cubic-bezier(.42,.03,.36,1);
        }
        .fade-in-up.in-view {
          opacity: 1 !important;
          transform: translateY(0) scale(1);
        }
      `}</style>
      {/* Intersection Observer animation script */}
      <script dangerouslySetInnerHTML={{
        __html: `
        (() => {
          function handleIntersect(entries) {
            entries.forEach(entry => {
              if(entry.isIntersecting) {
                entry.target.classList.add('in-view');
              }
            });
          }
          const observer = new window.IntersectionObserver(handleIntersect, { threshold: 0.18 });
          document.querySelectorAll('[data-animate].fade-in-up').forEach(el => observer.observe(el));
        })();
      `}} />
    </section>
  );
};

export default Education;
