import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHome from './DashboardHome';
import ContactManager from './ContactManager';
import MissionBriefing from './MissionBriefing';
import { trackPageView } from '../utils/analytics';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard - Secret Agent Digital Marketing');
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <motion.div 
      className="min-h-screen bg-jet-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <DashboardSidebar />
      <div className="lg:ml-64 transition-all duration-300">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/contact-manager" element={<Navigate to="/contact-manager" replace />} />
          <Route path="/mission-briefing" element={<Navigate to="/mission-briefing" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </motion.div>
  );
};

export default Dashboard;