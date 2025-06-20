import React from 'react';

const ClixSection = () => {
  return (
    <section id="clix" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">CLIX - Re-centralizing Money Where It Belongs</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Not a speculative token – CLIX is utility-driven money backed by real economic activity. 
            Built for communities, not corporations. Token growth through value creation, not speculation.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
              🏛️
            </div>
            <h3 className="text-2xl font-bold text-green-900 mb-4">Community Ownership</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-lg">✓</span>
                <span>75% of banking profits stay in communities</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-lg">✓</span>
                <span>DAO governance: Members vote on rates and policies</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 font-bold text-lg">✓</span>
                <span>Democratic finance replacing corporate control</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl">
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
              🌾
            </div>
            <h3 className="text-2xl font-bold text-yellow-900 mb-4">Real Asset Economics</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 font-bold text-lg">✓</span>
                <span>Backed by gold (KAU), silver (KAG), and commodities</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 font-bold text-lg">✓</span>
                <span>Tokenized harvests and warehouse receipts</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-3 font-bold text-lg">✓</span>
                <span>Value creation rewarded, not speculation</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mb-6">
              📱
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Mobile-First Banking</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 font-bold text-lg">✓</span>
                <span>USSD access (*483#) for feature phones</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 font-bold text-lg">✓</span>
                <span>AI loans in 24hrs with 90%+ approval rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 font-bold text-lg">✓</span>
                <span>Cross-border payments at 1/10th traditional cost</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Own Your Financial Future?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join 500 million Africans who already prove communities manage money better than banks. 
            CLIX makes cooperative finance work for the digital age.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
              Join Community Bank
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-colors">
              View Whitepaper
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClixSection;
