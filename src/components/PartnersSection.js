import React from 'react';

const PartnersSection = () => {
  const partners = [
    {
      name: "ALTX Africa",
      description: "Regulated private securities exchange enabling tokenization of real-world assets across Africa",
      logo: `${process.env.PUBLIC_URL}/altx-logo.png`,
      website: "https://www.altxafrica.com",
      category: "Securities Exchange"
    },
    {
      name: "Kinesis Money",
      description: "Revolutionary monetary system offering gold and silver-backed digital currencies with yield-bearing capabilities",
      logo: `${process.env.PUBLIC_URL}/kinesis-logo.png`,
      website: "https://kinesis.money/",
      category: "Precious Metals Currency"
    },
    {
      name: "Digital RFQ",
      description: "Digital trading platform for financial instruments and securities across emerging markets",
      logo: `${process.env.PUBLIC_URL}/drfq-logo.svg`,
      website: "https://digitalrfq.com",
      category: "Trading Platform"
    },
    {
      name: "Interswitch Group",
      description: "Leading African integrated digital payments and commerce company powering financial inclusion",
      logo: `${process.env.PUBLIC_URL}/interswitch-logo.svg`,
      website: "https://interswitchgroup.com",
      category: "Payment Infrastructure"
    },
    {
      name: "Yellow Card",
      description: "Africa's largest cryptocurrency exchange providing secure and compliant crypto-to-fiat services",
      logo: `${process.env.PUBLIC_URL}/yellowcard-logo.svg`,
      website: "https://yellowcard.io",
      category: "Crypto Exchange"
    },
    {
      name: "ABC Bank",
      description: "Commercial banking partner providing core banking infrastructure and regulatory compliance",
      logo: `${process.env.PUBLIC_URL}/abc-logo.jpg`,
      website: "https://www.abcthebank.com",
      category: "Banking Partner"
    },
    {
      name: "Stellar",
      description: "Open-source blockchain network enabling fast, low-cost cross-border payments and financial services",
      logo: `${process.env.PUBLIC_URL}/stellar-logo.png`,
      website: "https://stellar.org/",
      category: "Blockchain Infrastructure"
    },
    {
      name: "Anthropic",
      description: "AI safety company developing Claude and other advanced AI systems for beneficial and safe applications",
      logo: `${process.env.PUBLIC_URL}/anthropic-logo.png`,
      website: "https://www.anthropic.com/",
      category: "AI Technology"
    },
    {
      name: "Pryvaz",
      description: "Quantum-secured privacy platform providing personal digital vaults with AI assistants for data sovereignty",
      logo: `${process.env.PUBLIC_URL}/pryvaz-logo.png`,
      website: "https://pryvaz.mystrikingly.com/",
      category: "Privacy Technology"
    }
  ];

  return (
    <section id="partners" className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Strategic Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building the future of finance through powerful partnerships across Africa and beyond. 
            Together, we're creating an ecosystem that serves communities, not just corporations.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors group cursor-pointer"
              onClick={() => window.open(partner.website, '_blank')}
            >
              {/* Logo */}
              <div className="h-16 mb-6 flex items-center justify-center">
                {partner.logo ? (
                  <img 
                    src={partner.logo} 
                    alt={`${partner.name} logo`}
                    className={`object-contain ${
                      partner.name === 'Yellow Card' ? 'max-h-10 max-w-32' : // Smaller for Yellowcard
                      partner.name === 'ABC Bank' ? 'max-h-20 max-w-full' : // Even bigger for ABC Bank
                      partner.name === 'Interswitch Group' ? 'max-h-full max-w-full' : // Bigger for Interswitch
                      partner.name === 'Stellar' ? 'max-h-16 max-w-52' : // Bigger size for Stellar
                      partner.name === 'Anthropic' ? 'max-h-12 max-w-44' : // Balanced size for Anthropic
                      partner.name === 'Pryvaz' ? 'max-h-10 max-w-36' : // Even smaller size for Pryvaz
                      'max-h-12 max-w-40' // Default size for others
                    }`}
                  />
                ) : (
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    {partner.name}
                  </div>
                )}
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {partner.category}
                </span>
              </div>

              {/* Partner Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {partner.name}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {partner.description}
              </p>

              {/* Visit Link */}
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-800">
                <span>Visit Website</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Philosophy */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Partnership-Driven Innovation</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                We believe the future of finance is collaborative, not competitive. Our strategic partnerships 
                combine regulatory expertise, technical innovation, and market access to create solutions 
                that truly serve African communities and the global diaspora.
              </p>
              <div className="flex items-center text-yellow-400 font-semibold">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Building together, growing together
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-yellow-500 rounded-full p-2 mr-4 mt-1">
                  <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Regulatory Compliance</h4>
                  <p className="text-blue-100 text-sm">Working within established frameworks across multiple African markets</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-500 rounded-full p-2 mr-4 mt-1">
                  <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Technical Excellence</h4>
                  <p className="text-blue-100 text-sm">Combining cutting-edge blockchain technology with proven financial infrastructure</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-yellow-500 rounded-full p-2 mr-4 mt-1">
                  <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Community Impact</h4>
                  <p className="text-blue-100 text-sm">Every partnership serves our mission of community-owned financial empowerment</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Interested in Partnership?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our ecosystem of forward-thinking organizations building the future of community-owned finance.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Explore Partnerships
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
