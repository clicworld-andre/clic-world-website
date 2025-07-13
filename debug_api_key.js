#!/usr/bin/env node

/**
 * Simple API Key Test
 * Quick check to see the exact error message
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';

console.log('🔍 Simple API Key Test');
console.log('======================');
console.log(`🔑 Testing API Key: ${API_KEY.slice(0, 8)}...${API_KEY.slice(-4)}`);

const testQuery = `query { __typename }`;
const postData = JSON.stringify({ query: testQuery });

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
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Status Message: ${res.statusMessage}`);
  console.log(`🏷️  Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📄 Response Body:`, data);
    
    if (res.statusCode === 200) {
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ SUCCESS: API key is valid and working!');
        console.log('📊 Parsed Response:', JSON.stringify(jsonData, null, 2));
      } catch (error) {
        console.log('❌ JSON Parse Error:', error.message);
      }
    } else {
      console.log(`❌ HTTP Error: ${res.statusCode} ${res.statusMessage}`);
      console.log('💡 This suggests the API key may be invalid or expired');
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request Error:', error.message);
});

req.write(postData);
req.end();
