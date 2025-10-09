import { FiInstagram, FiGithub, FiMail, FiSend } from "react-icons/fi";
import FadeContent from "./FadeContent";

const socialLinks = [
  { href: "https://instagram.com/tanujairam.v", icon: FiInstagram, label: "Instagram" },
  { href: "https://t.me/Tanujairam", icon: FiSend, label: "Telegram" },
  { href: "mailto:tanujairam.v@gmail.com", icon: FiMail, label: "Email" },
  { href: "https://github.com/TanujairamV", icon: FiGithub, label: "GitHub" }
];

const gradientStyle = {
  background: "linear-gradient(90deg, #fff 70%, #b0b0b0 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const Footer: React.FC = () => (
  <footer className="py-5 px-4 flex flex-col items-center gap-2 border-t border-white/10 bg-black">
    <nav aria-label="Social media links">
      <ul className="flex flex-row gap-5 mb-1">
        {socialLinks.map(({ href, icon: Icon, label }, index) => (
          <FadeContent
            key={href}
            duration={600}
            delay={100 + index * 150}
            threshold={0.1}
            slide={true}
            blur={true}>
            <li>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={gradientStyle}
                className="hover:scale-125 transition-transform duration-150 block"
                title={label}>
                <Icon size={24} />
              </a>
            </li>
          </FadeContent>
        ))}
      </ul>
    </nav>
    <FadeContent
      duration={600}
      delay={100 + socialLinks.length * 150}
      threshold={0.1}
      slide={true}
      blur={true}>
      <p
        className="text-xs select-none mt-1 font-medium"
        style={gradientStyle}>
        © 2025 Tanujairam &nbsp;|&nbsp; Built with React & TailwindCSS
      </p>
    </FadeContent>
  </footer>
);

export default Footer;