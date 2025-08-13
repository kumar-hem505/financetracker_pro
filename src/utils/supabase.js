import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase?.auth?.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single();
  
  if (error) throw error;
  return data;
};

// Helper function for currency formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  })?.format(amount);
};

// Helper function for date formatting
export const formatDate = (date) => {
  return new Date(date)?.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function for transaction status
export const getTransactionStatusColor = (type) => {
  switch (type) {
    case 'income': return 'text-green-600 bg-green-50';
    case 'expense': return 'text-red-600 bg-red-50';
    case 'refund': return 'text-blue-600 bg-blue-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};