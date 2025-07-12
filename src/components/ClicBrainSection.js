import React, { useState } from 'react';
import { getPostBySlug } from '../data/blogPosts';
import BlogPostModal from './BlogPostModal';

const ClicBrainSection = ({ scrollToSection }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessEmail: '',
    linkedinProfile: '',
    name: '',
    surname: '',
    designation: '',
    employeeCount: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const openClicBrainPost = () => {
    const clicBrainPost = getPostBySlug('clicbrain-future-enterprise-intelligence');
    if (clicBrainPost) {
      setSelectedPost(clicBrainPost);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const emailBody = `
ClicBrain Enterprise Interest Registration

Name: ${formData.name} ${formData.surname}
Business Email: ${formData.businessEmail}
LinkedIn Profile: ${formData.linkedinProfile}
Designation: ${formData.designation}
Number of Employees: ${formData.employeeCount}

Additional Information:
${formData.additionalInfo}

---
Submitted from Clic.World website
Date: ${new Date().toLocaleString()}
      `.trim();

      const subject = encodeURIComponent('ClicBrain Enterprise Interest - ' + formData.name);
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:ClicBrain@clic.world?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;
      setSubmitMessage('✅ Email client opened! Please send the email to complete your registration.');
      
      setTimeout(() => {
        setFormData({
          businessEmail: '',
          linkedinProfile: '',
          name: '',
          surname: '',
          designation: '',
          employeeCount: '',
          additionalInfo: ''
        });
        setShowForm(false);
        setSubmitMessage('');
      }, 3000);
      
    } catch (error) {
      setSubmitMessage('❌ Error opening email client. Please email ClicBrain@clic.world directly.');
    }
    
    setIsSubmitting(false);
  };

  const tabContent = {
    overview: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">The Future of Enterprise Intelligence</h3>
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            ClicBrain represents a fundamental evolution in enterprise knowledge management—an <strong>AI-native, human-centric intelligence ecosystem</strong> that transforms how organizations create, share, and leverage collective wisdom.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-3">Living Knowledge Objects</h4>
            <p className="text-blue-200">Dynamic information that adapts, connects, and flows organically throughout your organization.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-3">Symbiotic Partnership</h4>
            <p className="text-blue-200">True human-AI collaboration that amplifies both capabilities exponentially.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-3">Free-Flowing Intelligence</h4>
            <p className="text-blue-200">Knowledge circulates based on context, need, and serendipitous discovery.</p>
          </div>
        </div>
      </div>
    ),
    
    paradigm: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">From Storage to Symbiosis</h3>
          <p className="text-xl text-blue-200 mb-8">
            Traditional enterprise systems warehouse information in rigid repositories. ClicBrain creates a living knowledge ecosystem.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-4">Traditional Approach</h4>
            <ul className="space-y-2 text-blue-200">
              <li>• Static documents and databases</li>
              <li>• Information silos and barriers</li>
              <li>• Manual knowledge management</li>
              <li>• One-size-fits-all solutions</li>
              <li>• Reactive information retrieval</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-4">ClicBrain Approach</h4>
            <ul className="space-y-2 text-blue-200">
              <li>• Intelligent, self-organizing knowledge</li>
              <li>• Seamless cross-department flow</li>
              <li>• AI-enhanced collaboration</li>
              <li>• Contextually adaptive systems</li>
              <li>• Predictive knowledge delivery</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h4 className="text-2xl font-bold text-white mb-4">AI-Native Architecture</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold text-blue-200 mb-2">Intelligent Knowledge Objects</h5>
              <p className="text-white/80">Self-aware information that understands its own value, context, and connections.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-blue-200 mb-2">Adaptive Pathways</h5>
              <p className="text-white/80">Information routes that evolve based on usage patterns and emerging needs.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-blue-200 mb-2">Contextual Intelligence</h5>
              <p className="text-white/80">Right knowledge, right moment, right people—automatically.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-blue-200 mb-2">Predictive Flows</h5>
              <p className="text-white/80">Anticipates information needs before they're explicitly requested.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    
    features: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Dynamic Knowledge Objects</h3>
          <p className="text-xl text-blue-200 mb-8">
            Beyond documents and data—intelligent knowledge that lives, learns, and evolves.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-3">Self-Organization</h4>
          <p className="text-blue-200">Knowledge objects automatically organize based on content, context, and usage patterns.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-3">Dynamic Relationships</h4>
          <p className="text-blue-200">Form intelligent connections with other knowledge objects across the organization.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-3">Continuous Evolution</h4>
          <p className="text-blue-200">Update and evolve themselves as new information becomes available.</p>
          </div>
          </div>
          
          <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-3">Contextual Awareness</h4>
          <p className="text-blue-200">Understand when and where they're most valuable to your organization.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-3">Temporal Sensitivity</h4>
          <p className="text-blue-200">Recognize when they need updates or have become obsolete.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-3">Usage Learning</h4>
          <p className="text-blue-200">Adapt presentation and accessibility based on how they're used.</p>
          </div>
          </div>
        </div>
      </div>
    ),
    
    partnership: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Symbiotic Human-AI Collaboration</h3>
          <p className="text-xl text-blue-200 mb-8">
            Beyond automation to true partnership—where humans and AI create organizational wisdom that exceeds the sum of its parts.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h4 className="text-2xl font-bold text-white mb-6 text-center">The Flow of Symbiotic Intelligence</h4>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { step: 1, title: "Human Insight", desc: "Seeds new knowledge creation" },
              { step: 2, title: "AI Amplifies", desc: "Pattern recognition & connections" },
              { step: 3, title: "Self-Organization", desc: "Knowledge objects establish relationships" },
              { step: 4, title: "Collaborative Refinement", desc: "Ongoing human-AI interaction" },
              { step: 5, title: "Organizational Intelligence", desc: "Emerges from collective network" }
            ].map((item, index) => (
              <div key={index} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-sm font-semibold text-blue-200 mb-1">{item.step}. {item.title}</div>
                <div className="text-xs text-white/70">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-4">Humans Provide</h4>
            <ul className="space-y-2 text-blue-200">
              <li>• Strategic vision & direction</li>
              <li>• Emotional intelligence</li>
              <li>• Creative problem-solving</li>
              <li>• Ethical judgment & context</li>
              <li>• Domain expertise</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-4">AI Contributes</h4>
            <ul className="space-y-2 text-blue-200">
              <li>• Pattern recognition</li>
              <li>• Rapid data processing</li>
              <li>• Predictive analytics</li>
              <li>• Continuous learning</li>
              <li>• 24/7 availability</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    
    transformation: (
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">Organizational Transformation</h3>
          <p className="text-xl text-blue-200 mb-8">
            From information repositories to living intelligence ecosystems—where organizations become conscious.
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h4 className="text-2xl font-bold text-white mb-6">The Emergent Intelligence Organization</h4>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h5 className="text-lg font-semibold text-blue-200 mb-4">From Knowledge Workers to Knowledge Partners</h5>
              <ul className="space-y-2 text-blue-200">
                <li>• Co-create intelligence with AI systems</li>
                <li>• Guide knowledge flows through human insight</li>
                <li>• Amplify organizational learning</li>
                <li>• Build collective wisdom spanning expertise</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold text-blue-200 mb-4">Learning Entities That:</h5>
              <ul className="space-y-2 text-blue-200">
                <li>• Adapt based on collective experience</li>
                <li>• Anticipate challenges through pattern recognition</li>
                <li>• Leverage full spectrum of intelligence</li>
                <li>• Create sustainable competitive advantages</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <h4 className="text-3xl font-bold text-white mb-4">The Vision Realized</h4>
        <p className="text-xl text-blue-200 leading-relaxed">
        This is not just knowledge management; this is <strong>organizational consciousness</strong>—the emergence of truly intelligent enterprises that learn, adapt, and thrive in an increasingly complex world.
        </p>
        </div>
        </div>
      </div>
    )
  };

  return (
    <section id="clicbrain" className="py-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-500/10 to-blue-500/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <button
              onClick={openClicBrainPost}
              className="text-white hover:text-blue-200 underline transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit text-inherit leading-inherit"
            >
              ClicBrain: Enterprise Intelligence
            </button>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Where knowledge flows freely, AI and humans partner, and organizations become conscious.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'paradigm', label: 'Paradigm Revolution' },
              { id: 'features', label: 'Living Knowledge' },
              { id: 'partnership', label: 'Symbiotic AI' },
              { id: 'transformation', label: 'Transformation' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-900'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {tabContent[activeTab]}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">
            Ready to Transform Your Enterprise?
          </h3>
          <p className="text-xl text-white/80 mb-8">Join the AI-Native Intelligence Beta Program</p>
          
          {!showForm ? (
            <div className="flex justify-center">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Register your interest for the Beta pilot
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-bold text-white">Beta Pilot Registration</h4>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-white/60 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                {submitMessage && (
                  <div className="mb-6 p-4 rounded-lg bg-white/20 text-white text-center">
                    {submitMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 mb-2 font-medium">Surname *</label>
                      <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Business Email *</label>
                    <input
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="your.email@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={formData.linkedinProfile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Designation *</label>
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="">Select your role</option>
                      <option value="CEO">CEO</option>
                      <option value="CTO">CTO</option>
                      <option value="CFO">CFO</option>
                      <option value="COO">COO</option>
                      <option value="VP">VP</option>
                      <option value="Director">Director</option>
                      <option value="Manager">Manager</option>
                      <option value="Engineer">Engineer</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Founder">Founder</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Number of Employees *</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: '1-50', label: '1-50' },
                        { value: '50-100', label: '50-100' },
                        { value: '100-1000', label: '100-1000' },
                        { value: '1000+', label: '1000+' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="employeeCount"
                            value={option.value}
                            checked={formData.employeeCount === option.value}
                            onChange={handleInputChange}
                            className="mr-2 text-purple-500"
                            required
                          />
                          <span className="text-white/80">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 mb-2 font-medium">Tell us about your organization and interest *</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="Tell us about your organization, current knowledge management challenges, and why you're interested in participating in the ClicBrain beta pilot..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-full font-semibold transition-all"
                    >
                      {isSubmitting ? 'Submitting...' : 'Register for Beta'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-4 border-2 border-white/30 text-white hover:bg-white/10 rounded-full font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Blog Post Modal */}
      {isModalOpen && selectedPost && (
        <BlogPostModal 
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </section>
  );
};

export default ClicBrainSection;