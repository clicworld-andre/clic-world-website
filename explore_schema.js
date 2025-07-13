#!/usr/bin/env node

/**
 * API Schema Exploration
 * Find out what's available in the BitQuery API
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';

console.log('🔍 BITQUERY API SCHEMA EXPLORATION');
console.log('==================================');

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

async function exploreSchema() {
  // Check what top-level fields are available
  console.log('1️⃣ Exploring Top-Level Schema');
  const schemaQuery = `
    query SchemaExploration {
      __schema {
        queryType {
          name
          fields {
            name
            description
          }
        }
      }
    }
  `;
  
  const schemaResult = await makeRequest(schemaQuery, 'Fetching available top-level fields');
  
  if (schemaResult.success) {
    const fields = schemaResult.data.__schema.queryType.fields;
    console.log(`   📊 Available top-level fields (${fields.length} total):`);
    fields.forEach((field, index) => {
      console.log(`      ${index + 1}. ${field.name}${field.description ? ` - ${field.description}` : ''}`);
    });
    
    // Look for anything blockchain or crypto related
    const cryptoFields = fields.filter(f => 
      f.name.toLowerCase().includes('stellar') ||
      f.name.toLowerCase().includes('crypto') ||
      f.name.toLowerCase().includes('blockchain') ||
      f.name.toLowerCase().includes('trade') ||
      f.name.toLowerCase().includes('token')
    );
    
    if (cryptoFields.length > 0) {
      console.log(`   🪙 Crypto/Blockchain related fields:`);
      cryptoFields.forEach(field => {
        console.log(`      • ${field.name}`);
      });
    }
  }
  
  console.log('');
  
  // Test if there's an "ethereum" field (common in BitQuery)
  console.log('2️⃣ Testing Ethereum Field (common in BitQuery)');
  const ethQuery = `
    query EthereumTest {
      ethereum {
        __typename
      }
    }
  `;
  
  const ethResult = await makeRequest(ethQuery, 'Testing ethereum field');
  
  if (ethResult.success) {
    console.log('   ✅ Ethereum field is available!');
  }
  
  console.log('');
  
  // Test different blockchain fields
  const blockchains = ['bitcoin', 'binance', 'polygon', 'cardano', 'algorand'];
  
  console.log('3️⃣ Testing Other Blockchain Fields');
  for (const blockchain of blockchains) {
    const blockchainQuery = `
      query ${blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}Test {
        ${blockchain} {
          __typename
        }
      }
    `;
    
    const result = await makeRequest(blockchainQuery, `Testing ${blockchain} field`);
    console.log(`   ${blockchain}: ${result.success ? '✅ Available' : '❌ Not available'}`);
  }
  
  console.log('');
  
  // Check if this is a different BitQuery endpoint
  console.log('📋 ANALYSIS SUMMARY');
  console.log('==================');
  console.log('🔍 The API is working but "stellar" field is not available.');
  console.log('💡 This suggests:');
  console.log('   1. Wrong API endpoint for Stellar data');
  console.log('   2. Stellar support might not be available in this instance');
  console.log('   3. Different field name might be used');
  console.log('');
  console.log('🌐 Check BitQuery documentation for:');
  console.log('   • Correct Stellar endpoint');
  console.log('   • Available blockchain networks');
  console.log('   • Stellar-specific API instances');
}

exploreSchema().catch(error => {
  console.error('❌ Schema exploration failed:', error.message);
});
