import React from 'react';

const PrivacySection = () => {
  return (
    <section id="pryvaz" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Quantum-Secured Privacy Partnership</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            Think of PRYVAZ as your personal digital vault that comes with its own AI assistant.
          </p>
          
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg mb-12 max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              Unlike traditional platforms where <strong className="text-blue-600">YOUR data</strong> powers <strong className="text-red-600">THEIR AI</strong> on <strong className="text-red-600">THEIR servers</strong>, 
              PRYVAZ gives you your own intelligent container where:
            </p>
            
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold text-lg">•</span>
                <span><strong className="text-green-700">YOUR AI</strong> processes <strong className="text-green-700">YOUR data</strong> in <strong className="text-green-700">YOUR secure space</strong></span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold text-lg">•</span>
                <span>External services connect <strong>TO you</strong>, not the other way around</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold text-lg">•</span>
                <span>You decide what data to share and when</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 font-bold text-lg">•</span>
                <span>Your digital identity and financial information never leave your control</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 italic">
                It's like having your own private bank with your own personal AI advisor - 
                except it's quantum-secured and works with everything.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Data Sovereignty</h3>
            <p className="text-gray-600">Your data lives in YOUR encrypted container. No company can access, sell, or manipulate your information.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Banking-Grade Security</h3>
            <p className="text-gray-600">Government-level encryption and security standards protect every interaction and transaction.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-blue-600">You Control Monetization</h3>
            <p className="text-gray-600">Choose how and when to monetize your data. Keep 100% privacy or earn revenue on your terms.</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">The First Platform Where YOU Truly Own Your Data</h3>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
              Learn About Privacy Revolution
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors">
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
