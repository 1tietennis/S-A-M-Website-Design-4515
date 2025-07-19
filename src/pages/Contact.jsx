import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackEnhancedEvent, trackEnhancedFormSubmission } from '../utils/analyticsEnhanced';
import { sendToCyborgCRM, calculateLeadScore } from '../utils/cyborgCRM';
import { sendNotification, createToast, requestNotificationPermission } from '../utils/notifications';

const { FiSend, FiClock, FiDollarSign, FiTarget, FiAlertCircle, FiCheckCircle } = FiIcons;

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: [],
    message: ''
  });

  // Request notification permissions on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Track form submission attempt
    trackEnhancedEvent('form_submit_attempt', {
      form: 'contact',
      page: '/contact',
      fields_completed: Object.values(formData).filter(val => 
        Array.isArray(val) ? val.length > 0 : val.trim() !== ''
      ).length
    });

    try {
      // Calculate lead score for analytics
      const leadScore = calculateLeadScore(formData);

      // Send to CyborgCRM for tracking
      sendToCyborgCRM(formData);

      // Prepare form data for Netlify
      const netlifyFormData = new FormData();
      netlifyFormData.append('form-name', 'contact');
      netlifyFormData.append('name', formData.name);
      netlifyFormData.append('email', formData.email);
      
      // Handle multiple role selections
      if (formData.role.length > 0) {
        formData.role.forEach(role => {
          netlifyFormData.append('role[]', role);
        });
      }
      
      netlifyFormData.append('message', formData.message);

      // Submit to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData).toString()
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Track successful submission
      trackEnhancedFormSubmission('contact_form', {
        lead_score: leadScore,
        estimated_value: 2500.00
      });

      // Send notification
      sendNotification(formData, 'success');

      // Show success toast
      createToast({
        message: "Your message has been sent successfully!",
        type: "success"
      });

      // Meta Pixel tracking
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Contact Form',
          content_category: 'contact',
          value: 99.99,
          currency: 'USD'
        });
      }

      // Google Analytics tracking
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'form_submit', {
          event_category: 'engagement',
          event_label: 'contact_form',
          value: 1
        });
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Redirect to thank you page
      setTimeout(() => {
        navigate('/thank-you');
      }, 1000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('There was an error submitting your form. Please try again.');
      setIsSubmitting(false);

      // Send error notification
      sendNotification(formData, 'error');

      // Show error toast
      createToast({
        message: "There was an error sending your message. Please try again.",
        type: "error"
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;

    // Handle multiple select
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <SafeIcon icon={FiCheckCircle} className="text-tactical-red text-6xl mb-4 mx-auto" />
          <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
          <p className="text-gray-300">We'll be in touch with you shortly.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-jet-black">
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-center">
            Contact <span className="text-tactical-red">Us</span>
          </h1>

          {formError && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start">
              <SafeIcon icon={FiAlertCircle} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          {/* Netlify Form */}
          <form 
            name="contact" 
            method="POST" 
            netlify="true"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Hidden field for Netlify */}
            <input type="hidden" name="form-name" value="contact" />

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Name:
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Email:
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Role:
                <select
                  name="role"
                  multiple
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="leader">Leader</option>
                  <option value="follower">Follower</option>
                </select>
              </label>
              <p className="text-sm text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple roles</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message:
                <textarea
                  name="message"
                  required
                  rows="4"
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none resize-vertical"
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary rounded-lg py-4 font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <span>Sending...</span>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <SafeIcon icon={FiSend} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <SafeIcon icon={FiClock} className="text-tactical-red text-2xl mb-2" />
              <h3 className="font-semibold text-center">Fast Response</h3>
              <p className="text-sm text-gray-400 text-center">24-hour response time</p>
            </div>
            <div className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <SafeIcon icon={FiDollarSign} className="text-tactical-red text-2xl mb-2" />
              <h3 className="font-semibold text-center">Clear Communication</h3>
              <p className="text-sm text-gray-400 text-center">Direct and transparent</p>
            </div>
            <div className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl mb-2" />
              <h3 className="font-semibold text-center">Expert Support</h3>
              <p className="text-sm text-gray-400 text-center">Professional assistance</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;