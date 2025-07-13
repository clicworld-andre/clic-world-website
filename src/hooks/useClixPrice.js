import { useState, useEffect, useCallback } from 'react';
import bitqueryService from '../services/BitqueryService';

/**
 * Custom React Hook for CLIX Token Price
 * 
 * Provides real-time CLIX price updates with automatic fallback
 * and error handling for production use.
 */
export const useClixPrice = (options = {}) => {
  const {
    enableRealTime = true,
    pollInterval = 30000, // 30 seconds fallback polling
    onError = null,
  } = options;

  const [price, setPrice] = useState(bitqueryService.getCurrentPrice());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Handle price updates from service
  const handlePriceUpdate = useCallback((newPrice) => {
    setPrice(newPrice);
    setLastUpdated(new Date());
    setError(null);
  }, []);

  // Handle errors
  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    if (onError) {
      onError(errorMessage);
    }
  }, [onError]);

  // Initialize service and fetch initial price
  useEffect(() => {
    const initializeService = async () => {
      setIsLoading(true);
      
      try {
        // Subscribe to price updates
        const unsubscribe = bitqueryService.onPriceUpdate(handlePriceUpdate);
        
        // Fetch initial price
        await bitqueryService.fetchLatestPrice();
        
        // Start real-time updates if enabled
        if (enableRealTime) {
          bitqueryService.startRealTimeUpdates();
          setIsConnected(true);
        }
        
        setIsLoading(false);
        
        // Cleanup function
        return () => {
          unsubscribe();
          if (enableRealTime) {
            bitqueryService.stopRealTimeUpdates();
          }
        };
      } catch (error) {
        setIsLoading(false);
        handleError(error.message);
      }
    };

    initializeService();
  }, [enableRealTime, handlePriceUpdate, handleError]);

  // Fallback polling when real-time is not available
  useEffect(() => {
    if (!enableRealTime && pollInterval > 0) {
      const interval = setInterval(async () => {
        try {
          await bitqueryService.fetchLatestPrice();
        } catch (error) {
          handleError(error.message);
        }
      }, pollInterval);

      return () => clearInterval(interval);
    }
  }, [enableRealTime, pollInterval, handleError]);

  // Manual refresh function
  const refreshPrice = useCallback(async () => {
    setIsLoading(true);
    try {
      await bitqueryService.fetchLatestPrice();
      setError(null);
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    price: price !== null ? parseFloat(price).toFixed(2) : null,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshPrice,
  };
};

export default useClixPrice;