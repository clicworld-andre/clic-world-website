import React, { useState } from 'react';
import { blogPosts, getFeaturedPosts, getAllCategories } from '../data/blogPosts';
import BlogPostModal from './BlogPostModal';

const BlogSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('Featured Stories');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categories = ['Featured Stories', 'All', ...getAllCategories()];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : selectedCategory === 'Featured Stories'
    ? getFeaturedPosts().slice(0, 3)
    : blogPosts.filter(post => post.category === selectedCategory);

  const openPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <section id="blog" className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Movement Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Thoughts, breakthroughs, and stories from the front lines of the financial revolution.
            Where community ownership meets cutting-edge innovation.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* All Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 relative">
                {post.image && (
                  <img 
                    src={post.image} 
                    alt=""
                    className="w-full h-full object-cover opacity-20"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-lg text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {post.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2" style={{color: 'white'}}>{post.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                  <button 
                    onClick={() => openPost(post)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Join the Conversation</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Have insights to share? Questions about the movement? Connect with our global community 
              of changemakers building the future of finance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
                Submit Your Story
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-6 py-3 rounded-lg font-semibold transition-colors">
                Subscribe to Updates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Modal */}
      <BlogPostModal 
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default BlogSection;
