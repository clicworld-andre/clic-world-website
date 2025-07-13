import React from 'react';

const Navigation = ({ clixPriceUSD, clixPriceXLM, xlmToUSD, activeSection, scrollToSection, setActiveSection }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-blue-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center space-x-4">
                <span className="flex items-center">
                  <img 
                    src={`${process.env.PUBLIC_URL}/clix-logo-v2.png`}
                    alt="CLIX Token"
                    className="w-4 h-4 mr-2"
                  />
                  <span className="hidden sm:inline">CLIX:</span>
                  <span className="ml-1 font-semibold">
                    {clixPriceUSD ? `${clixPriceUSD}` : 'N/A'}
                  </span>
                </span>
                <span className="hidden md:flex items-center text-yellow-300">
                  <span>💫</span>
                  <span className="ml-1">
                    {clixPriceXLM ? `${clixPriceXLM} XLM` : 'N/A'}
                  </span>
                </span>
                {xlmToUSD && (
                  <span className="hidden lg:inline text-xs opacity-75">
                    (XLM: ${xlmToUSD})
                  </span>
                )}
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
              className="cursor-pointer hover:opacity-80 transition-opacity outline-none focus:outline-none"
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
              { id: 'about', label: 'Movement' },
              { id: 'clix', label: 'CLIX' },
              { id: 'products', label: 'Solutions' },
              { id: 'clicbrain', label: 'ClicBrain' },
              { id: 'pryvaz', label: 'Privacy Vault' },
              { id: 'blog', label: 'Blog' },
              { id: 'partners', label: 'Partners' },
              { id: 'contact', label: 'Connect' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  console.log(`🖱️ CLICK START: ${item.id}`);
                  console.log(`📊 Current activeSection BEFORE: ${activeSection}`);
                  
                  // Update active section immediately
                  setActiveSection(item.id);
                  console.log(`✅ setActiveSection(${item.id}) called`);
                  
                  // Then scroll to the section
                  scrollToSection(item.id);
                  console.log(`🖱️ CLICK END: ${item.id}`);
                }}
                className={`px-3 py-2 rounded-lg font-medium transition-all border-2 border-transparent outline-none focus:outline-none ${
                  activeSection === item.id 
                    ? '!text-blue-800 !font-semibold !bg-blue-100 !border-blue-100' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
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