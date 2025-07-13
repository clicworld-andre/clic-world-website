/**
 * Bitquery Integration Status Check
 * Run this to verify your setup is complete
 */

import BitqueryConfig from './BitqueryConfig';
import { testClixSpecifically } from './ClixTokenTest';

export const checkIntegrationStatus = () => {
  console.log('🔧 BITQUERY INTEGRATION STATUS CHECK');
  console.log('=====================================');
  
  // Check configuration
  const configStatus = BitqueryConfig.validate();
  
  console.log('📋 Configuration:');
  console.log(`   API Key: ${BitqueryConfig.apiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`   CLIX Asset Code: ${BitqueryConfig.clix.assetCode || '❌ Missing'}`);
  console.log(`   CLIX Issuer: ${BitqueryConfig.clix.issuer || '❌ Missing'}`);
  
  if (configStatus.isValid) {
    console.log('✅ Configuration is complete!');
    console.log('\n🚀 Ready to start real-time CLIX price updates');
    console.log('💡 Restart your development server to activate: npm start');
    
    // Optionally test the API connection
    console.log('\n🧪 Testing API connection...');
    testClixSpecifically().then(success => {
      if (success) {
        console.log('🎉 API connection successful! CLIX data found.');
      } else {
        console.log('⚠️  API connected but no recent CLIX trades found.');
        console.log('💭 This is normal - CLIX price will update when trades occur.');
      }
    });
    
  } else {
    console.log('❌ Configuration incomplete:');
    configStatus.issues.forEach(issue => console.log(`   - ${issue}`));
    console.log(BitqueryConfig.getSetupInstructions());
  }
  
  return configStatus.isValid;
};

// Current configuration summary
export const getConfigSummary = () => {
  return {
    apiKey: BitqueryConfig.apiKey ? 'Set' : 'Missing',
    clixAssetCode: BitqueryConfig.clix.assetCode,
    clixIssuer: BitqueryConfig.clix.issuer,
    apiUrl: BitqueryConfig.apiUrl,
    isReady: BitqueryConfig.validate().isValid,
  };
};

export default checkIntegrationStatus;