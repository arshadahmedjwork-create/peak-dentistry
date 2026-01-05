
import React from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import { Award, Shield, Smile, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className={`pt-32 pb-16 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-100'}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-medium mb-6">About Us</h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
              Redefining dental care through compassion, precision, and elegance. Chennai's benchmark for luxury dental services.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-on-scroll animate-slide-in">
              <SectionHeader 
                title="Our Vision" 
                subtitle="To redefine dental care through compassion, precision, and elegance, becoming Chennai's benchmark for luxury dental services."
              />
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
                At PEAK Dentistry, we envision a future where dental care is not just about treating problems, but about enhancing lives through beautiful, healthy smiles. We aim to set new standards in dental care with our commitment to excellence, compassion for our patients, and conscience in our practice.
              </p>
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-xl animate-on-scroll animate-scale-in">
              <img 
                src="https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=1000" 
                alt="PEAK Dentistry Vision" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative rounded-xl overflow-hidden shadow-xl animate-on-scroll animate-scale-in">
              <img 
                src="https://images.unsplash.com/photo-1579684288361-5c1a2957a700?auto=format&fit=crop&q=80&w=1000" 
                alt="PEAK Dentistry Mission" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="order-1 md:order-2 animate-on-scroll animate-slide-in">
              <SectionHeader 
                title="Our Mission" 
                subtitle="World-class smile makeovers and patient-centric care using ADA-compliant practices and advanced dental technology."
              />
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
                Our mission is to provide unparalleled dental care that combines technical expertise with artistic vision. We are dedicated to creating personalized treatment plans that respect our patients' unique needs and desires, all while maintaining the highest standards of ethics and professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className={`py-20 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-100'}`}>
        <div className="container-custom">
          <SectionHeader 
            title="Our Core Values" 
            subtitle="At PEAK Dentistry, our practice is built on three fundamental pillars that guide everything we do."
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Commitment",
                description: "We are committed to providing patient-first excellence in every aspect of our dental care.",
                icon: <Shield className={isDark ? "text-white" : "text-peak-black"} size={24} />
              },
              {
                title: "Compassion",
                description: "We deliver gentle, ethical, and empathetic care that puts your comfort first.",
                icon: <Smile className={isDark ? "text-white" : "text-peak-black"} size={24} />
              },
              {
                title: "Conscience",
                description: "We practice transparent and ethical dentistry with integrity in everything we do.",
                icon: <Zap className={isDark ? "text-white" : "text-peak-black"} size={24} />
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll animate-fade-in ${isDark ? 'bg-peak-gray-800' : 'bg-white'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 ${isDark ? 'bg-peak-gray-700' : 'bg-peak-gray-200'}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                <p className={isDark ? 'text-gray-300' : 'text-peak-gray-600'}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader 
            title="Meet Our Founders" 
            subtitle="Led by experienced dentists who are passionate about combining artistry with dental science."
            center
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className={`p-8 rounded-xl shadow-sm animate-on-scroll animate-fade-in ${isDark ? 'bg-peak-gray-800' : 'bg-white'}`}>
              <div className="mb-6 overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dr. Kritika" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium mb-2">Dr. Kritika</h3>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-peak-gray-600'}`}>Cosmetic Dentistry Specialist</p>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
                With over 10 years of experience in cosmetic dentistry, Dr. Kritika brings artistry and precision to every smile makeover. She has trained with some of the world's leading cosmetic dentists and is passionate about helping patients achieve their dream smiles.
              </p>
              <ul className="space-y-2 mb-6 text-peak-gray-700">
                <li className="flex items-start">
                  <span className="text-peak-black mr-2">•</span>
                  <span>Masters in Cosmetic Dentistry from University of California</span>
                </li>
                <li className="flex items-start">
                  <span className="text-peak-black mr-2">•</span>
                  <span>Advanced certification in Smile Design from American Academy of Cosmetic Dentistry</span>
                </li>
                <li className="flex items-start">
                  <span className="text-peak-black mr-2">•</span>
                  <span>Member of the International Congress of Oral Implantologists</span>
                </li>
              </ul>
            </div>
            
            <div className={`p-8 rounded-xl shadow-sm animate-on-scroll animate-fade-in ${isDark ? 'bg-peak-gray-800' : 'bg-white'}`} style={{ animationDelay: '100ms' }}>
              <div className="mb-6 overflow-hidden rounded-xl">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000" 
                  alt="Dr. Ashwin" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium mb-2">Dr. Ashwin</h3>
              <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-peak-gray-600'}`}>Implantology & Rehabilitation Expert</p>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
                Dr. Ashwin specializes in complex dental rehabilitations, helping patients regain confidence and functionality. His approach combines technical expertise with a deep understanding of dental aesthetics, ensuring natural-looking results.
              </p>
              <ul className="space-y-2 mb-6 text-peak-gray-700">
                <li className="flex items-start">
                  <span className="text-peak-black mr-2">•</span>
                  <span>Fellowship in Implant Dentistry from New York University</span>
                </li>
                <li className="flex items-start">
                  <span className="text-peak-black mr-2">•</span>
                  <span>Certification in Advanced Full Mouth Rehabilitation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-peak-black mr-2">•</span>
                  <span>Specialized training in Laser Dentistry and Digital Smile Design</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-peak-black text-peak-white">
        <div className="container-custom">
          <SectionHeader 
            title="Our Achievements" 
            subtitle="Recognition of our commitment to excellence in dental care."
            center
            className="text-peak-white"
          />
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            <div className="bg-peak-gray-900 p-8 rounded-xl flex items-center max-w-sm animate-on-scroll animate-fade-in">
              <Award className="text-yellow-500 mr-4" size={48} />
              <div>
                <h3 className="text-xl font-medium mb-1">India's Best Dental Clinic</h3>
                <p className="text-peak-gray-400">2023 Award Winner</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/contact">
              <Button className="bg-peak-white text-peak-black hover:bg-peak-gray-200 flex items-center gap-2 mx-auto">
                Connect With Us
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
