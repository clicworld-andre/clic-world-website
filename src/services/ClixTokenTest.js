/**
 * CLIX Token Specific Test
 * Tests the Bitquery API with the actual CLIX token configuration
 */

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';
const API_URL = 'https://streaming.bitquery.io/graphql';
const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';

// Test query specifically for CLIX token
const clixTestQuery = `
  query TestClixToken {
    stellar {
      trades(
        limit: 10
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

// Alternative query - check for CLIX as counter asset too
const clixAlternativeQuery = `
  query TestClixAsCounterAsset {
    stellar {
      trades(
        limit: 10
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

async function testClixSpecifically() {
  console.log('🪙 Testing CLIX Token Configuration...');
  console.log(`📍 Asset Code: CLIX`);
  console.log(`📍 Issuer: ${CLIX_ISSUER}`);
  
  try {
    // Test CLIX as base asset
    console.log('\n🔍 Testing CLIX as base asset...');
    const response1 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({
        query: clixTestQuery,
      }),
    });

    const data1 = await response1.json();
    
    if (data1.errors) {
      console.error('❌ GraphQL errors:', data1.errors);
    } else {
      const trades1 = data1.data?.stellar?.trades || [];
      console.log(`📊 Found ${trades1.length} trades with CLIX as base asset`);
      
      if (trades1.length > 0) {
        console.log('💰 Recent CLIX trades (as base):');
        trades1.forEach((trade, index) => {
          const { price, counter_asset } = trade.trade;
          const timestamp = new Date(trade.block.timestamp).toLocaleString();
          console.log(`   ${index + 1}. CLIX/${counter_asset.asset_code} = ${price} (${timestamp})`);
        });
      }
    }

    // Test CLIX as counter asset
    console.log('\n🔍 Testing CLIX as counter asset...');
    const response2 = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        query: clixAlternativeQuery,
      }),
    });

    const data2 = await response2.json();
    
    if (data2.errors) {
      console.error('❌ GraphQL errors:', data2.errors);
    } else {
      const trades2 = data2.data?.stellar?.trades || [];
      console.log(`📊 Found ${trades2.length} trades with CLIX as counter asset`);
      
      if (trades2.length > 0) {
        console.log('💰 Recent trades (CLIX as counter):');
        trades2.forEach((trade, index) => {
          const { price, base_asset } = trade.trade;
          const timestamp = new Date(trade.block.timestamp).toLocaleString();
          const clixPrice = 1 / parseFloat(price); // Invert price when CLIX is counter
          console.log(`   ${index + 1}. ${base_asset.asset_code}/CLIX = ${price} (CLIX = ${clixPrice.toFixed(4)}) (${timestamp})`);
        });
      }
    }

    const totalTrades = (data1.data?.stellar?.trades?.length || 0) + (data2.data?.stellar?.trades?.length || 0);
    
    if (totalTrades > 0) {
      console.log(`\n✅ Success! Found ${totalTrades} CLIX trades`);
      console.log('🎯 CLIX token configuration is correct and has trading activity');
    } else {
      console.log('\n⚠️  No recent CLIX trades found');
      console.log('💡 This could mean:');
      console.log('   - CLIX hasn\'t been traded recently');
      console.log('   - Token might be traded on different pairs');
      console.log('   - Token configuration is correct but inactive');
    }

    return totalTrades > 0;

  } catch (error) {
    console.error('❌ CLIX Test Failed:', error.message);
    return false;
  }
}

// Export for use in React component
export { testClixSpecifically };

// Run test if called directly
if (typeof window === 'undefined') {
  testClixSpecifically();
}