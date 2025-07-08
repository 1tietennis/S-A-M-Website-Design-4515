// Meta Pixel Debugger - Advanced Debugging Utility

// Debug Mode Configuration
const DEBUG_MODE = true;
const VERBOSE_LOGGING = true;

/**
 * Initialize the Meta Pixel debugger
 * This enhances the standard fbq function with debugging capabilities
 */
export const initializePixelDebugger = () => {
  if (typeof window === 'undefined' || !DEBUG_MODE) return;
  
  console.log('🐞 Initializing Meta Pixel Debugger');
  
  // Store the original fbq function if it exists
  const originalFbq = window.fbq;
  
  if (typeof originalFbq !== 'function') {
    console.warn('⚠️ Meta Pixel Debugger: fbq function not found. Debugger cannot be initialized.');
    return false;
  }
  
  // Override fbq with our debugger version
  window.fbq = function(...args) {
    // Log the call in debug mode
    if (DEBUG_MODE) {
      const eventType = args[0] || 'unknown';
      const eventName = args[1] || 'unknown';
      const eventParams = args[2] || {};
      
      console.group(`🔍 Meta Pixel Event: ${eventType} - ${eventName}`);
      console.log('📅 Time:', new Date().toISOString());
      console.log('📝 Event Type:', eventType);
      console.log('📝 Event Name:', eventName);
      console.log('📝 Parameters:', eventParams);
      
      if (VERBOSE_LOGGING) {
        console.log('📍 Page:', window.location.href);
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('🔄 Full Arguments:', args);
      }
      
      console.groupEnd();
      
      // Store event in debug history
      storeEventInHistory(eventType, eventName, eventParams);
    }
    
    // Call the original fbq function
    return originalFbq.apply(this, args);
  };
  
  // Copy over any properties from the original fbq using Object.prototype.hasOwnProperty
  for (const key in originalFbq) {
    if (Object.prototype.hasOwnProperty.call(originalFbq, key)) {
      window.fbq[key] = originalFbq[key];
    }
  }
  
  // Initialize debug history
  if (!window._fbqDebugHistory) {
    window._fbqDebugHistory = [];
  }
  
  // Add window methods for debugging
  window.showPixelDebugHistory = showEventHistory;
  window.clearPixelDebugHistory = clearEventHistory;
  window.testPixelConnection = testPixelConnection;
  
  console.log('✅ Meta Pixel Debugger initialized successfully');
  return true;
};

/**
 * Store event in debug history
 */
function storeEventInHistory(eventType, eventName, eventParams) {
  if (typeof window === 'undefined' || !window._fbqDebugHistory) return;
  
  window._fbqDebugHistory.push({
    timestamp: new Date().toISOString(),
    eventType,
    eventName,
    eventParams,
    page: window.location.href
  });
  
  // Keep history at a reasonable size
  if (window._fbqDebugHistory.length > 100) {
    window._fbqDebugHistory.shift();
  }
}

/**
 * Display event history in console
 */
export function showEventHistory() {
  if (typeof window === 'undefined' || !window._fbqDebugHistory) {
    console.log('❌ No pixel debug history available');
    return;
  }
  
  console.group('📊 Meta Pixel Debug Event History');
  console.log(`Total Events: ${window._fbqDebugHistory.length}`);
  
  window._fbqDebugHistory.forEach((event, index) => {
    console.group(`Event #${index + 1}: ${event.eventType} - ${event.eventName}`);
    console.log('⏰ Time:', event.timestamp);
    console.log('📝 Type:', event.eventType);
    console.log('📝 Name:', event.eventName);
    console.log('📝 Parameters:', event.eventParams);
    console.log('📍 Page:', event.page);
    console.groupEnd();
  });
  
  console.groupEnd();
}

/**
 * Clear event history
 */
export function clearEventHistory() {
  if (typeof window === 'undefined') return;
  
  window._fbqDebugHistory = [];
  console.log('🧹 Meta Pixel debug history cleared');
}

/**
 * Test pixel connection
 */
export function testPixelConnection() {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
    console.error('❌ Meta Pixel (fbq) function not available');
    return false;
  }
  
  console.log('🧪 Testing Meta Pixel connection...');
  
  try {
    // Send a test event
    window.fbq('trackCustom', 'DebuggerTest', {
      test_time: new Date().toISOString(),
      source: 'pixel_debugger'
    });
    
    console.log('✅ Test event sent successfully');
    
    // Check fbq queue
    if (window.fbq.queue && Array.isArray(window.fbq.queue)) {
      console.log(`✅ Event queue exists with ${window.fbq.queue.length} entries`);
    } else {
      console.warn('⚠️ Event queue not found or not an array');
    }
    
    // Check for pixel ID
    let pixelId = 'Unknown';
    if (window.fbq.queue) {
      const initCalls = window.fbq.queue.filter(item => 
        Array.isArray(item) && item[0] === 'init'
      );
      
      if (initCalls.length > 0) {
        pixelId = initCalls[0][1];
      }
    }
    
    console.log(`📝 Pixel ID: ${pixelId}`);
    return true;
  } catch (error) {
    console.error('❌ Error testing pixel connection:', error);
    return false;
  }
}

// Auto-initialize when loaded in browser
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePixelDebugger);
  } else {
    // DOM already ready
    setTimeout(initializePixelDebugger, 500);
  }
}

export default {
  initializePixelDebugger,
  showEventHistory,
  clearEventHistory,
  testPixelConnection
};