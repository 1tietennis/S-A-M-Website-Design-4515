// SiteBehaviour Real-Time Monitoring System

export const initializeRealTimeMonitoring = () => {
  console.log('🚀 INITIALIZING SITEBEHAVIOUR REAL-TIME MONITORING');
  console.log('================================================');

  // Check if SiteBehaviour is properly loaded
  const checkSiteBehaviourReady = () => {
    const script = document.querySelector('#site-behaviour-script-v2');
    const secret = window.sitebehaviourTrackingSecret;
    const expectedSecret = '507f5743-d0f0-49db-a5f0-0d702b989128';
    
    if (!script) {
      console.error('❌ SiteBehaviour script not found - loading now...');
      loadSiteBehaviourScript();
      return false;
    }
    
    if (secret !== expectedSecret) {
      console.error('❌ SiteBehaviour secret not configured - setting now...');
      window.sitebehaviourTrackingSecret = expectedSecret;
    }
    
    return true;
  };

  // Load SiteBehaviour script if missing
  const loadSiteBehaviourScript = () => {
    const secret = '507f5743-d0f0-49db-a5f0-0d702b989128';
    window.sitebehaviourTrackingSecret = secret;
    
    const script = document.createElement('script');
    script.id = 'site-behaviour-script-v2';
    script.defer = true;
    script.src = `https://sitebehaviour-cdn.fra1.cdn.digitaloceanspaces.com/index.min.js?sitebehaviour-secret=${secret}`;
    
    script.onload = () => {
      console.log('✅ SiteBehaviour script loaded successfully');
      setTimeout(startRealTimeTracking, 2000);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load SiteBehaviour script');
    };
    
    document.head.appendChild(script);
  };

  // Start real-time tracking
  const startRealTimeTracking = () => {
    console.log('📊 STARTING REAL-TIME VISITOR TRACKING');
    console.log('======================================');

    // Initialize session
    initializeVisitorSession();
    
    // Track page view immediately
    trackRealTimePageView();
    
    // Start activity monitoring
    startActivityMonitoring();
    
    // Start engagement tracking
    startEngagementTracking();
    
    // Start form monitoring
    startFormMonitoring();
    
    // Start click tracking
    startClickTracking();
    
    // Send heartbeat every 30 seconds
    startHeartbeat();
    
    console.log('🎯 REAL-TIME MONITORING ACTIVE');
    console.log('All visitor activities are now being tracked in real-time!');
  };

  // Initialize visitor session
  const initializeVisitorSession = () => {
    let sessionId = sessionStorage.getItem('sb_session_id');
    
    if (!sessionId) {
      sessionId = `sb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sb_session_id', sessionId);
      sessionStorage.setItem('sb_session_start', Date.now().toString());
      sessionStorage.setItem('sb_page_count', '1');
      
      // Send session start event
      sendRealTimeEvent('session_start', {
        sessionId: sessionId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
        url: window.location.href
      });
    } else {
      // Increment page count for existing session
      const currentCount = parseInt(sessionStorage.getItem('sb_page_count') || '0');
      sessionStorage.setItem('sb_page_count', (currentCount + 1).toString());
    }
  };

  // Track real-time page view
  const trackRealTimePageView = () => {
    const pageData = {
      sessionId: sessionStorage.getItem('sb_session_id'),
      page: window.location.pathname,
      title: document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
      pageCount: parseInt(sessionStorage.getItem('sb_page_count') || '1'),
      loadTime: performance.now()
    };
    
    sendRealTimeEvent('page_view', pageData);
    console.log('📄 Real-time page view tracked:', pageData.page);
  };

  // Start activity monitoring
  const startActivityMonitoring = () => {
    let lastActivity = Date.now();
    let mouseMoveCount = 0;
    let scrollEvents = 0;
    
    // Mouse movement tracking
    const trackMouseActivity = (e) => {
      lastActivity = Date.now();
      mouseMoveCount++;
      
      // Send mouse activity every 50 movements
      if (mouseMoveCount % 50 === 0) {
        sendRealTimeEvent('mouse_activity', {
          sessionId: sessionStorage.getItem('sb_session_id'),
          movements: mouseMoveCount,
          lastPosition: { x: e.clientX, y: e.clientY },
          timestamp: Date.now()
        });
      }
    };
    
    // Scroll tracking
    const trackScrollActivity = () => {
      lastActivity = Date.now();
      scrollEvents++;
      
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
      
      sendRealTimeEvent('scroll_activity', {
        sessionId: sessionStorage.getItem('sb_session_id'),
        scrollPercent: scrollPercent,
        scrollTop: scrollTop,
        timestamp: Date.now()
      });
    };
    
    // Keyboard activity
    const trackKeyboardActivity = () => {
      lastActivity = Date.now();
      
      sendRealTimeEvent('keyboard_activity', {
        sessionId: sessionStorage.getItem('sb_session_id'),
        timestamp: Date.now()
      });
    };
    
    // Add event listeners
    document.addEventListener('mousemove', trackMouseActivity, { passive: true });
    document.addEventListener('scroll', trackScrollActivity, { passive: true });
    document.addEventListener('keydown', trackKeyboardActivity, { passive: true });
    
    // Check for inactivity every 60 seconds
    setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      
      if (timeSinceLastActivity > 60000) { // 1 minute of inactivity
        sendRealTimeEvent('user_inactive', {
          sessionId: sessionStorage.getItem('sb_session_id'),
          inactiveTime: timeSinceLastActivity,
          timestamp: Date.now()
        });
      }
    }, 60000);
  };

  // Start engagement tracking
  const startEngagementTracking = () => {
    const startTime = Date.now();
    let maxScrollDepth = 0;
    let clickCount = 0;
    
    // Track time on page every 30 seconds
    setInterval(() => {
      const timeOnPage = Date.now() - startTime;
      
      sendRealTimeEvent('engagement_update', {
        sessionId: sessionStorage.getItem('sb_session_id'),
        timeOnPage: timeOnPage,
        maxScrollDepth: maxScrollDepth,
        clickCount: clickCount,
        timestamp: Date.now()
      });
    }, 30000);
    
    // Track scroll depth
    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Send milestone events
        if (maxScrollDepth >= 25 && maxScrollDepth % 25 === 0) {
          sendRealTimeEvent('scroll_milestone', {
            sessionId: sessionStorage.getItem('sb_session_id'),
            milestone: maxScrollDepth,
            timestamp: Date.now()
          });
        }
      }
    };
    
    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    
    // Track clicks
    document.addEventListener('click', (e) => {
      clickCount++;
      
      sendRealTimeEvent('click_event', {
        sessionId: sessionStorage.getItem('sb_session_id'),
        element: e.target.tagName,
        elementId: e.target.id,
        elementClass: e.target.className,
        position: { x: e.clientX, y: e.clientY },
        timestamp: Date.now()
      });
    });
  };

  // Start form monitoring
  const startFormMonitoring = () => {
    const monitorForms = () => {
      const forms = document.querySelectorAll('form');
      
      forms.forEach((form, index) => {
        const formId = form.id || `form_${index}`;
        let formStarted = false;
        
        // Monitor form fields
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
          // Track form start on first field focus
          field.addEventListener('focus', () => {
            if (!formStarted) {
              formStarted = true;
              
              sendRealTimeEvent('form_started', {
                sessionId: sessionStorage.getItem('sb_session_id'),
                formId: formId,
                fieldCount: fields.length,
                timestamp: Date.now()
              });
            }
          }, { once: true });
          
          // Track field interactions
          field.addEventListener('input', () => {
            sendRealTimeEvent('form_field_interaction', {
              sessionId: sessionStorage.getItem('sb_session_id'),
              formId: formId,
              fieldName: field.name || field.id,
              fieldType: field.type,
              hasValue: !!field.value,
              timestamp: Date.now()
            });
          });
        });
        
        // Track form submission
        form.addEventListener('submit', (e) => {
          sendRealTimeEvent('form_submitted', {
            sessionId: sessionStorage.getItem('sb_session_id'),
            formId: formId,
            timestamp: Date.now()
          });
        });
      });
    };
    
    // Monitor existing forms
    monitorForms();
    
    // Watch for new forms
    const observer = new MutationObserver(() => {
      monitorForms();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // Start click tracking
  const startClickTracking = () => {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [onclick]');
      
      if (target) {
        const clickData = {
          sessionId: sessionStorage.getItem('sb_session_id'),
          element: target.tagName,
          text: target.textContent?.trim().substring(0, 100),
          href: target.href || null,
          id: target.id || null,
          className: target.className || null,
          isExternal: target.href && target.hostname !== window.location.hostname,
          position: { x: e.clientX, y: e.clientY },
          timestamp: Date.now()
        };
        
        sendRealTimeEvent('click_tracked', clickData);
      }
    });
  };

  // Send heartbeat to keep session alive
  const startHeartbeat = () => {
    setInterval(() => {
      sendRealTimeEvent('heartbeat', {
        sessionId: sessionStorage.getItem('sb_session_id'),
        timestamp: Date.now(),
        url: window.location.href
      });
    }, 30000); // Every 30 seconds
  };

  // Send real-time event to SiteBehaviour
  const sendRealTimeEvent = (eventType, data) => {
    try {
      // Create custom event for SiteBehaviour
      const customEvent = new CustomEvent(`sitebehaviour-${eventType}`, {
        detail: data
      });
      
      document.dispatchEvent(customEvent);
      
      // Also try to send directly if SiteBehaviour API is available
      if (window.siteBehaviour && typeof window.siteBehaviour.track === 'function') {
        window.siteBehaviour.track(eventType, data);
      }
      
      console.log(`📊 Real-time event sent: ${eventType}`, data);
      
    } catch (error) {
      console.error('❌ Failed to send real-time event:', error);
    }
  };

  // Check and initialize
  if (checkSiteBehaviourReady()) {
    startRealTimeTracking();
  } else {
    // Wait for script to load
    setTimeout(() => {
      if (checkSiteBehaviourReady()) {
        startRealTimeTracking();
      }
    }, 3000);
  }
};

// Auto-initialize when loaded
if (typeof window !== 'undefined') {
  // Make function globally available
  window.initializeSiteBehaviourRealTime = initializeRealTimeMonitoring;
  
  // Auto-start real-time monitoring
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRealTimeMonitoring);
  } else {
    initializeRealTimeMonitoring();
  }
}

export default { initializeRealTimeMonitoring };