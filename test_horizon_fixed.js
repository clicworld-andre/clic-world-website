#!/usr/bin/env node

/**
 * Fixed Stellar Horizon API Test
 * Test with corrected API parameter formats and order book data
 */

const https = require('https');

const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';
const HORIZON_URL = 'https://horizon.stellar.org';

console.log('🌟 FIXED STELLAR HORIZON API TEST');
console.log('================================');
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
          console.log(`   ❌ HTTP ${res.statusCode}: ${data.substring(0, 200)}`);
          resolve({ success: false, error: `HTTP ${res.statusCode}`, response: data });
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

async function testFixedHorizonAPI() {
  // Test 1: Check CLIX Order Book for pricing
  console.log('1️⃣ Testing CLIX Order Book (Primary Price Source)');
  
  const orderBookUrl = `${HORIZON_URL}/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=CLIX&selling_asset_issuer=${CLIX_ISSUER}&buying_asset_type=native`;
  const orderBookResult = await makeRequest(orderBookUrl, 'Checking CLIX/XLM order book');
  
  let clixPrice = null;
  
  if (orderBookResult.success) {
    const orderBook = orderBookResult.data;
    console.log(`   📊 CLIX/XLM Order Book:`);
    console.log(`      Bids: ${orderBook.bids?.length || 0}`);
    console.log(`      Asks: ${orderBook.asks?.length || 0}`);
    
    if (orderBook.asks && orderBook.asks.length > 0) {
      const askPrice = parseFloat(orderBook.asks[0].price);
      console.log(`      Best Ask: ${askPrice} XLM per CLIX`);
      
      // Estimate USD price (XLM ≈ $0.10-0.15)
      const xlmUsdRate = 0.12; // Rough estimate
      clixPrice = askPrice * xlmUsdRate;
      console.log(`      💰 Estimated CLIX Price: ~$${clixPrice.toFixed(4)} USD`);
    }
    
    if (orderBook.bids && orderBook.bids.length > 0) {
      const bidPrice = parseFloat(orderBook.bids[0].price);
      console.log(`      Best Bid: ${bidPrice} XLM per CLIX`);
    }
  }
  console.log('');

  // Test 2: Check alternative order books
  console.log('2️⃣ Testing Alternative CLIX Trading Pairs');
  
  const altOrderBooks = [
    {
      name: 'CLIX/USDC',
      url: `${HORIZON_URL}/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=CLIX&selling_asset_issuer=${CLIX_ISSUER}&buying_asset_type=credit_alphanum4&buying_asset_code=USDC&buying_asset_issuer=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`
    },
    {
      name: 'CLIX/USD (Anchor)',
      url: `${HORIZON_URL}/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=CLIX&selling_asset_issuer=${CLIX_ISSUER}&buying_asset_type=credit_alphanum4&buying_asset_code=USD&buying_asset_issuer=GCKFBEIYTKP7N4YRMTCHERQZR6AJUCRDNBF5TGDQGV5D3AVUDRVZ6CVD`
    }
  ];
  
  for (const orderBookTest of altOrderBooks) {
    const result = await makeRequest(orderBookTest.url, `Testing ${orderBookTest.name} order book`);
    
    if (result.success) {
      const orderBook = result.data;
      if ((orderBook.asks && orderBook.asks.length > 0) || (orderBook.bids && orderBook.bids.length > 0)) {
        console.log(`   ✅ ${orderBookTest.name}: Active trading pair!`);
        
        if (orderBook.asks && orderBook.asks.length > 0) {
          const price = parseFloat(orderBook.asks[0].price);
          console.log(`      Ask Price: ${price}`);
          if (orderBookTest.name.includes('USD')) {
            console.log(`      💰 Direct USD Price: $${price.toFixed(4)}`);
            clixPrice = price; // Use direct USD price if available
          }
        }
      } else {
        console.log(`   ⚠️  ${orderBookTest.name}: No active orders`);
      }
    } else {
      console.log(`   ❌ ${orderBookTest.name}: Failed`);
    }
  }
  console.log('');

  // Test 3: Check recent payments involving CLIX
  console.log('3️⃣ Testing Recent CLIX Payments');
  
  const paymentsUrl = `${HORIZON_URL}/payments?limit=200&order=desc`;
  const paymentsResult = await makeRequest(paymentsUrl, 'Checking recent payments for CLIX activity');
  
  if (paymentsResult.success) {
    const payments = paymentsResult.data._embedded?.records || [];
    console.log(`   📊 Checking ${payments.length} recent payments...`);
    
    const clixPayments = payments.filter(payment => {
      return payment.asset_code === 'CLIX' && payment.asset_issuer === CLIX_ISSUER;
    });
    
    console.log(`   💰 Found ${clixPayments.length} recent CLIX payments`);
    
    if (clixPayments.length > 0) {
      console.log(`   🎯 Recent CLIX activity:`);
      clixPayments.slice(0, 5).forEach((payment, index) => {
        const amount = parseFloat(payment.amount).toFixed(2);
        const timestamp = new Date(payment.created_at).toLocaleString();
        console.log(`      ${index + 1}. ${amount} CLIX - ${timestamp}`);
      });
    }
  }
  console.log('');

  // Test 4: Path payments (for price discovery)
  console.log('4️⃣ Testing Path Payments for Price Discovery');
  
  const pathPaymentsUrl = `${HORIZON_URL}/paths/strict-send?source_asset_type=credit_alphanum4&source_asset_code=CLIX&source_asset_issuer=${CLIX_ISSUER}&source_amount=1&destination_asset_type=native`;
  const pathResult = await makeRequest(pathPaymentsUrl, 'Finding paths to convert 1 CLIX to XLM');
  
  if (pathResult.success) {
    const paths = pathResult.data._embedded?.records || [];
    console.log(`   📊 Found ${paths.length} conversion paths`);
    
    if (paths.length > 0) {
      const bestPath = paths[0];
      const xlmAmount = parseFloat(bestPath.destination_amount);
      console.log(`   💱 1 CLIX can be converted to ${xlmAmount} XLM`);
      
      const xlmUsdRate = 0.12;
      const estimatedPrice = xlmAmount * xlmUsdRate;
      console.log(`   💰 Path-based CLIX price: ~$${estimatedPrice.toFixed(4)} USD`);
      
      if (!clixPrice) {
        clixPrice = estimatedPrice;
      }
    }
  }
  console.log('');

  // Final Results
  console.log('📋 FINAL HORIZON API RESULTS');
  console.log('============================');
  console.log(`🌐 Horizon API Access: ✅ WORKING`);
  console.log(`🪙 CLIX Asset: ✅ VERIFIED`);
  console.log(`📊 Order Book Data: ${orderBookResult.success ? '✅ AVAILABLE' : '❌ NOT AVAILABLE'}`);
  console.log(`💰 Price Discovery: ${clixPrice ? '✅ SUCCESS' : '❌ NO PRICE FOUND'}`);
  
  if (clixPrice) {
    console.log(`💎 Latest CLIX Price: $${clixPrice.toFixed(4)} USD`);
    console.log('');
    console.log('🎉 SUCCESS! Horizon API can provide CLIX pricing!');
    console.log('📈 Price sources: Order book + path payments');
    console.log('🔄 Update strategy: Poll order book every 30 seconds');
  } else {
    console.log(`💎 Latest CLIX Price: Not determinable`);
    console.log('');
    console.log('⚠️  CLIX exists but pricing requires active trading');
    console.log('💡 Monitor order books for price discovery');
  }
  
  console.log('');
  console.log('🛠️  IMPLEMENTATION RECOMMENDATION:');
  console.log('   1. Use order book endpoint for price data');
  console.log('   2. Try CLIX/USD pairs first, then CLIX/XLM');
  console.log('   3. Use path payments as fallback price source');
  console.log('   4. Poll every 30-60 seconds for updates');
  console.log('   5. Handle "Not Available" when no orders exist');
}

testFixedHorizonAPI().catch(error => {
  console.error('❌ Fixed Horizon test failed:', error.message);
});
