import React from "react";
import { Parallax } from "react-scroll-parallax";
import { FiMail, FiGithub, FiInstagram, FiSend, FiLinkedin } from "react-icons/fi";
import { RiDiscordLine } from "react-icons/ri";
import ShinyText from "../Components/gradient";
import FadeContent from "../Components/FadeContent";

const aboutText = `As a developer, I’m dedicated to crafting beautiful, high-performance web experiences. I thrive on learning, exploring new technologies, and building projects that make a difference.`;

const socialLinks = [
  { href: "mailto:tanujairam.v@gmail.com", icon: FiMail, label: "Email" },
  { href: "https://github.com/TanujairamV", icon: FiGithub, label: "GitHub" },
  { href: "https://www.linkedin.com/in/tanujairam-v-a43478291/", icon: FiLinkedin, label: "LinkedIn" },
  { href: "https://discordapp.com/users/tanujairam", icon: RiDiscordLine, label: "Discord" },
  { href: "https://instagram.com/tanujairam.v", icon: FiInstagram, label: "Instagram" },
  { href: "https://t.me/Tanujairam", icon: FiSend, label: "Telegram" }
];

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="w-full flex flex-col md:flex-row items-center md:items-center justify-center gap-8 md:gap-16 px-4 py-8 md:py-14">
      {/* Image left */}
      <Parallax speed={-10} className="w-full md:w-auto">
        <FadeContent duration={800} delay={100} slide={true} blur={true}>
          <div className="flex-shrink-0 flex justify-center md:justify-start items-center hover:scale-105 transition-transform duration-300">
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
      </Parallax>
      {/* Text & socials right */}
      <div className="flex flex-col items-center md:items-start w-full max-w-2xl">
        {/* Main Heading */}
        <FadeContent duration={800} delay={200} slide={true} blur={true}>
          <h1
            className="text-5xl md:text-7xl font-manrope font-medium mb-2 flex flex-wrap items-center"
            style={{
              fontWeight: 500,
              lineHeight: 1.14,
              letterSpacing: "0.01em",
              wordBreak: "break-word"
            }}>
            <span className="inline-block mr-3">
              <ShinyText speed={4}>hey, i'm</ShinyText>
            </span>
            <span className="inline-block">
              <ShinyText speed={4}>Tanujairam</ShinyText>
            </span>
          </h1>
        </FadeContent>
        {/* Subheading/About */}
        <FadeContent duration={800} delay={300} slide={true} blur={true}>
          <p
            className="mt-2 mb-5 text-lg md:text-xl font-manrope font-normal text-center md:text-left"
            style={{
              fontWeight: 400,
              lineHeight: 1.5,
              maxWidth: 480,
              letterSpacing: "0.02em",
              wordBreak: "break-word"
            }}>
            <ShinyText speed={5}>{aboutText}</ShinyText>
          </p>
        </FadeContent>
        {/* Social Icons */}
        <div className="flex flex-row mt-2 flex-wrap gap-5">
          {socialLinks.map(({ href, icon: Icon, label }, index) => (
            <FadeContent
              key={href}
              duration={600}
              delay={400 + index * 150}
              slide={true}
              blur={true}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="font-unica ripple social-icon animate-shine block hover:scale-125 transition-transform duration-150"
                title={label}
                data-cursor="ne-arrow"
                style={{
                  fontSize: "2rem",
                  backgroundImage: "linear-gradient(90deg, #fff 5%, #b0b0b0 94%, #888 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animationDuration: "6s",
                  position: "relative",
                  zIndex: 1,
                }}>
                <Icon />
              </a>
            </FadeContent>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
 