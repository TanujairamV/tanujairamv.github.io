import React from "react";
import { FaCertificate } from "react-icons/fa";

console.debug("[Debug] Certificates component file loaded");

const certificates = [
  {
    title: "Data Science and AI Completion",
    issuer: "IIT Madras",
    year: 2024,
    image: "ds.jpg", // Make sure ds.jpg is in your public folder
    description:
      "Certificate awarded by IIT Madras for successfully completing the Data Science and Artificial Intelligence course.",
  },
  // Add more certificates as needed
];

const gradientTextStyle = {
  background: "linear-gradient(90deg, #fff 70%, #b0b0b0 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontFamily: "'Space Grotesk', 'Poppins', 'Montserrat', sans-serif",
  fontWeight: 700,
  fontSize: "1.18rem",
  letterSpacing: ".02em",
  lineHeight: 1.6,
  display: "inline-block",
  cursor: "pointer",
  textAlign: "center",
  width: "100%",
} as React.CSSProperties;

const Certificates: React.FC = () => {
  // Only show the first certificate (remove multiple boxes)
  const cert = certificates[0];
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    console.debug("[Debug] Certificates component rendered");
    console.debug("[Debug] Certificates data:", certificates);
  }, []);

  const handleToggle = () => setShown((prev) => !prev);

  return (
    <div className="w-full flex justify-center items-start">
      <div
        className="flex flex-col items-center justify-center w-full max-w-md p-7 rounded-2xl bg-white/20 dark:bg-neutral-900/30 shadow-xl backdrop-blur-xl border border-white/10 group cursor-pointer"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleToggle();
        }}
        role="button"
        aria-pressed={shown}
        style={{
          userSelect: "none",
          outline: "none",
          marginTop: "2rem",
        }}
      >
        <div
          className="mb-1 w-full flex flex-row justify-center items-center gap-2 text-center"
          style={gradientTextStyle}
        >
          <FaCertificate className="text-blue-300 drop-shadow" />
          {cert.title}
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mb-1 w-full text-center">
          <span className="text-gray-300 text-base font-medium">{cert.issuer}</span>
          <span className="text-gray-400 text-xs">·</span>
          <span className="text-gray-400 text-xs">{cert.year}</span>
        </div>
        <div className="flex justify-center items-center w-full min-h-[85px] text-center">
          {!shown ? (
            <div
              className="text-gray-400 text-xs text-center w-full flex justify-center items-center"
              style={{
                fontFamily: "'Space Grotesk', 'Poppins', 'Montserrat', sans-serif",
                fontWeight: 400,
                letterSpacing: ".011em",
                padding: "0.5rem 0",
                textAlign: "center",
              }}
            >
              {cert.description}
            </div>
          ) : (
            <img
              src={cert.image}
              alt={cert.title}
              className="max-w-xs w-full h-auto rounded-xl shadow-lg border border-white/10 transition block mx-auto"
              style={{ marginTop: 2, background: "#fff3" }}
              tabIndex={-1}
              draggable={false}
              onError={() =>
                console.debug(`[Debug] Failed to load image: ${cert.image}`)
              }
            />
          )}
        </div>
        <div className="text-xs text-gray-500 mt-2 select-none text-center w-full flex justify-center items-center">
          {shown
            ? "Click anywhere to hide certificate"
            : "Click anywhere to view certificate"}
        </div>
      </div>
    </div>
  );
};

export default Certificates;
