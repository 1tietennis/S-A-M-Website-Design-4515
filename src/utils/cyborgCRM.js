// CyborgCRM integration for contact form submissions

/**
 * Send contact form data to CyborgCRM
 * @param {Object} contactData - The contact form data
 * @returns {Promise} - Resolution indicates success/failure
 */
export const sendToCyborgCRM = async (contactData) => {
  console.log('🚀 Sending contact data to CyborgCRM');
  
  // Calculate lead score
  const leadScore = calculateLeadScore(contactData);
  
  try {
    // Send to CyborgCRM's tracking system
    if (typeof window.CyborgCRM === 'function') {
      // Track the form submission as a conversion
      window.CyborgCRM('track', 'form_submission', {
        form_type: 'contact',
        service_interest: contactData.service,
        budget_range: contactData.budget,
        urgency: contactData.urgency,
        lead_score: leadScore,
        timestamp: new Date().toISOString(),
        custom_data: {
          company: contactData.company || 'Not provided',
          message: contactData.message || 'No message'
        }
      });
      
      // Track as a conversion with value
      window.CyborgCRM('track', 'conversion', {
        event: 'form_submission',
        value: getBudgetValue(contactData.budget),
        currency: 'USD',
        category: 'lead_generation',
        label: 'contact_form'
      });
      
      console.log('✅ CyborgCRM tracking successful');
      return true;
    } else {
      console.error('❌ CyborgCRM not available');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending to CyborgCRM:', error);
    return false;
  }
};

/**
 * Calculate a lead score based on form data
 * @param {Object} contactData - The contact form data
 * @returns {number} - Lead score from 0-100
 */
export const calculateLeadScore = (contactData) => {
  let score = 0;
  
  // Budget scoring
  if (contactData.budget) {
    switch (contactData.budget) {
      case '$5,000+': score += 30; break;
      case '$2,500-$5,000': score += 20; break;
      case '$1,000-$2,500': score += 10; break;
      default: score += 5;
    }
  }
  
  // Urgency scoring
  if (contactData.urgency === 'Immediate') score += 20;
  else if (contactData.urgency === 'Within 30 days') score += 15;
  else if (contactData.urgency === 'Within 90 days') score += 10;
  else score += 5;
  
  // Company provided
  if (contactData.company) score += 10;
  
  // Phone provided
  if (contactData.phone) score += 10;
  
  // Service type scoring
  if (contactData.service === 'PPC' || contactData.service === 'SEO') score += 15;
  
  // Message length scoring
  if (contactData.message && contactData.message.length > 100) score += 5;
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Convert budget range to estimated value
 * @param {string} budget - Budget range from form
 * @returns {number} - Estimated value
 */
export const getBudgetValue = (budget) => {
  switch (budget) {
    case '$5,000+': return 5000;
    case '$2,500-$5,000': return 2500;
    case '$1,000-$2,500': return 1000;
    default: return 500;
  }
};