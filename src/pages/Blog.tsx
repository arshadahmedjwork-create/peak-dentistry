import React from 'react';
import Layout from '@/components/layout/Layout';
import SectionHeader from '@/components/ui/section-header';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useBlogPosts } from '@/hooks/use-supabase-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/hooks/use-theme';

const Blog = () => {
  const { posts, loading } = useBlogPosts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const categories = [
    "All",
    "Technology",
    "Treatments",
    "Oral Health",
    "Wellness",
    "Pediatric"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className={`pt-32 pb-16 ${isDark ? 'bg-peak-gray-900' : 'bg-peak-gray-100'}`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-medium mb-6">Dental Insights & News</h1>
            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-peak-gray-700'}`}>
              Stay updated with the latest in dental care, technology, and health tips from our expert team.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Filter Section */}
      <section className="py-10 border-b border-peak-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    index === 0
                      ? 'bg-peak-black text-peak-white'
                      : 'bg-peak-gray-200 text-peak-gray-700 hover:bg-peak-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 border border-peak-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-peak-black"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peak-gray-500" size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-peak-gray-600 mb-6">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll animate-fade-in ${isDark ? 'bg-peak-gray-800' : 'bg-white'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.featured_image_url || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000'} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-peak-gray-500">
                        {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-xs font-medium px-3 py-1 bg-peak-gray-200 rounded-full">
                        {post.author_name}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium mb-3">{post.title}</h3>
                    <p className="text-peak-gray-600 mb-4">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-peak-black font-medium hover:underline">
                      Read More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <p className="text-peak-gray-600 mb-6">More articles coming soon. Stay tuned for regular updates from our dental experts.</p>
            <Button variant="outline" className="btn-outline">
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
