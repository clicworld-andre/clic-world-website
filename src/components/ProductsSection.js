import React, { useState } from 'react';

const ProductsSection = () => {
  const [expandedProduct, setExpandedProduct] = useState(null);

  const products = [
    {
      icon: '🏦',
      title: 'CLIX Platform',
      positioning: 'Your all-in-one financial companion—decentralized, community-powered, and gold-backed.',
      description: 'A Stellar-based decentralized virtual asset investment exchange integrating social banking and a multi-wallet Social Financial app.',
      features: [
        'Decentralized Exchange: Trade CLIX tokens, KAU (gold), KAG (silver), and approved assets (Stellar, Polygon, Ethereum)',
        'Social Banking System: AI-driven micro core banking for communities—real-time savings, loans, and account management',
        'Multi-Wallet Support: Stellar, Polygon, Ethereum for comprehensive asset management',
        'Merchant payments, P2P transfers, cross-border remittances, asset swaps, bill payments',
        'Investment options: bonds, shares, insurance, cash withdrawals via agents',
        'Integration with Kinesis.money for KAU/KAG issuance'
      ],
      valueProposition: 'Simplifies complex financial services into a single, secure app, bridging traditional banking with crypto innovation.'
    },
    {
      icon: '🛒',
      title: 'Decentralized e-Commerce Marketplace',
      positioning: 'Shop local, trade global—powered by trust and community.',
      description: 'A peer-to-peer marketplace for communities to buy, sell, and trade goods/services using CLIX, KAU, KAG, or fiat equivalents.',
      features: [
        'Local and global listings with KYC-verified sellers',
        'Payment options: CLIX, crypto swaps, or remittances via Stellar',
        'Community ratings and reviews tied to "Clic Trust Rating"',
        'Decentralized escrow and dispute resolution',
        'Integration with value chain management for direct producer sales'
      ],
      valueProposition: 'A safe, decentralized alternative to corporate e-commerce giants, keeping wealth within communities.'
    },
    {
      icon: '💼',
      title: 'Business Hub for SMEs',
      positioning: 'Grow your business, your way—with tools that scale.',
      description: 'An end-to-end business management suite for small and medium enterprises (SMEs).',
      features: [
        'Comprehensive accounts, payroll, stock, and inventory management',
        'Supply chain tracking with blockchain transparency',
        'CLIX-based payments and trade finance options',
        'Integration with decentralized marketplace for sales',
        'AI-powered business analytics and growth recommendations'
      ],
      valueProposition: 'Empowers SMEs with enterprise-grade tools at micro-scale costs, integrated with the CLIX financial ecosystem.'
    },
    {
      icon: '🌾',
      title: 'Value Chain Management',
      positioning: 'From farm to market—streamlined, secure, and community-funded.',
      description: 'A module for managing product lifecycles, off-taking, payments, and trade finance.',
      features: [
        'Product management: Track goods from source to sale on blockchain',
        'Off-taking: Pre-sell harvests or inventory with CLIX-backed contracts',
        'Payment management: Automate supplier payouts via Stellar',
        'Trade finance: Access loans or bonds using CLIX collateral',
        'Weather API integration for agricultural risk management'
      ],
      valueProposition: 'Optimizes agricultural and industrial value chains, critical for Africa\'s $1T agro-economy (FAO 2025 est.).'
    },
    {
      icon: '🎓',
      title: 'Online Education and E-Learning Platform',
      positioning: 'Learn today, lead tomorrow—education for a decentralized world.',
      description: 'A decentralized learning hub offering courses on finance, entrepreneurship, and sustainability.',
      features: [
        'Free and paid courses payable in CLIX or KAU/KAG',
        'Certifications tied to "OneClicID" for lifelong credentials',
        'Community-led content (e.g., SME success stories)',
        'Mentor marketplace connecting diaspora experts with local learners',
        'CLIX rewards for course completion and community contribution'
      ],
      valueProposition: 'Upskills users to thrive in the Clic.World ecosystem, fostering economic inclusion.'
    },
    {
      icon: '🧠',
      title: 'ClicBrain - AI Knowledge Management',
      positioning: 'Your enterprise memory that never forgets—where human insight meets AI amplification.',
      description: 'An enterprise-grade AI-human partnership platform that captures, processes, and amplifies organizational intelligence through documented breakthrough methodologies and persistent memory systems.',
      features: [
        'Corporate Intelligence: Enterprise knowledge graphs connecting insights, decisions, and outcomes',
        'Cross-Session Continuity: Seamless context restoration maintaining project momentum across time gaps',
        'Quality Gate Enforcement: Mandatory development protocols preventing technical debt',
        'Performance Analytics: 88.6% productivity gains measurement with waste elimination tracking',
        'Integration Ecosystem: Native connectivity with all Clic.World products',
        'White-Label Licensing: Enterprise deployment for $240B AI productivity market opportunities'
      ],
      valueProposition: 'Transforms organizational intelligence from scattered tribal knowledge into persistent, searchable, and amplified corporate memory, enabling breakthrough innovation velocity while maintaining human creativity and strategic thinking at the center of all decisions.'
    }
  ];

  const toggleProduct = (index) => {
    setExpandedProduct(expandedProduct === index ? null : index);
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Complete Ecosystem Solutions</h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-xl text-white/90 max-w-4xl mx-auto">
            Six interconnected products that power the future of community-owned finance—
            from local banking to global AI intelligence, all built on the CLIX ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="text-4xl mb-4">{product.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-green-900">{product.title}</h3>
                <p className="text-green-600 font-medium italic mb-4 text-sm leading-relaxed">
                  "{product.positioning}"
                </p>
                
                {expandedProduct !== index && (
                  <div className="mb-6">
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>
                )}

                {expandedProduct === index && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Description:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="text-green-500 mr-2 font-bold text-lg flex-shrink-0">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Value Proposition:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed italic">
                        {product.valueProposition}
                      </p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => toggleProduct(index)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {expandedProduct === index ? (
                    <>
                      Show Less
                      <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Learn More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Message */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border-l-4 border-green-600">
            <h3 className="text-2xl font-bold text-green-900 mb-4">Seamlessly Integrated Ecosystem</h3>
            <p className="text-gray-700 leading-relaxed">
              All six products work together as one unified platform. Your CLIX wallet works across all services, 
              your business data flows between modules, and ClicBrain AI optimizes performance across the entire ecosystem. 
              This isn't just a collection of tools—it's a complete economic operating system for communities and enterprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;