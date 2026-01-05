
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/section-header';

const FoundersSection = () => {
  const founders = [
    {
      name: "Dr. Kritika",
      title: "Cosmetic Dentistry Specialist",
      bio: "With over 10 years of experience in cosmetic dentistry, Dr. Kritika brings artistry and precision to every smile makeover.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000"
    },
    {
      name: "Dr. Ashwin",
      title: "Implantology & Rehabilitation Expert",
      bio: "Dr. Ashwin specializes in complex dental rehabilitations, helping patients regain confidence and functionality.",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <section className="py-20 bg-peak-gray-100">
      <div className="container-custom">
        <SectionHeader 
          title="Meet Our Founders" 
          subtitle="Led by experienced dentists who are passionate about combining artistry with dental science."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {founders.map((founder, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm animate-on-scroll animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="mb-6 overflow-hidden rounded-xl">
                <img 
                  src={founder.image} 
                  alt={founder.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
              <h3 className="text-2xl font-medium mb-2">{founder.name}</h3>
              <p className="text-peak-gray-600 mb-4">{founder.title}</p>
              <p className="text-peak-gray-700 mb-6">{founder.bio}</p>
              <Link to="/about" className="inline-flex items-center text-peak-black font-medium hover:underline">
                Read More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
