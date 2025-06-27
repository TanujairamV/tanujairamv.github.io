import React from "react";
import {
  FaGithub,
  FaEnvelope,
  FaInstagram,
  FaTelegramPlane
} from "react-icons/fa";

// Removed useFadeInOnScroll import and usage

const aboutText = `As a developer, I’m dedicated to crafting beautiful, high-performance web experiences. I thrive on learning, exploring new technologies, and building projects that make a difference.`;

const socialIcons = [
  { href: "mailto:tanujairam.v@gmail.com", icon: <FaEnvelope />, label: "Email" },
  { href: "https://github.com/TanujairamV", icon: <FaGithub />, label: "GitHub" },
  { href: "https://instagram.com/tanujairam.v", icon: <FaInstagram />, label: "Instagram" },
  { href: "https://t.me/Tanujairam", icon: <FaTelegramPlane />, label: "Telegram" }
];

const gradientText = {
  background: "linear-gradient(90deg, #fff 80%, #888 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  backgroundClip: "text",
  color: "transparent"
};

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="w-full flex flex-col md:flex-row items-center md:items-center justify-start gap-8 md:gap-16 py-8 md:py-14"
    >
      {/* Image left */}
      <div className="flex-shrink-0 flex justify-center md:justify-start items-center w-full md:w-auto">
        <img
          src="pfp.png"
          alt="Tanujairam"
          className="rounded-2xl shadow-xl object-cover object-center"
          style={{
            width: 320,
            height: 320,
            maxWidth: 380,
            maxHeight: 380,
            minWidth: 200,
            minHeight: 200,
            display: "block"
          }}
        />
      </div>
      {/* Text & socials right */}
      <div className="flex flex-col items-center md:items-start w-full max-w-2xl">
        {/* Main Heading */}
        <div>
          <h1
            className="text-3xl md:text-5xl font-hatton font-bold mb-2 flex flex-wrap items-center"
            style={{
              ...gradientText,
              fontWeight: 700,
              lineHeight: 1.14,
              letterSpacing: "0.01em",
              wordBreak: "break-word"
            }}
          >
            hey, i'm&nbsp;
            <span className="font-caviar">Tanujairam</span>
          </h1>
        </div>
        {/* Subheading/About */}
        <div
          className="mt-2 mb-5 text-base md:text-lg font-caviar font-medium text-center md:text-left"
          style={{
            ...gradientText,
            fontWeight: 500,
            lineHeight: 1.5,
            maxWidth: 480,
            display: "block",
            letterSpacing: "0.02em",
            wordBreak: "break-word"
          }}
        >
          {aboutText}
        </div>
        {/* Social Icons */}
        <div className="flex flex-row mt-2 flex-wrap gap-5">
          {socialIcons.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              style={{
                fontSize: "2rem",
                background: "linear-gradient(90deg, #fff 5%, #b0b0b0 94%, #888 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "#fff",
                transition: "transform 0.14s, color 0.14s",
                position: "relative",
                zIndex: 1,
                cursor: "none"
              }}
              className="hover:scale-110 focus:scale-110 font-unica ripple social-icon"
              title={social.label}
              data-cursor="ne-arrow"
            >
              <span className="icon-main">{social.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
