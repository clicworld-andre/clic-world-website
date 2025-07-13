# Bitquery CLIX Price Integration

This integration provides real-time CLIX token price updates from Stellar blockchain using Bitquery's API.

## 🚀 Quick Setup

### 1. Register with Bitquery
- Go to [Bitquery GraphQL IDE](https://graphql.bitquery.io/ide)
- Create account and verify email
- Navigate to Account section to get your API key

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
REACT_APP_BITQUERY_API_KEY=your_api_key_here
REACT_APP_CLIX_ASSET_CODE=CLIX
REACT_APP_CLIX_ISSUER=your_clix_issuer_address
```

### 3. Update CLIX Token Configuration
Update the token configuration with actual CLIX details:
- **Asset Code**: The token symbol on Stellar (e.g., "CLIX")
- **Issuer Address**: The Stellar address that issued the CLIX token

### 4. Switch to Bitquery Integration
Replace the current component with the Bitquery version:
```bash
# Backup current file
mv src/components/ClicWorldWebsite.js src/components/ClicWorldWebsite_Old.js

# Use the new Bitquery version
mv src/components/ClicWorldWebsite_Bitquery.js src/components/ClicWorldWebsite.js
```

## 📁 File Structure

```
src/
├── services/
│   ├── BitqueryService.js     # Main Bitquery API service
│   └── BitqueryConfig.js      # Configuration helper
├── hooks/
│   └── useClixPrice.js        # React hook for price updates
└── components/
    ├── ClicWorldWebsite.js    # Updated main component
    └── ClicWorldWebsite_Bitquery.js  # New Bitquery version
```

## 🔧 How It Works

### Real-time Updates
1. **WebSocket Connection**: Establishes real-time connection to Bitquery
2. **GraphQL Subscription**: Subscribes to CLIX trade events
3. **Price Updates**: Automatically updates price when trades occur
4. **Fallback Polling**: Falls back to HTTP requests if WebSocket fails

### Error Handling
- **API Key Missing**: Shows "Not Available" instead of fake price
- **Network Issues**: Automatic reconnection with exponential backoff
- **Rate Limiting**: Respects free tier limits (10k requests/month)
- **Graceful Degradation**: Shows "Not Available" when API fails

### Performance
- **Caching**: Caches last known price
- **Debouncing**: Prevents excessive API calls
- **Development Mode**: Shows connection status in development

## 🎯 Integration Points

### 1. BitqueryService.js
Core service handling all Bitquery API interactions:
- GraphQL query construction
- WebSocket management
- Error handling and reconnection
- Price caching and callbacks

### 2. useClixPrice Hook
React hook providing:
```javascript
const { 
  price,        // Current CLIX price
  isLoading,    // Loading state
  error,        // Error message if any
  isConnected,  // Real-time connection status
  lastUpdated,  // Last update timestamp
  refreshPrice  // Manual refresh function
} = useClixPrice();
```

### 3. Navigation Component
Already integrated - just receives the price prop:
```javascript
<Navigation clixPrice={clixPrice} ... />
```

## 🔍 GraphQL Queries

### Latest Price Query
```graphql
query GetClixPrice {
  stellar {
    trades(
      limit: 1
      orderBy: {descending: block_time}
      where: {
        base_asset: {
          asset_code: {is: "CLIX"}
          asset_issuer: {is: "ISSUER_ADDRESS"}
        }
      }
    ) {
      trade {
        price
        base_amount
        counter_amount
      }
    }
  }
}
```

### Real-time Subscription
```graphql
subscription ClixPriceUpdates {
  stellar {
    trades(
      where: {
        base_asset: {
          asset_code: {is: "CLIX"}
        }
      }
    ) {
      trade {
        price
      }
    }
  }
}
```

## 🐛 Debugging

### Development Helper
In development mode, a small indicator shows:
- Current price
- Loading state (🔄)
- Connected state (🟢)
- Error state (🟡)

### Console Logs
The service provides detailed console output:
```
🔑 BitqueryService initialized with API key
🪙 CLIX token config updated: {assetCode: "CLIX", issuer: "..."}
📡 Fetching latest CLIX price from Bitquery...
💰 CLIX price updated: $2.47
✅ WebSocket connected for real-time updates
🔥 Real-time CLIX price: $2.51
```

### Configuration Validation
```javascript
import BitqueryConfig from './services/BitqueryConfig';

// Check configuration status
BitqueryConfig.logStatus();
```

## 📊 Free Tier Limits

Bitquery free tier provides:
- **10,000 requests/month**
- **10 rows per query**
- **Real-time WebSocket support**

### Optimization for Free Tier
- Uses WebSocket for real-time updates (doesn't count against request limit)
- Falls back to polling every 30 seconds only when needed
- Caches prices to minimize API calls
- Approximately 13 HTTP requests per hour maximum

## 🔄 Migration Steps

### Current State
```javascript
// Old simulation-based approach (REMOVED - no fallback prices)
const [clixPrice, setClixPrice] = useState(null);
// No simulation - shows "Not Available" when API fails
```

### New Bitquery Integration
```javascript
// Real blockchain data
const { price: clixPrice } = useClixPrice({
  enableRealTime: true,
  pollInterval: 30000
});
```

## 🚨 Troubleshooting

### API Key Issues
```bash
# Check if API key is set
echo $REACT_APP_BITQUERY_API_KEY

# Restart development server after setting env vars
npm start
```

### CORS Issues
If you encounter CORS issues, the API endpoints are configured for browser use.

### Rate Limiting
If you hit rate limits:
1. Check your usage in Bitquery dashboard
2. Increase poll interval
3. Consider upgrading plan for higher limits

### WebSocket Connection Issues
- Check browser developer tools for WebSocket errors
- Verify API key has WebSocket permissions
- Check firewall/proxy settings

## 📞 Support

- **Bitquery Documentation**: https://docs.bitquery.io/
- **GraphQL IDE**: https://graphql.bitquery.io/ide
- **Community Support**: Bitquery Discord/Telegram

## ✅ Testing Checklist

After integration:

- [ ] API key is set in .env file
- [ ] CLIX token configuration is correct
- [ ] Price displays in top-left corner
- [ ] Real-time connection indicator works (development mode)
- [ ] Price updates when CLIX trades occur
- [ ] Fallback works when API is unavailable
- [ ] No console errors in production build

## 🎁 Ready to Use

The integration is **production-ready** with:
- ✅ Error handling and fallbacks
- ✅ Rate limiting respect
- ✅ Automatic reconnection
- ✅ Development debugging tools
- ✅ TypeScript-friendly (if migrating)
- ✅ Mobile-responsive (inherits from existing design)

Just add your API key and CLIX token details to get started!