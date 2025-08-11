import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

const { 
  FiShield, FiCheck, FiX, FiCreditCard, 
  FiLock, FiUnlock, FiTarget, FiArrowRight 
} = FiIcons;

const Upgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentStep, setPaymentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    agreeTerms: false
  });
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$199.99',
      period: 'per month',
      description: 'Full access with monthly billing',
      popular: true
    },
    {
      id: 'annual',
      name: 'Annual Plan',
      price: '$1,999.99',
      period: 'per year',
      description: 'Save $399.89 with annual billing',
      discount: 'Save 17%'
    }
  ];

  const premiumFeatures = [
    'Live Campaign Performance Reports',
    'Competitor Surveillance Intel',
    'Lead Tracking & CRM Integration',
    'ROI Calculations & Optimization',
    'Self-Marketing System™',
    'Advanced Analytics Dashboard'
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleContinue = () => {
    setPaymentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real application, you would:
    // 1. Process payment via Stripe, PayPal, etc.
    // 2. Update user's subscription in the database
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate updating user's subscription in Supabase
      // In a real app, you'd create a subscription record tied to the user
      
      // Navigate to success page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
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
              Upgrade to <span className="text-tactical-red">Full Access</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Complete access to the agency's inner vault of marketing intelligence.
            </p>
          </div>
          
          {paymentStep === 1 ? (
            <>
              {/* Plan Selection */}
              <div className="bg-dark-gray rounded-lg p-8 mb-8 tactical-border">
                <h2 className="text-2xl font-bold mb-6">Select Your Plan</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`border rounded-lg p-6 cursor-pointer relative ${
                        selectedPlan === plan.id 
                          ? 'border-tactical-red bg-tactical-red/10' 
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 right-6 bg-tactical-red text-white text-xs px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan === plan.id 
                            ? 'border-tactical-red bg-tactical-red text-white' 
                            : 'border-gray-600'
                        }`}>
                          {selectedPlan === plan.id && <SafeIcon icon={FiCheck} className="text-sm" />}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-400 ml-1">{plan.period}</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                      
                      {plan.discount && (
                        <span className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                          {plan.discount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <h3 className="font-bold text-lg mb-4">Premium Features Included:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="text-tactical-red flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={handleContinue}
                    className="btn-primary px-8 py-3 rounded-lg flex items-center space-x-2"
                  >
                    <span>Continue to Payment</span>
                    <SafeIcon icon={FiArrowRight} />
                  </button>
                </div>
              </div>
              
              {/* Money-back Guarantee */}
              <div className="bg-medium-gray rounded-lg p-6 text-center">
                <SafeIcon icon={FiShield} className="text-tactical-red text-3xl mb-3 mx-auto" />
                <h3 className="font-bold text-lg mb-2">90-Day Money-Back Guarantee</h3>
                <p className="text-gray-400 text-sm">
                  Not satisfied with the results? Get a full refund within 90 days, no questions asked.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Payment Form */}
              <div className="bg-dark-gray rounded-lg p-8 tactical-border">
                <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                
                <div className="mb-6 p-4 bg-tactical-red/10 border border-tactical-red rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">
                        {selectedPlan === 'monthly' ? 'Monthly Plan' : 'Annual Plan'}
                      </h3>
                      <p className="text-sm text-gray-300">Full Tactical Control</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xl">
                        {selectedPlan === 'monthly' ? '$199.99' : '$1,999.99'}
                      </span>
                      <span className="block text-xs text-gray-400">
                        {selectedPlan === 'monthly' ? 'per month' : 'per year'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name on Card
                        <input 
                          type="text"
                          name="cardName"
                          required
                          className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                          value={formData.cardName}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Card Number
                        <div className="relative">
                          <input 
                            type="text"
                            name="cardNumber"
                            required
                            placeholder="1234 5678 9012 3456"
                            className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                          />
                          <SafeIcon icon={FiCreditCard} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Expiry Date
                          <input 
                            type="text"
                            name="expiry"
                            required
                            placeholder="MM/YY"
                            className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                            value={formData.expiry}
                            onChange={handleInputChange}
                          />
                        </label>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Security Code (CVV)
                          <input 
                            type="text"
                            name="cvv"
                            required
                            placeholder="123"
                            className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                            value={formData.cvv}
                            onChange={handleInputChange}
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <input 
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        className="mt-1"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                        I agree to the <Link to="/terms" className="text-tactical-red hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-tactical-red hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-8">
                    <button 
                      type="button"
                      onClick={() => setPaymentStep(1)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Back to Plans
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="btn-primary px-8 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span>Processing...</span>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
                        </>
                      ) : (
                        <>
                          <SafeIcon icon={FiUnlock} />
                          <span>Complete Purchase</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Security Notice */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
                  <SafeIcon icon={FiLock} className="text-tactical-red" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upgrade;