import React from 'react';

const Navigation = ({ clixPrice, activeSection, scrollToSection }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-blue-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <img 
                  src={`${process.env.PUBLIC_URL}/clix-logo-v2.png`}
                  alt="CLIX Token"
                  className="w-4 h-4 mr-2"
                />
                CLIX ${clixPrice}
              </span>
              <span className="flex items-center">
                Clic.World | Where Sound Money Meets Community Power
              </span>
            </div>
            <div className="hidden md:block">
              <span>The Future of Digital | Is Human</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => scrollToSection('home')}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={`${process.env.PUBLIC_URL}/clic-logo.png`} 
                alt="Clic.World Logo" 
                className="w-20 h-20 object-contain"
              />
            </button>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            {[
              { id: 'products', label: 'Products' },
              { id: 'clix', label: 'CLIX' },
              { id: 'clicbrain', label: 'ClicBrain' },
              { id: 'pryvaz', label: 'Privacy' },
              { id: 'about', label: 'Movement' },
              { id: 'contact', label: 'Connect' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  activeSection === item.id ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Join Movement
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
