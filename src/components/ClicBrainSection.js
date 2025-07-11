import React, { useState } from 'react';

const ClicBrainSection = ({ scrollToSection }) => {
  const [showForm, setShowForm] = useState(false);
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
      // Create the email body
      const emailBody = `
ClicBrain Interest Registration

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

      // Create mailto link
      const subject = encodeURIComponent('ClicBrain Interest Registration - ' + formData.name);
      const body = encodeURIComponent(emailBody);
      const mailtoLink = `mailto:ClicBrain@clic.world?subject=${subject}&body=${body}`;
      
      // Open default email client
      window.location.href = mailtoLink;
      
      setSubmitMessage('✅ Email client opened! Please send the email to complete your registration.');
      
      // Reset form after 3 seconds
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

  return (
    <section id="clicbrain" className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-500/10 to-blue-500/10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
            ClicBrain: Revolutionary AI-Human Partnership Platform
          </h2>
          <p className="text-xl md:text-2xl text-blue-200 mb-4 font-light">
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
              <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-blue-300 to-white bg-clip-text mb-2">
                {stat.number}
              </div>
              <div className="text-white font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-white/60">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-white">
            🎯 Join the AI-Native Movement
          </h3>
          <p className="text-xl text-white/80 mb-8">Experience the Clic.World Advantage</p>
          
          {!showForm ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105"
              >
                Register your interest
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-full font-semibold transition-all"
              >
                Join Our Community
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-bold text-white">Register Your Interest</h4>
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
                    <label className="block text-white/80 mb-2 font-medium">Tell us more about your needs and why you are interested *</label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      placeholder="Tell us about your company's needs, current challenges, and what interests you most about ClicBrain..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white px-8 py-4 rounded-full font-semibold transition-all"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Registration'}
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
    </section>
  );
};

export default ClicBrainSection;