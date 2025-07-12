import React, { useState } from 'react';
import { blogPosts } from '../data/blogPosts';
import BlogPostModal from './BlogPostModal';

const AboutSectionEnhanced = () => {
  // Modal state for "Decentralized Money" blog post
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Find the "Decentralized Money" blog post
  const decentralizedMoneyPost = blogPosts.find(post => post.slug === 'problem-with-decentralized-money-different-path');
  
  const openDecentralizedMoneyPost = () => {
    if (decentralizedMoneyPost) {
      setSelectedPost(decentralizedMoneyPost);
      setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };
  const principles = [
    {
      icon: "💎",
      title: "Value Flows to Creators",
      description: "Those who create value receive it, not just those who extract it from others.",
      highlight: "From mining communities to global communities"
    },
    {
      icon: "🤝",
      title: "Belonging Means Ownership",
      description: "Community members own assets, participate in decisions, and shape their financial futures.",
      highlight: "Not just users—shareholders"
    },
    {
      icon: "🌍",
      title: "Digital Feels Human",
      description: "Technology that connects people, builds inclusion, and creates authentic relationships.",
      highlight: "Connected, inclusive, alive"
    }
  ];

  const journey = [
    {
      location: "Democratic Republic of Congo",
      story: "In the mining communities of North Kivu province, we witnessed value creators receiving only 30% of what their work was worth.",
      insight: "The fundamental problem became crystal clear"
    },
    {
      location: "Across Africa",
      story: "We saw innovation like Mobile Money, SACCOS, Stokvels and Chamas thriving against all odds, where community is the engine and the future is rewritten daily.",
      insight: "Community-powered innovation"
    },
    {
      location: "Around the World", 
      story: "This movement was never meant to stay within borders. We're building for communities everywhere.",
      insight: "Born in Africa. Built for the world."
    }
  ];

  return (
    <section id="about" className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <button 
              onClick={openDecentralizedMoneyPost} 
              className="text-gray-900 hover:text-blue-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit leading-inherit"
            >
              Clic.World: A Movement Without Borders
            </button>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            From the mines of the Democratic Republic of Congo to a global movement—this is the story 
            of re-centralising money where it belongs.
          </p>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12 border border-green-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Finance's <span className="text-green-600">Third Way</span>
              </h3>
              <p className="text-xl text-gray-700 italic">
                Rebalancing Influence, Ownership, and Value in the Digital Age
              </p>
            </div>
          </div>
        </div>

        {/* Journey Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              The Awakening Journey
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our movement began with a simple realization: those creating the most value were receiving the least
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {journey.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-3 mr-6 mt-1 min-w-[3rem]">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{step.location}</h4>
                    
                    {/* Add image for DRC story */}
                    {index === 0 && (
                      <div className="mb-6">
                        <img 
                          src={`${process.env.PUBLIC_URL}/artisanal-gold-miners.jpg`} 
                          alt="Artisanal Gold Miners"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                        <p className="text-sm text-gray-500 italic mt-2 text-center">Artisanal Gold Miners</p>
                      </div>
                    )}
                    
                    {/* Add image for Africa story */}
                    {index === 1 && (
                      <div className="mb-6">
                        <img 
                          src={`${process.env.PUBLIC_URL}/sacco-mtn-mpesa.png`} 
                          alt="African Financial Innovation - SACCO, MTN, M-Pesa"
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                        <p className="text-sm text-gray-500 italic mt-2 text-center">African Financial Innovation - SACCO, MTN, M-Pesa</p>
                      </div>
                    )}
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{step.story}</p>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <p className="text-green-800 font-semibold italic">"{step.insight}"</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Building an Economy That Works
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're creating a financial system where communities thrive, not just survive
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{principle.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{principle.title}</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">{principle.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-800 font-semibold text-sm">{principle.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">We're Not Disrupting Finance</h3>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            We're upgrading it—with accountability, yield, and teeth. 
            Imagine a world where money doesn't just hold value—it creates it.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏆</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Gold Earns Yield</h4>
            <p className="text-gray-600">Value that grows over time</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏫</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Bonds Fund Schools</h4>
            <p className="text-gray-600">Investment with purpose</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">👥</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Communities Own</h4>
            <p className="text-gray-600">Shareholders, not just users</p>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
          <p className="text-xl font-semibold text-gray-800 mb-2">The old system falls short. We're the rewrite.</p>
          <p className="text-lg font-bold text-blue-600">Born in Africa. Built for the world.</p>
        </div>
      </div>
      
      {/* Blog Post Modal for "Decentralized Money" */}
      <BlogPostModal 
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default AboutSectionEnhanced;