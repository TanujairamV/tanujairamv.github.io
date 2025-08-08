import React from "react";
import {
  SiGmail,
  SiGithub,
  SiInstagram,
  SiTelegram,
} from "react-icons/si";
import ShinyText from "../Components/gradient";
import FadeContent from "../Components/FadeContent";

// Removed useFadeInOnScroll import and usage

const aboutText = `As a developer, I’m dedicated to crafting beautiful, high-performance web experiences. I thrive on learning, exploring new technologies, and building projects that make a difference.`;

const socialIcons = [
  { href: "mailto:tanujairam.v@gmail.com", icon: <SiGmail />, label: "Email" },
  { href: "https://github.com/TanujairamV", icon: <SiGithub />, label: "GitHub" },
  { href: "https://instagram.com/tanujairam.v", icon: <SiInstagram />, label: "Instagram" },
  { href: "https://t.me/Tanujairam", icon: <SiTelegram />, label: "Telegram" }
];

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="w-full flex flex-col md:flex-row items-center md:items-center justify-start gap-8 md:gap-16 py-8 md:py-14"
    >
      {/* Image left */}
      <FadeContent blur={true} duration={1000} delay={1000}>
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
      </FadeContent>
      {/* Text & socials right */}
      <FadeContent blur={true} duration={700} delay={3000}>
        <div className="flex flex-col items-center md:items-start w-full max-w-2xl">
          {/* Main Heading */}
          <div>
            <h1
              className="text-3xl md:text-5xl font-hatton font-bold mb-2 flex flex-wrap items-center"
              style={{
                fontWeight: 700,
                lineHeight: 1.14,
                letterSpacing: "0.01em",
                wordBreak: "break-word"
              }}
            >
              <ShinyText speed={4}>
                hey, i'm&nbsp;
                <span className="font-caviar">Tanujairam</span>
              </ShinyText>
            </h1>
          </div>
          {/* Subheading/About */}
          <div
            className="mt-2 mb-5 text-base md:text-lg font-caviar font-medium text-center md:text-left"
            style={{
              fontWeight: 500,
              lineHeight: 1.5,
              maxWidth: 480,
              display: "block",
              letterSpacing: "0.02em",
              wordBreak: "break-word"
            }}
          >
            <ShinyText speed={5}>{aboutText}</ShinyText>
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
                className="hover:scale-110 focus:scale-110 font-unica ripple social-icon animate-shine"
                title={social.label}
                data-cursor="ne-arrow"
                style={{
                  fontSize: "2rem",
                  backgroundImage: "linear-gradient(90deg, #fff 5%, #b0b0b0 94%, #888 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transition: "transform 0.14s",
                  animationDuration: "6s",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span className="icon-main">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>
      </FadeContent>
    </section>
  );
};

export default Hero;
