import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../lib/supabase';
import { sendToCyborgCRM } from '../utils/cyborgCRM';
import { sendNotification, createToast } from '../utils/notifications';

const { 
  FiUsers, FiSearch, FiFilter, FiChevronDown, FiChevronUp, 
  FiMail, FiPhone, FiDollarSign, FiClock, FiStar,
  FiCheck, FiX, FiEdit, FiTrash2, FiRefreshCw
} = FiIcons;

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchContacts();
  }, [sortField, sortDirection, filterStatus, refreshTrigger]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('contacts_x7p29ak4m3')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' });
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setContacts(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to load contacts. Please try again.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshContacts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const updateContactStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('contacts_x7p29ak4m3')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, status } : contact
      ));
      
      // If we're viewing the contact details, update that too
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
      
      createToast({ 
        message: `Contact status updated to "${status}"`,
        type: "success" 
      });
      
    } catch (error) {
      console.error('Error updating contact status:', error);
      createToast({ 
        message: "Failed to update contact status",
        type: "error" 
      });
    }
  };

  const deleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('contacts_x7p29ak4m3')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setContacts(contacts.filter(contact => contact.id !== id));
      
      // If we're viewing this contact, close the modal
      if (selectedContact && selectedContact.id === id) {
        setIsContactModalOpen(false);
        setSelectedContact(null);
      }
      
      createToast({ 
        message: "Contact deleted successfully",
        type: "success" 
      });
      
    } catch (error) {
      console.error('Error deleting contact:', error);
      createToast({ 
        message: "Failed to delete contact",
        type: "error" 
      });
    }
  };

  const resendToCyborgCRM = (contact) => {
    try {
      const result = sendToCyborgCRM(contact);
      if (result) {
        createToast({ 
          message: "Contact re-sent to CyborgCRM successfully",
          type: "success" 
        });
        // Also send a notification
        sendNotification(contact, 'success');
      } else {
        throw new Error('Failed to send to CyborgCRM');
      }
    } catch (error) {
      console.error('Error re-sending to CyborgCRM:', error);
      createToast({ 
        message: "Failed to re-send contact to CyborgCRM",
        type: "error" 
      });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const openContactDetails = (contact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setSelectedContact(null);
  };

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.company?.toLowerCase().includes(searchLower) ||
      contact.service?.toLowerCase().includes(searchLower)
    );
  });

  // Render lead score badge with color based on score
  const renderLeadScoreBadge = (score) => {
    let colorClass = 'bg-gray-500';
    if (score >= 80) colorClass = 'bg-green-500';
    else if (score >= 60) colorClass = 'bg-blue-500';
    else if (score >= 40) colorClass = 'bg-yellow-500';
    else if (score >= 20) colorClass = 'bg-orange-500';
    
    return (
      <span className={`${colorClass} text-white text-xs font-bold px-2 py-1 rounded`}>
        {score}
      </span>
    );
  };

  // Render status badge with color based on status
  const renderStatusBadge = (status) => {
    let colorClass = '';
    switch(status) {
      case 'new':
        colorClass = 'bg-blue-500';
        break;
      case 'contacted':
        colorClass = 'bg-yellow-500';
        break;
      case 'qualified':
        colorClass = 'bg-green-500';
        break;
      case 'unqualified':
        colorClass = 'bg-red-500';
        break;
      case 'converted':
        colorClass = 'bg-purple-500';
        break;
      default:
        colorClass = 'bg-gray-500';
    }
    
    return (
      <span className={`${colorClass} text-white text-xs font-bold px-2 py-1 rounded capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-jet-black">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-display">
            <SafeIcon icon={FiUsers} className="inline-block mr-2 text-tactical-red" />
            Contact <span className="text-tactical-red">Manager</span>
          </h1>
          
          <button 
            onClick={refreshContacts}
            className="px-4 py-2 bg-tactical-red text-white rounded-lg flex items-center space-x-2"
          >
            <SafeIcon icon={FiRefreshCw} />
            <span>Refresh</span>
          </button>
        </div>
        
        {/* Search and filter controls */}
        <div className="bg-dark-gray p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-4 py-2 bg-medium-gray border border-gray-700 rounded-lg focus:border-tactical-red focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiFilter} className="text-gray-400" />
                <select
                  className="bg-medium-gray border border-gray-700 rounded-lg px-3 py-2 focus:border-tactical-red focus:outline-none"
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="unqualified">Unqualified</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {/* Contacts table */}
        <div className="bg-dark-gray rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-medium-gray">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {sortField === 'name' && (
                        <SafeIcon icon={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} className="text-tactical-red" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('service')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Service</span>
                      {sortField === 'service' && (
                        <SafeIcon icon={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} className="text-tactical-red" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('budget')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Budget</span>
                      {sortField === 'budget' && (
                        <SafeIcon icon={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} className="text-tactical-red" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('lead_score')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Score</span>
                      {sortField === 'lead_score' && (
                        <SafeIcon icon={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} className="text-tactical-red" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <SafeIcon icon={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} className="text-tactical-red" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortField === 'created_at' && (
                        <SafeIcon icon={sortDirection === 'asc' ? FiChevronUp : FiChevronDown} className="text-tactical-red" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-gray divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-tactical-red"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-medium-gray cursor-pointer" onClick={() => openContactDetails(contact)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="ml-2">
                            <div className="text-sm font-medium">{contact.name}</div>
                            <div className="text-sm text-gray-400">{contact.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{contact.service || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{contact.budget || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderLeadScoreBadge(contact.lead_score || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(contact.status || 'new')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openContactDetails(contact);
                          }}
                          className="text-tactical-red hover:text-tactical-red-dark mr-3"
                        >
                          <SafeIcon icon={FiEdit} className="text-lg" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContact(contact.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <SafeIcon icon={FiTrash2} className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-400">
                      No contacts found. Adjust your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Contact count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </div>
      </div>
      
      {/* Contact Details Modal */}
      {isContactModalOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <motion.div 
            className="bg-dark-gray rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">Contact Details</h2>
                <button 
                  onClick={closeContactModal}
                  className="text-gray-400 hover:text-white"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Name</p>
                      <p className="font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Email</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{selectedContact.email}</p>
                        <a 
                          href={`mailto:${selectedContact.email}`}
                          className="text-tactical-red hover:text-tactical-red-dark"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <SafeIcon icon={FiMail} />
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Company</p>
                      <p className="font-medium">{selectedContact.company || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Phone</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{selectedContact.phone || 'N/A'}</p>
                        {selectedContact.phone && (
                          <a 
                            href={`tel:${selectedContact.phone}`}
                            className="text-tactical-red hover:text-tactical-red-dark"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SafeIcon icon={FiPhone} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm">Service Interest</p>
                      <p className="font-medium">{selectedContact.service || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Budget</p>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiDollarSign} className="text-tactical-red" />
                        <p className="font-medium">{selectedContact.budget || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Urgency</p>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiClock} className="text-tactical-red" />
                        <p className="font-medium">{selectedContact.urgency || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Lead Score</p>
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiStar} className="text-tactical-red" />
                        <p className="font-medium">{selectedContact.lead_score || 0}</p>
                        {renderLeadScoreBadge(selectedContact.lead_score || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Message</h3>
                <div className="bg-medium-gray p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedContact.message || 'No message provided.'}</p>
                </div>
              </div>
              
              {/* Status and Actions */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Current Status</p>
                    <div className="flex items-center space-x-2">
                      {renderStatusBadge(selectedContact.status || 'new')}
                      <p className="text-sm text-gray-400">
                        Created: {new Date(selectedContact.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'new')}
                      className={`px-3 py-1 rounded ${selectedContact.status === 'new' ? 'bg-blue-500 text-white' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white'}`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'contacted')}
                      className={`px-3 py-1 rounded ${selectedContact.status === 'contacted' ? 'bg-yellow-500 text-white' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500 hover:text-white'}`}
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'qualified')}
                      className={`px-3 py-1 rounded ${selectedContact.status === 'qualified' ? 'bg-green-500 text-white' : 'bg-green-500/20 text-green-300 hover:bg-green-500 hover:text-white'}`}
                    >
                      Qualified
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'unqualified')}
                      className={`px-3 py-1 rounded ${selectedContact.status === 'unqualified' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white'}`}
                    >
                      Unqualified
                    </button>
                    <button
                      onClick={() => updateContactStatus(selectedContact.id, 'converted')}
                      className={`px-3 py-1 rounded ${selectedContact.status === 'converted' ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white'}`}
                    >
                      Converted
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-between mt-6 border-t border-gray-700 pt-6">
                <button
                  onClick={() => resendToCyborgCRM(selectedContact)}
                  className="px-4 py-2 bg-tactical-red text-white rounded-lg flex items-center space-x-2"
                >
                  <SafeIcon icon={FiRefreshCw} />
                  <span>Resend to CRM</span>
                </button>
                
                <div className="space-x-2">
                  <button
                    onClick={closeContactModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                  >
                    Close
                  </button>
                  
                  <button
                    onClick={() => deleteContact(selectedContact.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiTrash2} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ContactManager;