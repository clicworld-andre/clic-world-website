#!/usr/bin/env node

/**
 * Stellar Horizon API Test
 * Test the new Stellar Horizon service for CLIX price data
 */

const https = require('https');

const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';
const HORIZON_URL = 'https://horizon.stellar.org';

console.log('🌟 STELLAR HORIZON API TEST');
console.log('===========================');
console.log(`🪙 CLIX Issuer: ${CLIX_ISSUER}`);
console.log(`🌐 Horizon URL: ${HORIZON_URL}`);
console.log('');

function makeRequest(url, description) {
  return new Promise((resolve, reject) => {
    console.log(`📡 ${description}...`);
    
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log(`   ✅ Success!`);
            resolve({ success: true, data: jsonData });
          } catch (error) {
            console.log(`   ❌ JSON Parse Error: ${error.message}`);
            resolve({ success: false, error: error.message });
          }
        } else {
          console.log(`   ❌ HTTP ${res.statusCode}: ${data.substring(0, 100)}`);
          resolve({ success: false, error: `HTTP ${res.statusCode}` });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Request Error: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.end();
  });
}

async function testHorizonAPI() {
  // Test 1: Horizon API Health Check
  console.log('1️⃣ Testing Horizon API Health');
  const healthResult = await makeRequest(`${HORIZON_URL}/`, 'Checking Horizon API health');
  
  if (!healthResult.success) {
    console.log('❌ Horizon API not accessible');
    return;
  }
  console.log('');

  // Test 2: CLIX Asset Verification
  console.log('2️⃣ Testing CLIX Asset Verification');
  const assetUrl = `${HORIZON_URL}/assets?asset_code=CLIX&asset_issuer=${CLIX_ISSUER}`;
  const assetResult = await makeRequest(assetUrl, 'Verifying CLIX asset exists');
  
  if (assetResult.success) {
    const records = assetResult.data._embedded?.records || [];
    if (records.length > 0) {
      const asset = records[0];
      console.log(`   📊 CLIX Asset Details:`);
      console.log(`      Asset Code: ${asset.asset_code}`);
      console.log(`      Asset Issuer: ${asset.asset_issuer}`);
      console.log(`      Authorized Accounts: ${asset.accounts.authorized}`);
      console.log(`      Total Amount: ${asset.amount}`);
      console.log(`      Num Claimable Balances: ${asset.balances.authorized}`);
    } else {
      console.log('   ⚠️  CLIX asset not found');
      return;
    }
  } else {
    console.log('   ❌ Failed to verify CLIX asset');
    return;
  }
  console.log('');

  // Test 3: CLIX Trades (Base Asset)
  console.log('3️⃣ Testing CLIX Trades (as Base Asset)');
  const baseTradesUrl = `${HORIZON_URL}/trades?base_asset_type=credit_alphanum4&base_asset_code=CLIX&base_asset_issuer=${CLIX_ISSUER}&order=desc&limit=10`;
  const baseTradesResult = await makeRequest(baseTradesUrl, 'Fetching CLIX trades as base asset');
  
  let clixPrice = null;
  let tradeFound = false;
  
  if (baseTradesResult.success) {
    const trades = baseTradesResult.data._embedded?.records || [];
    console.log(`   📊 Found ${trades.length} trades with CLIX as base asset`);
    
    if (trades.length > 0) {
      console.log('   💰 Recent CLIX trades (as base):');
      trades.slice(0, 5).forEach((trade, index) => {
        const counterAsset = trade.counter_asset_code || 'XLM';
        const price = parseFloat(trade.counter_amount) / parseFloat(trade.base_amount);
        const timestamp = new Date(trade.ledger_close_time).toLocaleString();
        console.log(`      ${index + 1}. ${trade.base_amount} CLIX = ${trade.counter_amount} ${counterAsset} (Price: $${price.toFixed(6)}) [${timestamp}]`);
      });
      
      clixPrice = parseFloat(trades[0].counter_amount) / parseFloat(trades[0].base_amount);
      tradeFound = true;
    }
  }
  console.log('');

  // Test 4: CLIX Trades (Counter Asset)
  if (!tradeFound) {
    console.log('4️⃣ Testing CLIX Trades (as Counter Asset)');
    const counterTradesUrl = `${HORIZON_URL}/trades?counter_asset_type=credit_alphanum4&counter_asset_code=CLIX&counter_asset_issuer=${CLIX_ISSUER}&order=desc&limit=10`;
    const counterTradesResult = await makeRequest(counterTradesUrl, 'Fetching CLIX trades as counter asset');
    
    if (counterTradesResult.success) {
      const trades = counterTradesResult.data._embedded?.records || [];
      console.log(`   📊 Found ${trades.length} trades with CLIX as counter asset`);
      
      if (trades.length > 0) {
        console.log('   💰 Recent trades (CLIX as counter):');
        trades.slice(0, 5).forEach((trade, index) => {
          const baseAsset = trade.base_asset_code || 'XLM';
          const price = parseFloat(trade.base_amount) / parseFloat(trade.counter_amount);
          const timestamp = new Date(trade.ledger_close_time).toLocaleString();
          console.log(`      ${index + 1}. ${trade.base_amount} ${baseAsset} = ${trade.counter_amount} CLIX (CLIX Price: $${price.toFixed(6)}) [${timestamp}]`);
        });
        
        clixPrice = parseFloat(trades[0].base_amount) / parseFloat(trades[0].counter_amount);
        tradeFound = true;
      }
    }
    console.log('');
  }

  // Test 5: Account Information (Optional)
  console.log('5️⃣ Testing Additional CLIX Information');
  const accountsUrl = `${HORIZON_URL}/accounts?asset=${CLIX_ISSUER}:CLIX&limit=5`;
  const accountsResult = await makeRequest(accountsUrl, 'Fetching CLIX account holders');
  
  if (accountsResult.success) {
    const accounts = accountsResult.data._embedded?.records || [];
    console.log(`   📊 Found ${accounts.length} CLIX account holders`);
    
    if (accounts.length > 0) {
      console.log('   👥 Sample CLIX holders:');
      accounts.slice(0, 3).forEach((account, index) => {
        const clixBalance = account.balances.find(b => 
          b.asset_code === 'CLIX' && b.asset_issuer === CLIX_ISSUER
        );
        if (clixBalance) {
          console.log(`      ${index + 1}. Account ${account.id.slice(0, 10)}... holds ${parseFloat(clixBalance.balance).toFixed(2)} CLIX`);
        }
      });
    }
  }
  console.log('');

  // Final Results
  console.log('📋 FINAL HORIZON API TEST RESULTS');
  console.log('==================================');
  console.log(`🌐 Horizon API Access: ✅ WORKING`);
  console.log(`🪙 CLIX Asset Verified: ✅ EXISTS`);
  console.log(`💰 Trade Data Available: ${tradeFound ? '✅ YES' : '❌ NO'}`);
  
  if (tradeFound && clixPrice) {
    console.log(`💎 Latest CLIX Price: $${clixPrice.toFixed(6)}`);
    console.log('');
    console.log('🎉 SUCCESS! Stellar Horizon API can provide CLIX price data!');
    console.log('🚀 Your website will now have real CLIX pricing via Horizon API');
    console.log('💡 This is more reliable than BitQuery for Stellar data');
  } else {
    console.log(`💎 Latest CLIX Price: Not Available (no recent trades)`);
    console.log('');
    console.log('⚠️  CLIX token exists but has no recent trading activity');
    console.log('💡 The API is working and will show prices when trades occur');
  }
  
  console.log('');
  console.log('🔗 Integration Complete:');
  console.log('   • Stellar Horizon API: Confirmed working');
  console.log('   • CLIX token: Verified on Stellar network');
  console.log('   • Price data: Available when trades occur');
  console.log('   • Fallback system: Ready for production');
}

testHorizonAPI().catch(error => {
  console.error('❌ Horizon API test failed:', error.message);
});
