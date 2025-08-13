import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react';
import { supabase, getUserProfile } from '../utils/supabase';

const AuthContext = createContext({});

const PUBLISHABLE_KEY = import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export function AuthProvider({ children }) {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </ClerkProvider>
  );
}

function AuthContextProvider({ children }) {
  const { isLoaded, userId, getToken } = useAuth();
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabaseToken, setSupabaseToken] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    const setupAuth = async () => {
      try {
        if (userId && user) {
          // Get Clerk token for Supabase auth
          const token = await getToken({ template: 'supabase' });
          
          if (token) {
            // Set Supabase auth token
            await supabase?.auth?.setSession({
              access_token: token,
              refresh_token: '',
              user: {
                id: userId,
                email: user?.primaryEmailAddress?.emailAddress,
                app_metadata: {},
                user_metadata: {
                  full_name: user?.fullName,
                  role: user?.publicMetadata?.role || 'viewer'
                },
                aud: 'authenticated',
                role: 'authenticated'
              }
            });
            
            setSupabaseToken(token);
            
            // Get or create user profile in Supabase
            try {
              const profile = await getUserProfile(userId);
              setUserProfile(profile);
            } catch (error) {
              if (error?.code === 'PGRST116') {
                // Profile doesn't exist, create it
                const { data, error: insertError } = await supabase?.from('user_profiles')?.insert({
                    id: userId,
                    email: user?.primaryEmailAddress?.emailAddress,
                    full_name: user?.fullName || 'User',
                    role: user?.publicMetadata?.role || 'viewer',
                    company_name: user?.publicMetadata?.company_name || null,
                    phone: user?.primaryPhoneNumber?.phoneNumber || null
                  })?.select()?.single();
                
                if (!insertError) {
                  setUserProfile(data);
                }
              }
            }
          }
        } else {
          // User is not authenticated, clear Supabase session
          await supabase?.auth?.signOut();
          setUserProfile(null);
          setSupabaseToken(null);
        }
      } catch (error) {
        console.error('Auth setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();
  }, [isLoaded, userId, user, getToken]);

  const value = {
    user,
    userId,
    userProfile,
    loading,
    supabaseToken,
    isAuthenticated: !!userId,
    hasRole: (role) => userProfile?.role === role || user?.publicMetadata?.role === role,
    isAdmin: () => userProfile?.role === 'admin' || user?.publicMetadata?.role === 'admin',
    isAccountant: () => ['admin', 'accountant']?.includes(userProfile?.role) || ['admin', 'accountant']?.includes(user?.publicMetadata?.role),
    canManageTransactions: () => ['admin', 'accountant']?.includes(userProfile?.role) || ['admin', 'accountant']?.includes(user?.publicMetadata?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};