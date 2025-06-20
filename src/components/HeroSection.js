import React from 'react';

const HeroSection = ({ clixPrice, scrollToSection }) => {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 min-h-screen flex items-center relative overflow-hidden pt-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              We're not disrupting finance.<br />
              <span className="text-white">We're upgrading it.</span>
            </h1>
            
            <p className="text-xl mb-8 text-white/90 leading-relaxed">
              Money re-centralized where it belongs – in the hands of those who build real value. 
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

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => scrollToSection('clix')}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Discover CLIX Token
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Join the Movement
              </button>
            </div>
          </div>

          {/* Enhanced Floating Cards */}
          <div className="relative h-96 lg:h-80">
            {[
              { title: 'Community Ownership', value: '75% Profit Share', icon: '🤝' },
              { title: 'USSD Access', value: '*483# Ready', icon: '📱' },
              { title: 'Asset Backed', value: 'KAU/KAG Gold', icon: '🏆' }
            ].map((card, index) => (
              <div
                key={index}
                className="absolute bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 animate-float"
                style={{
                  top: `${index * 25}%`,
                  left: `${index * 15}%`,
                  animationDelay: `${index * 2}s`
                }}
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <div className="font-semibold text-gray-800 mb-2">{card.title}</div>
                <div className="text-xl font-bold text-green-600">{card.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
