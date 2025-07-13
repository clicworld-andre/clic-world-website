import { useState, useEffect, useCallback } from 'react';
import bitqueryService from '../services/BitqueryService';
import stellarHorizonService from '../services/StellarHorizonService';

/**
 * Dual CLIX Price Hook with USD and XLM pricing
 * 
 * Provides real-time CLIX price updates in both USD and XLM
 * with automatic fallback from BitQuery to Stellar Horizon API.
 */
export const useClixPriceDual = (options = {}) => {
  const {
    enableRealTime = true,
    pollInterval = 30000, // 30 seconds
    preferredService = 'auto', // 'auto', 'bitquery', 'horizon'
    onError = null,
  } = options;

  // Dual price states
  const [priceUSD, setPriceUSD] = useState(null);
  const [priceXLM, setPriceXLM] = useState(null);
  const [xlmToUSD, setXlmToUSD] = useState(null); // XLM/USD rate for conversion
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeService, setActiveService] = useState(null);

  // Fetch XLM/USD rate from a reliable source
  const fetchXLMRate = useCallback(async () => {
    try {
      // Use CoinGecko API for XLM/USD rate
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd');
      const data = await response.json();
      const rate = data?.stellar?.usd;
      
      if (rate) {
        setXlmToUSD(rate);
        console.log(`💫 XLM/USD rate updated: $${rate}`);
        return rate;
      }
      
      // If API fails, don't use fake fallback price
      console.warn('⚠️ XLM/USD rate unavailable - will not show conversions');
      setXlmToUSD(null);
      return null;
    } catch (error) {
      console.error('❌ Failed to fetch XLM rate:', error);
      setXlmToUSD(null); // No fake fallback prices
      return null;
    }
  }, []);

  // Handle dual price updates from any service
  const handlePriceUpdate = useCallback((priceData, serviceName) => {
    if (priceData) {
      // If we get USD price directly
      if (priceData.usdPrice) {
        setPriceUSD(priceData.usdPrice);
        console.log(`💰 USD price updated from ${serviceName}: $${priceData.usdPrice}`);
      }
      
      // If we get XLM price directly
      if (priceData.xlmPrice) {
        setPriceXLM(priceData.xlmPrice);
        console.log(`💫 XLM price updated from ${serviceName}: ${priceData.xlmPrice} XLM`);
        
        // Convert XLM to USD if we have the rate
        if (xlmToUSD && !priceData.usdPrice) {
          const calculatedUSD = priceData.xlmPrice * xlmToUSD;
          setPriceUSD(calculatedUSD);
          console.log(`🔄 Calculated USD from XLM: $${calculatedUSD.toFixed(4)}`);
        }
      }
      
      // If we only get a single price value (legacy support)
      if (typeof priceData === 'number') {
        setPriceUSD(priceData);
        console.log(`💰 Legacy price updated from ${serviceName}: $${priceData}`);
      }
    }
    
    setLastUpdated(new Date());
    setError(null);
    setActiveService(serviceName);
  }, [xlmToUSD]);

  // Handle errors
  const handleError = useCallback((errorMessage, serviceName) => {
    console.error(`❌ Error from ${serviceName}:`, errorMessage);
    setError(errorMessage);
    if (onError) {
      onError(errorMessage, serviceName);
    }
  }, [onError]);

  // Enhanced Horizon API call that gets both USD and XLM prices
  const tryHorizonAPIDual = useCallback(async () => {
    console.log('🌟 Trying Stellar Horizon API for dual CLIX pricing...');
    
    try {
      const unsubscribe = stellarHorizonService.onPriceUpdate((priceData) => {
        handlePriceUpdate(priceData, 'Stellar Horizon');
      });

      // Get both USD and XLM prices
      const priceResult = await stellarHorizonService.fetchDualPrice(xlmToUSD);
      
      if (priceResult.success) {
        const dualPriceData = {
          usdPrice: priceResult.usdPrice,
          xlmPrice: priceResult.xlmPrice
        };
        
        handlePriceUpdate(dualPriceData, 'Stellar Horizon');
        
        if (enableRealTime) {
          stellarHorizonService.startRealTimeUpdates(pollInterval);
          setIsConnected(true);
        }
        
        return { success: true, service: 'Stellar Horizon', unsubscribe };
      } else {
        unsubscribe();
        return { success: false, service: 'Stellar Horizon' };
      }
    } catch (error) {
      handleError(error.message, 'Stellar Horizon');
      return { success: false, service: 'Stellar Horizon' };
    }
  }, [enableRealTime, pollInterval, handlePriceUpdate, handleError]);

  // Try BitQuery (for now, falls back to single price)
  const tryBitQuery = useCallback(async () => {
    console.log('🔍 Trying BitQuery for CLIX price...');
    
    try {
      const unsubscribe = bitqueryService.onPriceUpdate((newPrice) => {
        // BitQuery returns USD price
        handlePriceUpdate({ usdPrice: newPrice }, 'BitQuery');
      });

      const price = await bitqueryService.fetchLatestPrice();
      
      if (price !== null) {
        handlePriceUpdate({ usdPrice: price }, 'BitQuery');
        
        if (enableRealTime) {
          bitqueryService.startRealTimeUpdates();
          setIsConnected(true);
        }
        
        return { success: true, service: 'BitQuery', unsubscribe };
      } else {
        unsubscribe();
        return { success: false, service: 'BitQuery' };
      }
    } catch (error) {
      handleError(error.message, 'BitQuery');
      return { success: false, service: 'BitQuery' };
    }
  }, [enableRealTime, handlePriceUpdate, handleError]);

  // Initialize services with dual pricing support
  useEffect(() => {
    const initializeServices = async () => {
      if (isLoading) return;
      
      setIsLoading(true);
      let activeCleanup = null;

      try {
        // First, get XLM/USD rate
        await fetchXLMRate();

        // Initialize services
        const apiKey = process.env.REACT_APP_BITQUERY_API_KEY;
        if (apiKey) {
          bitqueryService.initialize(apiKey);
          bitqueryService.setClixTokenConfig(
            process.env.REACT_APP_CLIX_ASSET_CODE || 'CLIX',
            process.env.REACT_APP_CLIX_ISSUER || ''
          );
        }

        stellarHorizonService.setClixTokenConfig(
          process.env.REACT_APP_CLIX_ASSET_CODE || 'CLIX',
          process.env.REACT_APP_CLIX_ISSUER || ''
        );

        // Try Horizon API first for dual pricing
        console.log('🎆 Using Horizon API for dual pricing (USD + XLM)');
        const horizonResult = await tryHorizonAPIDual();
        activeCleanup = horizonResult.unsubscribe;

        setIsLoading(false);

        // Cleanup function
        return () => {
          if (activeCleanup) {
            activeCleanup();
          }
          bitqueryService.stopRealTimeUpdates();
          stellarHorizonService.stopRealTimeUpdates();
        };

      } catch (error) {
        setIsLoading(false);
        handleError(error.message, 'Initialization');
      }
    };

    initializeServices();
  }, [preferredService, tryBitQuery, tryHorizonAPIDual, handleError, fetchXLMRate]);

  // Update XLM rate periodically (every 5 minutes)
  useEffect(() => {
    const xlmRateInterval = setInterval(() => {
      fetchXLMRate();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(xlmRateInterval);
  }, [fetchXLMRate]);

  // Manual refresh function that tries all services
  const refreshPrice = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Refresh XLM rate first
      await fetchXLMRate();
      
      // Try active service first
      if (activeService === 'Stellar Horizon') {
        const priceResult = await stellarHorizonService.fetchDualPrice(xlmToUSD);
        if (priceResult.success) {
          handlePriceUpdate({
            usdPrice: priceResult.usdPrice,
            xlmPrice: priceResult.xlmPrice
          }, 'Stellar Horizon');
          setIsLoading(false);
          return;
        }
      }
      
      if (activeService === 'BitQuery') {
        const price = await bitqueryService.fetchLatestPrice();
        if (price !== null) {
          handlePriceUpdate({ usdPrice: price }, 'BitQuery');
          setIsLoading(false);
          return;
        }
      }

      // If active service failed, try alternatives
      console.log('🔄 Active service failed, trying alternatives...');
      
      const horizonResult = await stellarHorizonService.fetchDualPrice(xlmToUSD);
      if (horizonResult.success) {
        handlePriceUpdate({
          usdPrice: horizonResult.usdPrice,
          xlmPrice: horizonResult.xlmPrice
        }, 'Stellar Horizon');
      } else {
        setError('No price data available from any service');
      }
    } catch (error) {
      handleError(error.message, 'Manual Refresh');
    } finally {
      setIsLoading(false);
    }
  }, [activeService, handlePriceUpdate, handleError, fetchXLMRate]);

  return {
    priceUSD: priceUSD !== null ? parseFloat(priceUSD).toFixed(6) : null,
    priceXLM: priceXLM !== null ? parseFloat(priceXLM).toFixed(7) : null,
    xlmToUSD: xlmToUSD !== null ? parseFloat(xlmToUSD).toFixed(4) : null,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    activeService,
    refreshPrice,
  };
};

export default useClixPriceDual;
