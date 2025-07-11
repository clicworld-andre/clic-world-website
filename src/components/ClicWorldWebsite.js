import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import ProductsSection from './ProductsSection';
import ClixSection from './ClixSection';
import PrivacySection from './PrivacySection';
import ClicBrainSection from './ClicBrainSection';
import BlogSection from './BlogSection';
import AboutSection from './AboutSection';
import PartnersSection from './PartnersSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

const ClicWorldWebsite = () => {
  const [clixPrice, setClixPrice] = useState(2.47);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Debug: Log whenever activeSection changes
  useEffect(() => {
    console.log(`🔄 ActiveSection changed to: ${activeSection}`);
  }, [activeSection]);
  // const [showThirdWayModal, setShowThirdWayModal] = useState(false);

  // Live CLIX price simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const basePrice = 2.47;
      const variation = (Math.random() - 0.5) * 0.1;
      setClixPrice((basePrice + variation).toFixed(2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const scrollToSection = (sectionId) => {
    console.log(`➡️ ScrollToSection called for: ${sectionId}`);
    
    // Set scrolling flag to disable scroll detection
    setIsScrolling(true);
    
    const element = document.getElementById(sectionId);
    if (element) {
      console.log(`🎯 Element found for ${sectionId}`);
      const navbarHeight = 140;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      console.log(`📜 Starting scroll to position: ${offsetPosition}`);
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Re-enable scroll detection after scrolling completes
      setTimeout(() => {
        console.log(`✅ Scroll complete, re-enabling scroll detection`);
        setIsScrolling(false);
      }, 1000); // Give enough time for smooth scroll to complete
      
    } else {
      console.log(`❌ Element NOT found for ${sectionId}`);
      setIsScrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        clixPrice={clixPrice}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        setActiveSection={setActiveSection}
      />
      
      <HeroSection 
        clixPrice={clixPrice}
        scrollToSection={scrollToSection}
      />
      
      <AboutSection />
      
      <ProductsSection />
      
      <ClixSection />
      
      <ClicBrainSection scrollToSection={scrollToSection} />
      
      <PrivacySection />
      
      <BlogSection />
      
      <PartnersSection />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default ClicWorldWebsite;
