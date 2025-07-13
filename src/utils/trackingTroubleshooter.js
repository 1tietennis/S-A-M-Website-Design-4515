// Advanced Tracking Troubleshooter - Integrated into main application
const TrackingTroubleshooter = {
  // Initialize comprehensive tracking diagnostics
  initialize() {
    console.log('🔧 Initializing Tracking Troubleshooter...');
    this.setupErrorMonitoring();
    this.monitorTrackingHealth();
    return this;
  },

  // Test all platforms including CyborgCRM
  testAllPlatforms() {
    console.log('🧪 Testing all tracking platforms...');

    // Test CyborgCRM
    if (typeof window.CyborgCRM === 'function') {
      try {
        window.CyborgCRM('track', 'test_event', {
          test_type: 'platform_verification',
          timestamp: new Date().toISOString()
        });
        console.log('✅ CyborgCRM test event sent successfully');
      } catch (error) {
        console.error('❌ CyborgCRM test failed:', error.message);
      }
    }

    // Test Google Analytics 4
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'test_event', {
          event_category: 'testing',
          event_label: 'troubleshooter_test'
        });
        console.log('✅ GA4 test event sent successfully');
      } catch (error) {
        console.error('❌ GA4 test failed:', error.message);
      }
    }

    // Test Meta Pixel
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('trackCustom', 'TroubleshooterTest', {
          test_type: 'platform_verification'
        });
        console.log('✅ Meta Pixel test event sent successfully');
      } catch (error) {
        console.error('❌ Meta Pixel test failed:', error.message);
      }
    }

    // Test SiteBehaviour
    if (window.sitebehaviourTrackingSecret) {
      try {
        document.dispatchEvent(new CustomEvent('sitebehaviour-test', {
          detail: {
            test: true,
            timestamp: Date.now()
          }
        }));
        console.log('✅ SiteBehaviour test event sent successfully');
      } catch (error) {
        console.error('❌ SiteBehaviour test failed:', error.message);
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
  console.log(' • window.checkTracking() - Quick health check');
  console.log(' • window.diagnoseTracking() - Full diagnostic');
  console.log(' • window.testTracking() - Test all platforms');
}

export default TrackingTroubleshooter;