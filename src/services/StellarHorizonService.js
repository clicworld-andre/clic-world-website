/**
 * Stellar Horizon API Service for CLIX Token Price
 * 
 * This service fetches real-time CLIX token price from Stellar Horizon API
 * as an alternative to BitQuery when BitQuery doesn't have trade data access.
 */

class StellarHorizonService {
  constructor() {
    // Stellar Horizon API Configuration
    this.apiUrl = process.env.REACT_APP_STELLAR_HORIZON_URL || 'https://horizon.stellar.org';
    
    // CLIX Token Configuration from environment
    this.clixToken = {
      assetCode: process.env.REACT_APP_CLIX_ASSET_CODE || 'CLIX',
      issuer: process.env.REACT_APP_CLIX_ISSUER || '',
    };
    
    // Price cache and callbacks
    this.currentPrice = null;
    this.priceCallbacks = [];
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.pollInterval = null;

    // Log configuration on startup
    console.log('🌟 StellarHorizonService initialized');
    console.log('🪙 CLIX Token Config:', this.clixToken);
  }

  /**
   * Initialize the service
   */
  initialize() {
    console.log('🌟 StellarHorizonService initialized');
  }

  /**
   * Set CLIX token configuration
   */
  setClixTokenConfig(assetCode, issuer) {
    this.clixToken = { assetCode, issuer };
    console.log('🪙 CLIX token config updated:', this.clixToken);
  }

  /**
   * Fetch latest CLIX price from Stellar Horizon API
   */
  async fetchLatestPrice() {
    if (!this.clixToken.issuer) {
      console.warn('⚠️ StellarHorizonService: No CLIX issuer configured, price unavailable');
      return null;
    }

    try {
      console.log('📡 Fetching latest CLIX price from Stellar Horizon...');
      
      // Skip asset verification for now, go directly to price fetching
      console.log('🔄 Skipping asset verification, going directly to order book...');
      
      // Fetch recent trades for CLIX
      const tradesResponse = await this.fetchRecentTrades();
      
      if (tradesResponse.success && tradesResponse.price) {
        this.currentPrice = tradesResponse.price;
        console.log(`💰 CLIX price updated from Horizon: ${tradesResponse.price}`);
        this.notifyPriceUpdate(tradesResponse.price);
        return tradesResponse.price;
      }

      console.log('📊 No CLIX price found from order book');
      return null;

    } catch (error) {
      console.error('❌ Failed to fetch CLIX price from Horizon:', error.message);
      return null;
    }
  }

  /**
   * Fetch CLIX asset information from Horizon
   */
  async fetchAssetInfo() {
    try {
      const url = `${this.apiUrl}/assets?asset_code=${this.clixToken.assetCode}&asset_issuer=${this.clixToken.issuer}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data._embedded && data._embedded.records.length > 0) {
        const asset = data._embedded.records[0];
        console.log(`✅ CLIX asset verified: ${asset.accounts.authorized} accounts, ${asset.amount} total supply`);
        return { exists: true, asset };
      }

      return { exists: false, asset: null };

    } catch (error) {
      console.error('❌ Failed to fetch CLIX asset info:', error.message);
      return { exists: false, asset: null };
    }
  }


  /**
   * Fetch dual pricing for CLIX (both USD and XLM)
   */
  async fetchDualPrice(currentXlmToUSD = null) {
    try {
      console.log('💰💫 Fetching dual CLIX pricing (USD + XLM)...');
      
      let usdPrice = null;
      let xlmPrice = null;
      let source = null;
      
      // First try CLIX/USDC order book for direct USD pricing
      console.log('💰 Checking CLIX/USDC order book...');
      
      let url = `${this.apiUrl}/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=${this.clixToken.assetCode}&selling_asset_issuer=${this.clixToken.issuer}&buying_asset_type=credit_alphanum4&buying_asset_code=USDC&buying_asset_issuer=GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN`;
      
      let response = await fetch(url);
      
      if (response.ok) {
        let data = await response.json();
        console.log('📊 CLIX/USDC order book response:', {
          status: response.status,
          asksLength: data.asks?.length || 0,
          bidsLength: data.bids?.length || 0,
          firstAsk: data.asks?.[0],
          firstBid: data.bids?.[0]
        });
        
        // Check for asks (selling CLIX for USDC)
        // Price represents: how much USDC you get for 1 CLIX
        if (data.asks && data.asks.length > 0) {
          usdPrice = parseFloat(data.asks[0].price);
          console.log(`✅ CLIX/USDC ask price: ${usdPrice} USDC per CLIX`);
          source = 'CLIX/USDC Order Book (Ask)';
        }
        // Check for bids if no asks
        else if (data.bids && data.bids.length > 0) {
          usdPrice = parseFloat(data.bids[0].price);
          console.log(`✅ CLIX/USDC bid price: ${usdPrice} USDC per CLIX`);
          source = 'CLIX/USDC Order Book (Bid)';
        }
      } else {
        console.log(`⚠️ CLIX/USDC order book failed: ${response.status}`);
      }

      // Always try to get CLIX/XLM pricing
      console.log('💫 Checking CLIX/XLM order book...');
      
      url = `${this.apiUrl}/order_book?selling_asset_type=credit_alphanum4&selling_asset_code=${this.clixToken.assetCode}&selling_asset_issuer=${this.clixToken.issuer}&buying_asset_type=native`;
      
      response = await fetch(url);
      
      if (response.ok) {
        let data = await response.json();
        console.log('📊 CLIX/XLM order book response:', {
          status: response.status,
          asksLength: data.asks?.length || 0,
          bidsLength: data.bids?.length || 0,
          firstAsk: data.asks?.[0],
          firstBid: data.bids?.[0]
        });
        
        // Check for asks (selling CLIX for XLM)
        // Price represents: how much XLM you get for 1 CLIX
        if (data.asks && data.asks.length > 0) {
          xlmPrice = parseFloat(data.asks[0].price);
          console.log(`✅ CLIX/XLM ask price: ${xlmPrice} XLM per CLIX`);
          
          // If we don't have USD price, calculate it from XLM ONLY if we have real XLM/USD rate
          if (!usdPrice && currentXlmToUSD) {
            usdPrice = xlmPrice * currentXlmToUSD;
            console.log(`🔄 Calculated USD from XLM: ${xlmPrice} * ${currentXlmToUSD} = ${usdPrice.toFixed(6)}`);
            source = 'CLIX/XLM Order Book (calculated USD)';
          } else if (!usdPrice) {
            console.log('⚠️ Cannot calculate USD price - XLM/USD rate unavailable');
          }
        }
        // Check for bids if no asks
        else if (data.bids && data.bids.length > 0) {
          xlmPrice = parseFloat(data.bids[0].price);
          console.log(`✅ CLIX/XLM bid price: ${xlmPrice} XLM per CLIX`);
          
          if (!usdPrice && currentXlmToUSD) {
            usdPrice = xlmPrice * currentXlmToUSD;
            console.log(`🔄 Calculated USD from XLM bid: ${xlmPrice} * ${currentXlmToUSD} = ${usdPrice.toFixed(6)}`);
            source = 'CLIX/XLM Order Book (bid, calculated USD)';
          } else if (!usdPrice) {
            console.log('⚠️ Cannot calculate USD price from bid - XLM/USD rate unavailable');
          }
        }
      } else {
        console.log(`⚠️ CLIX/XLM order book failed: ${response.status}`);
      }

      // Return results
      if (usdPrice || xlmPrice) {
        console.log(`✅ Dual pricing found - USD: ${usdPrice || 'N/A'}, XLM: ${xlmPrice || 'N/A'} XLM`);
        return { 
          success: true, 
          usdPrice,
          xlmPrice,
          source,
          timestamp: new Date().toISOString()
        };
      }

      console.log('📊 No active CLIX orders found in any market');
      return { success: false, usdPrice: null, xlmPrice: null };

    } catch (error) {
      console.error('❌ Failed to fetch CLIX dual pricing:', error.message);
      return { success: false, usdPrice: null, xlmPrice: null };
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  async fetchRecentTrades() {
    const dualResult = await this.fetchDualPrice();
    if (dualResult.success) {
      return {
        success: true,
        price: dualResult.usdPrice,
        xlmPrice: dualResult.xlmPrice,
        source: dualResult.source,
        timestamp: dualResult.timestamp
      };
    }
    return { success: false, price: null };
  }

  /**
   * Start polling for price updates
   */
  startRealTimeUpdates(intervalMs = 30000) {
    if (this.pollInterval) {
      this.stopRealTimeUpdates();
    }

    console.log(`🔄 Starting CLIX price polling every ${intervalMs/1000} seconds...`);
    
    this.pollInterval = setInterval(async () => {
      try {
        await this.fetchLatestPrice();
      } catch (error) {
        console.error('❌ Error in price polling:', error.message);
      }
    }, intervalMs);

    this.isConnected = true;

    // Fetch initial price
    this.fetchLatestPrice();
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
      console.log('🛑 CLIX price polling stopped');
    }
    this.isConnected = false;
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
   * Health check for Horizon API connectivity
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.apiUrl}/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get detailed trade history for CLIX
   */
  async getTradeHistory(limit = 50) {
    try {
      const response = await this.fetchRecentTrades();
      
      if (response.success) {
        // Fetch more detailed trade history
        const url = `${this.apiUrl}/trades?base_asset_type=credit_alphanum4&base_asset_code=${this.clixToken.assetCode}&base_asset_issuer=${this.clixToken.issuer}&order=desc&limit=${limit}`;
        
        const tradesResponse = await fetch(url);
        if (tradesResponse.ok) {
          const data = await tradesResponse.json();
          return data._embedded?.records || [];
        }
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch trade history:', error.message);
      return [];
    }
  }
}

// Export singleton instance
export const stellarHorizonService = new StellarHorizonService();
export default stellarHorizonService;
