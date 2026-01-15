
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { useMagnetic } from '@/hooks/use-magnetic';
import { Link } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enhanced magnetic effect for buttons
  const [bookButtonRef, { isHovering: isBookHovering }] = useMagnetic<HTMLButtonElement>({
    strength: 40,
    scale: 1.08
  });

  const [exploreButtonRef, { isHovering: isExploreHovering }] = useMagnetic<HTMLButtonElement>({
    strength: 30,
    scale: 1.05
  });

  // Video playback control
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.8; // Slightly slower for better visual impact
    }
  }, []);

  // Text animation setup
  const headingSpans = [
    { text: "Commitment.", delay: 0.2 },
    { text: "Compassion.", delay: 0.4 },
    { text: "Conscience.", delay: 0.6 }
  ];

  return (
    <section className={`min-h-screen pt-32 pb-16 relative flex items-center overflow-hidden ${!isDark ? 'bg-peak-gray-100' : ''}`}>
      {/* Enhanced overlay for better text visibility with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 z-0"></div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-0"></div>

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://cdn.pixabay.com/vimeo/149019283/smiles-2165.mp4?width=1280&hash=eb9bca5ee21e9bfacc2506a6f54e6ecd7c63c2a7" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <AnimatedGradient />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-fade-in">
            {/* Enhanced premium tag with better animation */}
            <div className="mb-6 flex items-center gap-2 reveal-list">
              <div className="w-12 h-0.5 bg-white/80"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-white text-shadow-lg px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">Premium Dental Care</span>
            </div>

            {/* Enhanced heading with better animations and visibility */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight text-reveal-lines revealed">
              {headingSpans.map((span, index) => (
                <span key={index} className="text-white block text-contrast-white mb-2 text-shadow-xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                  {span.text}
                </span>
              ))}
            </h1>

            {/* Enhanced paragraph with better contrast */}
            <p className="text-xl md:text-2xl text-white mb-10 max-w-xl text-shadow-lg leading-relaxed text-highlight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              Luxury smile makeovers by award-winning specialists, delivered with care that's deeply personal.
            </p>

            {/* Enhanced button section with better animations */}
            <div className="flex flex-wrap gap-6 stagger-children visible">
              <Link to="/patient-portal" className="hover-pulse-highlight">
                <Button
                  ref={bookButtonRef}
                  className="btn-primary px-8 py-6 text-lg flex items-center gap-3 button-3d ripple-button"
                  size="lg"
                >
                  <Calendar size={20} className={`${isBookHovering ? 'animate-pulse' : ''}`} />
                  <span>Book Appointment</span>
                </Button>
              </Link>
              <Link to="/services" className="hover-lift">
                <Button
                  ref={exploreButtonRef}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-peak-black px-8 py-6 text-lg flex items-center gap-3 button-3d ripple-button"
                  size="lg"
                >
                  <MessageSquare size={20} className={`${isExploreHovering ? 'animate-pulse' : ''}`} />
                  <span>Explore Our Services</span>
                </Button>
              </Link>
            </div>

            {/* New badge for added visual interest */}
            <div className="mt-16 inline-block">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-shadow-sm animate-pulse-soft">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
                <span className="text-sm">Accepting New Patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
