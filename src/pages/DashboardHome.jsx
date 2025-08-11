import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';
import { trackButtonClick } from '../utils/analytics';

const { 
  FiTarget, FiTrendingUp, FiUsers, FiDollarSign, 
  FiClock, FiActivity, FiCalendar, FiCheckSquare,
  FiArrowRight, FiRefreshCw, FiPlusCircle
} = FiIcons;

const DashboardHome = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [missionBriefing, setMissionBriefing] = useState(null);
  const [recentContacts, setRecentContacts] = useState([]);
  const [stats, setStats] = useState({
    campaignPerformance: '+127%',
    leadGeneration: '2,847',
    revenueImpact: '$45,230'
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch mission briefing
      if (user?.id) {
        const { data: briefingData, error: briefingError } = await supabase
          .from('mission_briefings_xb27jk3m9p')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (briefingError && briefingError.code !== 'PGRST116') {
          console.error('Error fetching mission briefing:', briefingError);
        }

        if (briefingData) {
          setMissionBriefing(briefingData);
        }
      }

      // Fetch recent contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts_xb27jk3m9p')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      }

      if (contactsData) {
        setRecentContacts(contactsData);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    trackButtonClick('Refresh Dashboard', 'Dashboard');
    await fetchDashboardData();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Calculate completion percentage for mission briefing
  const calculateBriefingCompletion = () => {
    if (!missionBriefing) return 0;
    
    const requiredFields = [
      'business_name', 'industry', 'target_audience', 
      'goals', 'budget_range', 'timeline'
    ];
    
    const filledFields = requiredFields.filter(field => {
      const value = missionBriefing[field];
      return value && (Array.isArray(value) ? value.length > 0 : value.trim() !== '');
    });
    
    return Math.round((filledFields.length / requiredFields.length) * 100);
  };

  return (
    <div className="min-h-screen bg-jet-black pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">
                Mission <span className="text-tactical-red">Dashboard</span>
              </h1>
              <p className="text-gray-300">Your command center for dominating the digital battlefield</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="mt-4 md:mt-0 px-4 py-2 bg-tactical-red text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <SafeIcon icon={refreshing ? FiRefreshCw : FiRefreshCw} className={refreshing ? "animate-spin" : ""} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-red"></div>
            </div>
          ) : (
            <>
              {/* Mission Brief Status */}
              {!missionBriefing ? (
                <motion.div 
                  className="bg-dark-gray rounded-lg p-8 tactical-border mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                      <h2 className="text-2xl font-bold mb-2 flex items-center">
                        <SafeIcon icon={FiTarget} className="text-tactical-red mr-2" />
                        Mission Brief Required
                      </h2>
                      <p className="text-gray-300 max-w-xl">
                        Complete your mission briefing to help us customize your marketing strategy and unlock your full dashboard.
                      </p>
                    </div>
                    <Link 
                      to="/mission-briefing"
                      className="px-6 py-3 btn-primary rounded-lg font-semibold flex items-center space-x-2"
                      onClick={() => trackButtonClick('Start Mission Briefing', 'Dashboard')}
                    >
                      <span>Start Briefing</span>
                      <SafeIcon icon={FiArrowRight} />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  className="bg-dark-gray rounded-lg p-8 tactical-border mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex flex-col md:flex-row items-start justify-between">
                    <div className="mb-6 md:mb-0">
                      <div className="flex items-center mb-2">
                        <h2 className="text-2xl font-bold flex items-center">
                          <SafeIcon icon={FiTarget} className="text-tactical-red mr-2" />
                          Mission Brief
                        </h2>
                        <span className="ml-4 px-3 py-1 bg-tactical-red/20 text-tactical-red rounded-full text-sm">
                          {missionBriefing.industry}
                        </span>
                      </div>
                      <p className="text-gray-300 max-w-xl mb-4">
                        Business: <span className="text-white">{missionBriefing.business_name}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {missionBriefing.goals.map((goal, index) => (
                          <span key={index} className="px-2 py-1 bg-medium-gray rounded-full text-xs">
                            {goal}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center">
                          <SafeIcon icon={FiDollarSign} className="text-tactical-red mr-1" />
                          <span>{missionBriefing.budget_range}</span>
                        </div>
                        <div className="flex items-center">
                          <SafeIcon icon={FiClock} className="text-tactical-red mr-1" />
                          <span>{missionBriefing.timeline}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 relative">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            className="text-medium-gray"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-tactical-red"
                            strokeWidth="8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="42"
                            cx="50"
                            cy="50"
                            strokeDasharray={`${calculateBriefingCompletion() * 2.64}, 264`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{calculateBriefingCompletion()}%</span>
                        </div>
                      </div>
                      <Link 
                        to="/mission-briefing"
                        className="mt-4 px-4 py-2 text-tactical-red border border-tactical-red rounded-lg text-sm hover:bg-tactical-red hover:text-white transition-colors"
                        onClick={() => trackButtonClick('Update Mission Briefing', 'Dashboard')}
                      >
                        Update Brief
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-dark-gray p-6 rounded-lg tactical-border card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <SafeIcon icon={FiTrendingUp} className="text-tactical-red text-2xl" />
                    <div className="text-2xl font-bold text-green-400">
                      {stats.campaignPerformance}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1">Campaign Performance</h3>
                  <p className="text-gray-400 text-sm">vs last month</p>
                </div>
                <div className="bg-dark-gray p-6 rounded-lg tactical-border card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <SafeIcon icon={FiUsers} className="text-tactical-red text-2xl" />
                    <div className="text-2xl font-bold text-blue-400">
                      {stats.leadGeneration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1">Lead Generation</h3>
                  <p className="text-gray-400 text-sm">qualified leads</p>
                </div>
                <div className="bg-dark-gray p-6 rounded-lg tactical-border card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <SafeIcon icon={FiDollarSign} className="text-tactical-red text-2xl" />
                    <div className="text-2xl font-bold text-tactical-red">
                      {stats.revenueImpact}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1">Revenue Impact</h3>
                  <p className="text-gray-400 text-sm">this quarter</p>
                </div>
              </motion.div>

              {/* Recent Contacts */}
              <motion.div 
                className="bg-dark-gray rounded-lg p-8 tactical-border mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold flex items-center">
                    <SafeIcon icon={FiUsers} className="text-tactical-red mr-2" />
                    Recent Contacts
                  </h2>
                  <Link 
                    to="/contact-manager"
                    className="text-tactical-red hover:text-white hover:bg-tactical-red px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
                    onClick={() => trackButtonClick('View All Contacts', 'Dashboard')}
                  >
                    <span>View All</span>
                    <SafeIcon icon={FiArrowRight} className="text-sm" />
                  </Link>
                </div>

                {recentContacts.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="mb-4">No contacts found</p>
                    <Link 
                      to="/contact"
                      className="text-tactical-red hover:underline flex items-center justify-center space-x-1"
                      onClick={() => trackButtonClick('Add Contact', 'Dashboard')}
                    >
                      <SafeIcon icon={FiPlusCircle} />
                      <span>Add your first contact</span>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-medium-gray">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-dark-gray divide-y divide-gray-700">
                        {recentContacts.map((contact) => (
                          <tr 
                            key={contact.id} 
                            className="hover:bg-medium-gray cursor-pointer"
                            onClick={() => {
                              trackButtonClick('Contact Row Click', 'Dashboard');
                              navigate('/contact-manager');
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-start">
                                <div>
                                  <div className="text-sm font-medium">{contact.name}</div>
                                  <div className="text-sm text-gray-400">{contact.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                contact.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                                contact.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                                contact.status === 'qualified' ? 'bg-green-500/20 text-green-400' :
                                contact.status === 'unqualified' ? 'bg-red-500/20 text-red-400' :
                                contact.status === 'converted' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {contact.status || 'new'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {contact.service || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {new Date(contact.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div 
                className="bg-dark-gray rounded-lg p-8 tactical-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link 
                    to="/contact-manager"
                    className="flex flex-col items-center p-4 bg-medium-gray rounded-lg hover:bg-tactical-red/20 transition-colors duration-200"
                    onClick={() => trackButtonClick('Manage Contacts', 'Dashboard Quick Actions')}
                  >
                    <SafeIcon icon={FiUsers} className="text-tactical-red text-2xl mb-2" />
                    <span className="text-sm font-semibold">Manage Contacts</span>
                  </Link>
                  <Link 
                    to="/mission-briefing"
                    className="flex flex-col items-center p-4 bg-medium-gray rounded-lg hover:bg-tactical-red/20 transition-colors duration-200"
                    onClick={() => trackButtonClick('Update Mission Brief', 'Dashboard Quick Actions')}
                  >
                    <SafeIcon icon={FiTarget} className="text-tactical-red text-2xl mb-2" />
                    <span className="text-sm font-semibold">Update Mission Brief</span>
                  </Link>
                  <Link 
                    to="/contact"
                    className="flex flex-col items-center p-4 bg-medium-gray rounded-lg hover:bg-tactical-red/20 transition-colors duration-200"
                    onClick={() => trackButtonClick('New Contact', 'Dashboard Quick Actions')}
                  >
                    <SafeIcon icon={FiPlusCircle} className="text-tactical-red text-2xl mb-2" />
                    <span className="text-sm font-semibold">New Contact</span>
                  </Link>
                  <Link 
                    to="/case-studies"
                    className="flex flex-col items-center p-4 bg-medium-gray rounded-lg hover:bg-tactical-red/20 transition-colors duration-200"
                    onClick={() => trackButtonClick('View Case Studies', 'Dashboard Quick Actions')}
                  >
                    <SafeIcon icon={FiActivity} className="text-tactical-red text-2xl mb-2" />
                    <span className="text-sm font-semibold">View Case Studies</span>
                  </Link>
                </div>
              </motion.div>

              {/* Upcoming Activities */}
              <motion.div 
                className="mt-8 bg-dark-gray rounded-lg p-8 tactical-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-6">Upcoming Activities</h3>
                <div className="space-y-4">
                  {[
                    {action: 'Strategy Session', time: 'Tomorrow, 10:00 AM', status: 'scheduled'},
                    {action: 'Campaign Review', time: 'May 15, 2:00 PM', status: 'scheduled'},
                    {action: 'Monthly Report', time: 'May 30', status: 'pending'}
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-medium-gray rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'scheduled' ? 'bg-green-400' : 
                          activity.status === 'pending' ? 'bg-yellow-400' : 
                          'bg-blue-400'
                        }`}></div>
                        <span>{activity.action}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiCalendar} className="text-tactical-red" />
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;