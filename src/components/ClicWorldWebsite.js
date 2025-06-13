import React, { useState, useEffect } from 'react';

const ClicWorldWebsite = () => {
  const [clixPrice, setClixPrice] = useState(2.47);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showThirdWayModal, setShowThirdWayModal] = useState(false);

  // Live CLIX price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const basePrice = 2.47;
      const variation = (Math.random() - 0.5) * 0.1; // smaller variation for token price
      setClixPrice((basePrice + variation).toFixed(2));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced scroll detection for navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Active section detection
      const sections = ['home', 'products', 'clix', 'pryvaz', 'clicbrain', 'about', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Modal keyboard handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showThirdWayModal) {
        setShowThirdWayModal(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showThirdWayModal]);

  const scrollToSection = (sectionId) => {
    console.log('Scrolling to:', sectionId); // Debug log
    const element = document.getElementById(sectionId);
    if (element) {
      // Get the navbar height (approximately 140px for fixed nav + top bar)
      const navbarHeight = 140;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.log('Element not found:', sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white shadow-lg border-b border-gray-200">
        {/* Top Bar */}
        <div className="bg-clic-green-900 text-white py-2">
          <div className="container-custom">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <span className="mr-2">💎</span>
                  CLIX ${clixPrice}
                </span>
                <span className="flex items-center">
                  <span className="mr-2">🌍</span>
                  Clic.World - Movement Without Borders
                </span>
              </div>
              <div className="hidden md:block">
                <span>The future of digital - is human</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src={`${process.env.PUBLIC_URL}/clic-logo.png`} 
                alt="Clic.World Logo" 
                className="w-16 h-16 object-contain"
              />
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
                  className={`nav-link text-gray-700 hover:text-clic-green-600 font-medium transition-colors ${
                    activeSection === item.id ? 'text-clic-green-600 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button className="btn-primary px-6 py-2">
                Join Movement
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        <div className="hero-content container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-slide-up">
              <h1 style={{
                fontSize: '2.8rem',
                fontWeight: '800',
                lineHeight: '1.1',
                marginBottom: '1.5rem',
                color: 'white'
              }}>
                We're not disrupting finance.<br />
                <span style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  We're upgrading it.
                </span>
              </h1>
              
              <p className="text-body mb-8 text-white/90">
                Money re-centralized where it belongs – in the hands of those who build real value. 
                Community-owned finance powered by blockchain, serving 500 million cooperative members across Africa.
              </p>

              {/* Enhanced Live Stats */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { value: `${clixPrice}`, label: 'CLIX Token Price (USD)', icon: '💎' },
                  { value: '90%+', label: 'Community Bank Repayment Rate', icon: '📈' },
                  { value: '500M', label: 'African Cooperative Members', icon: '🏘️' },
                  { value: '75%', label: 'Profits Stay in Communities', icon: '🤝' }
                ].map((stat, index) => (
                  <div key={index} className="card-stat animate-scale-in" style={{animationDelay: `${index * 0.2}s`}}>
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="stats-counter text-clic-gold-400">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('clix')}
                  className="btn-secondary"
                >
                  Discover CLIX Token
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="btn-outline"
                >
                  Join the Movement
                </button>
              </div>
            </div>

            {/* Enhanced Floating Cards */}
            <div className="relative h-96 lg:h-80">
              {[
                { title: 'Community Ownership', value: '75% Profit Share', animation: 'animate-float', icon: '🤝' },
                { title: 'USSD Access', value: '*483# Ready', animation: 'animate-float-delayed', icon: '📱' },
                { title: 'Asset Backed', value: 'KAU/KAG Gold', animation: 'animate-float-delayed-2', icon: '🏆' }
              ].map((card, index) => (
                <div
                  key={index}
                  className={`absolute glass-effect p-6 rounded-2xl shadow-2xl ${card.animation} interactive-card`}
                  style={{
                    top: `${index * 25}%`,
                    left: `${index * 15}%`
                  }}
                >
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <div className="font-semibold text-gray-800 mb-2">{card.title}</div>
                  <div className="text-xl font-bold text-clic-green-600">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRYVAZ Partnership Section */}
      <section id="pryvaz" className="section-padding bg-gradient-to-r from-clic-green-900 to-clic-blue-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Quantum-Secured Privacy Partnership</h2>
            <div className="brand-accent"></div>
            <p className="text-body text-white/80 max-w-4xl mx-auto mb-12">
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

          {/* How PRYVAZ Works - Visual Explanation */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-white">How Your PRYVAZ Container Works</h3>
            
            <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Your Container */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-400/20 to-blue-400/20 border-2 border-green-400 rounded-2xl p-6 mb-4">
                    <div className="text-4xl mb-3">🏦</div>
                    <h4 className="font-bold text-green-300 mb-2">Your PRYVAZ Container</h4>
                    <div className="text-sm text-white/70 space-y-1">
                      <div>🧠 Your Personal AI</div>
                      <div>📊 Your Data</div>
                      <div>🔒 Quantum-Secured</div>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">Everything stays in YOUR control</p>
                </div>
                
                {/* Connection */}
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="flex-1 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded"></div>
                    <div className="mx-4 bg-white/10 rounded-full p-2">
                      <span className="text-white text-sm">↔️</span>
                    </div>
                    <div className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded"></div>
                  </div>
                  <p className="text-white/60 text-xs mt-2">Secure API Connections</p>
                </div>
                
                {/* External Services */}
                <div className="text-center">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-3">
                      <div className="text-2xl mb-1">💳</div>
                      <div className="text-xs text-blue-200">Wallet</div>
                    </div>
                    <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-3">
                      <div className="text-2xl mb-1">🏦</div>
                      <div className="text-xs text-green-200">Social Bank</div>
                    </div>
                    <div className="bg-purple-500/20 border border-purple-400/50 rounded-lg p-3">
                      <div className="text-2xl mb-1">💼</div>
                      <div className="text-xs text-purple-200">Marketplace</div>
                    </div>
                    <div className="bg-orange-500/20 border border-orange-400/50 rounded-lg p-3">
                      <div className="text-2xl mb-1">💬</div>
                      <div className="text-xs text-orange-200">Chat</div>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm">Services connect TO you</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 p-4 rounded-lg border border-yellow-400/30">
                  <p className="text-yellow-200 font-semibold mb-2">Traditional Platforms:</p>
                  <p className="text-white/70 text-sm">Your Data → Their Servers → Their AI → Their Profit</p>
                </div>
                <div className="my-4 text-white/60">↓</div>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-lg border border-green-400/30">
                  <p className="text-green-200 font-semibold mb-2">PRYVAZ Revolution:</p>
                  <p className="text-white/70 text-sm">Your Data → Your Container → Your AI → Your Control</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-clic-gold-400">Data Sovereignty</h3>
              <p className="text-white/80">Your data lives in YOUR encrypted container. No company can access, sell, or manipulate your information.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-clic-gold-400">Banking-Grade Security</h3>
              <p className="text-white/80">Government-level encryption and security standards protect every interaction and transaction.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-clic-gold-400">You Control Monetization</h3>
              <p className="text-white/80">Choose how and when to monetize your data. Keep 100% privacy or earn revenue on your terms.</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4 text-clic-gold-400">The First Platform Where YOU Truly Own Your Data</h3>
            <div className="flex justify-center gap-4">
              <button className="btn-secondary px-8 py-4">
                Learn About Privacy Revolution
              </button>
              <button className="btn-outline px-8 py-4">
                Get Early Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Products Section */}
      <section id="products" className="section-padding bg-clic-green-50">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-headline mb-4">Complete Ecosystem Solutions</h2>
            <div className="brand-accent"></div>
            <p className="text-body text-gray-600 max-w-4xl mx-auto">
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
              <div key={index} className="card-feature reveal" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="feature-icon">
                  {product.icon}
                </div>
                <h3 className="text-title mb-3 text-clic-green-900">{product.title}</h3>
                <p className="text-clic-green-600 font-medium italic mb-4 text-sm">{product.tagline}</p>
                <ul className="space-y-3 mb-6">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="text-clic-green-500 mr-3 font-bold text-lg">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary w-full">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIX Token Section - THE MAIN NEW SECTION */}
      <section id="clix" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">CLIX - Re-centralizing Money Where It Belongs</h2>
            <div className="brand-accent"></div>
            <p className="text-body text-gray-600 max-w-4xl mx-auto">
              Not a speculative token – CLIX is utility-driven money backed by real economic activity. 
              Built for communities, not corporations. Token growth through value creation, not speculation.
            </p>
          </div>

          {/* Three Pillars */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-clic-green-50 to-clic-blue-50 p-8 rounded-2xl card-hover">
              <div className="feature-icon bg-gradient-to-br from-clic-green-500 to-clic-green-600 mb-6">
                🏛️
              </div>
              <h3 className="text-title text-clic-green-900 mb-4">Community Ownership</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-clic-green-500 mr-3 font-bold text-lg">✓</span>
                  <span>75% of banking profits stay in communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-clic-green-500 mr-3 font-bold text-lg">✓</span>
                  <span>DAO governance: Members vote on rates and policies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-clic-green-500 mr-3 font-bold text-lg">✓</span>
                  <span>Democratic finance replacing corporate control</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-clic-gold-50 to-yellow-50 p-8 rounded-2xl card-hover">
              <div className="feature-icon bg-gradient-to-br from-clic-gold-500 to-clic-gold-600 mb-6">
                🌾
              </div>
              <h3 className="text-title text-clic-gold-900 mb-4">Real Asset Economics</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-clic-gold-500 mr-3 font-bold text-lg">✓</span>
                  <span>Backed by gold (KAU), silver (KAG), and commodities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-clic-gold-500 mr-3 font-bold text-lg">✓</span>
                  <span>Tokenized harvests and warehouse receipts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-clic-gold-500 mr-3 font-bold text-lg">✓</span>
                  <span>Value creation rewarded, not speculation</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-clic-blue-50 to-purple-50 p-8 rounded-2xl card-hover">
              <div className="feature-icon bg-gradient-to-br from-clic-blue-500 to-clic-blue-600 mb-6">
                📱
              </div>
              <h3 className="text-title text-clic-blue-900 mb-4">Mobile-First Banking</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-clic-blue-500 mr-3 font-bold text-lg">✓</span>
                  <span>USSD access (*483#) for feature phones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-clic-blue-500 mr-3 font-bold text-lg">✓</span>
                  <span>AI loans in 24hrs with 90%+ approval rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-clic-blue-500 mr-3 font-bold text-lg">✓</span>
                  <span>Cross-border payments at 1/10th traditional cost</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CLIX Investment Exchange */}
          <div className="bg-gradient-to-r from-clic-green-900 to-clic-blue-900 rounded-2xl p-8 text-white mb-16">
            <div className="text-center mb-8">
              <h3 className="text-title-sm mb-4">CLIX Investment Exchange</h3>
              <p className="text-body text-white/80 max-w-3xl mx-auto">
                A unified platform combining Forex, Crypto, and Securities into one integrated exchange. 
                Trade real-world assets with blockchain efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💰', title: 'Multi-Asset Trading', desc: 'CLIX ↔ Gold ↔ Silver ↔ Bonds ↔ Shares ↔ Local Currencies' },
                { icon: '🌾', title: 'Commodity Tokens', desc: 'Convert harvests into tradable tokens with instant liquidity' },
                { icon: '⚡', title: 'Instant Settlement', desc: 'No waiting for market hours - trade 24/7 with 3-5 second finality' },
                { icon: '💸', title: 'Low Fees', desc: '0.5% transaction costs vs 5-8% traditional remittances' }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Proven Results */}
          <div className="bg-clic-blue-50 p-8 rounded-2xl mb-16">
            <h4 className="text-title text-clic-blue-900 mb-6 text-center">Proven Community Results</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🥛</div>
                <div className="font-semibold mb-2">Kenyan Dairy Farmers</div>
                <div className="text-3xl font-bold text-clic-green-600 mb-2">+20%</div>
                <div className="text-sm text-gray-600">Income boost via instant milk token (MLK) payments</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🌾</div>
                <div className="font-semibold mb-2">Ugandan Cassava Growers</div>
                <div className="text-3xl font-bold text-clic-green-600 mb-2">-60%</div>
                <div className="text-sm text-gray-600">Fewer losses with warehouse receipt NFTs</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="text-4xl mb-3">🏦</div>
                <div className="font-semibold mb-2">Community Banks</div>
                <div className="text-3xl font-bold text-clic-green-600 mb-2">90%+</div>
                <div className="text-sm text-gray-600">Loan repayment vs 60% traditional banks</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-title-sm mb-4">Ready to Own Your Financial Future?</h3>
            <p className="text-body text-gray-600 mb-8 max-w-3xl mx-auto">
              Join 500 million Africans who already prove communities manage money better than banks. 
              CLIX makes cooperative finance work for the digital age.
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn-primary px-8 py-4">
                Join Community Bank
              </button>
              <button className="btn-secondary px-8 py-4">
                View Whitepaper
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* ClicBrain Section */}
      <section id="clicbrain" className="section-padding bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h2 className="text-headline mb-6 bg-gradient-to-r from-purple-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              ClicBrain: Revolutionary AI-Human Partnership Platform
            </h2>
            <p className="text-xl md:text-2xl text-purple-200 mb-4 font-light">
              Transforming Development Productivity & Corporate Intelligence
            </p>
            <p className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed">
              The future of enterprise productivity lies not in replacing human intelligence, but in creating 
              seamless AI-human partnerships that amplify both capabilities exponentially.
            </p>
          </div>

          {/* AI Leadership Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              { number: '495+', label: 'Innovation Breakthroughs', subtitle: 'Real-time AI partnership' },
              { number: '4.0/5.0', label: 'Partnership Depth', subtitle: 'Highest documented in fintech' },
              { number: '88.6%', label: 'Performance Gains', subtitle: 'AI-optimized systems' },
              { number: '0%', label: 'Development Waste', subtitle: 'AI-enabled efficiency' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-white/60">{stat.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            {/* Left Column - Competitive Advantage */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-white">
                🏆 Clic.World: AI-First Innovation Leader
              </h3>
              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                <em>"While others are still figuring out how to use AI, Clic.World is already powered by it."</em>
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: '⚡',
                    title: 'Instant Innovation',
                    desc: 'AI partnership enables rapid response to market changes and user needs'
                  },
                  {
                    icon: '📈',
                    title: 'Continuous Learning', 
                    desc: 'Every user interaction improves our AI capabilities across all platforms'
                  },
                  {
                    icon: '📊',
                    title: 'Data-Driven Development',
                    desc: 'AI analyzes user patterns and feedback to guide feature development and improvements'
                  },
                  {
                    icon: '⚙️',
                    title: 'Intelligent Optimization',
                    desc: 'AI continuously optimizes system performance and user experience based on real usage data'
                  },
                  {
                    icon: '🚀',
                    title: 'Scalable Intelligence',
                    desc: 'Our AI grows smarter as our eco-system grows'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-white/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - ClicBrain in Action */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-white">
                🌟 ClicBrain in Action for Clic.World
              </h3>
              
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20 mb-8">
                <h4 className="text-xl font-semibold text-purple-200 mb-6">AI-Powered Innovation Examples</h4>
                <div className="space-y-4">
                  {[
                    {
                      product: 'CLIX Token',
                      innovation: 'AI-driven tokenomics optimization',
                      result: 'Maximum community benefit algorithms'
                    },
                    {
                      product: 'Community Banks',
                      innovation: 'Smart credit scoring system', 
                      result: '60%+ instant AI loans approvals'
                    },
                    {
                      product: 'Farmer Platform',
                      innovation: 'Predictive market analysis',
                      result: '20%+ income boost through AI timing'
                    }
                  ].map((example, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg">
                      <div className="font-semibold text-blue-200">{example.product}:</div>
                      <div className="text-white/80 text-sm">{example.innovation}</div>
                      <div className="text-green-300 text-sm font-medium">→ {example.result}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 rounded-xl border border-purple-400/30">
                <h4 className="font-semibold text-purple-200 mb-2">The ClicBrain Advantage</h4>
                <p className="text-white/80 text-sm mb-4">What makes Clic.World different:</p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li>• <strong>Living Memory:</strong> 428+ contextual memories ensure nothing is forgotten</li>
                  <li>• <strong>Cross-Platform Intelligence:</strong> AI insights flow across all Clic products</li>
                  <li>• <strong>Community-Trained:</strong> Learning from 500M+ cooperative members</li>
                  <li>• <strong>Real-Time Optimization:</strong> Continuous user experience improvement</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6 text-white">
              🚀 The Future of AI-Native Finance
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Clic.World: Built for the AI Age
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'First-Mover Advantage',
                  desc: 'Already AI-native while competitors are retrofitting'
                },
                {
                  title: 'Continuous Evolution', 
                  desc: 'AI partnership ensures we stay ahead of the curve'
                },
                {
                  title: 'Community-Centric AI',
                  desc: 'Technology that serves people, not replaces them'
                },
                {
                  title: 'Proven Track Record',
                  desc: 'Real results, not just promises'
                }
              ].map((item, index) => (
                <div key={index} className="p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 text-center">
                  <h4 className="font-semibold text-white mb-3">{item.title}</h4>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Solutions (Secondary) */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/20 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                💼 ClicBrain Enterprise Solutions
              </h3>
              <p className="text-white/80">The Technology Behind Our Success - Now Available to Partners</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🏆', title: 'Proven Framework', desc: 'Battle-tested in real financial applications' },
                { icon: '🚀', title: 'Enterprise Ready', desc: 'Scalable AI partnership architecture' },
                { icon: '⚙️', title: 'Customizable', desc: 'Adaptable to your organization\'s needs' },
                { icon: '🤝', title: 'Partnership Model', desc: 'True AI collaboration, not automation' }
              ].map((item, index) => (
                <div key={index} className="p-4">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-white/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6 text-white">
              🎯 Join the AI-Native Movement
            </h3>
            <p className="text-xl text-white/80 mb-8">Experience the Clic.World Advantage</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('products')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                See ClicBrain in Action
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all">
                Partner with AI Leaders
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="bg-transparent hover:bg-white/5 border-2 border-white/50 text-white px-8 py-4 rounded-full font-semibold transition-all"
              >
                Join Our Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Movement Without Borders</h2>
            <div className="brand-accent"></div>
            <p className="text-body text-gray-600 max-w-4xl mx-auto">
              From the mines of the Democratic Republic of Congo to a global movement—this is the story 
              of re-centralizing money where it belongs.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">The Awakening in the DRC</h3>
              <blockquote className="text-lg text-gray-700 leading-relaxed border-l-4 border-clic-green-500 pl-6 italic">
                "The fundamental problem became crystal clear in the mining communities of North Kivu province. 
                People extracting literal gold from the earth couldn't get paid properly. The value creators 
                received maybe 30% of what their work was worth."
              </blockquote>
            </div>
            
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Clic.World - Finance's{' '}
                <button 
                  onClick={() => setShowThirdWayModal(true)}
                  className="text-clic-green-600 hover:text-clic-green-700 underline underline-offset-2 transition-colors duration-200 font-bold"
                >
                  Third Way
                </button>
              </h3>
              <p className="text-lg text-gray-600 italic mb-6">(Rebalancing Influence, Ownership, and Value in the Digital Age)</p>
              
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  This is a reimagining of the digital economy—one that lifts people up instead of mining them for profit.
                </p>
                
                <p>
                  Imagine a world where money doesn't just <em>hold</em> value—it <em>creates</em> it. Where gold in your pocket earns yield, bonds fund schools, and communities aren't just users of a financial system—they're shareholders. A world where banks evolve from gatekeepers to allies, and technology amplifies human potential instead of replacing it.
                </p>
                
                <p>
                  Clic.World was born from a radical idea: What if technology served communities instead of corporations? What if the digital economy rebalanced <strong>influence, ownership, and value</strong>—not just moved money?
                </p>
                
                <p>
                  We started in Africa, where innovation thrives against all odds—<strong>where community is the engine, and where the future is rewritten daily</strong>. But this movement was never meant to stay within borders.
                </p>
                
                <p>
                  This is about <strong>real people</strong>—the creators, traders, farmers, and dreamers—taking their rightful place at the heart of finance. It's about <strong>sound money</strong> that works for the many, not the few. It's about networks that enrich lives, not platforms that drain them.
                </p>
                
                <div className="bg-white/50 p-6 rounded-lg border-l-4 border-clic-green-500">
                  <p className="font-semibold text-gray-800 mb-4">We're building an economy where:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>→ <strong>Value flows to those who create it</strong> (not just extract it)</li>
                    <li>→ <strong>Belonging means ownership</strong> (of assets, decisions, and futures)</li>
                    <li>→ <strong>"Digital" feels human</strong> (connected, inclusive, alive)</li>
                  </ul>
                </div>
                
                <p className="italic">
                  <em>We're not disrupting finance. We're upgrading it—with accountability, yield, and teeth.</em>
                </p>
                
                <div className="text-center mt-8">
                  <p className="text-xl font-semibold text-gray-800 mb-2">The old system falls short. We're the rewrite.</p>
                  <p className="text-lg font-bold text-clic-green-600">Born in Africa. Built for the world.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-gradient-to-r from-clic-green-900 to-clic-blue-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-headline mb-4">Ready to Join the Movement?</h2>
            <div className="brand-accent"></div>
            <p className="text-body text-white/80 max-w-4xl mx-auto">
              Whether you're a community leader, entrepreneur, or dreamer—there's a place 
              for you in the Clic.World ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect p-8 rounded-2xl text-center card-hover">
              <div className="text-4xl mb-4">🏘️</div>
              <h3 className="text-xl font-bold text-clic-gold-400 mb-4">For Communities</h3>
              <p className="mb-6 text-white/80">Start your Community Social Bank and keep wealth in your community</p>
              <button className="btn-secondary">Launch Community Bank</button>
            </div>

            <div className="glass-effect p-8 rounded-2xl text-center card-hover">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-clic-gold-400 mb-4">For Entrepreneurs</h3>
              <p className="mb-6 text-white/80">Access business tools and CLIX-powered commerce solutions</p>
              <button className="btn-secondary">Start Your Business</button>
            </div>

            <div className="glass-effect p-8 rounded-2xl text-center card-hover">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-clic-gold-400 mb-4">For Enterprises</h3>
              <p className="mb-6 text-white/80">License technology and join the cooperative finance revolution</p>
              <button className="btn-secondary">Enterprise Solutions</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-clic-green-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <p>&copy; 2025 Clic.World. Re-centralizing money where it belongs - in the hands of value creators.</p>
          </div>
        </div>
      </footer>

      {/* Third Way Modal */}
      {showThirdWayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button 
              onClick={() => setShowThirdWayModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
            >
              ×
            </button>
            
            {/* Modal Content */}
            <div className="p-8">
              {/* Header Quote */}
              <div className="text-center mb-8">
                <blockquote className="text-xl text-gray-700 italic leading-relaxed border-l-4 border-clic-green-500 pl-6 mb-4">
                  "The First Way (traditional finance) hoards power. The Second Way (DeFi) gambles with it. 
                  <strong className="text-clic-green-600">The Third Way?</strong> We redistribute it—through sound money, 
                  community ownership, and systems that serve people first."
                </blockquote>
              </div>

              {/* Three Ways Comparison */}
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                {/* First Way */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-red-800 mb-4">The First Way: Traditional Centralized Finance</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-red-700 mb-2">Key Traits:</h4>
                    <p className="text-sm text-red-600 mb-3">Controlled by banks, governments, and corporations.</p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-red-700">Pros:</span>
                        <span className="text-red-600"> Stability, regulation, trust in institutions.</span>
                      </div>
                      <div>
                        <span className="font-semibold text-red-700">Cons:</span>
                        <span className="text-red-600"> Exclusionary (1.7B unbanked), extractive (profits flow upward), slow innovation.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-700">Example:</p>
                    <p className="text-sm text-red-600 italic">Savings accounts with 1% interest while banks profit from your deposits.</p>
                  </div>
                </div>

                {/* Second Way */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-orange-800 mb-4">The Second Way: Decentralized Finance (DeFi)</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-orange-700 mb-2">Key Traits:</h4>
                    <p className="text-sm text-orange-600 mb-3">Peer-to-peer, blockchain-based, no intermediaries.</p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-orange-700">Pros:</span>
                        <span className="text-orange-600"> Permissionless access, fast innovation, high yields.</span>
                      </div>
                      <div>
                        <span className="font-semibold text-orange-700">Cons:</span>
                        <span className="text-orange-600"> Speculative (crypto volatility), anarchic (little regulation), complex for non-tech users.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-orange-700">Example:</p>
                    <p className="text-sm text-orange-600 italic">Yield farming risky tokens on Uniswap to earn 20% APY (until the protocol gets hacked).</p>
                  </div>
                </div>

                {/* Third Way */}
                <div className="bg-clic-green-50 border border-clic-green-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-clic-green-800 mb-4">The Third Way: Clic.World's Community-Powered Finance</h3>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-clic-green-700 mb-2">Key Traits:</h4>
                    <p className="text-sm text-clic-green-600 mb-3">
                      <strong>Hybrid model:</strong> Combines the best of centralized trust (banks, regulators) 
                      and decentralized innovation (blockchain, tokenization).
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-clic-green-700">Pros:</span>
                        <div className="text-clic-green-600 ml-4 space-y-1">
                          <div>→ <strong>Real-world assets</strong> (gold, bonds) = stability</div>
                          <div>→ <strong>Community governance</strong> (SACCOs) = inclusivity</div>
                          <div>→ <strong>Regulatory collaboration</strong> = safety without stagnation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-clic-green-100 p-3 rounded-lg">
                    <p className="text-sm font-medium text-clic-green-700">Example:</p>
                    <p className="text-sm text-clic-green-600 italic">
                      A Kenyan farmer earns 5% yield on tokenized gold or bond savings and uses it to pay 
                      for fertilizer—no volatility, no bank fees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowThirdWayModal(false)}
                  className="btn-primary px-8 py-3"
                >
                  Join the Third Way Movement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClicWorldWebsite;
