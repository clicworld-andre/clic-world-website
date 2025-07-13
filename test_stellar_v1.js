#!/usr/bin/env node

/**
 * BitQuery V1 Stellar Schema Test
 * Test the correct V1 schema structure for Stellar
 */

const https = require('https');

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';
const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';

console.log('🌟 BITQUERY V1 STELLAR SCHEMA TEST');
console.log('==================================');

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

async function testStellarV1Schema() {
  console.log('1️⃣ Testing Stellar Network Specification');
  
  // Test 1: Basic Stellar with network specification
  const stellarNetworkQuery = `
    query StellarNetworkTest {
      stellar(network: stellar) {
        __typename
      }
    }
  `;
  
  const networkResult = await makeRequest(stellarNetworkQuery, 'Testing stellar(network: stellar)');
  
  if (!networkResult.success) {
    console.log('❌ Network specification failed, trying without network...');
    
    const basicStellarQuery = `
      query BasicStellarTest {
        stellar {
          __typename
        }
      }
    `;
    
    const basicResult = await makeRequest(basicStellarQuery, 'Testing basic stellar field');
    
    if (!basicResult.success) {
      console.log('❌ Basic Stellar field not working');
      return;
    }
  }
  
  console.log('');
  console.log('2️⃣ Testing DEX Trades Structure');
  
  // Test 2: DEX Trades with V1 structure
  const v1Queries = [
    {
      name: 'DEX Trades Basic',
      query: `
        query StellarDEXTradesBasic {
          stellar(network: stellar) {
            dexTrades(options: {limit: 3, desc: "date.date"}) {
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
      `
    },
    {
      name: 'DEX Trades without network',
      query: `
        query StellarDEXTradesNoNetwork {
          stellar {
            dexTrades(options: {limit: 3, desc: "date.date"}) {
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
      `
    },
    {
      name: 'Trades (not DEX)',
      query: `
        query StellarTrades {
          stellar {
            trades(options: {limit: 3, desc: "date.date"}) {
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
      `
    }
  ];
  
  for (const testQuery of v1Queries) {
    const result = await makeRequest(testQuery.query, `Testing ${testQuery.name}`);
    
    if (result.success) {
      console.log(`   ✅ ${testQuery.name}: WORKS!`);
      
      const trades = result.data.stellar?.dexTrades || result.data.stellar?.trades || [];
      if (trades.length > 0) {
        console.log(`      📊 Found ${trades.length} trades:`);
        trades.forEach((trade, index) => {
          const base = trade.baseCurrency?.symbol || 'Unknown';
          const quote = trade.quoteCurrency?.symbol || 'Unknown';
          const date = trade.date?.date || 'Unknown';
          console.log(`         ${index + 1}. ${base}/${quote} = ${trade.price} (${date})`);
        });
        
        // Now test CLIX-specific query
        console.log('');
        console.log('3️⃣ Testing CLIX-Specific Query');
        await testCLIXQuery(testQuery);
        return;
      }
    } else {
      console.log(`   ❌ ${testQuery.name}: Failed`);
    }
  }
}

async function testCLIXQuery(workingStructure) {
  const clixQueries = [
    {
      name: 'CLIX as base currency',
      query: `
        query CLIXAsBase {
          stellar${workingStructure.name.includes('network') ? '(network: stellar)' : ''} {
            ${workingStructure.name.includes('DEX') ? 'dexTrades' : 'trades'}(
              options: {limit: 5, desc: "date.date"}
              baseCurrency: {is: "CLIX"}
            ) {
              date { date }
              baseCurrency { symbol address }
              quoteCurrency { symbol address }
              price
              baseAmount
              quoteAmount
              transaction { hash }
            }
          }
        }
      `
    },
    {
      name: 'CLIX by issuer address',
      query: `
        query CLIXByIssuer {
          stellar${workingStructure.name.includes('network') ? '(network: stellar)' : ''} {
            ${workingStructure.name.includes('DEX') ? 'dexTrades' : 'trades'}(
              options: {limit: 5, desc: "date.date"}
              baseCurrency: {address: {is: "${CLIX_ISSUER}"}}
            ) {
              date { date }
              baseCurrency { symbol address }
              quoteCurrency { symbol address }
              price
              baseAmount
              quoteAmount
              transaction { hash }
            }
          }
        }
      `
    },
    {
      name: 'CLIX as quote currency',
      query: `
        query CLIXAsQuote {
          stellar${workingStructure.name.includes('network') ? '(network: stellar)' : ''} {
            ${workingStructure.name.includes('DEX') ? 'dexTrades' : 'trades'}(
              options: {limit: 5, desc: "date.date"}
              quoteCurrency: {is: "CLIX"}
            ) {
              date { date }
              baseCurrency { symbol address }
              quoteCurrency { symbol address }
              price
              baseAmount
              quoteAmount
            }
          }
        }
      `
    }
  ];
  
  for (const clixQuery of clixQueries) {
    const result = await makeRequest(clixQuery.query, `Testing ${clixQuery.name}`);
    
    if (result.success) {
      const fieldName = workingStructure.name.includes('DEX') ? 'dexTrades' : 'trades';
      const trades = result.data.stellar?.[fieldName] || [];
      
      console.log(`   ✅ ${clixQuery.name}: Found ${trades.length} CLIX trades`);
      
      if (trades.length > 0) {
        console.log('      💰 CLIX trades found:');
        trades.forEach((trade, index) => {
          const base = trade.baseCurrency?.symbol || 'Unknown';
          const quote = trade.quoteCurrency?.symbol || 'Unknown';
          const date = trade.date?.date || 'Unknown';
          const hash = trade.transaction?.hash || 'No hash';
          console.log(`         ${index + 1}. ${base}/${quote} = $${trade.price} (${date}) [${hash.slice(0, 8)}...]`);
        });
        
        const latestPrice = parseFloat(trades[0].price);
        console.log('');
        console.log(`🎯 LATEST CLIX PRICE: $${latestPrice.toFixed(4)}`);
        console.log('🎉 SUCCESS! Found working CLIX price query!');
        console.log(`📋 Use this query structure for your application:`);
        console.log(`   Field: stellar${workingStructure.name.includes('network') ? '(network: stellar)' : ''}`);
        console.log(`   Trades: ${fieldName}`);
        console.log(`   Filter: ${clixQuery.name}`);
        
        return { success: true, price: latestPrice, structure: workingStructure, clixQuery: clixQuery };
      }
    } else {
      console.log(`   ❌ ${clixQuery.name}: Failed - ${result.errors?.[0] || 'Unknown error'}`);
    }
  }
  
  console.log('');
  console.log('⚠️  No CLIX trading data found');
  console.log('💡 This could mean:');
  console.log('   - CLIX token has no recent trading activity');
  console.log('   - Different field structure needed');
  console.log('   - Token might be traded on different exchanges');
}

testStellarV1Schema().catch(error => {
  console.error('❌ V1 Schema test failed:', error.message);
});
