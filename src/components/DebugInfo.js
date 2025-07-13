import React, { useState, useEffect } from 'react';
import bitqueryService from '../services/BitqueryService';
import stellarHorizonService from '../services/StellarHorizonService';
import useClixPriceEnhanced from '../hooks/useClixPriceEnhanced';

const DebugInfo = () => {
  const [envCheck, setEnvCheck] = useState({});
  const { 
    price, 
    isLoading, 
    error, 
    isConnected, 
    activeService,
    lastUpdated 
  } = useClixPriceEnhanced();

  useEffect(() => {
    // Check environment variables
    setEnvCheck({
      apiKey: process.env.REACT_APP_BITQUERY_API_KEY ? 'Set' : 'Missing',
      assetCode: process.env.REACT_APP_CLIX_ASSET_CODE || 'Not set',
      issuer: process.env.REACT_APP_CLIX_ISSUER ? 'Set' : 'Missing',
      bitqueryPrice: bitqueryService.getCurrentPrice(),
      horizonPrice: stellarHorizonService.getCurrentPrice(),
    });
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-900 text-white p-3 rounded-lg text-xs max-w-xs opacity-90 z-50">
      <div className="font-bold mb-2 text-green-400">Enhanced Debug Info</div>
      <div className="mb-2">
        <div className="text-yellow-400 font-semibold">Configuration:</div>
        <div>API Key: {envCheck.apiKey}</div>
        <div>Asset: {envCheck.assetCode}</div>
        <div>Issuer: {envCheck.issuer ? 'Set' : 'Missing'}</div>
      </div>
      
      <div className="mb-2">
        <div className="text-blue-400 font-semibold">Active Service:</div>
        <div>Service: {activeService || 'None'}</div>
        <div>Price: {price ? `${price}` : 'Not Available'}</div>
        <div>Status: 
          {isLoading ? <span className="text-yellow-400">Loading</span> : 
           isConnected ? <span className="text-green-400">Connected</span> : 
           <span className="text-red-400">Disconnected</span>}
        </div>
        {lastUpdated && (
          <div>Updated: {lastUpdated.toLocaleTimeString()}</div>
        )}
      </div>
      
      <div className="mb-2">
        <div className="text-purple-400 font-semibold">Service Prices:</div>
        <div>BitQuery: {envCheck.bitqueryPrice ? `${envCheck.bitqueryPrice}` : 'None'}</div>
        <div>Horizon: {envCheck.horizonPrice ? `${envCheck.horizonPrice}` : 'None'}</div>
      </div>
      
      {error && (
        <div className="text-red-300 text-xs mt-2 p-2 bg-red-900 rounded">
          <div className="font-semibold">Error:</div>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
};

export default DebugInfo;