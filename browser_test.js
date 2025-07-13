// Quick test for Horizon API in browser console
// Paste this in browser console to test the API directly

async function testHorizonDirect() {
  console.log('🧪 Testing Horizon API directly...');
  
  const CLIX_ISSUER = 'GBCJSKXTZX5CYKJGBGQPYEATLSGR4EPRUOL7EKIDCDOZ4UC67BBQRCSO';
  const url = `https://horizon.stellar.org/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=CLIX&selling_asset_issuer=${CLIX_ISSUER}&buying_asset_type=credit_alphanum4&buying_asset_code=USDC&buying_asset_issuer=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`;
  
  console.log('🔗 URL:', url);
  
  try {
    const response = await fetch(url);
    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Order book data:', data);
      
      if (data.asks && data.asks.length > 0) {
        console.log(`💰 CLIX Price: $${data.asks[0].price}`);
        return data.asks[0].price;
      } else {
        console.log('❌ No asks found');
      }
    } else {
      console.log('❌ Response not OK');
    }
  } catch (error) {
    console.log('❌ Error:', error);
  }
}

// Call the test
testHorizonDirect();
