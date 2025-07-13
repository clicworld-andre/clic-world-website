/**
 * Bitquery Stellar API Service for CLIX Token Price
 * 
 * This service fetches real-time CLIX token price from Stellar blockchain
 * using Bitquery's GraphQL API with WebSocket support for live updates.
 */

class BitqueryService {
  constructor() {
    // API Configuration
    this.apiUrl = process.env.REACT_APP_BITQUERY_API_URL || 'https://graphql.bitquery.io/graphql';
    this.wsUrl = process.env.REACT_APP_BITQUERY_WS_URL || 'wss://streaming.bitquery.io/eap';
    this.apiKey = process.env.REACT_APP_BITQUERY_API_KEY || '';
    
    // CLIX Token Configuration from environment
    this.clixToken = {
      assetCode: process.env.REACT_APP_CLIX_ASSET_CODE || 'CLIX',
      issuer: process.env.REACT_APP_CLIX_ISSUER || '',
    };
    
    // Price cache and callbacks
    this.currentPrice = null; // No fallback price - null means unavailable
    this.priceCallbacks = [];
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;

    // Log configuration on startup
    if (this.apiKey) {
      console.log('🔑 BitqueryService initialized with API key');
      console.log('🪙 CLIX Token Config:', this.clixToken);
    } else {
      console.warn('⚠️ No API key found - price will show as unavailable');
    }
  }

  /**
   * Initialize the service with API key
   */
  initialize(apiKey) {
    this.apiKey = apiKey;
    console.log('🔑 BitqueryService initialized with API key');
  }

  /**
   * Set CLIX token configuration
   */
  setClixTokenConfig(assetCode, issuer) {
    this.clixToken = { assetCode, issuer };
    console.log('🪙 CLIX token config updated:', this.clixToken);
  }

  /**
   * GraphQL Query for latest CLIX token price
   */
  getLatestPriceQuery() {
    return `
      query GetClixPrice {
        stellar {
          trades(
            limit: 1
            orderBy: {descending: block_time}
            where: {
              base_asset: {
                asset_code: {is: "${this.clixToken.assetCode}"}
                ${this.clixToken.issuer ? `asset_issuer: {is: "${this.clixToken.issuer}"}` : ''}
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
  }

  /**
   * GraphQL Subscription for real-time CLIX price updates
   */
  getRealTimePriceSubscription() {
    return `
      subscription ClixPriceUpdates {
        stellar {
          trades(
            where: {
              base_asset: {
                asset_code: {is: "${this.clixToken.assetCode}"}
                ${this.clixToken.issuer ? `asset_issuer: {is: "${this.clixToken.issuer}"}` : ''}
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
  }

  /**
   * Fetch latest CLIX price using HTTP request
   */
  async fetchLatestPrice() {
    if (!this.apiKey) {
      console.warn('⚠️ BitqueryService: No API key provided, price unavailable');
      return null;
    }

    try {
      console.log('📡 Fetching latest CLIX price from Bitquery...');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          query: this.getLatestPriceQuery(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        console.error('❌ GraphQL errors:', data.errors);
        throw new Error('GraphQL query failed');
      }

      const trades = data.data?.stellar?.trades || [];
      
      if (trades.length > 0) {
        const latestTrade = trades[0];
        const price = parseFloat(latestTrade.trade.price);
        
        if (price && price > 0) {
          this.currentPrice = price;
          console.log(`💰 CLIX price updated: $${price}`);
          this.notifyPriceUpdate(price);
          return price;
        }
      }

      console.log('📊 No recent trades found, price unavailable');
      return null;

    } catch (error) {
      console.error('❌ Failed to fetch CLIX price:', error.message);
      return null; // Return null when API fails
    }
  }

  /**
   * Start real-time price subscription using WebSocket
   */
  startRealTimeUpdates() {
    if (!this.apiKey) {
      console.warn('⚠️ Cannot start real-time updates without API key');
      return;
    }

    try {
      console.log('🔄 Starting real-time CLIX price updates...');
      
      // WebSocket connection for real-time updates
      const wsUrl = `${this.wsUrl}?token=${this.apiKey}`;
      this.ws = new WebSocket(wsUrl, 'graphql-ws');

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected for real-time updates');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Send connection init
        this.ws.send(JSON.stringify({ type: 'connection_init' }));
      };

      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        if (message.type === 'connection_ack') {
          // Start subscription
          this.ws.send(JSON.stringify({
            id: 'clix-price-sub',
            type: 'start',
            payload: {
              query: this.getRealTimePriceSubscription(),
            },
          }));
        }
        
        if (message.type === 'data' && message.payload?.data?.stellar?.trades) {
          const trades = message.payload.data.stellar.trades;
          if (trades.length > 0) {
            const price = parseFloat(trades[0].trade.price);
            if (price && price > 0) {
              this.currentPrice = price;
              console.log(`🔥 Real-time CLIX price: $${price}`);
              this.notifyPriceUpdate(price);
            }
          }
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        this.isConnected = false;
        this.handleReconnection();
      };

    } catch (error) {
      console.error('❌ Failed to start real-time updates:', error);
    }
  }

  /**
   * Handle WebSocket reconnection
   */
  handleReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.startRealTimeUpdates();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      console.log('🛑 Real-time updates stopped');
    }
  }

  /**
   * Subscribe to price updates
   */
  onPriceUpdate(callback) {
    this.priceCallbacks.push(callback);
    return () => {
      this.priceCallbacks = this.priceCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of price update
   */
  notifyPriceUpdate(price) {
    this.priceCallbacks.forEach(callback => {
      try {
        callback(price);
      } catch (error) {
        console.error('❌ Error in price update callback:', error);
      }
    });
  }

  /**
   * Get current cached price
   */
  getCurrentPrice() {
    return this.currentPrice;
  }

  /**
   * Health check for API connectivity
   */
  async healthCheck() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          query: `query { __schema { types { name } } }`,
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const bitqueryService = new BitqueryService();
export default bitqueryService;