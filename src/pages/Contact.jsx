import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackEnhancedEvent, trackEnhancedFormSubmission } from '../utils/analyticsEnhanced';
import { sendToCyborgCRM, calculateLeadScore } from '../utils/cyborgCRM';
import { sendNotification, createToast, requestNotificationPermission } from '../utils/notifications';
import supabase from '../lib/supabase';

const { FiSend, FiClock, FiDollarSign, FiTarget, FiAlertCircle, FiCheckCircle } = FiIcons;

const Contact = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    budget: '',
    urgency: '',
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
    
    // Track form submission attempt with enhanced analytics
    trackEnhancedEvent('form_submit_attempt', {
      form: 'contact',
      page: '/contact',
      urgency: formData.urgency,
      service: formData.service,
      budget: formData.budget,
      fields_completed: Object.values(formData).filter(val => val.trim() !== '').length
    });
    
    try {
      // Calculate lead score
      const leadScore = calculateLeadScore(formData);
      
      // Send to CyborgCRM
      const cyborgResult = sendToCyborgCRM(formData);
      
      // Store in Supabase database
      const { data, error } = await supabase
        .from('contacts_x7p29ak4m3')
        .insert([{
          ...formData,
          lead_score: leadScore
        }]);
      
      if (error) {
        throw new Error('Database error: ' + error.message);
      }
      
      // Enhanced form submission tracking
      trackEnhancedFormSubmission('contact_form', {
        service: formData.service,
        budget: formData.budget,
        urgency: formData.urgency,
        company: formData.company,
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
      
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Meta Pixel form submission tracking
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'InitiateCheckout', {
          content_type: 'service',
          content_name: formData.service || 'Digital Marketing Consultation',
          value: 99.99,
          currency: 'USD'
        });
      }

      // Redirect to thank you page after successful submission
      setTimeout(() => {
        navigate('/thank-you');
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(error.message || 'There was an error submitting your form. Please try again.');
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <SafeIcon icon={FiCheckCircle} className="text-tactical-red text-6xl mb-4 mx-auto" />
          <h2 className="text-3xl font-bold mb-4">Mission Received!</h2>
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
            Start Your <span className="text-tactical-red">Mission</span>
          </h1>
          
          {formError && (
            <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-start">
              <SafeIcon icon={FiAlertCircle} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
              <p>{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <input 
                  type="text" 
                  name="company"
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input 
                  type="tel" 
                  name="phone"
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Service Interest</label>
                <select 
                  name="service" 
                  required
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">Select Service</option>
                  <option value="SEO">SEO</option>
                  <option value="PPC">PPC</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Content Marketing">Content Marketing</option>
                  <option value="Web Design">Web Design</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Budget</label>
                <select 
                  name="budget" 
                  required
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="">Select Budget</option>
                  <option value="$1,000-$2,500">$1,000-$2,500</option>
                  <option value="$2,500-$5,000">$2,500-$5,000</option>
                  <option value="$5,000+">$5,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Urgency</label>
                <select 
                  name="urgency" 
                  required
                  className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="">Select Urgency</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Within 30 days">Within 30 days</option>
                  <option value="Within 90 days">Within 90 days</option>
                  <option value="Exploring options">Exploring options</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea 
                name="message" 
                rows="4"
                className="w-full bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full btn-primary rounded-lg py-4 font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span>Sending...</span>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </>
              ) : (
                <>
                  <span>Start Your Mission</span>
                  <SafeIcon icon={FiSend} />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <SafeIcon icon={FiClock} className="text-tactical-red text-2xl mb-2" />
              <h3 className="font-semibold text-center">Fast Response</h3>
              <p className="text-sm text-gray-400 text-center">24-hour response time</p>
            </div>
            <div className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <SafeIcon icon={FiDollarSign} className="text-tactical-red text-2xl mb-2" />
              <h3 className="font-semibold text-center">Clear Pricing</h3>
              <p className="text-sm text-gray-400 text-center">No hidden costs</p>
            </div>
            <div className="bg-dark-gray p-4 rounded-lg border border-gray-700 flex flex-col items-center">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl mb-2" />
              <h3 className="font-semibold text-center">Results Driven</h3>
              <p className="text-sm text-gray-400 text-center">ROI focused strategies</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;