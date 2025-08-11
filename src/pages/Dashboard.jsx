import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { trackPageView, trackButtonClick } from '../utils/analytics';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import DashboardMenu from '../components/DashboardMenu';
import DashboardHome from '../components/DashboardHome';
import MarketingStrategy from '../components/MarketingStrategy';
import CampaignManager from '../components/CampaignManager';
import PerformanceMetrics from '../components/PerformanceMetrics';
import MissionBriefing from '../components/MissionBriefing';

const {
  FiTarget, 
  FiTrendingUp, 
  FiUsers, 
  FiDollarSign, 
  FiLogOut, 
  FiSettings
} = FiIcons;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const [dashboardData, setDashboardData] = useState({
    campaigns: [],
    contacts: [],
    metrics: {},
    loading: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard - Secret Agent Digital Marketing');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setDashboardData(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('marketing_campaigns_7b3f9x5a2d')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (campaignsError) throw campaignsError;

      // Fetch contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts_7b3f9x5a2d')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (contactsError) throw contactsError;

      // Calculate metrics
      const metrics = {
        totalCampaigns: campaigns?.length || 0,
        totalContacts: contacts?.length || 0,
        activeContacts: contacts?.filter(contact => contact.status !== 'unqualified').length || 0,
        averageLeadScore: contacts?.length ? 
          Math.round(contacts.reduce((sum, contact) => sum + (contact.lead_score || 0), 0) / contacts.length) : 
          0,
        campaignPerformance: '+127%',
        leadGeneration: contacts?.length || 0,
        revenueImpact: '$' + (Math.round((contacts?.length || 0) * 250)).toLocaleString()
      };

      setDashboardData({
        campaigns: campaigns || [],
        contacts: contacts || [],
        metrics,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = () => {
    trackButtonClick('Logout', 'Dashboard Header');
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'home':
        return <DashboardHome data={dashboardData} />;
      case 'strategy':
        return <MarketingStrategy />;
      case 'campaigns':
        return <CampaignManager campaigns={dashboardData.campaigns} />;
      case 'performance':
        return <PerformanceMetrics metrics={dashboardData.metrics} />;
      case 'briefing':
        return <MissionBriefing />;
      default:
        return <DashboardHome data={dashboardData} />;
    }
  };

  const stats = [
    {
      icon: FiTrendingUp,
      label: 'Campaign Performance',
      value: dashboardData.metrics.campaignPerformance || '+127%',
      change: 'vs last month',
      color: 'text-green-400'
    },
    {
      icon: FiUsers,
      label: 'Lead Generation',
      value: dashboardData.metrics.leadGeneration || '0',
      change: 'qualified leads',
      color: 'text-blue-400'
    },
    {
      icon: FiDollarSign,
      label: 'Revenue Impact',
      value: dashboardData.metrics.revenueImpact || '$0',
      change: 'this quarter',
      color: 'text-tactical-red'
    }
  ];

  return (
    <div className="min-h-screen bg-jet-black">
      {/* Header */}
      <header className="bg-dark-gray border-b border-tactical-red/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl" />
              <h1 className="text-xl font-display font-bold gradient-text">
                Mission Control
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-gray-300">
                  Welcome back, <span className="text-tactical-red font-semibold">{user.name || 'Agent'}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-tactical-red/20 hover:bg-tactical-red/30 rounded-lg transition-colors duration-200"
              >
                <SafeIcon icon={FiLogOut} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Dashboard Menu */}
          <div className="w-full md:w-64 flex-shrink-0">
            <DashboardMenu activeSection={activeSection} setActiveSection={setActiveSection} />
          </div>

          {/* Dashboard Content */}
          <div className="flex-grow">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-dark-gray rounded-lg p-6 tactical-border"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;