#!/usr/bin/env node

/**
 * Final API Test with Correct Endpoint and Headers
 * Test the fixed BitQuery setup
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';
const API_URL = 'https://graphql.bitquery.io/graphql';
const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';

console.log('🎯 FINAL BITQUERY API TEST');
console.log('==========================');
console.log(`🔑 API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
console.log(`🌐 API URL: ${API_URL}`);
console.log(`🪙 CLIX Issuer: ${CLIX_ISSUER}`);
console.log('');

function makeRequest(query, description) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: 'graphql.bitquery.io',
      port: 443,
      path: '/graphql',
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
          console.log(`   ❌ HTTP ${res.statusCode}: ${data}`);
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

async function exploreStellarSchema() {
  // 1. Get Stellar type information
  console.log('1️⃣ Exploring Stellar Type Structure');
  const stellarTypeQuery = `
    query StellarTypeExploration {
      __schema {
        types {
          name
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `;
  
  const schemaResult = await makeRequest(stellarTypeQuery, 'Fetching full schema');
  
  if (schemaResult.success) {
    const types = schemaResult.data.__schema.types;
    const stellarType = types.find(t => t.name && t.name.toLowerCase().includes('stellar'));
    
    if (stellarType) {
      console.log(`   📋 Found Stellar type: ${stellarType.name}`);
      if (stellarType.fields) {
        console.log('   📋 Available fields:');
        stellarType.fields.slice(0, 10).forEach(field => {
          console.log(`      • ${field.name}`);
        });
      }
    } else {
      console.log('   ⚠️  No Stellar type found in schema');
    }
    
    // Look for any type containing 'trade'
    const tradeTypes = types.filter(t => t.name && t.name.toLowerCase().includes('trade'));
    if (tradeTypes.length > 0) {
      console.log('   📋 Trade-related types:');
      tradeTypes.forEach(type => {
        console.log(`      • ${type.name}`);
      });
    }
  }
  
  console.log('');
  
  // 2. Introspect Stellar field structure
  console.log('2️⃣ Introspecting Stellar Field Structure');
  const stellarIntrospectQuery = `
    query StellarIntrospection {
      __type(name: "RootQuery") {
        fields {
          name
          type {
            name
            fields {
              name
              type {
                name
              }
            }
          }
        }
      }
    }
  `;
  
  const introspectResult = await makeRequest(stellarIntrospectQuery, 'Introspecting RootQuery');
  
  if (introspectResult.success) {
    const fields = introspectResult.data.__type.fields;
    const stellarField = fields.find(f => f.name === 'stellar');
    
    if (stellarField && stellarField.type && stellarField.type.fields) {
      console.log('   📋 Stellar field structure:');
      stellarField.type.fields.slice(0, 10).forEach(field => {
        console.log(`      • ${field.name} (${field.type.name})`);
      });
    } else {
      console.log('   ⚠️  Could not introspect Stellar field structure');
    }
  }
  
  console.log('');
  
  // 3. Try simple Stellar queries
  console.log('3️⃣ Testing Simple Stellar Queries');
  
  const simpleQueries = [
    { name: 'Basic Stellar', query: 'query { stellar { __typename } }' },
    { name: 'Stellar Trades', query: 'query { stellar { trades { __typename } } }' },
    { name: 'Stellar DEXTrades', query: 'query { stellar { dexTrades { __typename } } }' },
    { name: 'Stellar Arguments', query: 'query { stellar { arguments { __typename } } }' },
    { name: 'Stellar Coinpath', query: 'query { stellar { coinpath { __typename } } }' }
  ];
  
  for (const testQuery of simpleQueries) {
    const result = await makeRequest(testQuery.query, `Testing ${testQuery.name}`);
    console.log(`   ${testQuery.name}: ${result.success ? '✅ Available' : '❌ Not available'}`);
    
    if (result.success && result.data.stellar) {
      const stellarData = result.data.stellar;
      console.log(`      📋 Structure:`, Object.keys(stellarData));
    }
  }
  
  console.log('');
  
  // 4. Try actual data query with different structures
  console.log('4️⃣ Testing Data Queries');
  
  const dataQueries = [
    {
      name: 'DEX Trades',
      query: `
        query StellarDEXTrades {
          stellar {
            dexTrades(limit: 3) {
              __typename
            }
          }
        }
      `
    },
    {
      name: 'Arguments',
      query: `
        query StellarArguments {
          stellar {
            arguments(limit: 3) {
              __typename
            }
          }
        }
      `
    }
  ];
  
  for (const testQuery of dataQueries) {
    const result = await makeRequest(testQuery.query, `Testing ${testQuery.name}`);
    console.log(`   ${testQuery.name}: ${result.success ? '✅ Works' : '❌ Failed'}`);
    
    if (result.success) {
      console.log('      🎉 This query structure works! Use this pattern.');
      break;
    }
  }
}

exploreStellarSchema().catch(error => {
  console.error('❌ Schema exploration failed:', error.message);
});
              console.log(`   ✅ Success!`);
              resolve({ success: true, data: jsonData.data, errors: null });
            }
          } catch (error) {
            console.log(`   ❌ JSON Parse Error: ${error.message}`);
            resolve({ success: false, data: null, errors: [error.message] });
          }
        } else {
          console.log(`   ❌ HTTP ${res.statusCode}: ${data}`);
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

async function runFinalTest() {
  // Test 1: Basic connectivity
  console.log('1️⃣ Testing Basic API Connectivity');
  const basicTest = await makeRequest('query { __typename }', 'Basic health check');
  
  if (!basicTest.success) {
    console.log('❌ Basic test failed - stopping');
    return;
  }
  console.log('');

  // Test 2: Stellar network access
  console.log('2️⃣ Testing Stellar Network');
  const stellarTest = await makeRequest(
    'query { stellar { __typename } }',
    'Testing Stellar field access'
  );
  
  if (!stellarTest.success) {
    console.log('❌ Stellar access failed - stopping');
    return;
  }
  console.log('');

  // Test 3: CLIX token data
  console.log('3️⃣ Testing CLIX Token Query');
  const clixQuery = `
    query GetClixPrice {
      stellar {
        trades(
          limit: 5
          orderBy: {descending: block_time}
          where: {
            base_asset: {
              asset_code: {is: "CLIX"}
              asset_issuer: {is: "${CLIX_ISSUER}"}
            }
          }
        ) {
          block {
            timestamp
          }
          trade {
            base_amount
            counter_amount
            price
            base_asset {
              asset_code
              asset_issuer
            }
            counter_asset {
              asset_code
              asset_issuer
            }
          }
        }
      }
    }
  `;
  
  const clixTest = await makeRequest(clixQuery, 'Fetching CLIX price data');
  
  if (clixTest.success) {
    const trades = clixTest.data.stellar.trades || [];
    console.log(`   📊 Found ${trades.length} CLIX trades`);
    
    if (trades.length > 0) {
      console.log('   💰 Recent CLIX trades:');
      trades.forEach((trade, index) => {
        const { price, counter_asset } = trade.trade;
        const timestamp = new Date(trade.block.timestamp).toLocaleString();
        console.log(`      ${index + 1}. CLIX/${counter_asset.asset_code} = $${price} (${timestamp})`);
      });
      
      const latestPrice = parseFloat(trades[0].trade.price);
      console.log('');
      console.log(`🎯 LATEST CLIX PRICE: $${latestPrice.toFixed(4)}`);
      console.log('');
      console.log('🎉 SUCCESS! BitQuery integration is now working!');
      console.log('✅ Your website will show real CLIX price data');
      
      return { success: true, price: latestPrice };
    } else {
      console.log('   ⚠️  No recent CLIX trades found');
      console.log('');
      console.log('✅ API working but no recent trading activity');
      console.log('💡 Website will show "Not Available" until trades occur');
      
      return { success: true, price: null };
    }
  }
  
  console.log('');
  console.log('📋 FINAL TEST RESULTS');
  console.log('=====================');
  console.log(`🔑 API Connection: ${basicTest.success ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`🌌 Stellar Access: ${stellarTest.success ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`🪙 CLIX Data: ${clixTest.success ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (basicTest.success && stellarTest.success && clixTest.success) {
    console.log('');
    console.log('🚀 INTEGRATION STATUS: FULLY OPERATIONAL');
    console.log('💡 Start your React app to see live CLIX prices!');
    console.log('📋 Command: npm start');
  }
}

runFinalTest().catch(error => {
  console.error('❌ Final test failed:', error.message);
});
