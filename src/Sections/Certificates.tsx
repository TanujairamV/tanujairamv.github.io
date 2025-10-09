import React from "react";
import { FiAward, FiExternalLink } from "react-icons/fi";

// --- Data ---
// For larger projects, consider moving this to a separate file (e.g., src/data/certificates.ts)
interface Certificate {
  title: string;
  issuer: string;
  year: number;
  image: string;
  description: string;
  link?: string;
}

const certificatesData: Certificate[] = [
  {
    title: "Data Science and AI Completion",
    issuer: "IIT Madras",
    year: 2024,
    image: "/assets/ds.jpg", // Use a public path string
    description:
      "Awarded for the successful completion of the 8-week certification course in Data Science and Artificial Intelligence.",
    link: "https://www.schoolconnect.iitm.ac.in/", // Example link
  },
  // Add more certificates as needed
];

// --- CertificateCard Component ---
// This component handles the display and interaction for a single certificate.
const CertificateCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => {
  const [shown, setShown] = React.useState(false);

  const handleToggle = () => setShown((prev) => !prev);

  return (
    <div
      className="flex flex-col items-center justify-center w-full max-w-md p-7 rounded-2xl bg-white/20 dark:bg-neutral-900/30 shadow-xl backdrop-blur-xl border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 select-none mt-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] focus:scale-[1.02]"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleToggle();
      }}
      role="button"
      aria-pressed={shown}
      aria-describedby="cert-helper-text"
      aria-label={`View certificate for ${certificate.title}`}
    >
      {/* Title */}
      <div
        className="mb-1 w-full flex flex-row justify-center items-center gap-2 text-center text-[1.18rem] font-bold tracking-wider leading-relaxed font-grotesk bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent"
      >
        <FiAward className="text-blue-300 drop-shadow" />
        {certificate.title}
      </div>

      {/* Issuer and Year */}
      <div className="relative flex flex-row items-center justify-center gap-2 mb-1 w-full text-center">
        <span className="text-gray-300 text-base font-medium">{certificate.issuer}</span>
        <span className="text-gray-400 text-xs">·</span>
        <span className="text-gray-400 text-xs">{certificate.year}</span>
        {certificate.link && (
          <a
            href={certificate.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group/link ml-2 text-gray-400 hover:text-blue-300 transition-colors"
            aria-label="Verify certificate (opens in a new tab)"
          >
            <FiExternalLink />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/link:opacity-100">
              Verify
            </span>
          </a>
        )}
      </div>

      {/* Content Area (Description or Image) */}
      <div className="grid place-items-center w-full min-h-[85px] text-center">
        {/* Description */}
        <p
          style={{ gridArea: "1 / 1" }}
          className={`w-full px-2 py-2 font-grotesk tracking-wide text-gray-400 text-xs text-center transition-all duration-300 ease-in-out ${
            shown ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {certificate.description}
        </p>

        {/* Image */}
        <div
          style={{ gridArea: "1 / 1" }}
          className={`flex items-center justify-center transition-all duration-300 ease-in-out ${
            shown ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <img
            src={certificate.image}
            alt={certificate.title}
            // When hidden, prevent it from being interactive or announced by screen readers
            aria-hidden={!shown}
            className="max-w-xs w-full h-auto rounded-xl shadow-lg border border-white/10 block mx-auto bg-white/20"
            tabIndex={-1}
            draggable={false}
          />
        </div>
      </div>

      {/* Helper Text */}
      <div id="cert-helper-text" className="text-xs text-gray-500 mt-2 text-center w-full">
        {shown ? "Click to hide certificate" : "Click to view certificate"}
      </div>
    </div>
  );
};

// --- Main Certificates Component ---
// This component is responsible for laying out all the certificate cards.
const Certificates: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-start">
      {certificatesData.map((cert) => (
        <CertificateCard key={cert.title} certificate={cert} />
      ))}
    </div>
  );
};

export default Certificates;
