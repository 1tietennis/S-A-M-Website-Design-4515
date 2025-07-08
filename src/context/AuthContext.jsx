import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuthStatus = () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const userProfile = localStorage.getItem('userProfile');

      if (userId && token) {
        setIsAuthenticated(true);
        if (userProfile) {
          try {
            setUser(JSON.parse(userProfile));
          } catch (error) {
            console.error('Error parsing user profile:', error);
            // Clear invalid data
            localStorage.removeItem('userProfile');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = (userData) => {
    const { userId, token, userProfile, newUser } = userData;
    
    // Store authentication data
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
      setUser(userProfile);
    }

    setIsAuthenticated(true);
    
    return { newUser };
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('onboardingCompleted');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
  };

  const isOnboardingCompleted = () => {
    return localStorage.getItem('onboardingCompleted') === 'true';
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    completeOnboarding,
    isOnboardingCompleted
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};