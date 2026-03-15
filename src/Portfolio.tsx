import React from "react";
import { ParallaxProvider } from "react-scroll-parallax";

// Components
import Navbar from "./Components/NavBar";
import Background from "./Components/bg";
import Footer from "./Components/Footer";
import Cursor from "./Components/Cursor";
import Intro from "./Components/Intro";
import NowPlaying from "./Components/NowPlaying";
import ShinyText from "./Components/gradient";
import Noise from "./Components/Noise";

// Sections
import Hero from "./Sections/Hero";
import Skills from "./Sections/Skills";
import Projects from "./Sections/Projects";
import Education from "./Sections/Education";
import Experience from "./Sections/Experience";
import Certificates from "./Sections/Certificates";
import Contact from "./Sections/Contact";

import "./Styles.css";

// Error Boundary for production safety
function withErrorBoundary<P extends object>(Component: React.ComponentType<P>) {
  return class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null as any };

    static getDerivedStateFromError(error: any) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      // You can also log the error to an error reporting service
      console.error("Uncaught error:", error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div style={{ color: "red", background: "#181824", padding: 24, borderRadius: 12 }}>
            <h2>Something went wrong rendering this section.</h2>
            <pre style={{ fontSize: 14 }}>{String(this.state.error)}</pre>
          </div>
        );
      }
      return <Component {...(this.props as P)} />;
    }
  };
}

const sectionHeading = (text: string, icon?: React.ReactNode) => (
  <div className="flex items-center gap-2 mb-6">
    {icon}
    <ShinyText speed={5} className="text-4xl font-bold font-manrope">
      {text}
    </ShinyText>
  </div>
);

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = "mb-20" }) => (
  <section id={id} className={className}>
    {sectionHeading(title)}
    {children}
  </section>
);

const Portfolio: React.FC = () => {
  return (
    <ParallaxProvider>
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-manrope">
        {/* Intro, particles, cursor, and navigation */}
        <Intro />
        <Background showParticles={true} particleCount={30} />
        <Cursor />
        <Navbar />
        <Noise patternAlpha={8} />

        <main className="relative z-10 w-full max-w-7xl mx-auto pt-24 pb-16 px-4 md:px-8 flex flex-col gap-14">
          <Hero />

          {/* Now Playing */}
          <div className="flex justify-center mb-12">
            <NowPlaying />
          </div>

          <Section id="skills" title="Skills">
            <Skills />
          </Section>

          <Section id="experience" title="Experience">
            <Experience />
          </Section>

          <Section id="education" title="Education">
            <Education />
          </Section>

          <Section id="certificates" title="Certificates">
            <Certificates />
          </Section>

          <Section id="projects" title="Projects">
            <Projects />
          </Section>

          <Section id="contact" title="Contact" className="mb-10">
            <Contact />
          </Section>
        </main>
        <Footer />
      </div>
    </ParallaxProvider>
  );
};

export default withErrorBoundary(Portfolio);
