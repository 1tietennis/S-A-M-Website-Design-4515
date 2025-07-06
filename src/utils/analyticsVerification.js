// SiteBehaviour-Focused Analytics Verification Utilities

export const verifyAllAnalytics = () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    overall: false
  };

  // Test 1: Check SiteBehaviour script
  const siteBehaviourScript = document.querySelector('#site-behaviour-script-v2');
  results.tests.siteBehaviourScript = {
    name: 'SiteBehaviour Script Loaded',
    passed: !!siteBehaviourScript,
    details: siteBehaviourScript ? `Script loaded from ${siteBehaviourScript.src}` : 'SiteBehaviour script not found'
  };

  // Test 2: Check SiteBehaviour secret
  const expectedSecret = '507f5743-d0f0-49db-a5f0-0d702b989128';
  results.tests.siteBehaviourSecret = {
    name: 'SiteBehaviour Secret Configuration',
    passed: window.sitebehaviourTrackingSecret === expectedSecret,
    details: window.sitebehaviourTrackingSecret ? `Secret configured: ${window.sitebehaviourTrackingSecret.substring(0, 8)}...` : 'SiteBehaviour secret not found'
  };

  // Test 3: Check SiteBehaviour API availability
  results.tests.siteBehaviourAPI = {
    name: 'SiteBehaviour API Active',
    passed: typeof window.siteBehaviour !== 'undefined',
    details: typeof window.siteBehaviour !== 'undefined' ? 'SiteBehaviour API object available' : 'SiteBehaviour API not initialized'
  };

  // Test 4: Test SiteBehaviour event firing
  let siteBehaviourEventFired = false;
  try {
    document.dispatchEvent(new CustomEvent('sitebehaviour-test-event', {
      detail: {
        test: true,
        timestamp: Date.now()
      }
    }));
    siteBehaviourEventFired = true;
  } catch (error) {
    console.error('Error firing SiteBehaviour test event:', error);
  }

  results.tests.siteBehaviourEventFiring = {
    name: 'SiteBehaviour Event Firing Test',
    passed: siteBehaviourEventFired,
    details: siteBehaviourEventFired ? 'SiteBehaviour test event fired successfully' : 'Could not fire SiteBehaviour test event'
  };

  // Test 5: Check Google Analytics (gtag)
  results.tests.googleAnalytics = {
    name: 'Google Analytics (gtag)',
    passed: typeof window.gtag === 'function',
    details: typeof window.gtag === 'function' ? 'Google Analytics gtag available' : 'Google Analytics gtag not configured'
  };

  // Test 6: Check Firebase Analytics (if configured)
  results.tests.firebaseAnalytics = {
    name: 'Firebase Analytics',
    passed: !!window.firebaseAnalytics,
    details: window.firebaseAnalytics ? 'Firebase Analytics available' : 'Firebase Analytics not configured'
  };

  // Test 7: Check CyborgCRM (if configured)
  results.tests.cyborgCRM = {
    name: 'CyborgCRM Tracking',
    passed: typeof window.CyborgCRM === 'function',
    details: typeof window.CyborgCRM === 'function' ? 'CyborgCRM tracking available' : 'CyborgCRM not configured'
  };

  // Calculate overall status - focus on SiteBehaviour as primary
  const siteBehaviourTests = ['siteBehaviourScript', 'siteBehaviourSecret', 'siteBehaviourEventFiring'];
  const passedSiteBehaviourTests = siteBehaviourTests.filter(test => results.tests[test].passed).length;
  const totalSiteBehaviourTests = siteBehaviourTests.length;

  results.overall = passedSiteBehaviourTests === totalSiteBehaviourTests;
  results.score = `${passedSiteBehaviourTests}/${totalSiteBehaviourTests} SiteBehaviour tests passed`;

  return results;
};

export const logAnalyticsStatus = () => {
  const results = verifyAllAnalytics();

  console.group('🎯 SITEBEHAVIOUR-FOCUSED ANALYTICS VERIFICATION');
  console.log(`📊 Overall Status: ${results.overall ? '✅ FULLY OPERATIONAL' : '⚠️ ISSUES DETECTED'}`);
  console.log(`📈 Score: ${results.score}`);
  console.log(`🕒 Timestamp: ${results.timestamp}`);

  console.group('🔍 Detailed Test Results:');

  // Group results by platform
  console.group('📊 SiteBehaviour (Primary Platform):');
  ['siteBehaviourScript', 'siteBehaviourSecret', 'siteBehaviourAPI', 'siteBehaviourEventFiring'].forEach(testKey => {
    const test = results.tests[testKey];
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();

  console.group('📊 Additional Platforms:');
  ['googleAnalytics', 'firebaseAnalytics', 'cyborgCRM'].forEach(testKey => {
    const test = results.tests[testKey];
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();

  console.groupEnd();

  if (results.overall) {
    console.log('🎉 All SiteBehaviour tests passed! Analytics is fully operational.');
    console.log('📊 SiteBehaviour is actively tracking user behavior and sending data.');
  } else {
    console.log('⚠️ Some SiteBehaviour tests failed. Check the failed items above.');
  }

  console.groupEnd();
  return results;
};

export const trackPageLoadComplete = (pageName) => {
  // Wait for page to fully load before testing
  if (document.readyState === 'complete') {
    setTimeout(() => {
      logAnalyticsStatus();
      
      // Fire page-specific SiteBehaviour tracking
      document.dispatchEvent(new CustomEvent('sitebehaviour-page-load-complete', {
        detail: {
          page_name: pageName,
          page_title: document.title,
          page_location: window.location.href,
          timestamp: new Date().toISOString()
        }
      }));
      
      console.log(`📄 SiteBehaviour page load complete tracked for: ${pageName}`);
    }, 1000);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        logAnalyticsStatus();
        
        document.dispatchEvent(new CustomEvent('sitebehaviour-page-load-complete', {
          detail: {
            page_name: pageName,
            page_title: document.title,
            page_location: window.location.href,
            timestamp: new Date().toISOString()
          }
        }));
        
        console.log(`📄 SiteBehaviour page load complete tracked for: ${pageName}`);
      }, 1000);
    });
  }
};

// Auto-verify on script load
if (typeof window !== 'undefined') {
  // Make verification functions available globally for testing
  window.verifyAllAnalytics = verifyAllAnalytics;
  window.logAnalyticsStatus = logAnalyticsStatus;

  // Auto-run verification after SiteBehaviour should be loaded
  setTimeout(() => {
    console.log('🔍 Auto-running SiteBehaviour-focused analytics verification...');
    logAnalyticsStatus();
  }, 3000);
}