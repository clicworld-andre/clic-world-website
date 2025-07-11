import React from 'react';

const BlogPostModal = ({ post, isOpen, onClose }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative h-64 bg-gradient-to-br from-blue-600 to-blue-800">
          {post.image && (
            <img 
              src={post.image} 
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
          >
            ×
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold mb-3">
              {post.category}
            </span>
            <h1 className="mb-2 force-white-text" style={{color: '#ffffff', fontSize: '1.875rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', display: 'block'}}>{post.title}</h1>
            <div className="flex items-center text-white/80 text-sm space-x-4">
              <span>{post.author}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-8">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.slice(2)}</h1>;
              } else if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{paragraph.slice(3)}</h2>;
              } else if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{paragraph.slice(4)}</h3>;
              } else if (paragraph.startsWith('> ')) {
                return <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4">{paragraph.slice(2)}</blockquote>;
              } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                return <p key={index} className="text-gray-600 italic my-2">{paragraph.slice(1, -1)}</p>;
              } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <p key={index} className="font-bold text-gray-900 my-2">{paragraph.slice(2, -2)}</p>;
              } else if (paragraph.trim() === '---') {
                return <hr key={index} className="my-6 border-gray-300" />;
              } else if (paragraph.trim() !== '') {
                // Handle bold text within paragraphs
                const parts = paragraph.split(/(\*\*.*?\*\*)/);
                return (
                  <p key={index} className="text-gray-700 leading-relaxed my-3">
                    {parts.map((part, partIndex) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Join the Clic Movement</h3>
            <p className="text-blue-100 mb-4">
              Ready to be part of the financial revolution? Connect with our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors">
                Join Movement
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-6 py-2 rounded-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostModal;
