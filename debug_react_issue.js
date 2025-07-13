#!/usr/bin/env node

/**
 * Debug the React app startup issue
 * Test the Horizon API directly to see if it's working
 */

const https = require('https');

const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';

console.log('🔍 DEBUGGING REACT APP ISSUE');
console.log('============================');

function makeRequest(url, description) {
  return new Promise((resolve) => {
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
            resolve({ success: true, data: jsonData });
          } catch (error) {
            resolve({ success: false, error: error.message });
          }
        } else {
          resolve({ success: false, error: `HTTP ${res.statusCode}` });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.end();
  });
}

async function debugReactIssue() {
  console.log('1️⃣ Testing CLIX/USDC Order Book (Should show $0.05)');
  
  const orderBookUrl = `https://horizon.stellar.org/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=CLIX&selling_asset_issuer=${CLIX_ISSUER}&buying_asset_type=credit_alphanum4&buying_asset_code=USDC&buying_asset_issuer=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`;
  
  const result = await makeRequest(orderBookUrl, 'Fetching CLIX/USDC order book');
  
  if (result.success) {
    const orderBook = result.data;
    console.log(`   📊 Order Book Status:`);
    console.log(`      Asks: ${orderBook.asks?.length || 0}`);
    console.log(`      Bids: ${orderBook.bids?.length || 0}`);
    
    if (orderBook.asks && orderBook.asks.length > 0) {
      const price = parseFloat(orderBook.asks[0].price);
      console.log(`   💰 CLIX Price: $${price}`);
      console.log(`   ✅ This should appear in your React app!`);
      
      if (price !== 0.05) {
        console.log(`   ⚠️  Price changed from $0.05 to $${price}`);
      }
    } else {
      console.log(`   ❌ No asks found - this explains "Not Available"`);
    }
    
    if (orderBook.bids && orderBook.bids.length > 0) {
      const bidPrice = parseFloat(orderBook.bids[0].price);
      console.log(`   💱 Best Bid: $${bidPrice}`);
    }
  } else {
    console.log(`   ❌ Order book request failed: ${result.error}`);
    console.log(`   💡 This could explain why React app shows "Not Available"`);
  }
  
  console.log('');
  console.log('2️⃣ Checking React App Startup Issues');
  console.log('=====================================');
  console.log('');
  console.log('🔍 Possible Issues:');
  console.log('   1. Multiple useClixPrice hooks running simultaneously');
  console.log('   2. Enhanced hook not initializing properly');
  console.log('   3. Network/CORS issues in browser environment');
  console.log('   4. Order book data changed since last test');
  console.log('');
  console.log('🛠️  Debugging Steps:');
  console.log('   1. Check browser console for JavaScript errors');
  console.log('   2. Look for network errors in Developer Tools');
  console.log('   3. Verify both debug components are using same hook');
  console.log('   4. Check if multiple price requests are conflicting');
  console.log('');
  console.log('💡 Quick Fix:');
  console.log('   - Both debug components should now use useClixPriceEnhanced');
  console.log('   - Restart React app: npm start');
  console.log('   - Check browser console for service selection logs');
}

debugReactIssue().catch(error => {
  console.error('❌ Debug failed:', error.message);
});
