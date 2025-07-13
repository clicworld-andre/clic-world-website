/**
 * Bitquery Configuration Helper
 * 
 * This utility helps configure the Bitquery service with proper
 * API keys and CLIX token settings.
 */

export const BitqueryConfig = {
  // API Endpoints
  apiUrl: process.env.REACT_APP_BITQUERY_API_URL || 'https://streaming.bitquery.io/graphql',
  wsUrl: process.env.REACT_APP_BITQUERY_WS_URL || 'wss://streaming.bitquery.io/eap',
  
  // API Key
  apiKey: process.env.REACT_APP_BITQUERY_API_KEY || '',
  
  // CLIX Token Configuration
  clix: {
    assetCode: process.env.REACT_APP_CLIX_ASSET_CODE || 'CLIX',
    issuer: process.env.REACT_APP_CLIX_ISSUER || '',
  },
  
  // Service Configuration
  options: {
    enableRealTime: true,
    pollInterval: 30000, // 30 seconds
    maxReconnectAttempts: 5,
    requestLimit: 10000, // Free tier limit per month
  },

  /**
   * Validate configuration
   */
  validate() {
    const issues = [];
    
    if (!this.apiKey) {
      issues.push('REACT_APP_BITQUERY_API_KEY is not set');
    }
    
    if (!this.clix.assetCode) {
      issues.push('REACT_APP_CLIX_ASSET_CODE is not set');
    }
    
    // Note: issuer can be empty for native assets
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  },

  /**
   * Get setup instructions
   */
  getSetupInstructions() {
    return `
🔧 Bitquery Setup Instructions:

1. Register at: https://graphql.bitquery.io/ide
2. Get your API key from Account section
3. Create .env file in project root with:
   REACT_APP_BITQUERY_API_KEY=your_api_key_here
   REACT_APP_CLIX_ASSET_CODE=CLIX
   REACT_APP_CLIX_ISSUER=your_issuer_address

4. Update CLIX token configuration with actual values
5. Restart development server

📚 Documentation: https://docs.bitquery.io/
💬 Support: Bitquery Discord/Telegram
    `;
  },

  /**
   * Development helper to log configuration status
   */
  logStatus() {
    const validation = this.validate();
    
    console.log('🔧 Bitquery Configuration Status:');
    console.log('API Key:', this.apiKey ? '✅ Set' : '❌ Missing');
    console.log('CLIX Asset Code:', this.clix.assetCode || '❌ Missing');
    console.log('CLIX Issuer:', this.clix.issuer || '⚠️ Not set (OK for native)');
    
    if (!validation.isValid) {
      console.log('❌ Configuration Issues:');
      validation.issues.forEach(issue => console.log(`   - ${issue}`));
      console.log(this.getSetupInstructions());
    } else {
      console.log('✅ Configuration is valid');
    }
    
    return validation.isValid;
  },
};

export default BitqueryConfig;