import { useState, useEffect, useCallback } from 'react';
import bitqueryService from '../services/BitqueryService';
import stellarHorizonService from '../services/StellarHorizonService';

/**
 * Enhanced CLIX Price Hook with Multiple API Sources
 * 
 * Provides real-time CLIX price updates with automatic fallback
 * from BitQuery to Stellar Horizon API for maximum reliability.
 */
export const useClixPriceEnhanced = (options = {}) => {
  const {
    enableRealTime = true,
    pollInterval = 30000, // 30 seconds
    preferredService = 'auto', // 'auto', 'bitquery', 'horizon'
    onError = null,
  } = options;

  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activeService, setActiveService] = useState(null);

  // Handle price updates from any service
  const handlePriceUpdate = useCallback((newPrice, serviceName) => {
    setPrice(newPrice);
    setLastUpdated(new Date());
    setError(null);
    setActiveService(serviceName);
    console.log(`💰 Price updated from ${serviceName}: $${newPrice}`);
  }, []);

  // Handle errors
  const handleError = useCallback((errorMessage, serviceName) => {
    console.error(`❌ Error from ${serviceName}:`, errorMessage);
    setError(errorMessage);
    if (onError) {
      onError(errorMessage, serviceName);
    }
  }, [onError]);

  // Try BitQuery first
  const tryBitQuery = useCallback(async () => {
    console.log('🔍 Trying BitQuery for CLIX price...');
    
    try {
      const unsubscribe = bitqueryService.onPriceUpdate((newPrice) => {
        handlePriceUpdate(newPrice, 'BitQuery');
      });

      const price = await bitqueryService.fetchLatestPrice();
      
      if (price !== null) {
        handlePriceUpdate(price, 'BitQuery');
        
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

  // Try Stellar Horizon as fallback
  const tryHorizonAPI = useCallback(async () => {
    console.log('🌟 Trying Stellar Horizon API for CLIX price...');
    
    try {
      const unsubscribe = stellarHorizonService.onPriceUpdate((newPrice) => {
        handlePriceUpdate(newPrice, 'Stellar Horizon');
      });

      const price = await stellarHorizonService.fetchLatestPrice();
      
      if (price !== null) {
        handlePriceUpdate(price, 'Stellar Horizon');
        
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

  // Initialize services with intelligent fallback (prevent multiple calls)
  useEffect(() => {
    const initializeServices = async () => {
      if (isLoading) return; // Prevent multiple initializations
      
      setIsLoading(true);
      let activeCleanup = null;

      try {
        // Initialize both services once
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

        // Try services based on preference (skip BitQuery in browser due to CORS)
        if (preferredService === 'horizon' || !apiKey) {
          console.log('🎆 Using Horizon API (preferred or no BitQuery key)');
          const horizonResult = await tryHorizonAPI();
          activeCleanup = horizonResult.unsubscribe;
        } else {
          // Auto mode: try Horizon first in browser (avoid CORS issues)
          console.log('🎆 Browser mode: trying Horizon API first to avoid CORS...');
          const horizonResult = await tryHorizonAPI();
          activeCleanup = horizonResult.unsubscribe;
        }

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
  }, [preferredService, tryBitQuery, tryHorizonAPI, handleError]);

  // Manual refresh function that tries all services
  const refreshPrice = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Try current active service first
      if (activeService === 'BitQuery') {
        const price = await bitqueryService.fetchLatestPrice();
        if (price !== null) {
          handlePriceUpdate(price, 'BitQuery');
          setIsLoading(false);
          return;
        }
      }
      
      if (activeService === 'Stellar Horizon') {
        const price = await stellarHorizonService.fetchLatestPrice();
        if (price !== null) {
          handlePriceUpdate(price, 'Stellar Horizon');
          setIsLoading(false);
          return;
        }
      }

      // If active service failed, try the other one
      console.log('🔄 Active service failed, trying alternative...');
      
      const bitqueryPrice = await bitqueryService.fetchLatestPrice();
      if (bitqueryPrice !== null) {
        handlePriceUpdate(bitqueryPrice, 'BitQuery');
      } else {
        const horizonPrice = await stellarHorizonService.fetchLatestPrice();
        if (horizonPrice !== null) {
          handlePriceUpdate(horizonPrice, 'Stellar Horizon');
        } else {
          setError('No price data available from any service');
        }
      }
    } catch (error) {
      handleError(error.message, 'Manual Refresh');
    } finally {
      setIsLoading(false);
    }
  }, [activeService, handlePriceUpdate, handleError]);

  return {
    price: price !== null ? parseFloat(price).toFixed(2) : null,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    activeService,
    refreshPrice,
  };
};

export default useClixPriceEnhanced;
