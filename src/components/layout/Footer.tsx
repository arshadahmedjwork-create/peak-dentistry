
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const Footer = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' 
    ? "/lovable-uploads/269f56a7-f61d-4578-99e4-075f5fc6f5fe.png" 
    : "/lovable-uploads/5a8bb037-3da9-4a17-92c7-9452dea12a35.png";

  return (
    <footer className="bg-peak-black text-peak-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <img 
                src={logoSrc} 
                alt="PEAK DENTISTRY" 
                className="h-14"
              />
            </div>
            <p className="mb-6 text-peak-gray-300 max-w-xs">
              Luxury smile makeovers by award-winning specialists, delivered with care that's deeply personal.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-white hover:text-peak-gray-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-peak-gray-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-white hover:text-peak-gray-300 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-peak-gray-300 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-peak-gray-300 hover:text-white transition-colors">Smile Design & Makeover</Link></li>
              <li><Link to="/services" className="text-peak-gray-300 hover:text-white transition-colors">Cosmetic Dentistry</Link></li>
              <li><Link to="/services" className="text-peak-gray-300 hover:text-white transition-colors">Implantology & Full Mouth Rehab</Link></li>
              <li><Link to="/services" className="text-peak-gray-300 hover:text-white transition-colors">Laser Dentistry</Link></li>
              <li><Link to="/services" className="text-peak-gray-300 hover:text-white transition-colors">Pediatric & Preventive Dentistry</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-peak-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-peak-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-peak-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-peak-gray-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-peak-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-peak-gray-300 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 shrink-0 text-white" size={18} />
                <span className="text-peak-gray-300">B38, Prithvi Avenue 2nd Street, Abiramapuram, Alwarpet, Chennai – 600018</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 shrink-0 text-white" size={18} />
                <a href="tel:+917373044044" className="text-peak-gray-300 hover:text-white transition-colors">+91 73 73 044 044</a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 shrink-0 text-white" size={18} />
                <a href="mailto:contact@peak-dentistry.com" className="text-peak-gray-300 hover:text-white transition-colors">contact@peak-dentistry.com</a>
              </li>
              <li className="flex items-center">
                <Clock className="mr-2 shrink-0 text-white" size={18} />
                <span className="text-peak-gray-300">Mon–Fri: 10:30 AM – 7:30 PM, Sat: 10:30 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-peak-gray-800 mb-6" />

        <div className="text-center text-peak-gray-400 text-sm">
          <p>© {new Date().getFullYear()} PEAK Dentistry. All rights reserved.</p>
          <p className="mt-2">Commitment. Compassion. Conscience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
