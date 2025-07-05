// SiteBehaviour Command Center - Easy Commands for Activation and Testing

export const SiteBehaviourCommands = {
  
  // Command 1: Quick Status Check
  status: () => {
    console.log('🔍 SITEBEHAVIOUR STATUS CHECK');
    console.log('============================');
    
    const checks = {
      scriptLoaded: !!document.querySelector('#site-behaviour-script-v2'),
      secretConfigured: window.sitebehaviourTrackingSecret === '507f5743-d0f0-49db-a5f0-0d702b989128',
      apiReady: typeof window.siteBehaviour !== 'undefined',
      tracking: !!sessionStorage.getItem('sb_session_id')
    };
    
    Object.entries(checks).forEach(([key, value]) => {
      console.log(`${value ? '✅' : '❌'} ${key}: ${value ? 'OK' : 'FAILED'}`);
    });
    
    const allGood = Object.values(checks).every(Boolean);
    console.log(`\n🎯 Overall Status: ${allGood ? '✅ ACTIVE' : '❌ NEEDS ATTENTION'}`);
    
    return checks;
  },

  // Command 2: Force Activation
  activate: () => {
    console.log('🚀 FORCE ACTIVATING SITEBEHAVIOUR');
    console.log('=================================');
    
    // Import and run activation
    import('./siteBehaviourVerification.js').then(module => {
      module.activateAllSiteBehaviourMetrics();
    });
  },

  // Command 3: Test All Metrics
  testMetrics: () => {
    console.log('🧪 TESTING ALL SITEBEHAVIOUR METRICS');
    console.log('====================================');
    
    const tests = [];
    
    // Test 1: Site Traffic
    console.log('📊 Testing Site Traffic...');
    document.dispatchEvent(new CustomEvent('sitebehaviour-test-pageview', {
      detail: { page: '/test', timestamp: Date.now() }
    }));
    tests.push('Site Traffic: Test event sent');
    
    // Test 2: Engagement Score
    console.log('🎯 Testing Engagement Score...');
    document.dispatchEvent(new CustomEvent('sitebehaviour-test-engagement', {
      detail: { type: 'test_interaction', value: 100 }
    }));
    tests.push('Engagement Score: Test interaction sent');
    
    // Test 3: UTM Tracking
    console.log('📈 Testing UTM Tracking...');
    document.dispatchEvent(new CustomEvent('sitebehaviour-utm-tracking', {
      detail: {
        utm_source: 'test',
        utm_medium: 'manual',
        utm_campaign: 'verification'
      }
    }));
    tests.push('UTM Tracking: Test parameters sent');
    
    // Test 4: Multi-page Visits
    console.log('📚 Testing Multi-page Visits...');
    sessionStorage.setItem('sb_page_count', '5');
    document.dispatchEvent(new CustomEvent('sitebehaviour-multi-page', {
      detail: { pageCount: 5, sessionId: 'test_session' }
    }));
    tests.push('Multi-page Visits: Test visit data sent');
    
    // Test 5: Form Interactions
    console.log('📝 Testing Form Interactions...');
    document.dispatchEvent(new CustomEvent('sitebehaviour-form-start', {
      detail: { formId: 'test_form', fieldCount: 3 }
    }));
    tests.push('Form Interactions: Test form event sent');
    
    // Test 6: Link Clicks
    console.log('🔗 Testing Link Clicks...');
    document.dispatchEvent(new CustomEvent('sitebehaviour-link-click', {
      detail: { 
        href: 'https://test.com', 
        text: 'Test Link',
        isExternal: true
      }
    }));
    tests.push('Link Clicks: Test click event sent');
    
    console.log('\n✅ ALL METRIC TESTS COMPLETED');
    tests.forEach(test => console.log(`   ${test}`));
    console.log('\n📊 Check your SiteBehaviour dashboard for these test events');
    
    return tests;
  },

  // Command 4: Generate Sample Data
  generateSampleData: () => {
    console.log('🎲 GENERATING SAMPLE DATA');
    console.log('=========================');
    
    const sampleEvents = [
      // Page views
      { type: 'pageview', page: '/', title: 'Home' },
      { type: 'pageview', page: '/services', title: 'Services' },
      { type: 'pageview', page: '/contact', title: 'Contact' },
      
      // Engagements
      { type: 'scroll', depth: 25 },
      { type: 'scroll', depth: 50 },
      { type: 'scroll', depth: 75 },
      
      // Form interactions
      { type: 'form_start', formId: 'contact_form' },
      { type: 'field_focus', field: 'email' },
      { type: 'field_focus', field: 'name' },
      { type: 'form_submit', formId: 'contact_form' },
      
      // Link clicks
      { type: 'link_click', href: '/services', text: 'Our Services' },
      { type: 'link_click', href: 'https://google.com', text: 'External Link', external: true }
    ];
    
    sampleEvents.forEach((event, index) => {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent(`sitebehaviour-${event.type}`, {
          detail: { ...event, timestamp: Date.now() }
        }));
        console.log(`📤 Sent sample event: ${event.type}`);
      }, index * 500); // Spread events over time
    });
    
    console.log(`🎲 Generated ${sampleEvents.length} sample events`);
    console.log('📊 Events will be sent over the next few seconds');
    
    return sampleEvents;
  },

  // Command 5: Check Dashboard Connection
  checkDashboard: async () => {
    console.log('🔍 CHECKING DASHBOARD CONNECTION');
    console.log('================================');
    
    try {
      // Test connection to SiteBehaviour CDN
      const response = await fetch('https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      console.log('✅ CDN Connection: OK');
      
      // Check if tracking secret is valid format
      const secret = window.sitebehaviourTrackingSecret;
      const isValidFormat = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(secret);
      
      console.log(`${isValidFormat ? '✅' : '❌'} Tracking Secret Format: ${isValidFormat ? 'Valid' : 'Invalid'}`);
      console.log(`📝 Secret: ${secret?.substring(0, 8)}...`);
      
      // Check local storage for session data
      const sessionData = {
        sessionId: sessionStorage.getItem('sb_session_id'),
        pageCount: sessionStorage.getItem('sb_page_count'),
        sessionStart: sessionStorage.getItem('sb_session_start')
      };
      
      console.log('📊 Session Data:', sessionData);
      
      console.log('\n🎯 Dashboard should show data if:');
      console.log('   ✅ CDN connection is working');
      console.log('   ✅ Tracking secret is valid');
      console.log('   ✅ Events are being sent');
      console.log('\n📱 Check your SiteBehaviour dashboard at: https://sitebehaviour.com/dashboard');
      
      return {
        cdnConnected: true,
        secretValid: isValidFormat,
        sessionData: sessionData
      };
      
    } catch (error) {
      console.error('❌ Dashboard connection failed:', error);
      return { error: error.message };
    }
  },

  // Command 6: Reset and Restart
  resetAndRestart: () => {
    console.log('🔄 RESET AND RESTART SITEBEHAVIOUR');
    console.log('===================================');
    
    // Clear session data
    sessionStorage.removeItem('sb_session_id');
    sessionStorage.removeItem('sb_page_count'); 
    sessionStorage.removeItem('sb_session_start');
    console.log('🗑️ Cleared session data');
    
    // Remove and reload script
    const existingScript = document.querySelector('#site-behaviour-script-v2');
    if (existingScript) {
      existingScript.remove();
      console.log('🗑️ Removed existing script');
    }
    
    // Reload script
    setTimeout(() => {
      const script = document.createElement('script');
      script.id = 'site-behaviour-script-v2';
      script.defer = true;
      script.src = `https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=${window.sitebehaviourTrackingSecret}`;
      document.head.appendChild(script);
      console.log('🔄 Reloaded SiteBehaviour script');
      
      // Reactivate after script loads
      setTimeout(() => {
        SiteBehaviourCommands.activate();
      }, 2000);
      
    }, 1000);
    
    console.log('✅ Reset complete - reactivating in 3 seconds...');
  }
};

// Make commands available globally
if (typeof window !== 'undefined') {
  window.SiteBehaviour = SiteBehaviourCommands;
  
  // Add helpful console message
  console.log('🎯 SITEBEHAVIOUR COMMANDS LOADED');
  console.log('================================');
  console.log('Available commands:');
  console.log('   SiteBehaviour.status()           - Check current status');
  console.log('   SiteBehaviour.activate()         - Force activation');
  console.log('   SiteBehaviour.testMetrics()      - Test all metrics');
  console.log('   SiteBehaviour.generateSampleData() - Generate test data');
  console.log('   SiteBehaviour.checkDashboard()   - Check dashboard connection');
  console.log('   SiteBehaviour.resetAndRestart()  - Reset and restart tracking');
  console.log('\n🚀 Run SiteBehaviour.activate() to start tracking all metrics!');
}

export default SiteBehaviourCommands;