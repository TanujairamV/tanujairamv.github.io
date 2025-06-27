import { FaInstagram, FaGithub, FaEnvelope } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
const socialLinks = [
  { href: "https://instagram.com/tanujairam.v", icon: FaInstagram, label: "Instagram" },
  { href: "https://t.me/Tanujairam", icon: FaTelegramPlane, label: "Telegram" },
  { href: "mailto:tanujairam.v@gmail.com", icon: FaEnvelope, label: "Email" },
  { href: "https://github.com/TanujairamV", icon: FaGithub, label: "GitHub" }
];
// Removed the extra closing bracket here

const gradientStyle = {
  background: "linear-gradient(90deg, #fff 70%, #b0b0b0 100%)",
  WebkitBackgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
};

const Footer: React.FC = () => (
  <footer className="py-5 px-4 flex flex-col items-center gap-2 border-t border-white/10 bg-[#181824]">
    <nav aria-label="Social media links">
      <ul className="flex flex-row gap-5 mb-1">
        {socialLinks.map(({ href, icon: Icon, label }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={gradientStyle}
              className="hover:scale-125 transition-transform duration-150"
              title={label}
            >
              <Icon size={26} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
    <p
      className="text-xs select-none mt-1 font-medium"
      style={gradientStyle}
    >
      © 2025 Tanujairam &nbsp;|&nbsp; Built with React & TailwindCSS
    </p>
  </footer>
);

export default Footer;