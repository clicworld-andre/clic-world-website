import React, { useState } from 'react';
import { blogPosts } from '../data/blogPosts';
import BlogPostModal from './BlogPostModal';

const ClixSection = ({ clixPriceUSD, clixPriceXLM, xlmToUSD }) => {
  // Modal state for "Third Way" blog post
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Find the "Finance's Third Way" blog post
  const thirdWayPost = blogPosts.find(post => post.slug === 'clic-world-vision-finance-third-way');
  
  // Find the "Africa's Youth Surge" blog post
  const youthSurgePost = blogPosts.find(post => post.slug === 'africa-youth-surge-demographic-dividend-clix-future');
  
  const openYouthSurgePost = () => {
    if (youthSurgePost) {
      setSelectedPost(youthSurgePost);
      setIsModalOpen(true);
    }
  };
  
  const openThirdWayPost = () => {
    if (thirdWayPost) {
      setSelectedPost(thirdWayPost);
      setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const tokenomics = [
    {
      percentage: "40%",
      label: "Community Rewards",
      description: "Directly benefiting ecosystem participants",
      color: "bg-green-100",
      textColor: "text-green-700"
    },
    {
      percentage: "25%",
      label: "Green Projects",
      description: "Sustainable development initiatives",
      color: "bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      percentage: "20%",
      label: "Development",
      description: "Platform enhancement and innovation",
      color: "bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      percentage: "15%",
      label: "Team & Reserves",
      description: "Long-term sustainability and operations",
      color: "bg-orange-100",
      textColor: "text-orange-700"
    }
  ];

  const useCases = [
    {
      icon: "💸",
      title: "Payments",
      description: "Cross-border remittances, micro-transactions, and merchant adoption for seamless financial flows.",
      highlight: "Fast & affordable global transfers"
    },
    {
      icon: "📈",
      title: "Investment",
      description: "Green project funding, staking rewards, and real-world asset tokenization liquidity.",
      highlight: "Real assets, real returns"
    },
    {
      icon: "🤝",
      title: "Social Finance",
      description: "Community profit-sharing and loyalty rewards for active ecosystem engagement.",
      highlight: "Community wealth sharing"
    },
    {
      icon: "🗳️",
      title: "Governance",
      description: "Ecosystem decision-making and project funding votes for democratic participation.",
      highlight: "Your voice, your vote"
    }
  ];

  const growthMetrics = [
    {
      value: "60M",
      label: "Target Users by 2035",
      sublabel: "54M Africa + 6M Diaspora"
    },
    {
      value: "$15B",
      label: "Annual Transaction Volume",
      sublabel: "Target market goal"
    },
    {
      value: "40+",
      label: "Global Markets",
      sublabel: "Starting with 24 African countries"
    },
    {
      value: "$5B",
      label: "Market Cap Goal",
      sublabel: "Sustainable growth target"
    }
  ];

  // FILE_MARKER: All data arrays defined - ready for JSX return

  return (
    <section id="clix" className="py-8 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Hero Section with Live Price */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <button onClick={openThirdWayPost} className="text-green-600 hover:text-blue-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit leading-inherit">CLIX: Finance's Third Way</button>
          </h2>
          
          {/* Live Price Display */}
          <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl p-6 border border-green-200 max-w-4xl mx-auto mb-8">
            <div className="flex justify-center items-center space-x-8 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {clixPriceUSD ? `${clixPriceUSD}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">USD Price</div>
              </div>
              
              <div className="h-12 w-px bg-gray-300"></div>
              
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {clixPriceXLM ? `${clixPriceXLM}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 font-medium">XLM Price</div>
              </div>
              
              {xlmToUSD && (
                <>
                  <div className="h-12 w-px bg-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      ${xlmToUSD}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">XLM/USD Rate</div>
                  </div>
                </>
              )}
            </div>
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live from Stellar Network</span>
              </div>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            The financial upgrade that puts communities first. CLIX combines a complete social financial platform with a community-owned token, delivering real financial empowerment beyond traditional banking and crypto speculation.
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">🌍</div>
                <h4 className="font-bold text-gray-900">African-Born</h4>
                <p className="text-sm text-gray-600">Social finance platform</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">🏦</div>
                <h4 className="font-bold text-gray-900">Real-World Assets</h4>
                <p className="text-sm text-gray-600">Buy gold and securities</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">🤝</div>
                <h4 className="font-bold text-gray-900">Community-Owned</h4>
                <p className="text-sm text-gray-600">Regulatory aligned</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILE_MARKER: Hero section complete - ready for Core Concept section */}

        {/* Core Concept */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Beyond Traditional Finance vs. Crypto</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CLIX combines traditional finance stability with blockchain innovation, 
              serving real-world needs rather than speculation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">⚡</span>
                Hybrid Blockchain Approach
              </h4>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                  <div className="bg-blue-600 rounded-full w-3 h-3 mr-3"></div>
                  <div>
                    <strong className="text-blue-900">Stellar Network:</strong> Fast transactions & low costs
                  </div>
                </div>
                <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                  <div className="bg-purple-600 rounded-full w-3 h-3 mr-3"></div>
                  <div>
                    <strong className="text-purple-900">BSC Integration:</strong> DeFi capabilities & governance
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                Circular Economy Vision
              </h4>
              <p className="text-gray-600 mb-4">
                Creating sustainable wealth generation where communities both create and share value, 
                moving beyond extraction-based models.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-green-800 font-semibold">
                  "Communities generate and share wealth sustainably"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FILE_MARKER: Core Concept section complete - ready for Token Economics */}

        {/* Token Economics */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Token Economics</h3>
            <p className="text-xl text-gray-600">
              <strong className="text-gray-900">10 Billion CLIX</strong> total supply distributed for maximum community benefit
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {tokenomics.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all">
                <div className={`${item.color} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
                  <span className={`text-2xl font-bold ${item.textColor}`}>{item.percentage}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{item.label}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FILE_MARKER: Token Economics section complete - ready for Use Cases */}

        {/* Use Cases */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Four Pillars of Utility</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The CLIX token serves as payment medium, investment vehicle, loyalty rewards, and governance voting
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-all">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{useCase.icon}</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">{useCase.title}</h4>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{useCase.description}</p>
                <div className="bg-blue-50 px-3 py-2 rounded-lg">
                  <p className="text-blue-700 text-xs font-medium">{useCase.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FILE_MARKER: Use Cases section complete - ready for Growth Strategy */}

        {/* Growth Strategy */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              <button 
                onClick={openYouthSurgePost} 
                className="text-gray-900 hover:text-blue-700 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit leading-inherit"
              >
                Ambitious Growth Vision
              </button>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building the largest community-owned financial ecosystem globally
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {growthMetrics.map((metric, index) => (
              <div key={index} className="bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <div className="text-lg font-semibold mb-1">{metric.label}</div>
                <div className="text-sm opacity-90">{metric.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FILE_MARKER: Growth Strategy section complete - ready for Key Value Proposition */}

        {/* Key Value Proposition */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">The CLIX Difference</h3>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            A practical, community-focused alternative serving real-world needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🌍</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">African Markets Focus</h4>
            <p className="text-gray-600 mb-4">
              Strong emphasis on African markets and diaspora connections for inclusive finance.
            </p>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-green-700 text-sm font-medium">24 countries and expanding</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚖️</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Stability Meets Innovation</h4>
            <p className="text-gray-600 mb-4">
              Beyond volatile crypto speculation - real-world asset backing with blockchain efficiency.
            </p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-700 text-sm font-medium">Gold & bonds backed</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚀</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Community-Driven Growth</h4>
            <p className="text-gray-600 mb-4">
              Democratic governance where community members shape the ecosystem's future together.
            </p>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-purple-700 text-sm font-medium">Your ecosystem, your rules</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
          <p className="text-xl font-semibold text-gray-800 mb-2">
            CLIX: Where traditional finance stability meets blockchain innovation
          </p>
          <p className="text-lg font-bold text-blue-600">
            Finance's Third Way - Born in Africa, Built for the World
          </p>
        </div>
      </div>
      
      {/* Blog Post Modal for "Third Way" */}
      <BlogPostModal 
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default ClixSection;
