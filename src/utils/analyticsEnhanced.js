// Add these new functions for enhanced form tracking
export const trackEnhancedEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined') {
    // Track with GA4
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString()
      });
    }

    // Track with CyborgCRM
    if (typeof window.CyborgCRM === 'function') {
      window.CyborgCRM('track', eventName, {
        ...parameters,
        timestamp: new Date().toISOString()
      });
    }

    // Track with Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, parameters);
    }

    // Track with SiteBehaviour
    document.dispatchEvent(new CustomEvent(`sitebehaviour-${eventName}`, {
      detail: {
        ...parameters,
        timestamp: new Date().toISOString()
      }
    }));

    console.log(`📊 Enhanced event tracked: ${eventName}`, parameters);
  }
};

export const trackEnhancedFormSubmission = (formName, formData = {}) => {
  const eventData = {
    form_name: formName,
    ...formData,
    timestamp: new Date().toISOString()
  };

  // Track as enhanced event
  trackEnhancedEvent('form_submission', eventData);

  // Track as conversion
  if (typeof window.CyborgCRM === 'function') {
    window.CyborgCRM('track', 'conversion', {
      event: 'form_submission',
      value: formData.estimated_value || 249.99, // Use actual value for marketing forms
      currency: 'USD',
      ...eventData
    });
  }

  // Track with Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: formName,
      content_category: 'form_submission',
      value: formData.estimated_value || 249.99,
      currency: 'USD'
    });
  }

  // Track with Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: formData.estimated_value || 249.99,
      form_name: formName
    });
  }

  console.log(`📝 Enhanced form submission tracked: ${formName}`, formData);
};