import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { 
  trackEnhancedPageView, 
  trackEnhancedEvent, 
  trackEnhancedFormSubmission,
  trackEnhancedConversion 
} from '../utils/analyticsEnhanced';

const { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiClock, FiTarget } = FiIcons;

const Contact = () => {
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
    urgency: 'standard'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Enhanced page tracking with Meta Pixel
  useEffect(() => {
    trackEnhancedPageView('/contact', 'Contact - Secret Agent Digital Marketing');
    
    // Meta Pixel specific tracking for contact page
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'ViewContent', {
        content_type: 'contact_page',
        content_name: 'Contact Form Page',
        value: 50.00,
        currency: 'USD'
      });
    }

    trackEnhancedEvent('page_engagement', {
      action: 'page_load',
      page: '/contact'
    });
  }, []);

  // Track conversion when form is submitted
  useEffect(() => {
    if (isSubmitted) {
      // Enhanced conversion tracking across all platforms
      trackEnhancedConversion('contact_form_submission', 99.99, 'USD', {
        service_interest: formData.service,
        budget_range: formData.budget,
        urgency_level: formData.urgency,
        lead_quality: 'high'
      });

      // Meta Pixel lead tracking
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: formData.service || 'Digital Marketing Service',
          content_category: 'lead_generation',
          value: 99.99,
          currency: 'USD',
          predicted_ltv: 2500.00
        });

        window.fbq('trackCustom', 'QualifiedLead', {
          lead_source: 'contact_form',
          service_interest: formData.service,
          budget_range: formData.budget,
          urgency: formData.urgency,
          company_name: formData.company,
          form_completion_time: Date.now()
        });
      }
    }
  }, [isSubmitted, formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Enhanced form field tracking
    trackEnhancedEvent('form_interaction', {
      field: name,
      value: name === 'email' ? 'email_entered' : (value ? 'filled' : 'cleared'),
      page: '/contact',
      form_name: 'contact_form'
    });

    // Meta Pixel form interaction tracking
    if (typeof window.fbq !== 'undefined') {
      window.fbq('trackCustom', 'FormFieldInteraction', {
        field_name: name,
        field_type: e.target.type,
        has_value: !!value,
        form_name: 'contact_form',
        page_url: window.location.href
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track form submission attempt with enhanced analytics
    trackEnhancedEvent('form_submit_attempt', {
      form: 'contact',
      page: '/contact',
      urgency: formData.urgency,
      service: formData.service,
      budget: formData.budget,
      fields_completed: Object.values(formData).filter(val => val.trim() !== '').length
    });

    // Meta Pixel form submission tracking
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'InitiateCheckout', {
        content_type: 'service',
        content_name: formData.service || 'Digital Marketing Consultation',
        value: 99.99,
        currency: 'USD'
      });
    }

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Enhanced form submission tracking
    trackEnhancedFormSubmission('contact_form', {
      service: formData.service,
      budget: formData.budget,
      urgency: formData.urgency,
      company: formData.company,
      lead_score: calculateLeadScore(),
      estimated_value: 2500.00
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const calculateLeadScore = () => {
    let score = 50; // Base score
    
    if (formData.budget && formData.budget !== 'Under $1,000/month') score += 20;
    if (formData.urgency === 'emergency') score += 30;
    if (formData.urgency === 'priority') score += 15;
    if (formData.company) score += 10;
    if (formData.service) score += 10;
    
    return Math.min(100, score);
  };

  const services = [
    'SEO & Local Optimization',
    'Paid Ads (Meta, Google, TikTok)',
    'Social Media Management',
    'Video Marketing',
    'Reputation Management',
    'CRM Automation & Funnels',
    'AI-Powered Copy & Content',
    'Full Marketing Strategy'
  ];

  const budgetRanges = [
    'Under $1,000/month',
    '$1,000 - $2,500/month',
    '$2,500 - $5,000/month',
    '$5,000 - $10,000/month',
    '$10,000+/month'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-jet-black">
        <motion.div
          className="text-center max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 h-20 bg-tactical-red/20 rounded-full flex items-center justify-center mb-6 mx-auto">
            <SafeIcon icon={FiCheck} className="text-tactical-red text-4xl" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-6">
            Mission <span className="text-tactical-red">Received</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your strategy briefing has been received. One of our operatives will contact you within 24 hours to discuss your marketing objectives and develop your custom battle plan.
          </p>
          <div className="bg-dark-gray p-6 rounded-lg tactical-border">
            <h3 className="text-lg font-semibold mb-4 text-tactical-red">What Happens Next:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-tactical-red rounded-full"></div>
                <span className="text-gray-300">Initial consultation call within 24 hours</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-tactical-red rounded-full"></div>
                <span className="text-gray-300">Custom strategy development (2-3 days)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-tactical-red rounded-full"></div>
                <span className="text-gray-300">Proposal presentation and mission briefing</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-jet-black">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Launch Your <span className="gradient-text">Marketing Mission</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Ready to dominate your market? Let's discuss your objectives and develop a custom strategy that delivers measurable results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section ref={formRef} className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-medium-gray rounded-lg p-8 tactical-border"
                initial={{ opacity: 0, x: -50 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl font-display font-bold mb-8">
                  Strategy <span className="text-tactical-red">Briefing Form</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Primary Service Interest</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Monthly Marketing Budget</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range, index) => (
                        <option key={index} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Mission Urgency</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'standard', label: 'Standard', desc: '2-4 weeks' },
                        { value: 'priority', label: 'Priority', desc: '1-2 weeks' },
                        { value: 'emergency', label: 'Emergency', desc: 'ASAP' }
                      ].map((urgency) => (
                        <label key={urgency.value} className="cursor-pointer">
                          <input
                            type="radio"
                            name="urgency"
                            value={urgency.value}
                            checked={formData.urgency === urgency.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`p-3 border-2 rounded-lg text-center transition-colors ${
                            formData.urgency === urgency.value
                              ? 'border-tactical-red bg-tactical-red/20 text-tactical-red'
                              : 'border-gray-600 hover:border-tactical-red/50'
                          }`}>
                            <div className="font-semibold">{urgency.label}</div>
                            <div className="text-xs text-gray-400">{urgency.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Mission Objectives</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-dark-gray border border-gray-600 rounded-lg focus:border-tactical-red focus:outline-none transition-colors resize-none"
                      placeholder="Tell us about your business goals, current challenges, and what success looks like to you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 btn-primary rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Transmitting Mission Brief...</span>
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiSend} />
                        <span>Launch Strategy Session</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Contact Details */}
                <div className="bg-medium-gray rounded-lg p-6 tactical-border">
                  <h3 className="text-xl font-bold mb-6">Mission Command Center</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMail} className="text-tactical-red" />
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-gray-400 text-sm">info@secretagentdigital.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiPhone} className="text-tactical-red" />
                      <div>
                        <div className="font-semibold">Phone</div>
                        <div className="text-gray-400 text-sm">301-205-5131</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMapPin} className="text-tactical-red" />
                      <div>
                        <div className="font-semibold">Location</div>
                        <div className="text-gray-400 text-sm">Classified HQ</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-medium-gray rounded-lg p-6 tactical-border">
                  <div className="flex items-center space-x-3 mb-4">
                    <SafeIcon icon={FiClock} className="text-tactical-red text-xl" />
                    <h3 className="text-xl font-bold">Response Protocol</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Standard Missions:</span>
                      <span className="text-tactical-red font-semibold">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Priority Missions:</span>
                      <span className="text-tactical-red font-semibold">4-8 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency Missions:</span>
                      <span className="text-tactical-red font-semibold">1-2 hours</span>
                    </div>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="bg-tactical-red/10 border border-tactical-red/30 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <SafeIcon icon={FiTarget} className="text-tactical-red text-xl" />
                    <h3 className="text-xl font-bold text-tactical-red">Mission Guarantee</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    We're so confident in our strategies that we offer a 90-day performance guarantee. 
                    If we don't deliver measurable improvements, we'll work for free until we do.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;