import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import { trackButtonClick } from '../utils/analytics';

const {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPlay,
  FiPause,
  FiRefreshCw,
  FiCalendar,
  FiDollarSign,
  FiTarget,
  FiUsers,
  FiClock,
  FiCheck,
  FiX,
  FiAlertCircle
} = FiIcons;

const CampaignManager = ({ campaigns: initialCampaigns = [] }) => {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_audience: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'draft'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (initialCampaigns.length === 0) {
      fetchCampaigns();
    } else {
      setCampaigns(initialCampaigns);
    }
  }, [initialCampaigns]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns_7b3f9x5a2d')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openNewCampaignModal = () => {
    setCurrentCampaign(null);
    setFormData({
      name: '',
      description: '',
      target_audience: '',
      budget: '',
      start_date: '',
      end_date: '',
      status: 'draft'
    });
    setShowModal(true);
    trackButtonClick('Create New Campaign', 'Campaign Manager');
  };

  const openEditCampaignModal = (campaign) => {
    setCurrentCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      target_audience: campaign.target_audience || '',
      budget: campaign.budget || '',
      start_date: campaign.start_date ? campaign.start_date.substring(0, 10) : '',
      end_date: campaign.end_date ? campaign.end_date.substring(0, 10) : '',
      status: campaign.status || 'draft'
    });
    setShowModal(true);
    trackButtonClick('Edit Campaign', 'Campaign Manager');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      if (currentCampaign) {
        // Update existing campaign
        const { error } = await supabase
          .from('marketing_campaigns_7b3f9x5a2d')
          .update(formData)
          .eq('id', currentCampaign.id);
        
        if (error) throw error;
        
        setCampaigns(prev => 
          prev.map(c => c.id === currentCampaign.id ? { ...c, ...formData } : c)
        );
        setSuccess('Campaign updated successfully!');
        trackButtonClick('Update Campaign Success', 'Campaign Manager Form');
      } else {
        // Create new campaign
        const { data, error } = await supabase
          .from('marketing_campaigns_7b3f9x5a2d')
          .insert([formData])
          .select();
        
        if (error) throw error;
        
        setCampaigns(prev => [data[0], ...prev]);
        setSuccess('Campaign created successfully!');
        trackButtonClick('Create Campaign Success', 'Campaign Manager Form');
      }
      
      // Close modal after short delay
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      }, 1500);
    } catch (error) {
      console.error('Error saving campaign:', error);
      setError('Failed to save campaign. Please try again.');
      trackButtonClick('Campaign Save Error', 'Campaign Manager Form');
    }
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      const { error } = await supabase
        .from('marketing_campaigns_7b3f9x5a2d')
        .update({ status: newStatus })
        .eq('id', campaignId);
      
      if (error) throw error;
      
      setCampaigns(prev => 
        prev.map(c => c.id === campaignId ? { ...c, status: newStatus } : c)
      );
      trackButtonClick(`Campaign Status: ${newStatus}`, 'Campaign Manager');
    } catch (error) {
      console.error('Error updating campaign status:', error);
      setError('Failed to update campaign status. Please try again.');
    }
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      const { error } = await supabase
        .from('marketing_campaigns_7b3f9x5a2d')
        .delete()
        .eq('id', campaignId);
      
      if (error) throw error;
      
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      trackButtonClick('Delete Campaign', 'Campaign Manager');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-display font-bold">
          Campaign <span className="text-tactical-red">Manager</span>
        </h2>
        <button
          className="px-4 py-2 btn-primary rounded-lg font-semibold flex items-center space-x-2"
          onClick={openNewCampaignModal}
        >
          <SafeIcon icon={FiPlus} />
          <span>New Campaign</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
          <SafeIcon icon={FiAlertCircle} className="text-red-500 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tactical-red"></div>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              className="bg-medium-gray p-5 rounded-lg tactical-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold mr-3">{campaign.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded capitalize ${
                      campaign.status === 'active' ? 'bg-green-500 text-white' :
                      campaign.status === 'paused' ? 'bg-yellow-500 text-white' :
                      campaign.status === 'draft' ? 'bg-blue-500 text-white' :
                      campaign.status === 'completed' ? 'bg-purple-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1 line-clamp-2">
                    {campaign.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {campaign.status === 'draft' && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded flex items-center space-x-1"
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                    >
                      <SafeIcon icon={FiPlay} className="text-sm" />
                      <span>Start</span>
                    </button>
                  )}
                  
                  {campaign.status === 'active' && (
                    <button
                      className="px-3 py-1 bg-yellow-600 text-white rounded flex items-center space-x-1"
                      onClick={() => handleStatusChange(campaign.id, 'paused')}
                    >
                      <SafeIcon icon={FiPause} className="text-sm" />
                      <span>Pause</span>
                    </button>
                  )}
                  
                  {campaign.status === 'paused' && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded flex items-center space-x-1"
                      onClick={() => handleStatusChange(campaign.id, 'active')}
                    >
                      <SafeIcon icon={FiPlay} className="text-sm" />
                      <span>Resume</span>
                    </button>
                  )}
                  
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded flex items-center space-x-1"
                    onClick={() => openEditCampaignModal(campaign)}
                  >
                    <SafeIcon icon={FiEdit} className="text-sm" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded flex items-center space-x-1"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  >
                    <SafeIcon icon={FiTrash2} className="text-sm" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiCalendar} className="text-tactical-red" />
                  <div>
                    <div className="text-gray-400">Start Date</div>
                    <div>{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'Not set'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiDollarSign} className="text-tactical-red" />
                  <div>
                    <div className="text-gray-400">Budget</div>
                    <div>${campaign.budget?.toLocaleString() || '0'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiTarget} className="text-tactical-red" />
                  <div>
                    <div className="text-gray-400">Target Audience</div>
                    <div>{campaign.target_audience || 'Not specified'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiUsers} className="text-tactical-red" />
                  <div>
                    <div className="text-gray-400">Leads Generated</div>
                    <div>{campaign.performance_metrics?.leads || '0'}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-medium-gray rounded-lg p-10 text-center">
          <SafeIcon icon={FiTarget} className="text-tactical-red text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Campaigns Yet</h3>
          <p className="text-gray-400 mb-6">Create your first marketing campaign to start generating leads.</p>
          <button
            className="px-6 py-3 btn-primary rounded-lg font-semibold inline-flex items-center space-x-2"
            onClick={openNewCampaignModal}
          >
            <SafeIcon icon={FiPlus} />
            <span>Create First Campaign</span>
          </button>
        </div>
      )}

      {/* Campaign Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-dark-gray rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">
                  {currentCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <SafeIcon icon={FiAlertCircle} className="text-red-500 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <SafeIcon icon={FiCheck} className="text-green-500 mr-2 flex-shrink-0" />
                  <p>{success}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Campaign Name*
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                      <textarea
                        name="description"
                        rows="3"
                        className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none resize-vertical"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Audience
                      <input
                        type="text"
                        name="target_audience"
                        className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                        value={formData.target_audience}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Budget ($)
                        <input
                          type="number"
                          name="budget"
                          min="0"
                          step="0.01"
                          className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                          value={formData.budget}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                        <select
                          name="status"
                          className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Start Date
                        <input
                          type="date"
                          name="start_date"
                          className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                          value={formData.start_date}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        End Date
                        <input
                          type="date"
                          name="end_date"
                          className="w-full mt-1 bg-medium-gray border border-gray-600 rounded-lg p-3 focus:border-tactical-red focus:outline-none"
                          value={formData.end_date}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 btn-primary rounded-lg font-semibold"
                  >
                    {currentCampaign ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CampaignManager;