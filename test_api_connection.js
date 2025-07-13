#!/usr/bin/env node

/**
 * Comprehensive Bitquery API Connection Test
 * Tests API connectivity, authentication, and CLIX token data availability
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';
const API_URL = 'https://streaming.bitquery.io/graphql';
const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';

console.log('🚀 BITQUERY API CONNECTION TEST');
console.log('================================');
console.log(`🔑 API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
console.log(`🌐 API URL: ${API_URL}`);
console.log(`🪙 CLIX Issuer: ${CLIX_ISSUER}`);
console.log('');

// Test 1: API Health Check
async function testAPIHealth() {
  console.log('1️⃣ Testing API Health & Authentication...');
  
  const healthQuery = `
    query HealthCheck {
      __schema {
        types {
          name
        }
      }
    }
  `;

  try {
    const response = await makeRequest(healthQuery);
    
    if (response.data && response.data.__schema) {
      console.log('   ✅ API is accessible and authenticated');
      return true;
    } else {
      console.log('   ❌ Unexpected response structure');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Health check failed: ${error.message}`);
    return false;
  }
}

// Test 2: Stellar Network Connectivity
async function testStellarNetwork() {
  console.log('2️⃣ Testing Stellar Network Data Access...');
  
  const stellarQuery = `
    query StellarTest {
      stellar {
        trades(limit: 3, orderBy: {descending: block_time}) {
          block {
            timestamp
          }
          trade {
            base_asset {
              asset_code
              asset_issuer
            }
            counter_asset {
              asset_code
              asset_issuer
            }
            price
          }
        }
      }
    }
  `;

  try {
    const response = await makeRequest(stellarQuery);
    
    if (response.data && response.data.stellar && response.data.stellar.trades) {
      const trades = response.data.stellar.trades;
      console.log(`   ✅ Stellar data accessible - Found ${trades.length} recent trades`);
      
      if (trades.length > 0) {
        console.log('   📊 Sample trade data:');
        trades.slice(0, 2).forEach((trade, index) => {
          const { base_asset, counter_asset, price } = trade.trade;
          console.log(`      ${index + 1}. ${base_asset.asset_code}/${counter_asset.asset_code} = ${price}`);
        });
      }
      return true;
    } else {
      console.log('   ❌ No Stellar data found');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Stellar test failed: ${error.message}`);
    return false;
  }
}

// Test 3: CLIX Token Specific Query
async function testCLIXToken() {
  console.log('3️⃣ Testing CLIX Token Data...');
  
  const clixQuery = `
    query CLIXTest {
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

  try {
    const response = await makeRequest(clixQuery);
    
    if (response.data && response.data.stellar) {
      const trades = response.data.stellar.trades || [];
      console.log(`   📊 Found ${trades.length} CLIX trades (as base asset)`);
      
      if (trades.length > 0) {
        console.log('   💰 Recent CLIX trades:');
        trades.forEach((trade, index) => {
          const { price, counter_asset } = trade.trade;
          const timestamp = new Date(trade.block.timestamp).toLocaleString();
          console.log(`      ${index + 1}. CLIX/${counter_asset.asset_code} = $${price} (${timestamp})`);
        });
        return { success: true, latestPrice: parseFloat(trades[0].trade.price) };
      } else {
        console.log('   ⚠️  No recent CLIX trades found as base asset');
        return { success: true, latestPrice: null };
      }
    } else {
      console.log('   ❌ Invalid response structure for CLIX query');
      return { success: false, latestPrice: null };
    }
  } catch (error) {
    console.log(`   ❌ CLIX test failed: ${error.message}`);
    return { success: false, latestPrice: null };
  }
}

// Test 4: CLIX as Counter Asset
async function testCLIXAsCounter() {
  console.log('4️⃣ Testing CLIX as Counter Asset...');
  
  const clixCounterQuery = `
    query CLIXCounterTest {
      stellar {
        trades(
          limit: 5
          orderBy: {descending: block_time}
          where: {
            counter_asset: {
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

  try {
    const response = await makeRequest(clixCounterQuery);
    
    if (response.data && response.data.stellar) {
      const trades = response.data.stellar.trades || [];
      console.log(`   📊 Found ${trades.length} trades with CLIX as counter asset`);
      
      if (trades.length > 0) {
        console.log('   💰 Recent trades (CLIX as counter):');
        trades.forEach((trade, index) => {
          const { price, base_asset } = trade.trade;
          const timestamp = new Date(trade.block.timestamp).toLocaleString();
          const clixPrice = 1 / parseFloat(price);
          console.log(`      ${index + 1}. ${base_asset.asset_code}/CLIX = ${price} (CLIX = $${clixPrice.toFixed(4)}) (${timestamp})`);
        });
        return { success: true, latestPrice: 1 / parseFloat(trades[0].trade.price) };
      } else {
        console.log('   ⚠️  No recent trades with CLIX as counter asset');
        return { success: true, latestPrice: null };
      }
    } else {
      console.log('   ❌ Invalid response structure for CLIX counter query');
      return { success: false, latestPrice: null };
    }
  } catch (error) {
    console.log(`   ❌ CLIX counter test failed: ${error.message}`);
    return { success: false, latestPrice: null };
  }
}

// Test 5: Rate Limit Check
async function testRateLimit() {
  console.log('5️⃣ Testing Rate Limits...');
  
  const simpleQuery = `query { __typename }`;
  const startTime = Date.now();
  let successCount = 0;
  
  try {
    // Send 5 quick requests to test rate limiting
    for (let i = 0; i < 5; i++) {
      await makeRequest(simpleQuery);
      successCount++;
      if (i < 4) await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }
    
    const duration = Date.now() - startTime;
    console.log(`   ✅ Sent ${successCount}/5 requests successfully in ${duration}ms`);
    console.log('   📊 No immediate rate limiting detected');
    return true;
  } catch (error) {
    console.log(`   ⚠️  Rate limit test encountered error after ${successCount} requests: ${error.message}`);
    return false;
  }
}

// Helper function to make HTTP requests
function makeRequest(query) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: 'streaming.bitquery.io',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          if (jsonData.errors) {
            reject(new Error(`GraphQL Error: ${jsonData.errors.map(e => e.message).join(', ')}`));
          } else {
            resolve(jsonData);
          }
        } catch (error) {
          reject(new Error(`JSON Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request Error: ${error.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Main test execution
async function runAllTests() {
  console.log('Starting comprehensive API tests...\n');
  
  const results = {
    apiHealth: false,
    stellarAccess: false,
    clixData: false,
    clixCounterData: false,
    rateLimit: false,
    latestPrice: null
  };

  // Run all tests
  results.apiHealth = await testAPIHealth();
  console.log('');
  
  if (results.apiHealth) {
    results.stellarAccess = await testStellarNetwork();
    console.log('');
    
    if (results.stellarAccess) {
      const clixResult = await testCLIXToken();
      results.clixData = clixResult.success;
      if (clixResult.latestPrice) results.latestPrice = clixResult.latestPrice;
      console.log('');
      
      const clixCounterResult = await testCLIXAsCounter();
      results.clixCounterData = clixCounterResult.success;
      if (!results.latestPrice && clixCounterResult.latestPrice) {
        results.latestPrice = clixCounterResult.latestPrice;
      }
      console.log('');
      
      results.rateLimit = await testRateLimit();
      console.log('');
    }
  }

  // Print final results
  console.log('📋 FINAL TEST RESULTS');
  console.log('====================');
  console.log(`🔑 API Authentication: ${results.apiHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🌌 Stellar Network Access: ${results.stellarAccess ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🪙 CLIX Token Data: ${results.clixData ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔄 CLIX Counter Data: ${results.clixCounterData ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`⚡ Rate Limiting: ${results.rateLimit ? '✅ PASS' : '❌ FAIL'}`);
  
  if (results.latestPrice) {
    console.log(`💰 Latest CLIX Price: $${results.latestPrice.toFixed(4)}`);
  } else {
    console.log(`💰 Latest CLIX Price: Not Available`);
  }

  console.log('');

  // Overall status
  const allPassed = results.apiHealth && results.stellarAccess;
  const clixAvailable = results.clixData || results.clixCounterData;
  
  if (allPassed && clixAvailable) {
    console.log('🎉 OVERALL STATUS: ✅ ALL SYSTEMS OPERATIONAL');
    console.log('   Your Bitquery integration should work perfectly!');
  } else if (allPassed && !clixAvailable) {
    console.log('⚠️  OVERALL STATUS: 🟡 API WORKING, CLIX DATA LIMITED');
    console.log('   API works but CLIX token has no recent trading activity.');
  } else {
    console.log('❌ OVERALL STATUS: 🔴 INTEGRATION ISSUES DETECTED');
    console.log('   Check API key and network connectivity.');
  }

  return results;
}

// Run the tests
runAllTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});
