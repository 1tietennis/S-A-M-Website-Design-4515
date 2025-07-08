// Meta Pixel Tester Utility
// This utility helps verify that the Meta Pixel is properly installed and functioning

export const verifyPixelInstallation = () => {
  console.log('🧪 TESTING META PIXEL INSTALLATION');
  console.log('=================================');
  
  const results = {
    scriptPresent: false,
    fbqFunction: false,
    pixelInitialized: false,
    pageViewTracked: false,
    testEventSuccess: false,
    correctPixelId: false
  };
  
  // Check 1: Script presence
  const pixelScript = document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]');
  results.scriptPresent = !!pixelScript;
  console.log(`${results.scriptPresent ? '✅' : '❌'} Meta Pixel script: ${results.scriptPresent ? 'FOUND' : 'MISSING'}`);
  
  // Check 2: fbq function availability
  results.fbqFunction = typeof window.fbq === 'function';
  console.log(`${results.fbqFunction ? '✅' : '❌'} fbq function: ${results.fbqFunction ? 'AVAILABLE' : 'MISSING'}`);
  
  // Check 3: Pixel initialization
  if (window._fbq && window._fbq.loaded) {
    results.pixelInitialized = true;
    console.log('✅ Pixel initialized: YES');
  } else {
    console.log('❌ Pixel initialized: NO');
  }
  
  // Check 4: Correct Pixel ID
  if (window.fbq && window.fbq.queue) {
    const initCalls = window.fbq.queue.filter(item => 
      Array.isArray(item) && item[0] === 'init'
    );
    
    if (initCalls.length > 0) {
      const pixelId = initCalls[0][1];
      console.log(`📝 Detected Pixel ID: ${pixelId}`);
      results.correctPixelId = pixelId === '1234567890123456'; // Replace with your actual ID
    }
  }
  
  // Check 5: Test event firing
  if (results.fbqFunction) {
    try {
      window.fbq('trackCustom', 'PixelVerificationTest', {
        test_time: new Date().toISOString(),
        page: window.location.pathname
      });
      results.testEventSuccess = true;
      console.log('✅ Test event fired successfully');
    } catch (error) {
      console.log('❌ Test event firing failed:', error.message);
    }
  }
  
  // Overall status
  const passedChecks = Object.values(results).filter(Boolean).length;
  const totalChecks = Object.keys(results).length;
  console.log(`\n📊 Overall status: ${passedChecks}/${totalChecks} checks passed`);
  
  if (passedChecks === totalChecks) {
    console.log('🎉 META PIXEL IS PROPERLY INSTALLED AND WORKING');
  } else if (passedChecks >= totalChecks - 1) {
    console.log('✅ META PIXEL IS WORKING BUT COULD BE OPTIMIZED');
  } else {
    console.log('❌ META PIXEL INSTALLATION HAS ISSUES');
    
    // Provide troubleshooting advice
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    
    if (!results.scriptPresent) {
      console.log('1. The Meta Pixel script is missing. Add the base code to your <head> section.');
    }
    
    if (!results.fbqFunction) {
      console.log('2. The fbq function is not available. Check for JavaScript errors that might be preventing it from loading.');
    }
    
    if (!results.pixelInitialized) {
      console.log('3. The pixel is not properly initialized. Make sure you have the fbq(\'init\', \'YOUR_PIXEL_ID\') call in your code.');
    }
    
    if (!results.correctPixelId) {
      console.log('4. The pixel ID might be incorrect. Double-check your pixel ID in Meta Events Manager.');
    }
    
    if (!results.testEventSuccess) {
      console.log('5. Test event failed to fire. Check browser console for JavaScript errors.');
    }
  }
  
  return results;
};

export const testPixelEvents = () => {
  console.log('🧪 TESTING META PIXEL EVENTS');
  console.log('===========================');
  
  if (typeof window.fbq !== 'function') {
    console.log('❌ Cannot test events: fbq function not available');
    return false;
  }
  
  const standardEvents = [
    {
      name: 'PageView',
      params: {
        page_location: window.location.href,
        page_title: document.title
      }
    },
    {
      name: 'ViewContent',
      params: {
        content_type: 'webpage',
        content_name: 'Meta Pixel Test',
        value: 1.00,
        currency: 'USD'
      }
    },
    {
      name: 'Lead',
      params: {
        content_name: 'Test Lead',
        content_category: 'testing'
      }
    }
  ];
  
  const customEvents = [
    {
      name: 'PixelTest',
      params: {
        test_type: 'standard',
        timestamp: new Date().toISOString()
      }
    },
    {
      name: 'EventVerification',
      params: {
        verification_type: 'custom',
        page: window.location.pathname
      }
    }
  ];
  
  console.log('📊 Testing standard events...');
  standardEvents.forEach((event, index) => {
    try {
      window.fbq('track', event.name, event.params);
      console.log(`✅ Standard event ${index + 1} fired: ${event.name}`);
    } catch (error) {
      console.log(`❌ Standard event ${index + 1} failed: ${error.message}`);
    }
  });
  
  console.log('\n📊 Testing custom events...');
  customEvents.forEach((event, index) => {
    try {
      window.fbq('trackCustom', event.name, event.params);
      console.log(`✅ Custom event ${index + 1} fired: ${event.name}`);
    } catch (error) {
      console.log(`❌ Custom event ${index + 1} failed: ${error.message}`);
    }
  });
  
  console.log('\n🎯 All test events sent to Meta Pixel');
  console.log('📝 Check Meta Events Manager > Test Events to verify');
  
  return true;
};

// Make functions globally available
if (typeof window !== 'undefined') {
  window.verifyPixelInstallation = verifyPixelInstallation;
  window.testPixelEvents = testPixelEvents;
}

export default {
  verifyPixelInstallation,
  testPixelEvents
};