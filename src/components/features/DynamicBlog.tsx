import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

// Sample blog post data - in a real implementation, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: "The Importance of Regular Dental Check-ups",
    excerpt: "Regular dental check-ups are essential for maintaining good oral health and preventing serious dental issues.",
    content: "Regular dental check-ups are essential for maintaining good oral health and preventing serious dental issues. During a check-up, your dentist will examine your teeth, gums, and mouth for signs of problems. They will also clean your teeth to remove plaque and tartar buildup, which can lead to cavities and gum disease if left untreated.",
    category: "preventive",
    tags: ["check-ups", "cleaning", "prevention"],
    author: "Dr. Sarah Johnson",
    date: "2023-09-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRlbnRhbHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    title: "Understanding Dental Implants",
    excerpt: "Dental implants are a permanent solution for replacing missing teeth that look and function like natural teeth.",
    content: "Dental implants are a permanent solution for replacing missing teeth that look and function like natural teeth. They consist of a titanium post that is surgically placed in the jawbone, an abutment that connects the post to the replacement tooth, and a crown that is custom-made to match your natural teeth.",
    category: "restorative",
    tags: ["implants", "missing teeth", "restoration"],
    author: "Dr. Michael Chen",
    date: "2023-10-02",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGRlbnRhbHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    title: "The Benefits of Teeth Whitening",
    excerpt: "Professional teeth whitening can significantly improve the appearance of your smile and boost your confidence.",
    content: "Professional teeth whitening can significantly improve the appearance of your smile and boost your confidence. Unlike over-the-counter whitening products, professional treatments are more effective and can be customized to your specific needs. They also reduce the risk of tooth sensitivity and gum irritation.",
    category: "cosmetic",
    tags: ["whitening", "smile", "aesthetics"],
    author: "Dr. Emily Roberts",
    date: "2023-10-20",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGRlbnRhbHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 4,
    title: "Preventing Gum Disease",
    excerpt: "Gum disease is a common but preventable condition that can lead to tooth loss if left untreated.",
    content: "Gum disease is a common but preventable condition that can lead to tooth loss if left untreated. It begins with gingivitis, which causes red, swollen gums that may bleed when brushing or flossing. If not treated, it can progress to periodontitis, which affects the tissues and bones that support the teeth.",
    category: "preventive",
    tags: ["gum disease", "periodontal", "oral health"],
    author: "Dr. James Wilson",
    date: "2023-11-05",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlbnRhbHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 5,
    title: "How to Choose the Right Toothbrush",
    excerpt: "Selecting the right toothbrush is an important part of maintaining good oral hygiene.",
    content: "Selecting the right toothbrush is an important part of maintaining good oral hygiene. Consider factors such as bristle type (soft, medium, or hard), head size, handle design, and whether to choose manual or electric. Most dentists recommend soft bristles to avoid damaging tooth enamel and gum tissue.",
    category: "preventive",
    tags: ["toothbrush", "oral hygiene", "cleaning"],
    author: "Dr. Sarah Johnson",
    date: "2023-11-18",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGRlbnRhbHxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 6,
    title: "The Advantages of Invisalign",
    excerpt: "Invisalign offers a discreet and comfortable alternative to traditional braces for straightening teeth.",
    content: "Invisalign offers a discreet and comfortable alternative to traditional braces for straightening teeth. The clear aligners are nearly invisible, removable for eating and cleaning, and typically require fewer office visits than traditional braces. Treatment time varies, but many patients see results within 12 to 18 months.",
    category: "cosmetic",
    tags: ["invisalign", "orthodontics", "straight teeth"],
    author: "Dr. Michael Chen",
    date: "2023-12-01",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1595785926057-19738096e185?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGRlbnRhbHxlbnwwfHwwfHx8MA%3D%3D"
  }
];

const DynamicBlog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    filterPosts();
  }, [searchTerm, activeCategory]);

  const filterPosts = () => {
    let filtered = blogPosts;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => post.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.excerpt.toLowerCase().includes(term) || 
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredPosts(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const openPost = (post) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  return (
    <div className="w-full">
      {selectedPost ? (
        <Card className="w-full">
          <CardHeader>
            <Button variant="ghost" onClick={closePost} className="w-fit p-0 mb-4">
              ← Back to all posts
            </Button>
            <CardTitle className="text-2xl md:text-3xl">{selectedPost.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline">{selectedPost.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {selectedPost.date} • {selectedPost.readTime} read
              </span>
              <span className="text-sm">By {selectedPost.author}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-md mb-8">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="prose max-w-none">
              <p>{selectedPost.content}</p>
              <p>{selectedPost.content}</p>
              <h3>Key Takeaways</h3>
              <ul>
                <li>Important point about dental health</li>
                <li>Another critical aspect to consider</li>
                <li>Final recommendation for patients</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {selectedPost.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="w-full border-t pt-4">
              <h3 className="font-medium mb-2">Share this article</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Facebook</Button>
                <Button variant="outline" size="sm">Twitter</Button>
                <Button variant="outline" size="sm">LinkedIn</Button>
                <Button variant="outline" size="sm">Email</Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <h2 className="text-3xl font-bold">Dental Health Blog</h2>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Topics</TabsTrigger>
              <TabsTrigger value="preventive">Preventive</TabsTrigger>
              <TabsTrigger value="cosmetic">Cosmetic</TabsTrigger>
              <TabsTrigger value="restorative">Restorative</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openPost(post)}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <Button variant="ghost" size="sm">Read More</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setActiveCategory('all');}}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preventive" className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openPost(post)}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <Button variant="ghost" size="sm">Read More</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setActiveCategory('all');}}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cosmetic" className="mt-0">
              {/* Same structure as "all" tab */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openPost(post)}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <Button variant="ghost" size="sm">Read More</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setActiveCategory('all');}}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="restorative" className="mt-0">
              {/* Same structure as "all" tab */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openPost(post)}>
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        </div>
                        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                        <Button variant="ghost" size="sm">Read More</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <h3 className="text-lg font-medium">No articles found</h3>
                    <p className="text-muted-foreground mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {setSearchTerm(''); setActiveCategory('all');}}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default DynamicBlog;
