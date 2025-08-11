import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

const { 
  FiLock, FiUnlock, FiBarChart2, FiUsers, FiTarget, 
  FiDollarSign, FiTrendingUp, FiEye, FiShield 
} = FiIcons;

const TacticalControl = () => {
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchUserSubscription = async () => {
      try {
        setLoading(true);
        // In a real app, you'd fetch the user's actual subscription from Supabase
        const { data, error } = await supabase
          .from('subscription_tiers_jfk72b')
          .select('name')
          .limit(1);
          
        if (error) throw error;
        
        // For this demo, we'll just check if data exists to determine tier
        // In a real app, you'd check the user's subscription record
        setSubscriptionTier(data?.length > 0 ? 'free' : 'free');
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserSubscription();
  }, [isAuthenticated, navigate, user]);
  
  const premiumFeatures = [
    {
      title: 'Live Campaign Performance Reports',
      icon: FiBarChart2,
      description: 'Real-time data on all your marketing campaigns with detailed metrics and performance analysis.',
      metricValue: '24/7',
      metricLabel: 'Live Updates'
    },
    {
      title: 'Competitor Surveillance Intel',
      icon: FiEye,
      description: 'Monitor your competitors' strategies, keywords, and market positioning to stay ahead.',
      metricValue: '12+',
      metricLabel: 'Competitors Tracked'
    },
    {
      title: 'Lead Tracking & CRM Integration',
      icon: FiUsers,
      description: 'Advanced lead scoring, tracking, and seamless integration with your existing CRM systems.',
      metricValue: '100%',
      metricLabel: 'Lead Visibility'
    },
    {
      title: 'ROI Calculations & Optimization',
      icon: FiDollarSign,
      description: 'Precise return-on-investment metrics for all marketing activities with automated optimization suggestions.',
      metricValue: '+287%',
      metricLabel: 'Avg. ROI Increase'
    },
    {
      title: 'Self-Marketing System™',
      icon: FiTarget,
      description: 'Our proprietary performance engine that continuously optimizes your campaigns without human intervention.',
      metricValue: '24/7',
      metricLabel: 'Autonomous Operation'
    },
    {
      title: 'Advanced Analytics Dashboard',
      icon: FiTrendingUp,
      description: 'Comprehensive analytics with predictive modeling and custom reporting capabilities.',
      metricValue: '15+',
      metricLabel: 'Advanced Metrics'
    }
  ];
  
  const handleUpgrade = () => {
    // In a real app, this would redirect to a payment page
    navigate('/upgrade');
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-jet-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Full Tactical <span className="text-tactical-red">Control</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Complete access to the agency's inner vault of marketing intelligence.
            </p>
          </div>
          
          {/* Subscription Status */}
          <div className={`p-6 rounded-lg mb-8 ${subscriptionTier === 'premium' ? 'bg-tactical-red/20 border border-tactical-red' : 'bg-dark-gray border border-gray-700'}`}>
            <div className="flex items-center">
              <SafeIcon 
                icon={subscriptionTier === 'premium' ? FiUnlock : FiLock} 
                className={`text-2xl mr-4 ${subscriptionTier === 'premium' ? 'text-tactical-red' : 'text-gray-400'}`} 
              />
              <div>
                <h3 className="text-lg font-bold">
                  {subscriptionTier === 'premium' ? 'Premium Access Granted' : 'Premium Access Required'}
                </h3>
                <p className="text-gray-400">
                  {subscriptionTier === 'premium' 
                    ? 'You have full access to all premium features and intelligence tools.' 
                    : 'Upgrade to unlock all premium features and intelligence tools.'}
                </p>
              </div>
              {subscriptionTier !== 'premium' && (
                <button 
                  onClick={handleUpgrade}
                  className="ml-auto btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <SafeIcon icon={FiShield} />
                  <span>Upgrade Now</span>
                </button>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-tactical-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Premium Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`bg-dark-gray rounded-lg overflow-hidden ${subscriptionTier === 'premium' ? '' : 'opacity-75'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-tactical-red/20 flex items-center justify-center">
                          <SafeIcon icon={feature.icon} className="text-tactical-red text-xl" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold">{feature.title}</h3>
                          {subscriptionTier !== 'premium' && (
                            <span className="inline-flex items-center text-xs text-gray-400">
                              <SafeIcon icon={FiLock} className="mr-1" />
                              Premium Feature
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="block text-tactical-red font-bold text-lg">{feature.metricValue}</span>
                          <span className="text-xs text-gray-400">{feature.metricLabel}</span>
                        </div>
                        
                        {subscriptionTier !== 'premium' && (
                          <div className="flex items-center space-x-1 text-sm">
                            <SafeIcon icon={FiLock} className="text-gray-400" />
                            <span className="text-gray-400">Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Upgrade CTA (if not premium) */}
              {subscriptionTier !== 'premium' && (
                <motion.div
                  className="mt-8 bg-tactical-red/10 rounded-lg p-8 border border-tactical-red"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Upgrade to Full Tactical Control</h3>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                      Get complete access to our premium features, advanced analytics, and proprietary optimization tools 
                      to maximize your marketing ROI.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button 
                        onClick={handleUpgrade}
                        className="btn-primary px-6 py-3 rounded-lg flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={FiShield} />
                        <span>Upgrade for $199.99/mo</span>
                      </button>
                      <button 
                        onClick={() => navigate('/contact')}
                        className="px-6 py-3 border border-tactical-red text-tactical-red rounded-lg hover:bg-tactical-red hover:text-white transition-all duration-300"
                      >
                        Schedule a Demo
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TacticalControl;