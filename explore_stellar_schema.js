#!/usr/bin/env node

/**
 * Stellar Schema Exploration
 * Find the correct structure for Stellar queries
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';

console.log('🔍 STELLAR SCHEMA EXPLORATION');
console.log('=============================');

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
  // 1. Try simple Stellar queries to find the right structure
  console.log('1️⃣ Testing Simple Stellar Queries');
  
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
      
      // If we found a working query, test it with actual data
      if (testQuery.name === 'Stellar DEXTrades') {
        console.log('      🎯 Testing DEX Trades with actual data...');
        await testDEXTrades();
      }
    }
  }
  
  console.log('');
}

async function testDEXTrades() {
  const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';
  
  console.log('2️⃣ Testing DEX Trades Structure');
  
  // Try basic DEX trades query
  const basicDEXQuery = `
    query BasicDEXTrades {
      stellar {
        dexTrades(limit: 3) {
          date {
            date
          }
          baseCurrency {
            symbol
            address
          }
          quoteCurrency {
            symbol
            address
          }
          price
          baseAmount
          quoteAmount
        }
      }
    }
  `;
  
  const basicResult = await makeRequest(basicDEXQuery, 'Testing basic DEX trades structure');
  
  if (basicResult.success) {
    const trades = basicResult.data.stellar.dexTrades || [];
    console.log(`   📊 Found ${trades.length} recent DEX trades`);
    
    if (trades.length > 0) {
      console.log('   💰 Sample trades:');
      trades.forEach((trade, index) => {
        const base = trade.baseCurrency?.symbol || 'Unknown';
        const quote = trade.quoteCurrency?.symbol || 'Unknown';
        console.log(`      ${index + 1}. ${base}/${quote} = ${trade.price}`);
      });
    }
    
    console.log('');
    console.log('3️⃣ Testing CLIX-Specific DEX Trades');
    
    // Try CLIX-specific query
    const clixDEXQuery = `
      query CLIXDEXTrades {
        stellar {
          dexTrades(
            limit: 5
            date: {since: "2024-01-01"}
            baseCurrency: {is: "CLIX"}
            options: {desc: "date.date"}
          ) {
            date {
              date
            }
            baseCurrency {
              symbol
              address
            }
            quoteCurrency {
              symbol
              address
            }
            price
            baseAmount
            quoteAmount
            transaction {
              hash
            }
          }
        }
      }
    `;
    
    const clixResult = await makeRequest(clixDEXQuery, 'Testing CLIX-specific DEX trades');
    
    if (clixResult.success) {
      const clixTrades = clixResult.data.stellar.dexTrades || [];
      console.log(`   📊 Found ${clixTrades.length} CLIX DEX trades`);
      
      if (clixTrades.length > 0) {
        console.log('   💰 CLIX trades:');
        clixTrades.forEach((trade, index) => {
          const quote = trade.quoteCurrency?.symbol || 'XLM';
          const date = trade.date?.date || 'Unknown';
          console.log(`      ${index + 1}. CLIX/${quote} = $${trade.price} (${date})`);
        });
        
        const latestPrice = parseFloat(clixTrades[0].price);
        console.log('');
        console.log(`🎯 LATEST CLIX PRICE: $${latestPrice.toFixed(4)}`);
        console.log('🎉 SUCCESS! Found working CLIX price query!');
        
        return { success: true, price: latestPrice, queryType: 'dexTrades' };
      }
    }
    
    // Try alternative CLIX query structures
    console.log('');
    console.log('4️⃣ Testing Alternative CLIX Query Structures');
    
    const altQueries = [
      {
        name: 'CLIX with address filter',
        query: `
          query CLIXByAddress {
            stellar {
              dexTrades(
                limit: 5
                baseCurrency: {address: {is: "${CLIX_ISSUER}"}}
                options: {desc: "date.date"}
              ) {
                date { date }
                baseCurrency { symbol address }
                quoteCurrency { symbol address }
                price
              }
            }
          }
        `
      },
      {
        name: 'CLIX as quote currency',
        query: `
          query CLIXAsQuote {
            stellar {
              dexTrades(
                limit: 5
                quoteCurrency: {is: "CLIX"}
                options: {desc: "date.date"}
              ) {
                date { date }
                baseCurrency { symbol address }
                quoteCurrency { symbol address }
                price
              }
            }
          }
        `
      }
    ];
    
    for (const altQuery of altQueries) {
      const result = await makeRequest(altQuery.query, `Testing ${altQuery.name}`);
      
      if (result.success) {
        const trades = result.data.stellar.dexTrades || [];
        console.log(`   ${altQuery.name}: ✅ Found ${trades.length} trades`);
        
        if (trades.length > 0) {
          console.log('      🎯 This query structure works for CLIX!');
          return { success: true, workingQuery: altQuery };
        }
      } else {
        console.log(`   ${altQuery.name}: ❌ Failed`);
      }
    }
  }
  
  return { success: false };
}

exploreStellarSchema().catch(error => {
  console.error('❌ Schema exploration failed:', error.message);
});
