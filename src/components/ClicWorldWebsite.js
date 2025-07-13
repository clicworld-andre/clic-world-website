import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import ProductsSection from './ProductsSection';
import ClixSection from './ClixSection';
import PrivacySectionEnhanced from './PrivacySectionEnhanced';
import ClicBrainSection from './ClicBrainSection';
import BlogSection from './BlogSection';
import AboutSectionEnhanced from './AboutSectionEnhanced';
import PartnersSection from './PartnersSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import useClixPriceDual from '../hooks/useClixPriceDual';
import bitqueryService from '../services/BitqueryService';
import DebugInfo from './DebugInfo';

const ClicWorldWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Use the dual price service with USD and XLM pricing
  const { 
    priceUSD: clixPriceUSD,
    priceXLM: clixPriceXLM,
    xlmToUSD,
    isLoading: priceLoading, 
    error: priceError, 
    isConnected: priceConnected,
    activeService,
    refreshPrice
  } = useClixPriceDual({
    enableRealTime: true,
    pollInterval: 30000, // 30 second fallback for Horizon
    preferredService: 'horizon', // Force Horizon API to avoid CORS issues
    onError: (error, serviceName) => console.error(`💰 ${serviceName} Error:`, error)
  });

  // Initialize Bitquery service on component mount
  useEffect(() => {
    // Initialize with API key from environment variable
    const apiKey = process.env.REACT_APP_BITQUERY_API_KEY;
    if (apiKey) {
      bitqueryService.initialize(apiKey);
      console.log('🔑 Bitquery service initialized');

      // Set CLIX token configuration
      const assetCode = process.env.REACT_APP_CLIX_ASSET_CODE || 'CLIX';
      const issuer = process.env.REACT_APP_CLIX_ISSUER || '';
      bitqueryService.setClixTokenConfig(assetCode, issuer);
      console.log('🪙 CLIX token config set:', { assetCode, issuer: issuer.slice(0, 10) + '...' });
    } else {
      console.warn('⚠️ REACT_APP_BITQUERY_API_KEY not found in environment variables');
      console.log('💡 Add your Bitquery API key to .env file as REACT_APP_BITQUERY_API_KEY=your_key_here');
      console.log('🔄 Falling back to simulation mode');
    }
  }, []);
  
  // Debug: Log whenever activeSection changes
  useEffect(() => {
    console.log(`🔄 ActiveSection changed to: ${activeSection}`);
  }, [activeSection]);

  // Debug: Log price updates
  useEffect(() => {
    if (priceConnected) {
      console.log('🟢 Real-time price connection established');
    }
    if (priceError) {
      console.log('🟡 Using fallback price due to:', priceError);
    }
  }, [priceConnected, priceError]);

  // Enhanced scroll detection for navigation
  useEffect(() => {
    const handleScroll = () => {
      // Skip scroll detection during programmatic scrolling
      if (isScrolling) {
        console.log(`⏸️ SCROLL DETECTION: Skipped due to programmatic scroll`);
        return;
      }
      
      const sections = ['home', 'about', 'products', 'clix', 'clicbrain', 'pryvaz', 'blog', 'partners', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current && current !== activeSection) {
        console.log(`📜 SCROLL DETECTION: Changing from ${activeSection} to ${current}`);
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, isScrolling]);

  // Enhanced scroll to section function
  const scrollToSection = (sectionId) => {
    console.log(`➡️ ScrollToSection called for: ${sectionId}`);
    
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`🎯 Element found for ${sectionId}`);
      
      // Disable scroll detection during programmatic scroll
      setIsScrolling(true);
      
      const offsetTop = element.offsetTop - 100; // Account for fixed nav
      console.log(`📜 Starting scroll to position: ${offsetTop}`);
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Re-enable scroll detection after scroll completes
      setTimeout(() => {
        console.log(`✅ Scroll complete, re-enabling scroll detection`);
        setIsScrolling(false);
      }, 1000);
    } else {
      console.error(`❌ Element not found for section: ${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        clixPriceUSD={clixPriceUSD}
        clixPriceXLM={clixPriceXLM}
        xlmToUSD={xlmToUSD}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        setActiveSection={setActiveSection}
      />
      
      <main>
        <section id="home">
          <HeroSection 
            clixPriceUSD={clixPriceUSD} 
            clixPriceXLM={clixPriceXLM}
            xlmToUSD={xlmToUSD}
            scrollToSection={scrollToSection} 
          />
        </section>
        
        <section id="about">
          <AboutSectionEnhanced />
        </section>
        
        <section id="products">
          <ProductsSection />
        </section>
        
        <section id="clix">
          <ClixSection 
            clixPriceUSD={clixPriceUSD}
            clixPriceXLM={clixPriceXLM}
            xlmToUSD={xlmToUSD}
          />
        </section>
        
        <section id="clicbrain">
          <ClicBrainSection />
        </section>
        
        <section id="pryvaz">
          <PrivacySectionEnhanced />
        </section>
        
        <section id="blog">
          <BlogSection />
        </section>
        
        <section id="partners">
          <PartnersSection />
        </section>
        
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      
      <Footer />

      {/* Debug Info Component */}
      <DebugInfo />

      {/* Development helper - shows connection status */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs">
          CLIX: {clixPriceUSD ? `${clixPriceUSD}` : 'N/A'} | {clixPriceXLM ? `${clixPriceXLM} XLM` : 'N/A'}
          {priceLoading && ' [Loading]'}
          {priceConnected && ' [Connected]'}
          {priceError && ' [Error]'}
        </div>
      )}
    </div>
  );
};

export default ClicWorldWebsite;