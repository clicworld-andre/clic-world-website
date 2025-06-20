import React from 'react';

const PrivacySection = () => {
  return (
    <section id="pryvaz" className="py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Quantum-Secured Privacy Partnership</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-xl text-white/80 max-w-4xl mx-auto mb-12">
            Think of PRYVAZ as your personal digital vault that comes with its own AI assistant.
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 mb-12 max-w-4xl mx-auto">
            <p className="text-lg text-white/90 mb-6">
              Unlike traditional platforms where <strong className="text-yellow-300">YOUR data</strong> powers <strong className="text-red-300">THEIR AI</strong> on <strong className="text-red-300">THEIR servers</strong>, 
              PRYVAZ gives you your own intelligent container where:
            </p>
            
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold text-lg">•</span>
                <span><strong className="text-green-300">YOUR AI</strong> processes <strong className="text-green-300">YOUR data</strong> in <strong className="text-green-300">YOUR secure space</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold text-lg">•</span>
                <span>External services connect <strong>TO you</strong>, not the other way around</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold text-lg">•</span>
                <span>You decide what data to share and when</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-3 font-bold text-lg">•</span>
                <span>Your digital identity and financial information never leave your control</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
              <p className="text-blue-200 italic">
                It's like having your own private bank with your own personal AI advisor - 
                except it's quantum-secured and works with everything.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Data Sovereignty</h3>
            <p className="text-white/80">Your data lives in YOUR encrypted container. No company can access, sell, or manipulate your information.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">Banking-Grade Security</h3>
            <p className="text-white/80">Government-level encryption and security standards protect every interaction and transaction.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">You Control Monetization</h3>
            <p className="text-white/80">Choose how and when to monetize your data. Keep 100% privacy or earn revenue on your terms.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4 text-yellow-400">The First Platform Where YOU Truly Own Your Data</h3>
          <div className="flex justify-center gap-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors">
              Learn About Privacy Revolution
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-800 px-8 py-4 rounded-lg font-semibold transition-colors">
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
