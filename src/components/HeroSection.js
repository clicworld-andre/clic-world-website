import React from 'react';

const HeroSection = ({ clixPrice, scrollToSection }) => {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 min-h-screen flex items-center relative overflow-hidden pt-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
              We're not disrupting finance.<br />
              <span className="text-white">We're upgrading it.</span>
            </h1>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Money re-centralised where it belongs – in the hands of those who build real value. 
              Community-owned finance powered by responsible AI and the blockchain, ready to serve 500 million cooperative 
              members across Africa and the World.
            </p>

            {/* Enhanced Live Stats */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                { value: `$${clixPrice}`, label: 'CLIX Token Price (USD)', icon: '💎' },
                { value: '90%+', label: 'Community Bank Repayment Rate', icon: '📈' },
                { value: '500M', label: 'African Cooperative Members', icon: '🏘️' },
                { value: '75%', label: 'Profits Stay in Communities', icon: '🤝' }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/20">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex items-end justify-center">
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={`${process.env.PUBLIC_URL}/community-group.jpg`} 
                alt="Community collaboration and digital engagement"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-lg font-semibold mb-1">Building Tomorrow</div>
                <div className="text-sm opacity-90">Community-Owned Finance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
