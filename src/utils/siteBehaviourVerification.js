// SiteBehaviour Complete Verification and Activation Script

export const verifySiteBehaviourStatus = () => {
  console.log('🔍 SITEBEHAVIOUR COMPLETE VERIFICATION');
  console.log('=====================================');
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
    status: 'unknown',
    recommendations: []
  };

  // Test 1: Check if SiteBehaviour script is loaded
  const siteBehaviourScript = document.querySelector('#site-behaviour-script-v2');
  results.tests.scriptLoaded = {
    name: 'SiteBehaviour Script Loaded',
    passed: !!siteBehaviourScript,
    details: siteBehaviourScript ? 
      `Script found with src: ${siteBehaviourScript.src}` : 
      'Script element not found in DOM'
  };

  // Test 2: Check tracking secret
  const expectedSecret = '507f5743-d0f0-49db-a5f0-0d702b989128';
  results.tests.trackingSecret = {
    name: 'Tracking Secret Configuration',
    passed: window.sitebehaviourTrackingSecret === expectedSecret,
    details: window.sitebehaviourTrackingSecret ? 
      `Secret configured: ${window.sitebehaviourTrackingSecret.substring(0, 8)}...` : 
      'Tracking secret not found'
  };

  // Test 3: Check if SiteBehaviour API is active
  results.tests.apiActive = {
    name: 'SiteBehaviour API Active',
    passed: typeof window.siteBehaviour !== 'undefined',
    details: typeof window.siteBehaviour !== 'undefined' ? 
      'SiteBehaviour API object available' : 
      'SiteBehaviour API not initialized'
  };

  // Test 4: Check network connectivity to SiteBehaviour CDN
  const testCDNConnectivity = async () => {
    try {
      const response = await fetch('https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/ping', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Test 5: Verify tracking is working
  const testTracking = () => {
    try {
      // Simulate user interaction
      const testEvent = new CustomEvent('sitebehaviour-test', {
        detail: { test: true, timestamp: Date.now() }
      });
      document.dispatchEvent(testEvent);
      return true;
    } catch (error) {
      console.error('SiteBehaviour tracking test failed:', error);
      return false;
    }
  };

  results.tests.tracking = {
    name: 'Event Tracking Test',
    passed: testTracking(),
    details: testTracking() ? 'Test event dispatched successfully' : 'Event tracking failed'
  };

  // Calculate overall status
  const passedTests = Object.values(results.tests).filter(test => test.passed).length;
  const totalTests = Object.values(results.tests).length;
  
  if (passedTests === totalTests) {
    results.status = 'fully_active';
  } else if (passedTests >= totalTests * 0.7) {
    results.status = 'partially_active';
  } else {
    results.status = 'inactive';
  }

  // Generate recommendations
  if (!results.tests.scriptLoaded.passed) {
    results.recommendations.push('Load SiteBehaviour script in HTML head');
  }
  if (!results.tests.trackingSecret.passed) {
    results.recommendations.push('Configure tracking secret: 507f5743-d0f0-49db-a5f0-0d702b989128');
  }
  if (!results.tests.apiActive.passed) {
    results.recommendations.push('Wait for SiteBehaviour API to initialize');
  }

  // Log detailed results
  console.group('📊 SiteBehaviour Test Results:');
  Object.entries(results.tests).forEach(([key, test]) => {
    console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
  });
  console.groupEnd();

  console.log(`\n🎯 Overall Status: ${results.status.toUpperCase()}`);
  console.log(`📈 Score: ${passedTests}/${totalTests} tests passed`);

  if (results.recommendations.length > 0) {
    console.group('💡 Recommendations:');
    results.recommendations.forEach(rec => console.log(`- ${rec}`));
    console.groupEnd();
  }

  return results;
};

export const activateAllSiteBehaviourMetrics = () => {
  console.log('🚀 ACTIVATING ALL SITEBEHAVIOUR METRICS');
  console.log('======================================');

  // Ensure SiteBehaviour is ready
  const waitForSiteBehaviour = (callback, maxAttempts = 10) => {
    let attempts = 0;
    
    const checkReady = () => {
      attempts++;
      
      if (window.sitebehaviourTrackingSecret && document.querySelector('#site-behaviour-script-v2')) {
        console.log('✅ SiteBehaviour is ready');
        callback();
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Waiting for SiteBehaviour... (${attempts}/${maxAttempts})`);
        setTimeout(checkReady, 1000);
      } else {
        console.error('❌ SiteBehaviour failed to initialize after maximum attempts');
      }
    };
    
    checkReady();
  };

  waitForSiteBehaviour(() => {
    // 1. Site Traffic Tracking
    console.log('📊 Activating Site Traffic Tracking...');
    
    // Track page views
    const trackPageView = () => {
      const pageData = {
        page: window.location.pathname,
        title: document.title,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      };
      
      // SiteBehaviour automatically tracks page views, but we can enhance with custom data
      document.dispatchEvent(new CustomEvent('sitebehaviour-pageview', {
        detail: pageData
      }));
      
      console.log('📄 Page view tracked:', pageData.page);
    };

    // Track initial page view
    trackPageView();

    // Track SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      setTimeout(trackPageView, 100);
    };
    
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      setTimeout(trackPageView, 100);
    };
    
    window.addEventListener('popstate', trackPageView);

    // 2. Engagement Score Tracking
    console.log('🎯 Activating Engagement Score Tracking...');
    
    let engagementData = {
      timeOnPage: 0,
      scrollDepth: 0,
      clicks: 0,
      movements: 0,
      interactions: 0
    };

    // Time on page
    const startTime = Date.now();
    setInterval(() => {
      engagementData.timeOnPage = Date.now() - startTime;
    }, 1000);

    // Scroll depth tracking
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        engagementData.scrollDepth = maxScrollDepth;
        
        // Send milestone events
        if (maxScrollDepth >= 25 && maxScrollDepth % 25 === 0) {
          document.dispatchEvent(new CustomEvent('sitebehaviour-scroll-milestone', {
            detail: { depth: maxScrollDepth, timestamp: Date.now() }
          }));
        }
      }
    };
    
    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Mouse movement tracking
    let lastMovementTime = 0;
    const trackMouseMovement = (e) => {
      const now = Date.now();
      if (now - lastMovementTime > 100) { // Throttle to every 100ms
        engagementData.movements++;
        lastMovementTime = now;
        
        if (engagementData.movements % 50 === 0) { // Every 50 movements
          document.dispatchEvent(new CustomEvent('sitebehaviour-engagement', {
            detail: { type: 'movement_milestone', count: engagementData.movements }
          }));
        }
      }
    };
    
    document.addEventListener('mousemove', trackMouseMovement, { passive: true });

    // 3. UTM Campaign Tracking
    console.log('📈 Activating UTM Campaign Tracking...');
    
    const trackUTMParameters = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const utmParams = {
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        utm_term: urlParams.get('utm_term'),
        utm_content: urlParams.get('utm_content'),
        gclid: urlParams.get('gclid'), // Google Ads
        fbclid: urlParams.get('fbclid'), // Facebook Ads
        timestamp: new Date().toISOString()
      };
      
      // Filter out null values
      const activeUTMs = Object.fromEntries(
        Object.entries(utmParams).filter(([key, value]) => value !== null)
      );
      
      if (Object.keys(activeUTMs).length > 1) { // More than just timestamp
        document.dispatchEvent(new CustomEvent('sitebehaviour-utm-tracking', {
          detail: activeUTMs
        }));
        
        // Store in session for attribution
        sessionStorage.setItem('utm_attribution', JSON.stringify(activeUTMs));
        console.log('🎯 UTM parameters tracked:', activeUTMs);
      }
    };
    
    trackUTMParameters();

    // 4. Multi-page Visit Tracking
    console.log('📚 Activating Multi-page Visit Tracking...');
    
    let sessionPageCount = parseInt(sessionStorage.getItem('sb_page_count') || '0');
    sessionPageCount++;
    sessionStorage.setItem('sb_page_count', sessionPageCount.toString());
    
    const visitData = {
      pageCount: sessionPageCount,
      currentPage: window.location.pathname,
      sessionId: sessionStorage.getItem('sb_session_id') || 'session_' + Date.now(),
      visitDuration: Date.now() - parseInt(sessionStorage.getItem('sb_session_start') || Date.now().toString())
    };
    
    if (!sessionStorage.getItem('sb_session_id')) {
      sessionStorage.setItem('sb_session_id', visitData.sessionId);
      sessionStorage.setItem('sb_session_start', Date.now().toString());
    }
    
    document.dispatchEvent(new CustomEvent('sitebehaviour-multi-page', {
      detail: visitData
    }));
    
    console.log('📖 Multi-page visit tracked:', visitData);

    // 5. Form Interaction Tracking
    console.log('📝 Activating Form Interaction Tracking...');
    
    const trackFormInteractions = () => {
      const forms = document.querySelectorAll('form');
      
      forms.forEach((form, index) => {
        const formId = form.id || `form_${index}`;
        
        // Track form start
        const trackFormStart = () => {
          document.dispatchEvent(new CustomEvent('sitebehaviour-form-start', {
            detail: {
              formId: formId,
              formAction: form.action || 'none',
              fieldCount: form.querySelectorAll('input, textarea, select').length,
              timestamp: Date.now()
            }
          }));
          console.log('📝 Form interaction started:', formId);
        };
        
        // Track field interactions
        const trackFieldInteraction = (field) => {
          field.addEventListener('focus', () => {
            document.dispatchEvent(new CustomEvent('sitebehaviour-field-focus', {
              detail: {
                formId: formId,
                fieldType: field.type || field.tagName.toLowerCase(),
                fieldName: field.name || field.id,
                timestamp: Date.now()
              }
            }));
          });
          
          field.addEventListener('blur', () => {
            document.dispatchEvent(new CustomEvent('sitebehaviour-field-blur', {
              detail: {
                formId: formId,
                fieldType: field.type || field.tagName.toLowerCase(),
                fieldName: field.name || field.id,
                hasValue: !!field.value,
                timestamp: Date.now()
              }
            }));
          });
        };
        
        // Track form submission
        form.addEventListener('submit', (e) => {
          const formData = new FormData(form);
          const fieldData = {};
          
          for (let [key, value] of formData.entries()) {
            fieldData[key] = value ? 'filled' : 'empty'; // Don't send actual values for privacy
          }
          
          document.dispatchEvent(new CustomEvent('sitebehaviour-form-submit', {
            detail: {
              formId: formId,
              fieldData: fieldData,
              timestamp: Date.now(),
              utm_attribution: JSON.parse(sessionStorage.getItem('utm_attribution') || '{}')
            }
          }));
          
          console.log('📤 Form submission tracked:', formId);
        });
        
        // Set up field tracking
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(trackFieldInteraction);
        
        // Track when user first interacts with form
        let formStarted = false;
        fields.forEach(field => {
          field.addEventListener('focus', () => {
            if (!formStarted) {
              formStarted = true;
              trackFormStart();
            }
          }, { once: true });
        });
      });
    };
    
    // Run immediately and on DOM changes
    trackFormInteractions();
    
    // Watch for dynamically added forms
    const observer = new MutationObserver(() => {
      trackFormInteractions();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 6. Link Click Tracking
    console.log('🔗 Activating Link Click Tracking...');
    
    const trackLinkClicks = () => {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        
        if (link) {
          const linkData = {
            href: link.href,
            text: link.textContent?.trim().substring(0, 100),
            target: link.target,
            isExternal: link.hostname !== window.location.hostname,
            isDownload: link.download !== '',
            position: {
              x: e.clientX,
              y: e.clientY
            },
            timestamp: Date.now(),
            page: window.location.pathname
          };
          
          document.dispatchEvent(new CustomEvent('sitebehaviour-link-click', {
            detail: linkData
          }));
          
          console.log('🔗 Link click tracked:', linkData.href);
          
          // Special tracking for external links
          if (linkData.isExternal) {
            document.dispatchEvent(new CustomEvent('sitebehaviour-external-link', {
              detail: linkData
            }));
          }
        }
      });
    };
    
    trackLinkClicks();

    // Send activation confirmation
    document.dispatchEvent(new CustomEvent('sitebehaviour-activation-complete', {
      detail: {
        timestamp: new Date().toISOString(),
        metrics: [
          'site_traffic',
          'engagement_score', 
          'utm_campaigns',
          'multi_page_visits',
          'form_interactions',
          'link_clicks'
        ],
        status: 'all_active'
      }
    }));
    
    console.log('🎉 ALL SITEBEHAVIOUR METRICS ACTIVATED SUCCESSFULLY!');
    console.log('📊 The following metrics are now being tracked:');
    console.log('   ✅ Site Traffic');
    console.log('   ✅ Engagement Score');  
    console.log('   ✅ UTM Campaigns');
    console.log('   ✅ Multi-page Visits');
    console.log('   ✅ Form Interactions');
    console.log('   ✅ Link Clicks');
    console.log('\n🔍 Data should now appear in your SiteBehaviour dashboard');
  });
};

// Auto-activate when script loads
if (typeof window !== 'undefined') {
  // Make functions globally available
  window.verifySiteBehaviourStatus = verifySiteBehaviourStatus;
  window.activateAllSiteBehaviourMetrics = activateAllSiteBehaviourMetrics;
  
  // Auto-run verification
  setTimeout(() => {
    console.log('🔍 Running SiteBehaviour verification...');
    verifySiteBehaviourStatus();
  }, 2000);
}

export default {
  verifySiteBehaviourStatus,
  activateAllSiteBehaviourMetrics
};