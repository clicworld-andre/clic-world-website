#!/usr/bin/env node

/**
 * BitQuery Endpoint Investigation
 * Explore EVM field and check for Stellar-specific endpoints
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';

console.log('🔍 BITQUERY ENDPOINT INVESTIGATION');
console.log('==================================');

function makeRequest(host, path, query, description) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: host,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`📡 ${description}...`);

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            
            if (jsonData.errors) {
              console.log(`   ❌ GraphQL Error: ${jsonData.errors.map(e => e.message).join(', ')}`);
              resolve({ success: false, data: null, errors: jsonData.errors });
            } else {
              console.log(`   ✅ Success!`);
              resolve({ success: true, data: jsonData.data, errors: null });
            }
          } catch (error) {
            console.log(`   ❌ JSON Parse Error: ${error.message}`);
            resolve({ success: false, data: null, errors: [error.message] });
          }
        } else {
          console.log(`   ❌ HTTP ${res.statusCode}: ${data.substring(0, 100)}...`);
          resolve({ success: false, data: null, errors: [`HTTP ${res.statusCode}`] });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Request Error: ${error.message}`);
      resolve({ success: false, data: null, errors: [error.message] });
    });

    req.write(postData);
    req.end();
  });
}

async function investigateEndpoints() {
  // 1. Explore EVM field structure
  console.log('1️⃣ Exploring EVM Field Structure');
  const evmQuery = `
    query EVMExploration {
      EVM {
        __typename
      }
    }
  `;
  
  const evmResult = await makeRequest('streaming.bitquery.io', '/graphql', evmQuery, 'Exploring EVM field');
  
  if (evmResult.success) {
    console.log('   📊 EVM field is available - this is an Ethereum-focused endpoint');
  }
  
  console.log('');
  
  // 2. Try different BitQuery endpoints
  const endpoints = [
    { host: 'graphql.bitquery.io', path: '/graphql', name: 'Legacy GraphQL' },
    { host: 'streaming.bitquery.io', path: '/eap', name: 'Streaming EAP' },
    { host: 'ide.bitquery.io', path: '/graphql', name: 'IDE GraphQL' },
    { host: 'api.bitquery.io', path: '/graphql', name: 'API GraphQL' }
  ];
  
  console.log('2️⃣ Testing Different BitQuery Endpoints');
  
  for (const endpoint of endpoints) {
    const testQuery = `query { __typename }`;
    console.log(`\n🌐 Testing ${endpoint.name} (${endpoint.host}${endpoint.path})`);
    
    const result = await makeRequest(endpoint.host, endpoint.path, testQuery, `Testing ${endpoint.name}`);
    
    if (result.success) {
      // If this endpoint works, test for stellar
      const stellarQuery = `
        query StellarTest {
          stellar {
            __typename
          }
        }
      `;
      
      const stellarResult = await makeRequest(endpoint.host, endpoint.path, stellarQuery, 'Testing Stellar on this endpoint');
      
      if (stellarResult.success) {
        console.log(`   🎯 FOUND STELLAR SUPPORT!`);
        console.log(`   🌐 Working endpoint: https://${endpoint.host}${endpoint.path}`);
        
        return { workingEndpoint: endpoint, hasSteller: true };
      } else {
        console.log(`   ⚠️  Endpoint works but no Stellar support`);
      }
    } else {
      console.log(`   ❌ Endpoint not accessible`);
    }
  }
  
  return { workingEndpoint: null, hasSteller: false };
}

async function testStellarAlternatives() {
  console.log('3️⃣ Testing Stellar Alternative APIs');
  console.log('');
  
  // Test Horizon API for CLIX data
  console.log('🌟 Testing Stellar Horizon API');
  
  const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'horizon.stellar.org',
      port: 443,
      path: `/assets?asset_code=CLIX&asset_issuer=${CLIX_ISSUER}`,
      method: 'GET'
    };

    console.log('📡 Checking CLIX token on Stellar Horizon...');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            
            if (jsonData._embedded && jsonData._embedded.records.length > 0) {
              const asset = jsonData._embedded.records[0];
              console.log('   ✅ CLIX token found on Stellar!');
              console.log(`   📊 Asset Code: ${asset.asset_code}`);
              console.log(`   📊 Asset Issuer: ${asset.asset_issuer}`);
              console.log(`   📊 Accounts: ${asset.accounts.authorized}`);
              console.log(`   📊 Amount: ${asset.amount}`);
              console.log('');
              console.log('💡 You can use Stellar Horizon API for CLIX data!');
              console.log('🔗 Horizon API docs: https://developers.stellar.org/api/');
              
              // Test for recent trades
              testStellarTrades();
            } else {
              console.log('   ⚠️  CLIX token not found on Stellar Horizon');
            }
          } catch (error) {
            console.log(`   ❌ JSON Parse Error: ${error.message}`);
          }
        } else {
          console.log(`   ❌ HTTP ${res.statusCode}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Request Error: ${error.message}`);
      resolve();
    });

    req.end();
  });
}

function testStellarTrades() {
  console.log('');
  console.log('🔍 Testing Stellar Trade Data');
  
  const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'horizon.stellar.org',
      port: 443,
      path: `/trades?base_asset_type=credit_alphanum4&base_asset_code=CLIX&base_asset_issuer=${CLIX_ISSUER}&order=desc&limit=5`,
      method: 'GET'
    };

    console.log('📡 Checking recent CLIX trades on Stellar...');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            
            if (jsonData._embedded && jsonData._embedded.records.length > 0) {
              console.log(`   ✅ Found ${jsonData._embedded.records.length} recent CLIX trades!`);
              
              jsonData._embedded.records.slice(0, 3).forEach((trade, index) => {
                const timestamp = new Date(trade.ledger_close_time).toLocaleString();
                console.log(`   ${index + 1}. ${trade.base_amount} CLIX = ${trade.counter_amount} ${trade.counter_asset_code || 'XLM'} (${timestamp})`);
              });
              
              console.log('');
              console.log('🎉 EXCELLENT! Stellar Horizon API has CLIX trade data!');
              console.log('💡 This can be used as an alternative to BitQuery');
            } else {
              console.log('   ⚠️  No recent CLIX trades found');
            }
          } catch (error) {
            console.log(`   ❌ JSON Parse Error: ${error.message}`);
          }
        } else {
          console.log(`   ❌ HTTP ${res.statusCode}: ${data.substring(0, 100)}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Request Error: ${error.message}`);
      resolve();
    });

    req.end();
  });
}

async function runInvestigation() {
  const result = await investigateEndpoints();
  
  if (!result.hasSteller) {
    await testStellarAlternatives();
  }
  
  console.log('');
  console.log('📋 FINAL INVESTIGATION RESULTS');
  console.log('==============================');
  
  if (result.workingEndpoint && result.hasSteller) {
    console.log('🎉 SUCCESS: Found working Stellar endpoint!');
    console.log(`🌐 Update your API URL to: https://${result.workingEndpoint.host}${result.workingEndpoint.path}`);
  } else {
    console.log('❌ ISSUE: No Stellar support found in current BitQuery setup');
    console.log('');
    console.log('🛠️  RECOMMENDED ACTIONS:');
    console.log('1. ✅ Use Stellar Horizon API as primary data source');
    console.log('2. 📧 Contact BitQuery support about Stellar access');
    console.log('3. 💰 Check BitQuery pricing for Stellar plans');
    console.log('4. 🔄 Implement Horizon API integration');
    console.log('');
    console.log('🔗 Useful Links:');
    console.log('   • Stellar Horizon API: https://developers.stellar.org/api/');
    console.log('   • BitQuery Pricing: https://bitquery.io/pricing');
    console.log('   • BitQuery Support: https://community.bitquery.io/');
    console.log('');
    console.log('💡 NEXT STEPS: Implement Stellar Horizon API integration');
    console.log('   This will provide direct access to CLIX price data!');
  }
}

runInvestigation().catch(error => {
  console.error('❌ Investigation failed:', error.message);
});
