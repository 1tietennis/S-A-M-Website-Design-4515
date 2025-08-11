import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

const { 
  FiShield, FiTarget, FiUsers, FiDollarSign, FiLock, 
  FiArrowRight, FiCheck, FiClock, FiBriefcase 
} = FiIcons;

const MissionBriefing = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {
      businessName: '',
      industry: '',
      primaryGoal: '',
      competitors: []
    },
    step2: {
      targetAudience: '',
      marketingChannels: [],
      existingAssets: [],
      brandVoice: ''
    },
    step3: {
      budget: '',
      timeline: '',
      successMetrics: [],
      additionalNotes: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [briefingId, setBriefingId] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user has an existing mission briefing
    const checkExistingBriefing = async () => {
      try {
        const { data, error } = await supabase
          .from('mission_briefings_jfk72b')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setBriefingId(data[0].id);
          
          // Populate form data if there's existing data
          if (data[0].intelligence_data) {
            setFormData(prevData => ({
              ...prevData,
              step1: { ...data[0].intelligence_data }
            }));
          }
          
          if (data[0].strategy_plan) {
            setFormData(prevData => ({
              ...prevData,
              step2: { ...data[0].strategy_plan }
            }));
          }
          
          if (data[0].mission_parameters) {
            setFormData(prevData => ({
              ...prevData,
              step3: { ...data[0].mission_parameters }
            }));
          }
        }
      } catch (error) {
        console.error('Error checking existing briefing:', error);
      }
    };

    checkExistingBriefing();
  }, [isAuthenticated, navigate, user]);

  const handleInputChange = (step, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [field]: value
      }
    }));
  };

  const handleMultiSelect = (step, field, value) => {
    const currentValues = formData[step][field] || [];
    let updatedValues;
    
    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter(item => item !== value);
    } else {
      updatedValues = [...currentValues, value];
    }
    
    setFormData(prevData => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [field]: updatedValues
      }
    }));
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - save everything
      await saveMissionBriefing();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveMissionBriefing = async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const missionData = {
        user_id: user.id,
        intelligence_data: formData.step1,
        strategy_plan: formData.step2,
        mission_parameters: formData.step3,
        status: 'completed',
        updated_at: new Date()
      };
      
      let response;
      
      if (briefingId) {
        // Update existing briefing
        response = await supabase
          .from('mission_briefings_jfk72b')
          .update(missionData)
          .eq('id', briefingId);
      } else {
        // Create new briefing
        response = await supabase
          .from('mission_briefings_jfk72b')
          .insert([missionData]);
      }
      
      if (response.error) throw response.error;
      
      // Navigate to the dashboard or success page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving mission briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-tactical-red">Intelligence Gathering</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Name:
                <input 
                  type="text" 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step1.businessName}
                  onChange={(e) => handleInputChange('step1', 'businessName', e.target.value)}
                />
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Industry:
                <select 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step1.industry}
                  onChange={(e) => handleInputChange('step1', 'industry', e.target.value)}
                >
                  <option value="">Select Industry</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Legal">Legal</option>
                  <option value="Finance">Finance</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Home Services">Home Services</option>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Mission Objective:
                <select 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step1.primaryGoal}
                  onChange={(e) => handleInputChange('step1', 'primaryGoal', e.target.value)}
                >
                  <option value="">Select Primary Goal</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Online Sales">Online Sales</option>
                  <option value="Local Traffic">Local Traffic</option>
                  <option value="Customer Retention">Customer Retention</option>
                </select>
              </label>
            </div>
            
            <div>
              <p className="block text-sm font-medium mb-2">Competitors (Select all that apply):</p>
              <div className="grid grid-cols-2 gap-2">
                {['Local Competitors', 'Regional Players', 'National Brands', 'Online-Only'].map((option) => (
                  <label key={option} className="inline-flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox bg-dark-gray border border-gray-600 rounded text-tactical-red"
                      checked={formData.step1.competitors?.includes(option) || false}
                      onChange={() => handleMultiSelect('step1', 'competitors', option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-tactical-red">Strategy Formation</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Audience:
                <input 
                  type="text" 
                  placeholder="Describe your ideal customer"
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step2.targetAudience}
                  onChange={(e) => handleInputChange('step2', 'targetAudience', e.target.value)}
                />
              </label>
            </div>
            
            <div>
              <p className="block text-sm font-medium mb-2">Marketing Channels (Select all that apply):</p>
              <div className="grid grid-cols-2 gap-2">
                {['SEO', 'Paid Ads', 'Social Media', 'Email Marketing', 'Content Marketing', 'Video', 'Local SEO'].map((option) => (
                  <label key={option} className="inline-flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox bg-dark-gray border border-gray-600 rounded text-tactical-red"
                      checked={formData.step2.marketingChannels?.includes(option) || false}
                      onChange={() => handleMultiSelect('step2', 'marketingChannels', option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <p className="block text-sm font-medium mb-2">Existing Assets (Select all that apply):</p>
              <div className="grid grid-cols-2 gap-2">
                {['Website', 'Logo', 'Brand Guidelines', 'Social Media Accounts', 'Email List', 'Content Library', 'Customer Database'].map((option) => (
                  <label key={option} className="inline-flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox bg-dark-gray border border-gray-600 rounded text-tactical-red"
                      checked={formData.step2.existingAssets?.includes(option) || false}
                      onChange={() => handleMultiSelect('step2', 'existingAssets', option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Brand Voice:
                <select 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step2.brandVoice}
                  onChange={(e) => handleInputChange('step2', 'brandVoice', e.target.value)}
                >
                  <option value="">Select Brand Voice</option>
                  <option value="Professional">Professional</option>
                  <option value="Friendly">Friendly</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Casual">Casual</option>
                  <option value="Luxurious">Luxurious</option>
                  <option value="Technical">Technical</option>
                </select>
              </label>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-tactical-red">Mission Parameters</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Budget Range:
                <select 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step3.budget}
                  onChange={(e) => handleInputChange('step3', 'budget', e.target.value)}
                >
                  <option value="">Select Budget Range</option>
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Timeline:
                <select 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  value={formData.step3.timeline}
                  onChange={(e) => handleInputChange('step3', 'timeline', e.target.value)}
                >
                  <option value="">Select Timeline</option>
                  <option value="Immediate (ASAP)">Immediate (ASAP)</option>
                  <option value="Within 30 days">Within 30 days</option>
                  <option value="Within 90 days">Within 90 days</option>
                  <option value="Long-term planning">Long-term planning</option>
                </select>
              </label>
            </div>
            
            <div>
              <p className="block text-sm font-medium mb-2">Success Metrics (Select all that apply):</p>
              <div className="grid grid-cols-2 gap-2">
                {['Lead Volume', 'Conversion Rate', 'ROI', 'Traffic Growth', 'Social Engagement', 'Keyword Rankings', 'Brand Mentions'].map((option) => (
                  <label key={option} className="inline-flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="form-checkbox bg-dark-gray border border-gray-600 rounded text-tactical-red"
                      checked={formData.step3.successMetrics?.includes(option) || false}
                      onChange={() => handleMultiSelect('step3', 'successMetrics', option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Notes:
                <textarea 
                  className="w-full mt-1 bg-dark-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                  rows="3"
                  placeholder="Any other information you'd like to share with our agents..."
                  value={formData.step3.additionalNotes}
                  onChange={(e) => handleInputChange('step3', 'additionalNotes', e.target.value)}
                ></textarea>
              </label>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-jet-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Mission <span className="text-tactical-red">Briefing</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Agent, your mission — should you choose to accept it — is to arm your business with a revenue-generating system that works around the clock.
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2 z-0"></div>
            
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`relative z-10 flex flex-col items-center ${currentStep >= step ? 'text-tactical-red' : 'text-gray-500'}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep > step 
                      ? 'bg-tactical-red text-white' 
                      : currentStep === step 
                        ? 'border-2 border-tactical-red bg-dark-gray text-tactical-red' 
                        : 'border-2 border-gray-700 bg-dark-gray'
                  }`}
                >
                  {currentStep > step ? <SafeIcon icon={FiCheck} /> : step}
                </div>
                <span className="mt-2 text-sm font-medium">
                  {step === 1 ? 'Intelligence' : step === 2 ? 'Strategy' : 'Parameters'}
                </span>
              </div>
            ))}
          </div>
          
          {/* Form Card */}
          <div className="bg-dark-gray rounded-lg p-6 md:p-8 tactical-border">
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <button 
                onClick={handlePrevStep}
                className={`px-6 py-2 rounded-lg border border-gray-600 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-tactical-red'}`}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              
              <button 
                onClick={handleNextStep}
                className="px-6 py-2 btn-primary rounded-lg flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{currentStep === 3 ? 'Complete Briefing' : 'Next Step'}</span>
                    <SafeIcon icon={FiArrowRight} />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Security Notice */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiLock} className="text-tactical-red" />
              <span>Your data is encrypted and secure</span>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6 text-center">
              What You'll Get <span className="text-tactical-red">Access To</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-medium-gray p-6 rounded-lg">
                <SafeIcon icon={FiBriefcase} className="text-tactical-red text-2xl mb-3" />
                <h4 className="font-bold mb-2">Basic Traffic Trends</h4>
                <p className="text-sm text-gray-400">Monitor your website traffic and visitor engagement.</p>
              </div>
              
              <div className="bg-medium-gray p-6 rounded-lg">
                <SafeIcon icon={FiUsers} className="text-tactical-red text-2xl mb-3" />
                <h4 className="font-bold mb-2">Lead Volume</h4>
                <p className="text-sm text-gray-400">Track incoming leads and conversion metrics.</p>
              </div>
              
              <div className="bg-medium-gray p-6 rounded-lg">
                <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl mb-3" />
                <h4 className="font-bold mb-2">Campaign Health</h4>
                <p className="text-sm text-gray-400">Monitor campaign status with simple status indicators.</p>
              </div>
            </div>
            
            {/* Upgrade CTA */}
            <div className="mt-8 bg-medium-gray p-6 rounded-lg border border-dashed border-tactical-red">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <SafeIcon icon={FiLock} className="text-tactical-red text-2xl" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Unlock Full Tactical Control</h4>
                  <p className="text-gray-400 mb-4">Gain access to premium features including live campaign performance reports, competitor surveillance intel, and ROI calculations.</p>
                  <button className="px-6 py-2 bg-tactical-red text-white rounded-lg hover:bg-red-700 transition-colors">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MissionBriefing;