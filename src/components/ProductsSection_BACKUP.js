import React from 'react';

const ProductsSection = () => {
  return (
    <section id="products" className="py-20 bg-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Complete Ecosystem Solutions</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From Community Social Banks to tokenized assets—everything you need 
            to participate in community-owned finance, all powered by the CLIX ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '🏦',
              title: 'Community Social Banks',
              tagline: 'Evolution of traditional SACCOs enhanced with blockchain technology.',
              features: [
                'DAO governance with member voting on policies',
                '75% of profits stay within the community',
                'AI-powered lending without traditional credit scores',
                'Cross-border networks connecting cooperatives'
              ]
            },
            {
              icon: '📱',
              title: 'Social Finance App',
              tagline: 'Mobile-first banking for feature phones and smartphones.',
              features: [
                'USSD access (*483#) for basic feature phones',
                'Multi-asset wallet (CLIX, gold, silver, stablecoins)',
                'Instant P2P transfers and merchant payments',
                'Micro-loans processed in 24 hours'
              ]
            },
            {
              icon: '💱',
              title: 'CLIX Investment Exchange',
              tagline: 'Unified platform combining Forex, Crypto, and Securities trading.',
              features: [
                'Multi-asset trading with instant liquidity',
                'Tokenized crops and commodity trading',
                '0.5% transaction costs vs 5-8% traditional',
                'No waiting for market hours - trade 24/7'
              ]
            }
          ].map((product, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{product.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-green-900">{product.title}</h3>
              <p className="text-green-600 font-medium italic mb-4 text-sm">{product.tagline}</p>
              <ul className="space-y-3 mb-6">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <span className="text-green-500 mr-3 font-bold text-lg">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;