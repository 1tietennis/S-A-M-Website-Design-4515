import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

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
    const checkAuthStatus = async () => {
      try {
        // Check if user is authenticated with Supabase
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error checking auth status:', error);
          setIsAuthenticated(false);
          setUser(null);
        } else if (supabaseUser) {
          setIsAuthenticated(true);
          setUser(supabaseUser);
          
          // Get user profile if available
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();
            
          if (profile) {
            setUser({
              ...supabaseUser,
              ...profile
            });
          }
        }
      } catch (error) {
        console.error('Error in auth check:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && session.user) {
          setIsAuthenticated(true);
          setUser(session.user);
          
          // Get user profile if available
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setUser({
              ...session.user,
              ...profile
            });
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      setUser(data.user);
      
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const completeOnboarding = async (userData) => {
    if (!user) return;
    
    try {
      // Update user profile with onboarding data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...userData,
          onboarding_completed: true,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        ...userData,
        onboarding_completed: true
      });
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  const isOnboardingCompleted = () => {
    return user?.onboarding_completed || false;
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
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