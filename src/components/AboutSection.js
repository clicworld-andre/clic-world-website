import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Movement Without Borders</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From the mines of the Democratic Republic of Congo to a global movement—this is the story 
            of re-centralizing money where it belongs.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">The Awakening in the DRC</h3>
            <blockquote className="text-lg text-gray-700 leading-relaxed border-l-4 border-green-500 pl-6 italic bg-white p-6 rounded-r-lg shadow-sm">
              "The fundamental problem became crystal clear in the mining communities of North Kivu province. 
              People extracting literal gold from the earth couldn't get paid properly. The value creators 
              received maybe 30% of what their work was worth."
            </blockquote>
          </div>
          
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Clic.World - Finance's{' '}
              <span className="text-green-600 font-bold">
                Third Way
              </span>
            </h3>
            <p className="text-lg text-gray-600 italic mb-6">(Rebalancing Influence, Ownership, and Value in the Digital Age)</p>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p className="mb-4">
                  This is a reimagining of the digital economy—one that lifts people up instead of mining them for profit.
                </p>
                
                <p className="mb-4">
                  Imagine a world where money doesn't just <em>hold</em> value—it <em>creates</em> it. Where gold in your pocket earns yield, bonds fund schools, and communities aren't just users of a financial system—they're shareholders.
                </p>
                
                <p className="mb-4">
                  We started in Africa, where innovation thrives against all odds—<strong>where community is the engine, and where the future is rewritten daily</strong>. But this movement was never meant to stay within borders.
                </p>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500 mt-6">
                  <p className="font-semibold text-gray-800 mb-2">We're building an economy where:</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>→ <strong>Value flows to those who create it</strong> (not just extract it)</li>
                    <li>→ <strong>Belonging means ownership</strong> (of assets, decisions, and futures)</li>
                    <li>→ <strong>"Digital" feels human</strong> (connected, inclusive, alive)</li>
                  </ul>
                </div>
                
                <p className="mt-6 italic">
                  <em>We're not disrupting finance. We're upgrading it—with accountability, yield, and teeth.</em>
                </p>
                
                <div className="text-center mt-8">
                  <p className="text-xl font-semibold text-gray-800 mb-2">The old system falls short. We're the rewrite.</p>
                  <p className="text-lg font-bold text-green-600">Born in Africa. Built for the world.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
