import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { trackFormSubmission } from '../utils/analytics';
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
    phone: '',
    company: '',
    role: [],
    service: '',
    budget: '',
    urgency: '',
    message: ''
  });

  // Track page view with Google Analytics
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-CTDQQ8XMKC', {
        page_path: '/contact',
        page_title: 'Contact Us - Secret Agent Digital Marketing',
        page_location: window.location.href
      });
      console.log('📊 Contact page view tracked');
    }
  }, []);

  // Calculate lead score based on form data
  const calculateLeadScore = (data) => {
    let score = 0;
    
    // Budget scoring
    if (data.budget) {
      switch (data.budget) {
        case '$5,000+': score += 30; break;
        case '$2,500-$5,000': score += 20; break;
        case '$1,000-$2,500': score += 10; break;
        default: score += 5;
      }
    }
    
    // Urgency scoring
    if (data.urgency === 'Immediate') score += 20;
    else if (data.urgency === 'Within 30 days') score += 15;
    else if (data.urgency === 'Within 90 days') score += 10;
    else score += 5;
    
    // Company provided
    if (data.company) score += 10;
    
    // Phone provided
    if (data.phone) score += 10;
    
    // Service type scoring
    if (data.service) score += 15;
    
    // Message length scoring
    if (data.message && data.message.length > 100) score += 5;
    
    return Math.min(score, 100); // Cap at 100
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // Track form submission attempt with Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'form_submit_attempt', {
        event_category: 'form',
        event_label: 'contact_form',
        form_name: 'contact'
      });
    }

    try {
      // Calculate lead score
      const leadScore = calculateLeadScore(formData);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('contacts_x7p29ak4m3')
        .insert([
          { 
            name: formData.name, 
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            message: formData.message,
            role: formData.role,
            service: formData.service || null,
            budget: formData.budget || null,
            urgency: formData.urgency || null,
            lead_score: leadScore,
            status: 'new'
          }
        ]);
      
      if (error) throw error;
      
      // Prepare form data for Netlify (fallback)
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
      
      // Submit to Netlify as fallback
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(netlifyFormData).toString()
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Track successful submission with Google Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit_success', {
          event_category: 'form',
          event_label: 'contact_form',
          form_name: 'contact',
          value: 1
        });
        
        // Also track as lead generation
        window.gtag('event', 'generate_lead', {
          currency: 'USD',
          value: 249.99
        });
      }

      // Track with our utility function
      trackFormSubmission('contact_form', {
        form_type: 'contact',
        fields_completed: Object.keys(formData).length,
        lead_score: leadScore
      });
      
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
      
      // Track form error with Google Analytics
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit_error', {
          event_category: 'error',
          event_label: 'contact_form',
          form_name: 'contact',
          error_message: error.message
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, options } = e.target;
    
    // Handle multiple select
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      // Handle regular inputs
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
          <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
          <p className="text-gray-300">We'll be in touch with you shortly.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-jet-black">
      <motion.div className="container mx-auto px-4"
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

          {/* Contact Form */}
          <form name="contact" method="POST" netlify="true" onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden field for Netlify */}
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number (optional):
                  <input 
                    type="tel" 
                    name="phone" 
                    className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name (optional):
                  <input 
                    type="text" 
                    name="company" 
                    className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Interest:
                  <select 
                    name="service" 
                    className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                    value={formData.service}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a service</option>
                    <option value="SEO">SEO & Local Optimization</option>
                    <option value="PPC">Paid Ads (Meta, Google)</option>
                    <option value="Social">Social Media Management</option>
                    <option value="Reputation">Reputation Management</option>
                    <option value="CRM">CRM & Automation</option>
                    <option value="Content">Content Creation</option>
                    <option value="Video">Video Marketing</option>
                    <option value="Drone">Drone Services</option>
                  </select>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget Range:
                  <select 
                    name="budget" 
                    className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option value="">Select budget</option>
                    <option value="Under $1,000">Under $1,000</option>
                    <option value="$1,000-$2,500">$1,000-$2,500</option>
                    <option value="$2,500-$5,000">$2,500-$5,000</option>
                    <option value="$5,000+">$5,000+</option>
                  </select>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Urgency:
                  <select 
                    name="urgency" 
                    className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    <option value="">Select timeline</option>
                    <option value="Immediate">Immediate (ASAP)</option>
                    <option value="Within 30 days">Within 30 days</option>
                    <option value="Within 90 days">Within 90 days</option>
                    <option value="Just exploring">Just exploring</option>
                  </select>
                </label>
              </div>
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
                  <option value="business_owner">Business Owner</option>
                  <option value="marketing_manager">Marketing Manager</option>
                  <option value="agency">Agency Partner</option>
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