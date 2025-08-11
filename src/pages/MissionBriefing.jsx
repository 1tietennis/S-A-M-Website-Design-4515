import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import { trackButtonClick } from '../utils/analytics';

const { FiTarget, FiZap, FiUsers, FiDollarSign, FiClock, FiArrowRight, FiCheckCircle } = FiIcons;

const MissionBriefing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    target_audience: '',
    goals: [],
    budget_range: '',
    timeline: '',
    marketing_challenges: ''
  });

  const totalSteps = 3;

  // Form validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.business_name.trim() !== '' && formData.industry.trim() !== '';
      case 2:
        return formData.target_audience.trim() !== '' && formData.goals.length > 0;
      case 3:
        return formData.budget_range !== '' && formData.timeline !== '';
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        trackButtonClick('Next Step', `Mission Briefing Step ${currentStep}`);
      } else {
        handleSubmit();
      }
    } else {
      // Show validation message
      alert('Please complete all required fields before proceeding.');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      trackButtonClick('Previous Step', `Mission Briefing Step ${currentStep}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGoalsChange = (e) => {
    const goal = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setFormData({
        ...formData,
        goals: [...formData.goals, goal]
      });
    } else {
      setFormData({
        ...formData,
        goals: formData.goals.filter(g => g !== goal)
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    trackButtonClick('Submit Mission Briefing', 'Mission Briefing');

    try {
      // Submit to Supabase
      const { data, error } = await supabase
        .from('mission_briefings_xb27jk3m9p')
        .insert([
          {
            ...formData,
            user_id: user?.id || '00000000-0000-0000-0000-000000000000'
          }
        ]);

      if (error) {
        throw error;
      }

      // Success
      setIsComplete(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error submitting mission briefing:', error);
      alert('There was an error submitting your mission briefing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-jet-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-xl mx-auto px-6">
          <SafeIcon icon={FiCheckCircle} className="text-tactical-red text-6xl mb-6 mx-auto" />
          <h2 className="text-3xl font-display font-bold mb-4">Mission Brief Submitted!</h2>
          <p className="text-xl text-gray-300 mb-6">
            Your marketing intelligence has been received. Redirecting to your command center...
          </p>
          <div className="w-full h-2 bg-dark-gray rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-tactical-red" 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-jet-black pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8 text-center">
            Mission <span className="text-tactical-red">Briefing</span>
          </h1>

          {/* Progress Steps */}
          <div className="flex justify-between mb-12 relative">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep > index + 1 
                    ? 'bg-tactical-red text-white' 
                    : currentStep === index + 1 
                      ? 'bg-tactical-red/20 border-2 border-tactical-red text-tactical-red' 
                      : 'bg-gray-600 text-gray-400'
                }`}>
                  {currentStep > index + 1 ? (
                    <SafeIcon icon={FiCheckCircle} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`text-sm ${currentStep === index + 1 ? 'text-tactical-red' : 'text-gray-400'}`}>
                  {index === 0 ? 'Intelligence' : index === 1 ? 'Strategy' : 'Parameters'}
                </span>
              </div>
            ))}
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-600" style={{ width: '100%', zIndex: 0 }}>
              <div className="h-full bg-tactical-red" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}></div>
            </div>
          </div>

          {/* Step 1: Business Information */}
          {currentStep === 1 && (
            <motion.div 
              className="bg-dark-gray rounded-lg p-8 tactical-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center">
                <SafeIcon icon={FiTarget} className="text-tactical-red mr-3" />
                Intelligence Gathering
              </h2>
              <p className="text-gray-300 mb-6">
                Tell us about your business so we can tailor our strategies to your specific needs.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name*
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                      required
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Industry*
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Real Estate">Real Estate</option>
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
                    Current Marketing Challenges
                    <textarea
                      name="marketing_challenges"
                      value={formData.marketing_challenges}
                      onChange={handleChange}
                      rows="4"
                      className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none resize-vertical"
                    ></textarea>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Target Audience & Goals */}
          {currentStep === 2 && (
            <motion.div 
              className="bg-dark-gray rounded-lg p-8 tactical-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center">
                <SafeIcon icon={FiUsers} className="text-tactical-red mr-3" />
                Strategy Formation
              </h2>
              <p className="text-gray-300 mb-6">
                Define your target audience and marketing objectives.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Audience Description*
                    <textarea
                      name="target_audience"
                      value={formData.target_audience}
                      onChange={handleChange}
                      rows="3"
                      className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none resize-vertical"
                      required
                    ></textarea>
                  </label>
                </div>
                <div>
                  <p className="block text-sm font-medium mb-3">Marketing Goals* (select all that apply)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Increase website traffic',
                      'Generate more leads',
                      'Improve conversion rates',
                      'Boost brand awareness',
                      'Enhance customer retention',
                      'Launch new product/service',
                      'Expand to new markets',
                      'Improve online reputation'
                    ].map((goal, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={goal}
                          checked={formData.goals.includes(goal)}
                          onChange={handleGoalsChange}
                          className="w-4 h-4 accent-tactical-red"
                        />
                        <span>{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Budget & Timeline */}
          {currentStep === 3 && (
            <motion.div 
              className="bg-dark-gray rounded-lg p-8 tactical-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center">
                <SafeIcon icon={FiDollarSign} className="text-tactical-red mr-3" />
                Mission Parameters
              </h2>
              <p className="text-gray-300 mb-6">
                Set your budget and timeline expectations so we can plan accordingly.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Budget Range*
                    <select
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleChange}
                      className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                      required
                    >
                      <option value="">Select Budget Range</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                      <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000+">$10,000+</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Timeline for Results*
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                      required
                    >
                      <option value="">Select Timeline</option>
                      <option value="Immediate (1-2 months)">Immediate (1-2 months)</option>
                      <option value="Short-term (3-6 months)">Short-term (3-6 months)</option>
                      <option value="Medium-term (6-12 months)">Medium-term (6-12 months)</option>
                      <option value="Long-term (12+ months)">Long-term (12+ months)</option>
                    </select>
                  </label>
                </div>
                <div className="bg-tactical-red/10 p-6 rounded-lg border border-tactical-red/30">
                  <h3 className="font-bold mb-2 flex items-center">
                    <SafeIcon icon={FiZap} className="text-tactical-red mr-2" />
                    What You'll Get:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiClock} className="text-tactical-red mt-1 flex-shrink-0" />
                      <span>Instant Setup - Get your campaigns running in minutes, not weeks</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiTarget} className="text-tactical-red mt-1 flex-shrink-0" />
                      <span>Data-Driven Results - Every decision backed by real performance metrics</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <SafeIcon icon={FiZap} className="text-tactical-red mt-1 flex-shrink-0" />
                      <span>Proven Strategies - Battle-tested tactics that deliver consistent ROI</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-tactical-red hover:text-tactical-red transition-all duration-300"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="px-6 py-3 btn-primary rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span>Processing...</span>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </>
              ) : (
                <>
                  <span>{currentStep === totalSteps ? 'Submit' : 'Next'}</span>
                  <SafeIcon icon={FiArrowRight} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MissionBriefing;