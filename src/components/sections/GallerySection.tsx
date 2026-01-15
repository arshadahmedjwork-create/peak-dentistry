
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/section-header';
import { X } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const galleryImages = [
  {
    title: 'Reception Area',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Modern Treatment Room',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Dental Equipment',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Consultation Room',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'State-of-the-Art Technology',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=600'
  },
  {
    title: 'Caring Dental Team',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600'
  }
];

const GallerySection = () => {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const openLightbox = (index: number) => {
    setActiveImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="gallery-section" className={`py-20 relative ${isDark ? 'bg-peak-gray-800' : 'bg-peak-gray-100'}`}>
      <div className="container-custom">
        <SectionHeader
          title="Peek Inside PEAK"
          subtitle="Take a virtual tour of our state-of-the-art dental clinic"
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-md cursor-pointer group scroll-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback for broken images
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-4 w-full">
                    <h3 className="text-white text-lg font-medium">{image.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {activeImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl w-full p-4">
            <button
              className="absolute top-4 right-4 text-white z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>
            <img
              src={galleryImages[activeImage].image}
              alt={galleryImages[activeImage].title}
              className="w-full h-auto max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white text-center mt-4 text-xl">
              {galleryImages[activeImage].title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
