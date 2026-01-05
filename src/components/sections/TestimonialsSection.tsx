
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/section-header';
import AnimatedGradient from '@/components/ui/animated-gradient';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const testimonials = [
  {
    id: 1,
    name: "Aishwarya R.",
    role: "Corporate Executive",
    quote: "PEAK Dentistry transformed not just my smile, but my confidence. The team's attention to detail and personalized care is unmatched in Chennai.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=300&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Business Owner",
    quote: "Dr. Ashwin and team made my dental implant procedure completely painless. The clinic's ambiance and technology are truly world-class.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&h=300&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Fashion Designer",
    quote: "My smile makeover journey with PEAK Dentistry exceeded all expectations. The results are phenomenal and the entire experience was luxurious.",
    stars: 5,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=300&h=300&auto=format&fit=crop"
  }
];

const TestimonialsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <section className={`py-20 relative ${isDark ? 'bg-peak-black text-peak-white' : 'bg-peak-gray-100 text-peak-black'} overflow-hidden`}>
      <AnimatedGradient />
      <div className="container-custom relative z-10">
        <SectionHeader 
          title="What Our Patients Say" 
          subtitle="Hear from our valued patients about their transformative experiences at PEAK Dentistry"
          center
          className={isDark ? 'text-peak-white' : 'text-peak-black'}
        />
        
        <div className="mt-12 relative">
          <Carousel 
            className="max-w-4xl mx-auto"
            opts={{
              align: 'center',
              loop: true,
            }}
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-4/5">
                  <div className={cn(
                    "relative p-8 rounded-xl h-full transition-all duration-300 overflow-hidden",
                    isDark 
                      ? "bg-gradient-to-br from-peak-gray-900/60 to-peak-gray-800/40 backdrop-blur-sm border border-peak-gray-700/30"
                      : "bg-white/90 backdrop-blur-sm border border-peak-gray-200 shadow-lg"
                  )}>
                    <Quote className={cn("absolute top-6 left-6 w-8 h-8", isDark ? "text-peak-gray-700/30" : "text-peak-gray-300")} />
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <p className={cn("italic text-lg mb-4", isDark ? "text-peak-gray-200" : "text-peak-gray-700")}>{testimonial.quote}</p>
                        <h4 className="text-xl font-medium mb-1">{testimonial.name}</h4>
                        <p className={cn("text-sm mb-2", isDark ? "text-peak-gray-400" : "text-peak-gray-600")}>{testimonial.role}</p>
                        <div className="flex justify-center md:justify-start gap-1">
                          {Array(testimonial.stars).fill(0).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={cn("ml-8 border", isDark ? "bg-white/10 hover:bg-white/20 text-white border-peak-gray-700" : "bg-black/10 hover:bg-black/20 text-black border-peak-gray-300")} />
            <CarouselNext className={cn("mr-8 border", isDark ? "bg-white/10 hover:bg-white/20 text-white border-peak-gray-700" : "bg-black/10 hover:bg-black/20 text-black border-peak-gray-300")} />
          </Carousel>
        </div>
        
        <div className="mt-10 text-center">
          <Button variant="outline" className={cn("hover-lift", isDark ? "border-peak-white text-peak-white hover:bg-peak-white hover:text-peak-black" : "border-peak-black text-peak-black hover:bg-peak-black hover:text-white")}>
            Share Your Story
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
