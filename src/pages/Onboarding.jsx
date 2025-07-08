import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OnBoarding } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import questConfig from '../config/questConfig';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiZap, FiTrendingUp, FiShield, FiCheckCircle, FiArrowRight } = FiIcons;

const Onboarding = () => {
  const { isAuthenticated, completeOnboarding, isOnboardingCompleted } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    trackPageView('/onboarding', 'Onboarding - Secret Agent Digital Marketing');
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if onboarding already completed
  if (isOnboardingCompleted()) {
    return <Navigate to="/dashboard" replace />;
  }

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const getAnswers = () => {
    trackButtonClick('Onboarding Complete', 'Onboarding Flow');
    
    // Mark onboarding as completed
    completeOnboarding();
    
    // Navigate to main app
    navigate('/dashboard');
  };

  const onboardingSteps = [
    {
      step: 1,
      title: 'Intelligence Gathering',
      description: 'Tell us about your business and goals'
    },
    {
      step: 2,
      title: 'Strategy Formation',
      description: 'Define your target audience and preferences'
    },
    {
      step: 3,
      title: 'Mission Parameters',
      description: 'Set your budget and timeline expectations'
    }
  ];

  const benefits = [
    {
      icon: FiZap,
      title: 'Instant Setup',
      description: 'Get your campaigns running in minutes, not weeks'
    },
    {
      icon: FiTrendingUp,
      title: 'Data-Driven Results',
      description: 'Every decision backed by real performance metrics'
    },
    {
      icon: FiShield,
      title: 'Proven Strategies',
      description: 'Battle-tested tactics that deliver consistent ROI'
    }
  ];

  return (
    <div className="min-h-screen bg-jet-black flex">
      {/* Left Section - Progress & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tactical-red/20 via-jet-black to-dark-gray"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='%23ED2729' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-4xl" />
              <h1 className="text-3xl font-display font-bold gradient-text">
                Mission Briefing
              </h1>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Let's Set Up Your
              <span className="text-tactical-red block">Marketing Arsenal</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-md">
              We're configuring your personalized marketing strategy. This quick setup ensures maximum effectiveness from day one.
            </p>

            {/* Progress Steps */}
            <div className="space-y-6 mb-8">
              {onboardingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-start space-x-4 ${
                    currentStep >= step.step ? 'opacity-100' : 'opacity-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: currentStep >= step.step ? 1 : 0.5, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    currentStep > step.step 
                      ? 'bg-tactical-red text-white' 
                      : currentStep === step.step 
                        ? 'bg-tactical-red/20 border-2 border-tactical-red text-tactical-red' 
                        : 'bg-gray-600 text-gray-400'
                  }`}>
                    {currentStep > step.step ? (
                      <SafeIcon icon={FiCheckCircle} className="text-sm" />
                    ) : (
                      <span className="text-sm font-bold">{step.step}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">What You'll Get:</h3>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <SafeIcon icon={benefit.icon} className="text-tactical-red text-lg mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{benefit.title}</h4>
                    <p className="text-gray-400 text-xs">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Onboarding Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-3xl" />
              <span className="text-2xl font-display font-bold gradient-text">
                Mission Setup
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Let's Get Started
            </h2>
            <p className="text-gray-300">
              Quick setup to personalize your experience
            </p>
          </div>

          {/* Quest Onboarding Component */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Strategic Briefing
                </h3>
                <p className="text-gray-600">
                  Help us customize your marketing arsenal
                </p>
              </div>

              <OnBoarding
                userId={userId}
                token={token}
                questId={questConfig.QUEST_ONBOARDING_QUESTID}
                answer={answers}
                setAnswer={setAnswers}
                getAnswers={getAnswers}
                accent={questConfig.PRIMARY_COLOR}
                singleChoose="modal1"
                multiChoice="modal2"
                style={{
                  width: '100%',
                  maxWidth: '400px'
                }}
              >
                <OnBoarding.Header />
                <OnBoarding.Content />
                <OnBoarding.Footer />
              </OnBoarding>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiShield} className="text-tactical-red" />
              <span>Your data is encrypted and secure</span>
            </div>
          </div>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                trackButtonClick('Skip Onboarding', 'Onboarding Flow');
                completeOnboarding();
                navigate('/dashboard');
              }}
              className="text-gray-400 hover:text-tactical-red text-sm transition-colors duration-200 flex items-center space-x-1 mx-auto"
            >
              <span>Skip for now</span>
              <SafeIcon icon={FiArrowRight} className="text-xs" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;