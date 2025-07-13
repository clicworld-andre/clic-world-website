/**
 * Bitquery API Test Script
 * Tests the API connection and queries available Stellar data
 */

const API_KEY = 'e1579369-d930-47be-937d-96150942d1ec';
const API_URL = 'https://streaming.bitquery.io/graphql';

// Test query to check API connection and explore Stellar data
const testQuery = `
  query TestStellarAPI {
    stellar {
      trades(limit: 5, orderBy: {descending: block_time}) {
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
          base_amount
          counter_amount
          price
        }
      }
    }
  }
`;

async function testBitqueryAPI() {
  console.log('🔑 Testing Bitquery API with your key...');
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
      },
      body: JSON.stringify({
        query: testQuery,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return false;
    }

    console.log('✅ API Connection Successful!');
    console.log('📊 Recent Stellar Trades:');
    
    const trades = data.data?.stellar?.trades || [];
    trades.forEach((trade, index) => {
      const { base_asset, counter_asset, price } = trade.trade;
      console.log(`${index + 1}. ${base_asset.asset_code}/${counter_asset.asset_code} - Price: ${price}`);
    });

    // Look for CLIX tokens in the results
    const clixTrades = trades.filter(trade => 
      trade.trade.base_asset.asset_code === 'CLIX' || 
      trade.trade.counter_asset.asset_code === 'CLIX'
    );

    if (clixTrades.length > 0) {
      console.log('🎯 Found CLIX trades:');
      clixTrades.forEach(trade => {
        console.log('   CLIX Trade:', trade.trade);
      });
    } else {
      console.log('⚠️  No CLIX trades found in recent data');
      console.log('💡 This is normal - CLIX might not have recent trades');
    }

    return true;

  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    return false;
  }
}

// Export for use in React component
export { testBitqueryAPI };

// Run test if called directly (for Node.js testing)
if (typeof window === 'undefined') {
  testBitqueryAPI();
}