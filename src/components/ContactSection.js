import React from 'react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-8 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Ready to Join the Movement?</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-xl text-white/80 max-w-4xl mx-auto">
            Whether you're a community leader, entrepreneur, or dreamer—there's a place 
            for you in the Clic.World ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/20 hover:bg-white/15 transition-colors">
            <div className="text-4xl mb-4">🏘️</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">For Communities</h3>
            <p className="mb-6 text-white/80">Start your Community Social Bank and keep wealth in your community</p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              Launch Community Bank
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/20 hover:bg-white/15 transition-colors">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">For Entrepreneurs</h3>
            <p className="mb-6 text-white/80">Access business tools and CLIX-powered commerce solutions</p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              Start Your Business
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl text-center border border-white/20 hover:bg-white/15 transition-colors">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">For Enterprises</h3>
            <p className="mb-6 text-white/80">License technology and join the cooperative finance revolution</p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors">
              Enterprise Solutions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
