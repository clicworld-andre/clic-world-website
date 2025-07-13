#!/usr/bin/env node

/**
 * Fixed API Connection Test
 * Test with the correct X-API-KEY header format
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';
const API_URL = 'https://streaming.bitquery.io/graphql';
const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';

console.log('🚀 FIXED BITQUERY API TEST');
console.log('===========================');
console.log(`🔑 API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);
console.log(`🪙 CLIX Issuer: ${CLIX_ISSUER}`);
console.log('');

// Helper function for API requests
function makeRequest(query, description) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query });
    
    const options = {
      hostname: 'streaming.bitquery.io',
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

async function runTests() {
  // Test 1: Basic API connectivity
  console.log('1️⃣ Testing Basic API Connectivity');
  const basicTest = await makeRequest(
    'query { __typename }',
    'Basic API health check'
  );
  
  if (!basicTest.success) {
    console.log('❌ Basic API test failed. Stopping tests.');
    return;
  }
  
  console.log('');

  // Test 2: Stellar network access
  console.log('2️⃣ Testing Stellar Network Access');
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
  
  const stellarTest = await makeRequest(stellarQuery, 'Fetching recent Stellar trades');
  
  if (stellarTest.success && stellarTest.data.stellar.trades.length > 0) {
    console.log(`   📊 Found ${stellarTest.data.stellar.trades.length} recent trades:`);
    stellarTest.data.stellar.trades.forEach((trade, index) => {
      const { base_asset, counter_asset, price } = trade.trade;
      console.log(`      ${index + 1}. ${base_asset.asset_code}/${counter_asset.asset_code} = ${price}`);
    });
  }
  
  console.log('');

  // Test 3: CLIX token specific query
  console.log('3️⃣ Testing CLIX Token Data');
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
  
  const clixTest = await makeRequest(clixQuery, 'Searching for CLIX trades (as base asset)');
  let clixPrice = null;
  
  if (clixTest.success) {
    const trades = clixTest.data.stellar.trades || [];
    console.log(`   📊 Found ${trades.length} CLIX trades as base asset`);
    
    if (trades.length > 0) {
      console.log('   💰 Recent CLIX trades:');
      trades.forEach((trade, index) => {
        const { price, counter_asset } = trade.trade;
        const timestamp = new Date(trade.block.timestamp).toLocaleString();
        console.log(`      ${index + 1}. CLIX/${counter_asset.asset_code} = $${price} (${timestamp})`);
      });
      clixPrice = parseFloat(trades[0].trade.price);
    }
  }
  
  console.log('');

  // Test 4: CLIX as counter asset
  console.log('4️⃣ Testing CLIX as Counter Asset');
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
  
  const clixCounterTest = await makeRequest(clixCounterQuery, 'Searching for CLIX as counter asset');
  
  if (clixCounterTest.success) {
    const trades = clixCounterTest.data.stellar.trades || [];
    console.log(`   📊 Found ${trades.length} trades with CLIX as counter asset`);
    
    if (trades.length > 0 && !clixPrice) {
      console.log('   💰 Recent trades (CLIX as counter):');
      trades.forEach((trade, index) => {
        const { price, base_asset } = trade.trade;
        const timestamp = new Date(trade.block.timestamp).toLocaleString();
        const clixPriceInverted = 1 / parseFloat(price);
        console.log(`      ${index + 1}. ${base_asset.asset_code}/CLIX = ${price} (CLIX = $${clixPriceInverted.toFixed(4)}) (${timestamp})`);
      });
      clixPrice = 1 / parseFloat(trades[0].trade.price);
    }
  }
  
  console.log('');

  // Summary
  console.log('📋 FINAL RESULTS');
  console.log('=================');
  console.log(`🔑 API Connection: ${basicTest.success ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`🌌 Stellar Access: ${stellarTest.success ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`🪙 CLIX Data Found: ${clixPrice ? '✅ YES' : '❌ NO'}`);
  
  if (clixPrice) {
    console.log(`💰 Latest CLIX Price: $${clixPrice.toFixed(4)}`);
    console.log('🎉 SUCCESS: Your BitQuery integration should work perfectly!');
    console.log('💡 The website will now show real CLIX price data.');
  } else {
    console.log('💰 Latest CLIX Price: Not Available');
    console.log('⚠️  API works but CLIX token has no recent trading activity.');
    console.log('💡 The website will show "Not Available" until CLIX trades occur.');
  }
}

runTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
});
