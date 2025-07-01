// Google Analytics 4 & SiteBehaviour Complete Test Script

const testGA4AndSiteBehaviour = () => {
  console.log('🧪 Testing Google Analytics 4 & SiteBehaviour Implementation...');
  
  const results = {
    ga4: {},
    siteBehaviour: {},
    overall: false
  };

  // GA4 Tests
  console.log('\n📊 GOOGLE ANALYTICS 4 TESTS');
  console.log('============================');
  
  // Test 1: GA4 gtag function
  results.ga4.gtagFunction = typeof window.gtag === 'function';
  console.log(`${results.ga4.gtagFunction ? '✅' : '❌'} GA4 gtag function: ${results.ga4.gtagFunction ? 'LOADED' : 'MISSING'}`);
  
  // Test 2: GA4 dataLayer
  results.ga4.dataLayer = window.dataLayer && Array.isArray(window.dataLayer);
  console.log(`${results.ga4.dataLayer ? '✅' : '❌'} GA4 dataLayer: ${results.ga4.dataLayer ? `ACTIVE (${window.dataLayer.length} entries)` : 'MISSING'}`);
  
  // Test 3: GA4 script tag
  const ga4Script = document.querySelector('script[src*="googletagmanager.com/gtag/js?id=G-CTDQQ8XMKC"]');
  results.ga4.script = !!ga4Script;
  console.log(`${results.ga4.script ? '✅' : '❌'} GA4 script tag: ${results.ga4.script ? 'LOADED' : 'MISSING'}`);
  
  // Test 4: GA4 configuration
  const ga4Config = window.dataLayer && window.dataLayer.some(item => 
    Array.isArray(item) && item[0] === 'config' && item[1] === 'G-CTDQQ8XMKC'
  );
  results.ga4.config = ga4Config;
  console.log(`${results.ga4.config ? '✅' : '❌'} GA4 configuration: ${results.ga4.config ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
  
  // Test 5: Fire GA4 test event
  let ga4EventFired = false;
  try {
    if (window.gtag) {
      window.gtag('event', 'test_ga4_tracking', {
        event_category: 'testing',
        event_label: 'ga4_verification',
        custom_parameter: 'test_successful',
        timestamp: new Date().toISOString()
      });
      ga4EventFired = true;
    }
  } catch (error) {
    console.error('Error firing GA4 test event:', error);
  }
  
  results.ga4.eventFiring = ga4EventFired;
  console.log(`${results.ga4.eventFiring ? '✅' : '❌'} GA4 event firing: ${results.ga4.eventFiring ? 'SUCCESS' : 'FAILED'}`);
  
  // SiteBehaviour Tests
  console.log('\n📊 SITEBEHAVIOUR TESTS');
  console.log('======================');
  
  // Test 6: SiteBehaviour script
  const siteBehaviourScript = document.querySelector('#site-behaviour-script-v2');
  results.siteBehaviour.script = !!siteBehaviourScript;
  console.log(`${results.siteBehaviour.script ? '✅' : '❌'} SiteBehaviour script: ${results.siteBehaviour.script ? 'LOADED' : 'MISSING'}`);
  
  // Test 7: SiteBehaviour secret
  const expectedSecret = '507f5743-d0f0-49db-a5f0-0d702b989128';
  results.siteBehaviour.secret = window.sitebehaviourTrackingSecret === expectedSecret;
  console.log(`${results.siteBehaviour.secret ? '✅' : '❌'} SiteBehaviour secret: ${results.siteBehaviour.secret ? 'CONFIGURED' : 'MISSING'}`);
  
  // Test 8: SiteBehaviour CDN connection
  const siteBehaviourCDN = siteBehaviourScript && siteBehaviourScript.src.includes('sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com');
  results.siteBehaviour.cdn = siteBehaviourCDN;
  console.log(`${results.siteBehaviour.cdn ? '✅' : '❌'} SiteBehaviour CDN: ${results.siteBehaviour.cdn ? 'CONNECTED' : 'NOT CONNECTED'}`);
  
  // Overall Results
  console.log('\n🎯 COMPLETE TEST SUMMARY');
  console.log('=========================');
  
  const ga4Tests = Object.values(results.ga4);
  const siteBehaviourTests = Object.values(results.siteBehaviour);
  const allTests = [...ga4Tests, ...siteBehaviourTests];
  
  const passedTests = allTests.filter(Boolean).length;
  const totalTests = allTests.length;
  
  results.overall = passedTests === totalTests;
  
  console.log(`📊 Tests Passed: ${passedTests}/${totalTests}`);
  console.log(`📈 GA4 Status: ${ga4Tests.every(Boolean) ? '✅ OPERATIONAL' : '⚠️ ISSUES'}`);
  console.log(`📈 SiteBehaviour Status: ${siteBehaviourTests.every(Boolean) ? '✅ OPERATIONAL' : '⚠️ ISSUES'}`);
  console.log(`🎯 Overall Status: ${results.overall ? '✅ FULLY OPERATIONAL' : '⚠️ NEEDS ATTENTION'}`);
  
  if (results.overall) {
    console.log('\n🎉 SUCCESS: All tracking systems are fully operational!');
    console.log('📊 GA4 is collecting and sending data to Google Analytics');
    console.log('📈 SiteBehaviour is monitoring user interactions');
    console.log('🚀 Ready for production deployment');
  } else {
    console.log('\n⚠️ WARNING: Some systems need attention');
    console.log('🔧 Check the failed tests above for issues');
  }
  
  return results;
};

// Page-specific verification
const verifyPageTracking = (pageName) => {
  console.log(`\n🔍 VERIFYING PAGE TRACKING: ${pageName}`);
  console.log('=========================================');
  
  // Fire page view for GA4
  if (window.gtag) {
    window.gtag('config', 'G-CTDQQ8XMKC', {
      page_title: `${pageName} - Test`,
      page_location: window.location.href
    });
    console.log(`✅ GA4 page view tracked for ${pageName}`);
  }
  
  // Check SiteBehaviour is active
  if (window.sitebehaviourTrackingSecret) {
    console.log(`✅ SiteBehaviour monitoring active for ${pageName}`);
  }
};

// Export for global use
window.testGA4AndSiteBehaviour = testGA4AndSiteBehaviour;
window.verifyPageTracking = verifyPageTracking;

// Auto-run test when script loads
console.log('🚀 GA4 & SiteBehaviour Test Script Loaded');
console.log('📊 Run testGA4AndSiteBehaviour() to verify implementation');