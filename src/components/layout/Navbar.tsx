import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Phone, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/269f56a7-f61d-4578-99e4-075f5fc6f5fe.png" 
    : "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png";

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? `py-3 ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-md shadow-md` 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <img 
            src={logoSrc}
            alt="PEAK DENTISTRY" 
            className="h-12 md:h-14"
          />
        </NavLink>

        <nav className="hidden lg:flex items-center space-x-10">
          <NavLink to="/" className={`nav-link font-medium ${theme === 'dark' ? 'text-white text-shadow-md' : 'text-peak-black'}`}>Home</NavLink>
          <NavLink to="/services" className={`nav-link font-medium ${theme === 'dark' ? 'text-white text-shadow-md' : 'text-peak-black'}`}>Services</NavLink>
          <NavLink to="/patient-portal" className={`nav-link font-medium ${theme === 'dark' ? 'text-white text-shadow-md' : 'text-peak-black'}`}>Patient Portal</NavLink>
          <NavLink to="/about" className={`nav-link font-medium ${theme === 'dark' ? 'text-white text-shadow-md' : 'text-peak-black'}`}>About Us</NavLink>
          <NavLink to="/blog" className={`nav-link font-medium ${theme === 'dark' ? 'text-white text-shadow-md' : 'text-peak-black'}`}>Blog</NavLink>
          <NavLink to="/contact" className={`nav-link font-medium ${theme === 'dark' ? 'text-white text-shadow-md' : 'text-peak-black'}`}>Contact</NavLink>
          <Button onClick={toggleTheme} size="icon" variant="ghost" className="ml-2">
            {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} />}
          </Button>
          <Link to="/contact">
            <Button className="btn-primary flex items-center gap-2">
              <Phone size={16} />
              Book Appointment
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          <Button onClick={toggleTheme} size="icon" variant="ghost">
            {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} />}
          </Button>
          <button
            className="lg:hidden z-50 p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} className={theme === 'dark' ? 'text-white' : ''} /> : 
            <Menu size={24} className={theme === 'dark' ? 'text-white' : ''} />}
          </button>
        </div>

        <div 
          className={`fixed inset-0 ${theme === 'dark' ? 'bg-peak-black' : 'bg-peak-white'} z-40 flex flex-col justify-center items-center space-y-8 
          transition-all duration-300 ease-in-out transform lg:hidden
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
          <div className="mb-10">
            <img 
              src={logoSrc}
              alt="PEAK DENTISTRY" 
              className="h-16"
            />
          </div>
          <NavLink to="/" className="text-2xl font-medium dark-theme-text" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/services" className="text-2xl font-medium dark-theme-text" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/patient-portal" className="text-2xl font-medium dark-theme-text" onClick={closeMenu}>Patient Portal</NavLink>
          <NavLink to="/about" className="text-2xl font-medium dark-theme-text" onClick={closeMenu}>About Us</NavLink>
          <NavLink to="/blog" className="text-2xl font-medium dark-theme-text" onClick={closeMenu}>Blog</NavLink>
          <NavLink to="/contact" className="text-2xl font-medium dark-theme-text" onClick={closeMenu}>Contact</NavLink>
          <Link to="/contact" onClick={closeMenu}>
            <Button className="btn-primary mt-6 flex items-center gap-2">
              <Phone size={16} />
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
