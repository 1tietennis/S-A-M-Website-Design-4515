// Advanced Tracking Troubleshooter - Integrated into main application

export const TrackingTroubleshooter = {
  // Initialize comprehensive tracking diagnostics
  initialize() {
    console.log('🔧 Initializing Tracking Troubleshooter...');
    this.setupErrorMonitoring();
    this.monitorTrackingHealth();
    return this;
  },

  // Set up comprehensive error monitoring
  setupErrorMonitoring() {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Override console.error to catch tracking errors
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('gtag') || message.includes('fbq') || message.includes('sitebehaviour') || message.includes('tracer')) {
        this.logTrackingIssue('ERROR', message);
      }
      originalError.apply(console, args);
    };

    // Override console.warn for tracking warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('tracking') || message.includes('analytics') || message.includes('blocked')) {
        this.logTrackingIssue('WARNING', message);
      }
      originalWarn.apply(console, args);
    };

    // Catch uncaught errors that might affect tracking
    window.addEventListener('error', (event) => {
      if (event.filename && (
        event.filename.includes('gtag') ||
        event.filename.includes('fbevents') ||
        event.filename.includes('sitebehaviour') ||
        event.filename.includes('tracer')
      )) {
        this.logTrackingIssue('SCRIPT_ERROR', `${event.message} in ${event.filename}`);
      }
    });

    // Monitor for blocked resources
    this.monitorBlockedResources();
  },

  // Monitor for blocked tracking resources
  monitorBlockedResources() {
    const trackingResources = [
      'googletagmanager.com',
      'facebook.net',
      'sitebehaviour-cdn',
      'visitortracking.com'
    ];

    // Check if scripts loaded successfully
    setTimeout(() => {
      trackingResources.forEach(resource => {
        const scripts = document.querySelectorAll(`script[src*="${resource}"]`);
        scripts.forEach(script => {
          if (!script.onload && !script.readyState) {
            this.logTrackingIssue('BLOCKED_RESOURCE', `${resource} may be blocked by ad blocker or network`);
          }
        });
      });
    }, 5000);
  },

  // Monitor overall tracking health
  monitorTrackingHealth() {
    setInterval(() => {
      const healthStatus = this.getTrackingHealthStatus();
      if (healthStatus.issues.length > 0) {
        console.group('🔧 Tracking Health Issues Detected');
        healthStatus.issues.forEach(issue => {
          console.warn(`⚠️ ${issue.platform}: ${issue.issue}`);
        });
        console.groupEnd();
      }
    }, 30000); // Check every 30 seconds
  },

  // Get comprehensive tracking health status
  getTrackingHealthStatus() {
    const status = {
      platforms: {
        ga4: this.checkGA4Health(),
        metaPixel: this.checkMetaPixelHealth(),
        siteBehaviour: this.checkSiteBehaviourHealth(),
        visitorTracking: this.checkVisitorTrackingHealth()
      },
      issues: [],
      score: 0
    };

    // Calculate issues and score
    Object.entries(status.platforms).forEach(([platform, health]) => {
      if (!health.working) {
        status.issues.push({
          platform: platform,
          issue: health.issue || 'Not working properly',
          solution: health.solution || 'Check implementation'
        });
      } else {
        status.score += 25; // Each platform worth 25 points
      }
    });

    return status;
  },

  // Check Google Analytics 4 health
  checkGA4Health() {
    const health = {
      working: false,
      issue: null,
      solution: null,
      details: {}
    };

    // Check if gtag function exists
    if (typeof window.gtag !== 'function') {
      health.issue = 'gtag function not available';
      health.solution = 'Check if Google Analytics script is loaded';
      return health;
    }

    // Check if dataLayer exists
    if (!window.dataLayer || !Array.isArray(window.dataLayer)) {
      health.issue = 'dataLayer not properly initialized';
      health.solution = 'Ensure dataLayer is created before gtag script';
      return health;
    }

    // Check if measurement ID is configured
    const hasConfig = window.dataLayer.some(item => 
      Array.isArray(item) && item[0] === 'config' && item[1] === 'G-CTDQQ8XMKC'
    );

    if (!hasConfig) {
      health.issue = 'Measurement ID not configured';
      health.solution = 'Call gtag("config", "G-CTDQQ8XMKC")';
      return health;
    }

    health.working = true;
    health.details = {
      gtagAvailable: true,
      dataLayerEntries: window.dataLayer.length,
      measurementIdConfigured: true
    };

    return health;
  },

  // Check Meta Pixel health
  checkMetaPixelHealth() {
    const health = {
      working: false,
      issue: null,
      solution: null,
      details: {}
    };

    // Check if fbq function exists
    if (typeof window.fbq !== 'function') {
      health.issue = 'fbq function not available';
      health.solution = 'Check if Meta Pixel script is loaded and not blocked';
      return health;
    }

    // Check if pixel is initialized
    if (!window._fbq || !window._fbq.loaded) {
      health.issue = 'Meta Pixel not properly initialized';
      health.solution = 'Ensure fbq("init", "PIXEL_ID") is called';
      return health;
    }

    // Check event queue
    const queueLength = window.fbq.queue ? window.fbq.queue.length : 0;

    health.working = true;
    health.details = {
      fbqAvailable: true,
      pixelLoaded: window._fbq.loaded,
      queueLength: queueLength
    };

    return health;
  },

  // Check SiteBehaviour health
  checkSiteBehaviourHealth() {
    const health = {
      working: false,
      issue: null,
      solution: null,
      details: {}
    };

    // Check if secret is configured
    if (!window.sitebehaviourTrackingSecret) {
      health.issue = 'Tracking secret not configured';
      health.solution = 'Set window.sitebehaviourTrackingSecret variable';
      return health;
    }

    // Check if secret is correct
    const expectedSecret = '507f5743-d0f0-49db-a5f0-0d702b989128';
    if (window.sitebehaviourTrackingSecret !== expectedSecret) {
      health.issue = 'Incorrect tracking secret';
      health.solution = 'Use the correct tracking secret key';
      return health;
    }

    // Check if script element exists
    const scriptElement = document.querySelector('#site-behaviour-script-v2');
    if (!scriptElement) {
      health.issue = 'SiteBehaviour script not loaded';
      health.solution = 'Check if script element is created and added to DOM';
      return health;
    }

    health.working = true;
    health.details = {
      secretConfigured: true,
      secretCorrect: true,
      scriptElementExists: true,
      scriptSrc: scriptElement.src
    };

    return health;
  },

  // Check Visitor Tracking health
  checkVisitorTrackingHealth() {
    const health = {
      working: false,
      issue: null,
      solution: null,
      details: {}
    };

    // Check if init_tracer function exists
    if (typeof window.init_tracer !== 'function') {
      health.issue = 'init_tracer function not available';
      health.solution = 'Check if Visitor Tracking script is loaded';
      return health;
    }

    // Check if Tracer class exists
    if (typeof window.Tracer === 'undefined') {
      health.issue = 'Tracer class not available';
      health.solution = 'Ensure Visitor Tracking script loaded completely';
      return health;
    }

    health.working = true;
    health.details = {
      initTracerAvailable: true,
      tracerClassAvailable: true
    };

    return health;
  },

  // Log tracking issues with context
  logTrackingIssue(type, message) {
    const timestamp = new Date().toISOString();
    const issue = {
      type: type,
      message: message,
      timestamp: timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.group(`🔧 Tracking Issue Detected - ${type}`);
    console.error(message);
    console.log('Context:', issue);
    console.groupEnd();

    // Store issue for later analysis
    if (!window.trackingIssues) {
      window.trackingIssues = [];
    }
    window.trackingIssues.push(issue);
  },

  // Run comprehensive diagnostic
  runDiagnostic() {
    console.group('🔧 COMPREHENSIVE TRACKING DIAGNOSTIC');
    console.log('=====================================');

    const healthStatus = this.getTrackingHealthStatus();
    
    console.log(`📊 Overall Health Score: ${healthStatus.score}/100`);
    console.log(`🎯 Working Platforms: ${Object.values(healthStatus.platforms).filter(p => p.working).length}/4`);

    // Log platform details
    Object.entries(healthStatus.platforms).forEach(([platform, health]) => {
      console.group(`${health.working ? '✅' : '❌'} ${platform.toUpperCase()}`);
      if (health.working) {
        console.log('Status: Working correctly');
        console.log('Details:', health.details);
      } else {
        console.error('Issue:', health.issue);
        console.log('Solution:', health.solution);
      }
      console.groupEnd();
    });

    // Log issues summary
    if (healthStatus.issues.length > 0) {
      console.group('⚠️ ISSUES REQUIRING ATTENTION');
      healthStatus.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.platform}: ${issue.issue}`);
        console.log(`   Solution: ${issue.solution}`);
      });
      console.groupEnd();
    } else {
      console.log('🎉 No issues detected - all tracking systems operational!');
    }

    console.groupEnd();
    return healthStatus;
  },

  // Quick health check
  quickCheck() {
    const platforms = {
      'GA4': typeof window.gtag === 'function',
      'Meta Pixel': typeof window.fbq === 'function',
      'SiteBehaviour': !!window.sitebehaviourTrackingSecret,
      'Visitor Tracking': typeof window.init_tracer === 'function'
    };

    console.log('🔍 Quick Tracking Health Check');
    console.log('==============================');
    Object.entries(platforms).forEach(([platform, working]) => {
      console.log(`${working ? '✅' : '❌'} ${platform}: ${working ? 'Working' : 'Issues'}`);
    });

    const workingCount = Object.values(platforms).filter(Boolean).length;
    console.log(`📊 Status: ${workingCount}/4 platforms operational`);

    return platforms;
  },

  // Test all tracking platforms
  testAllPlatforms() {
    console.log('🧪 Testing all tracking platforms...');

    // Test GA4
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'troubleshooter_test', {
          event_category: 'testing',
          event_label: 'platform_verification'
        });
        console.log('✅ GA4: Test event sent');
      } catch (error) {
        console.error('❌ GA4: Test failed -', error.message);
      }
    }

    // Test Meta Pixel
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('trackCustom', 'TroubleshooterTest', {
          test_type: 'platform_verification'
        });
        console.log('✅ Meta Pixel: Test event sent');
      } catch (error) {
        console.error('❌ Meta Pixel: Test failed -', error.message);
      }
    }

    // Test SiteBehaviour
    if (window.sitebehaviourTrackingSecret) {
      try {
        document.dispatchEvent(new CustomEvent('sitebehaviour-troubleshooter-test', {
          detail: { test: 'platform_verification' }
        }));
        console.log('✅ SiteBehaviour: Test event sent');
      } catch (error) {
        console.error('❌ SiteBehaviour: Test failed -', error.message);
      }
    }

    // Test Visitor Tracking
    if (typeof window.init_tracer === 'function') {
      try {
        window.init_tracer();
        console.log('✅ Visitor Tracking: Initialized successfully');
      } catch (error) {
        console.error('❌ Visitor Tracking: Test failed -', error.message);
      }
    }

    console.log('🎯 Platform testing completed');
  }
};

// Make troubleshooter globally available
if (typeof window !== 'undefined') {
  window.TrackingTroubleshooter = TrackingTroubleshooter;
  
  // Auto-initialize
  TrackingTroubleshooter.initialize();
  
  // Add convenience methods to window
  window.checkTracking = () => TrackingTroubleshooter.quickCheck();
  window.diagnoseTracking = () => TrackingTroubleshooter.runDiagnostic();
  window.testTracking = () => TrackingTroubleshooter.testAllPlatforms();
  
  console.log('🔧 Tracking Troubleshooter ready!');
  console.log('📊 Available commands:');
  console.log('  • window.checkTracking() - Quick health check');
  console.log('  • window.diagnoseTracking() - Full diagnostic');
  console.log('  • window.testTracking() - Test all platforms');
}

export default TrackingTroubleshooter;