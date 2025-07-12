import React, { useState } from 'react';
import PatentModal from './PatentModal';

const PrivacySectionEnhanced = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPatentModalOpen, setIsPatentModalOpen] = useState(false);

  const features = [
    {
      title: "Complete Data Ownership",
      description: "Your data never leaves your personal vault. You own it, control it, and decide what happens with it.",
      details: "Unlike traditional platforms where your data powers their AI, your vault keeps everything under your control."
    },
    {
      title: "Private AI Assistant", 
      description: "Your personal AI learns from all your Clic interactions without ever exposing your data externally.",
      details: "Advanced AI processing happens locally within your quantum-secured vault environment."
    },
    {
      title: "Quantum Security",
      description: "Military-grade quantum-resistant encryption protects your vault with unbreakable security.",
      details: "True quantum random number generation creates encryption keys that protect against future quantum computing threats."
    },
    {
      title: "Selective Sharing",
      description: "Choose exactly what data each application can access. Grant or revoke permissions instantly.",
      details: "Granular control over data access with real-time permission management for all connected applications."
    },
    {
      title: "Portable Freedom",
      description: "Your vault is portable. Move it anywhere, anytime. Never be locked into any platform again.",
      details: "Complete data portability ensures you're never dependent on any single platform or provider."
    },
    {
      title: "Your Monetization",
      description: "Keep 100% privacy or choose to monetize your data on YOUR terms. You decide, you profit.",
      details: "Retain full control over data monetization opportunities while maintaining complete privacy protection."
    }
  ];

  const securityFeatures = [
    {
      title: "Quantum-Resistant Encryption",
      description: "True quantum random number generation creates unbreakable encryption keys that protect against future quantum computing threats."
    },
    {
      title: "Zero-Knowledge Architecture", 
      description: "Clic literally cannot access your data. Even if compromised, your information remains completely secure in your vault."
    },
    {
      title: "AI Privacy Protection",
      description: "Your AI assistant processes data locally within your vault. No external servers ever see your personal information."
    },
    {
      title: "Distributed Security",
      description: "No central servers to hack. Your data is distributed and encrypted across your personal infrastructure."
    }
  ];

  return (
    <section id="pryvaz" className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personal Privacy Vault
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            The first platform where you truly own your data, control your AI, and decide your digital destiny. Where your data stays in your own quantum-secured vault and your AI processes your own data inside your secure space. Experience true digital sovereignty with quantum-secured personal data vaults and integrated AI
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-white p-8 rounded-2xl shadow-lg border-2 transition-all cursor-pointer hover:shadow-xl ${
                  activeFeature === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                {activeFeature === index && (
                  <p className="text-blue-700 text-sm border-t border-blue-200 pt-4 mt-4">
                    {feature.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How Your Personal Vault Works
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your vault is the center of your digital universe. All Clic products connect TO you, not the other way around.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Clic Wallet", icon: "💰", desc: "Financial data secured" },
                { name: "Social Bank", icon: "🏛️", desc: "Social networking with privacy" },
                { name: "Business Hub", icon: "🏢", desc: "Enterprise operations secured" },
                { name: "Clic Chat", icon: "💬", desc: "Communications with privacy" }
              ].map((product, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-3xl mb-2">{product.icon}</div>
                  <h5 className="font-semibold text-gray-900 mb-1">{product.name}</h5>
                  <p className="text-sm text-gray-600 mb-2">{product.desc}</p>
                  <div className="text-xs text-blue-600 font-semibold">🔐 Secure Connection</div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-blue-800 text-center">
                All Clic products connect TO your vault via encrypted channels. You control what data each app can access, 
                when they can access it, and how they can use it. Your AI learns from everything while keeping your data completely private.
              </p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              <button 
                onClick={() => setIsPatentModalOpen(true)}
                className="text-gray-900 hover:text-blue-600 transition-colors duration-200 border-b-2 border-transparent hover:border-blue-600 cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit"
                title="View Patent Document: Secure Private Portable Vault Container"
              >
                Patented Quantum Security
              </button>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your vault is protected by the most advanced security technology available
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="flex items-start">
                  <div className="bg-red-100 rounded-full p-3 mr-4 mt-1">
                    <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Beta Notice */}
        <div className="text-center bg-blue-50 border border-blue-200 rounded-2xl p-8">
          <p className="text-lg text-blue-800 italic">
            *The Clic Data Privacy Vault is a CLIX Premium value added product offered in partnership with PRYVAZ. It is currently in beta testing and final pricing (in CLIX) will be announced soon.
          </p>
        </div>
      </div>

      {/* Patent Modal */}
      <PatentModal 
        isOpen={isPatentModalOpen}
        onClose={() => setIsPatentModalOpen(false)}
      />
    </section>
  );
};

export default PrivacySectionEnhanced;