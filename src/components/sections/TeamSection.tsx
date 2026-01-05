
import React from 'react';
import SectionHeader from '@/components/ui/section-header';
import { Card, CardContent } from '@/components/ui/card';
import { LinkedinIcon, InstagramIcon } from 'lucide-react';

const doctors = [
  {
    name: 'Dr. Ashwin Rajan D',
    role: 'Specialist in Teeth Alignment',
    bio: 'With over 10 years of experience in orthodontics, Dr. Ashwin specializes in creating perfect smiles with minimal intervention.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
  },
  {
    name: 'Dr. Krithika Datta',
    role: 'Root Canal & Veneers Expert',
    bio: 'Dr. Krithika combines precision with artistry to deliver pain-free root canals and natural-looking veneers.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  },
  {
    name: 'Dr. Roma Kewlani',
    role: 'Gum Specialist',
    bio: 'As a periodontist, Dr. Roma focuses on gum health and rehabilitation, ensuring strong foundations for beautiful smiles.',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300',
  },
  {
    name: 'Dr. Avinash Reddy',
    role: 'Oral Surgeon',
    bio: 'Dr. Avinash specializes in complex dental surgeries and implant procedures with a focus on patient comfort.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
  },
];

const TeamSection = () => {
  return (
    <section id="team-section" className="py-20 relative">
      <div className="container-custom">
        <SectionHeader
          title="Meet the Experts Behind Every Smile"
          subtitle="Our team of specialists brings together decades of experience and passion for dental excellence"
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {doctors.map((doctor, index) => (
            <div 
              key={index} 
              className="group scroll-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                <div className="relative overflow-hidden aspect-square">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full text-white">
                      <p className="text-sm mb-3">{doctor.bio}</p>
                      <div className="flex gap-2">
                        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                          <LinkedinIcon size={16} />
                        </a>
                        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition-colors">
                          <InstagramIcon size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-medium text-lg mb-1">{doctor.name}</h3>
                  <p className="text-peak-gray-600 text-sm">{doctor.role}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
