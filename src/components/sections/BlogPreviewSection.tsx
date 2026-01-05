
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeader from '@/components/ui/section-header';

const BlogPreviewSection = () => {
  const blogPosts = [
    {
      title: "The Evolution of Smile Design Technology",
      excerpt: "Explore how modern technology is transforming the art and science of smile makeovers.",
      image: "https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1000",
      date: "April 2, 2023"
    },
    {
      title: "Understanding Laser Dentistry Benefits",
      excerpt: "Learn how laser dentistry provides more comfortable and precise treatments for various dental issues.",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
      date: "March 15, 2023"
    },
    {
      title: "Preventive Care: Your First Defense",
      excerpt: "Discover the importance of regular preventive dental care for long-term oral health.",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000",
      date: "February 28, 2023"
    }
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeader 
          title="Dental Insights & News" 
          subtitle="Stay updated with the latest in dental care, technology, and health tips from our expert team."
          center
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-peak-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-medium mb-3">{post.title}</h3>
                <p className="text-peak-gray-600 mb-4">{post.excerpt}</p>
                <Link to="/blog" className="inline-flex items-center text-peak-black font-medium hover:underline">
                  Read More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button variant="outline" className="btn-outline">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
