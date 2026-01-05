
import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import TeamSection from '@/components/sections/TeamSection';
import ServicesSection from '@/components/sections/ServicesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import GallerySection from '@/components/sections/GallerySection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import ClinicInfoSection from '@/components/sections/ClinicInfoSection';
import CallToActionSection from '@/components/sections/CallToActionSection';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import CoreValuesSection from '@/components/sections/CoreValuesSection';
import FoundersSection from '@/components/sections/FoundersSection';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';

const Index = () => {
  const animatedElementsRef = useRef<HTMLElement[]>([]);
  const pageLoadedRef = useRef(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { toast } = useToast();
  const { theme } = useTheme();
  const lastScrollTime = useRef(0);
  const lastMouseMoveTime = useRef(0);
  
  // Welcome toast for first-time visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      setTimeout(() => {
        toast({
          title: `Welcome to PEAK Dentistry`,
          description: "Scroll down to explore our premium dental services!",
          duration: 5000,
        });
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
    }
  }, [toast]);
  
  useEffect(() => {
    // Enable enhanced smooth scrolling with better easing
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Track scroll progress for progress indicator with throttling
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 100) return; // Throttle to 10fps
      lastScrollTime.current = now;
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    // Enhanced detection of animated elements with improved selectors
    const detectAnimatedElements = () => {
      const animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .scroll-fade-in, .scroll-scale-in, ' +
        '.scroll-slide-in-left, .scroll-slide-in-right, .stagger-children, ' + 
        '.reveal-on-scroll, .reveal-list, .reveal-clip, .section-transition, ' +
        '.text-reveal-lines'
      );
      
      animatedElementsRef.current = Array.from(animatedElements) as HTMLElement[];
    };
    
    // Enhanced animation trigger with better timing and threshold
    const animateScrollElements = () => {
      animatedElementsRef.current.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const triggerPoint = window.innerHeight * 0.8; // Slightly earlier trigger point
        
        if (elementTop < triggerPoint) {
          // Add animation classes based on the element's classes
          if (element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-fade-in');
          }
          
          // Add visible class for CSS transition animations
          if (element.classList.contains('scroll-fade-in') || 
              element.classList.contains('scroll-scale-in') || 
              element.classList.contains('scroll-slide-in-left') || 
              element.classList.contains('scroll-slide-in-right') ||
              element.classList.contains('stagger-children')) {
            element.classList.add('visible');
          }
          
          // Add revealed class for elements that should be revealed on scroll
          if (element.classList.contains('reveal-on-scroll') ||
              element.classList.contains('reveal-list') ||
              element.classList.contains('reveal-clip') ||
              element.classList.contains('text-reveal-lines')) {
            element.classList.add('revealed');
          }
          
          // Add active class for section transitions
          if (element.classList.contains('section-transition')) {
            element.classList.add('active');
          }
        }
      });
    };
    
    // Enhanced parallax effect with better performance using requestAnimationFrame and throttling
    const parallaxElements = document.querySelectorAll('.parallax');
    let rafId: number | null = null;
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveTime.current < 16) return; // Throttle to ~60fps
      lastMouseMoveTime.current = now;
      
      if (rafId) return; // Skip if already queued
      
      rafId = requestAnimationFrame(() => {
        rafId = null;
        parallaxElements.forEach((element) => {
          const parallaxLayers = element.querySelectorAll('.parallax-layer');
          
          const mouseX = e.clientX / window.innerWidth - 0.5;
          const mouseY = e.clientY / window.innerHeight - 0.5;
          
          parallaxLayers.forEach((layer, index) => {
            const depth = index + 1;
            const moveX = mouseX * depth * 25;
            const moveY = mouseY * depth * 25;
            
            const htmlElement = layer as HTMLElement;
            htmlElement.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
          });
        });
      });
    };
    
    // Apply tilt effect to elements with tilt-element class
    const tiltElements = document.querySelectorAll('.tilt-element');
    
    const handleTiltMouseMove = (e: MouseEvent) => {
      tiltElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const tiltAmount = 10;
        const tiltX = percentY * tiltAmount;
        const tiltY = -percentX * tiltAmount;
        
        const htmlElement = element as HTMLElement;
        htmlElement.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });
    };
    
    // Run once on page load
    if (!pageLoadedRef.current) {
      detectAnimatedElements();
      animateScrollElements();
      pageLoadedRef.current = true;
    }
    
    // Set up event listeners with passive flag for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', animateScrollElements, { passive: true });
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousemove', handleTiltMouseMove, { passive: true });
    window.addEventListener('resize', detectAnimatedElements, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', animateScrollElements);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleTiltMouseMove);
      window.removeEventListener('resize', detectAnimatedElements);
    };
  }, []);

  return (
    <Layout>
      {/* Progressive scroll indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className={`h-full ${theme === 'dark' ? 'bg-white' : 'bg-peak-black'} transition-all duration-100 ease-out`}
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      <HeroSection />
      <AboutSection />
      <CoreValuesSection />
      <ServicesSection />
      <TeamSection />
      <FoundersSection />
      <GallerySection />
      <TestimonialsSection />
      <ClinicInfoSection />
      <BlogPreviewSection />
      <CallToActionSection />
      <ScrollToTop />
    </Layout>
  );
};

export default Index;
