import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Movement Without Borders</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600">
            From the mines of the Democratic Republic of Congo to a global movement—this is the story 
            of re-centralizing money where it belongs.
          </p>
        </div>
        
        {/* Origin Story Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">The Awakening in the DRC</h3>
            </div>
            <blockquote className="text-lg text-gray-700 leading-relaxed italic">
              "The fundamental problem became crystal clear in the mining communities of North Kivu province. 
              People extracting literal gold from the earth couldn't get paid properly. The value creators 
              received maybe 30% of what their work was worth."
            </blockquote>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">30%</div>
                  <div className="text-sm text-gray-600">Value to Creators</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">70%</div>
                  <div className="text-sm text-gray-600">Extracted by System</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">∞</div>
                  <div className="text-sm text-gray-600">Potential to Unlock</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mr-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-3xl font-bold">Global Vision Born</h3>
            </div>
            <p className="text-lg mb-6 text-white/90">
              What started as a solution for mining communities became a blueprint for economic justice worldwide. 
              If we could fix finance at its most challenging point, we could fix it everywhere.
            </p>
            <div className="bg-blue-600/20 rounded-lg p-4">
              <p className="font-semibold mb-2">From Local Problem to Global Solution:</p>
              <ul className="space-y-2 text-sm text-white/90">
                <li>→ Fair payment systems for value creators</li>
                <li>→ Community ownership of financial infrastructure</li>
                <li>→ Technology that serves people, not profits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Third Way Section */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Clic.World - Finance's{' '}
            <span className="text-green-600 font-bold">Third Way</span>
          </h3>
          <p className="text-lg text-gray-600 italic mb-8">(Rebalancing Influence, Ownership, and Value in the Digital Age)</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💰</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Money That Creates Value</h4>
            <p className="text-gray-600">
              Where gold in your pocket earns yield, bonds fund schools, and every transaction builds community wealth.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤝</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Belonging Means Ownership</h4>
            <p className="text-gray-600">
              Communities aren't just users of a financial system—they're shareholders in their economic future.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❤️</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Digital That Feels Human</h4>
            <p className="text-gray-600">
              Technology that connects, includes, and empowers rather than extracts and isolates.
            </p>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">We're Not Disrupting Finance</h3>
          <p className="text-xl text-gray-600 mb-16">
            We're upgrading it—with accountability, yield, and teeth. Imagine a world where 
            money doesn't just hold value—it creates it.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏆</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Gold Earns Yield</h4>
            <p className="text-gray-600">Value that grows over time</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏛️</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Bonds Fund Schools</h4>
            <p className="text-gray-600">Investment with purpose</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤝</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Communities Own</h4>
            <p className="text-gray-600">Shareholders, not just users</p>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
          <p className="text-xl font-semibold text-gray-800 mb-2">The old system falls short. We're the rewrite.</p>
          <p className="text-lg font-bold text-blue-600">Born in Africa. Built for the world.</p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              <em>We're not disrupting finance. We're upgrading it.</em>
            </h3>
            <p className="text-lg text-gray-600">With accountability, yield, and teeth.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">From Africa to the World</h4>
              <p className="text-lg text-gray-700 mb-6">
                We started in Africa, where innovation thrives against all odds—where community is the engine, 
                and where the future is rewritten daily. But this movement was never meant to stay within borders.
              </p>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <p className="text-blue-800 font-semibold text-lg">
                  "This is a reimagining of the digital economy—one that lifts people up instead of mining them for profit."
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl text-white">🚀</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">The Rewrite Begins</h4>
              <p className="text-xl font-semibold text-gray-800 mb-2">The old system falls short.</p>
              <p className="text-lg font-bold text-green-600">Born in Africa. Built for the world.</p>
              
              <div className="mt-8">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
                  Join the Movement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
