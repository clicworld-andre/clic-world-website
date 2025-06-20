import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import ProductsSection from './ProductsSection';
import ClixSection from './ClixSection';
import PrivacySection from './PrivacySection';
import ClicBrainSection from './ClicBrainSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

const ClicWorldWebsite = () => {
  const [clixPrice, setClixPrice] = useState(2.47);
  const [activeSection, setActiveSection] = useState('home');
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 140;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation 
        clixPrice={clixPrice}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
      
      <HeroSection 
        clixPrice={clixPrice}
        scrollToSection={scrollToSection}
      />
      
      <PrivacySection />
      
      <ProductsSection />
      
      <ClixSection />
      
      <ClicBrainSection scrollToSection={scrollToSection} />
      
      <AboutSection />
      
      <ContactSection />
      
      <Footer />
    </div>
  );
};

export default ClicWorldWebsite;
