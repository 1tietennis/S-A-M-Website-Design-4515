// Google Analytics Implementation Test Script
// This script will verify GA tracking on all pages

const testGoogleAnalytics = () => {
  console.log('🧪 Testing Google Analytics Implementation...');
  
  // Test 1: Check if gtag is loaded globally
  const gtagTest = () => {
    console.log('\n📊 Test 1: Global gtag Function');
    if (typeof window.gtag === 'function') {
      console.log('✅ gtag function is available globally');
      return true;
    } else {
      console.log('❌ gtag function not found');
      return false;
    }
  };

  // Test 2: Check if dataLayer exists
  const dataLayerTest = () => {
    console.log('\n📊 Test 2: DataLayer Existence');
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      console.log('✅ dataLayer exists and is an array');
      console.log(`📈 dataLayer has ${window.dataLayer.length} entries`);
      return true;
    } else {
      console.log('❌ dataLayer not found or not an array');
      return false;
    }
  };

  // Test 3: Fire a test event
  const eventTest = () => {
    console.log('\n📊 Test 3: Event Firing');
    try {
      if (window.gtag) {
        window.gtag('event', 'test_event', {
          event_category: 'testing',
          event_label: 'analytics_verification',
          custom_parameter: 'test_value'
        });
        console.log('✅ Test event fired successfully');
        return true;
      } else {
        console.log('❌ Cannot fire test event - gtag not available');
        return false;
      }
    } catch (error) {
      console.log('❌ Error firing test event:', error);
      return false;
    }
  };

  // Test 4: Check tracking ID configuration
  const trackingIdTest = () => {
    console.log('\n📊 Test 4: Tracking ID Configuration');
    const scripts = document.querySelectorAll('script');
    let foundTrackingId = false;
    
    scripts.forEach(script => {
      if (script.innerHTML.includes('G-CTDQQ8XMKC')) {
        foundTrackingId = true;
      }
    });

    if (foundTrackingId) {
      console.log('✅ Tracking ID G-CTDQQ8XMKC found in page');
      return true;
    } else {
      console.log('❌ Tracking ID G-CTDQQ8XMKC not found');
      return false;
    }
  };

  // Test 5: Check GA script loading
  const scriptLoadTest = () => {
    console.log('\n📊 Test 5: Google Analytics Script Loading');
    const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    
    if (gaScript) {
      console.log('✅ Google Analytics script tag found');
      console.log(`📍 Script source: ${gaScript.src}`);
      return true;
    } else {
      console.log('❌ Google Analytics script tag not found');
      return false;
    }
  };

  // Run all tests
  const results = {
    gtag: gtagTest(),
    dataLayer: dataLayerTest(),
    eventFiring: eventTest(),
    trackingId: trackingIdTest(),
    scriptLoading: scriptLoadTest()
  };

  // Summary
  console.log('\n🎯 GOOGLE ANALYTICS TEST SUMMARY');
  console.log('=====================================');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`📊 Tests Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED - Google Analytics is fully operational!');
  } else {
    console.log('⚠️ Some tests failed - Check implementation');
  }

  // Detailed results
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
  });

  return results;
};

// Page-specific tracking verification
const verifyPageTracking = (pageName) => {
  console.log(`\n🔍 Verifying tracking for: ${pageName}`);
  
  // Check if page tracking code is present
  const pageTrackingScript = document.querySelector('script[data-page-tracking]') || 
                            document.querySelector('script').innerHTML.includes('gtag');
  
  if (pageTrackingScript) {
    console.log(`✅ ${pageName} has tracking code`);
  } else {
    console.log(`❌ ${pageName} missing tracking code`);
  }

  // Fire page view event
  if (window.gtag) {
    window.gtag('config', 'G-CTDQQ8XMKC', {
      page_title: `${pageName} - Test`,
      page_location: window.location.href
    });
    console.log(`📊 Page view tracked for ${pageName}`);
  }
};

// Export for use
window.testGoogleAnalytics = testGoogleAnalytics;
window.verifyPageTracking = verifyPageTracking;

// Auto-run test when script loads
console.log('🚀 Google Analytics Test Script Loaded');
console.log('Run testGoogleAnalytics() to verify implementation');