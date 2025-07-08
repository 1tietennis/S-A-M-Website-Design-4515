import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import questConfig from '../config/questConfig';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTarget, FiShield, FiZap, FiTrendingUp } = FiIcons;

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView('/login', 'Login - Secret Agent Digital Marketing');
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (userData) => {
    trackButtonClick('Quest Login Success', 'Login Form');
    
    const { newUser } = login(userData);
    
    if (newUser) {
      // New user - redirect to onboarding
      navigate('/onboarding');
    } else {
      // Existing user - redirect to main app
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: FiShield,
      title: 'Secure Access',
      description: 'Military-grade security for your marketing data'
    },
    {
      icon: FiZap,
      title: 'Instant Setup',
      description: 'Get started in under 60 seconds'
    },
    {
      icon: FiTrendingUp,
      title: 'Real Results',
      description: 'Track your ROI with precision analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-jet-black flex">
      {/* Left Section - Branding */}
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
                Secret Agent Digital Marketing
              </h1>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
              Welcome Back,
              <span className="text-tactical-red block">Agent</span>
            </h2>

            <p className="text-xl text-gray-300 mb-8 max-w-md">
              Access your mission control center and continue dominating your market with data-driven strategies.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-tactical-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <SafeIcon icon={feature.icon} className="text-tactical-red text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-3xl" />
              <span className="text-2xl font-display font-bold gradient-text">
                Secret Agent Digital
              </span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white">
              Agent Login
            </h2>
          </div>

          {/* Quest Login Component */}
          <div className="bg-white rounded-lg p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Mission Access
              </h3>
              <p className="text-gray-600">
                Enter your credentials to access the command center
              </p>
            </div>

            <QuestLogin
              onSubmit={handleLogin}
              email={true}
              google={false}
              accent={questConfig.PRIMARY_COLOR}
              style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto'
              }}
            />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Secret Agent Digital?{' '}
                <span className="text-tactical-red font-semibold">
                  Create an account above to get started
                </span>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
              <SafeIcon icon={FiShield} className="text-tactical-red" />
              <span>Secured with enterprise-grade encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;