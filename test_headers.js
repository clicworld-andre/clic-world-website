#!/usr/bin/env node

/**
 * API Key Header Test
 * Test both Authorization and X-API-KEY header formats
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';

console.log('🔍 API Key Header Format Test');
console.log('==============================');
console.log(`🔑 Testing API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);

const testQuery = `query { __typename }`;

async function testWithHeaders(headerType, headers) {
  return new Promise((resolve) => {
    console.log(`\n${headerType}:`);
    console.log(`📋 Headers:`, headers);
    
    const postData = JSON.stringify({ query: testQuery });
    
    const options = {
      hostname: 'streaming.bitquery.io',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      console.log(`   📊 Status: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            console.log('   ✅ SUCCESS! This header format works.');
            console.log('   📊 Response:', JSON.stringify(jsonData, null, 2));
            resolve({ success: true, format: headerType });
          } catch (error) {
            console.log('   ❌ JSON Parse Error:', error.message);
            resolve({ success: false, format: headerType });
          }
        } else {
          console.log('   ❌ Failed -', data.substring(0, 100));
          resolve({ success: false, format: headerType });
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Request Error:', error.message);
      resolve({ success: false, format: headerType });
    });

    req.write(postData);
    req.end();
  });
}

async function runHeaderTests() {
  console.log('Testing different header formats...\n');
  
  // Test 1: Authorization Bearer (current format)
  const result1 = await testWithHeaders('1️⃣ Authorization: Bearer', {
    'Authorization': `Bearer ${API_KEY}`
  });
  
  // Test 2: X-API-KEY header (suggested format)
  const result2 = await testWithHeaders('2️⃣ X-API-KEY header', {
    'X-API-KEY': API_KEY
  });
  
  // Test 3: Authorization without Bearer
  const result3 = await testWithHeaders('3️⃣ Authorization: Direct', {
    'Authorization': API_KEY
  });
  
  console.log('\n📋 HEADER TEST RESULTS');
  console.log('======================');
  console.log(`Authorization Bearer: ${result1.success ? '✅ WORKS' : '❌ FAILS'}`);
  console.log(`X-API-KEY header: ${result2.success ? '✅ WORKS' : '❌ FAILS'}`);
  console.log(`Authorization Direct: ${result3.success ? '✅ WORKS' : '❌ FAILS'}`);
  
  const workingFormat = [result1, result2, result3].find(r => r.success);
  
  if (workingFormat) {
    console.log(`\n🎉 SOLUTION FOUND: Use ${workingFormat.format}`);
    console.log('💡 Update your BitqueryService.js to use the working header format');
  } else {
    console.log('\n❌ NO WORKING FORMAT FOUND');
    console.log('💡 The API key may be invalid, expired, or the service may be down');
    console.log('🔗 Try getting a new API key from: https://graphql.bitquery.io/ide');
  }
}

runHeaderTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
});
