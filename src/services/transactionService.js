import { supabase } from '../utils/supabase';

export class TransactionService {
  // Get all transactions with filters
  async getTransactions(filters = {}) {
    try {
      let query = supabase?.from('transactions')?.select(`
          *,
          vendor:vendors(name, category),
          category:transaction_categories(name, color_code, is_gst_applicable),
          project:projects(name)
        `)?.order('transaction_date', { ascending: false });

      // Apply filters
      if (filters?.startDate) {
        query = query?.gte('transaction_date', filters?.startDate);
      }
      
      if (filters?.endDate) {
        query = query?.lte('transaction_date', filters?.endDate);
      }
      
      if (filters?.type) {
        query = query?.eq('transaction_type', filters?.type);
      }
      
      if (filters?.categoryId) {
        query = query?.eq('category_id', filters?.categoryId);
      }
      
      if (filters?.vendorId) {
        query = query?.eq('vendor_id', filters?.vendorId);
      }
      
      if (filters?.projectId) {
        query = query?.eq('project_id', filters?.projectId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const { data, error } = await supabase?.from('transactions')?.insert(transactionData)?.select(`
          *,
          vendor:vendors(name, category),
          category:transaction_categories(name, color_code, is_gst_applicable),
          project:projects(name)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Update transaction
  async updateTransaction(id, updates) {
    try {
      const { data, error } = await supabase?.from('transactions')?.update(updates)?.eq('id', id)?.select(`
          *,
          vendor:vendors(name, category),
          category:transaction_categories(name, color_code, is_gst_applicable),
          project:projects(name)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Delete transaction
  async deleteTransaction(id) {
    try {
      const { error } = await supabase?.from('transactions')?.delete()?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Get financial summary
  async getFinancialSummary(period = 'current_month') {
    try {
      let startDate, endDate;
      const now = new Date();
      
      switch (period) {
        case 'current_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'current_quarter':
          const quarter = Math.floor(now?.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
          break;
        case 'current_year':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }

      const { data, error } = await supabase?.from('transactions')?.select('transaction_type, amount, gst_amount, tds_amount')?.gte('transaction_date', startDate?.toISOString()?.split('T')?.[0])?.lte('transaction_date', endDate?.toISOString()?.split('T')?.[0]);

      if (error) throw error;

      const summary = {
        total_income: 0,
        total_expenses: 0,
        total_gst: 0,
        total_tds: 0,
        net_cash_flow: 0,
        transaction_count: data?.length || 0
      };

      data?.forEach(transaction => {
        const amount = parseFloat(transaction?.amount) || 0;
        const gstAmount = parseFloat(transaction?.gst_amount) || 0;
        const tdsAmount = parseFloat(transaction?.tds_amount) || 0;

        if (transaction?.transaction_type === 'income') {
          summary.total_income += amount;
        } else if (transaction?.transaction_type === 'expense') {
          summary.total_expenses += amount;
        }
        
        summary.total_gst += gstAmount;
        summary.total_tds += tdsAmount;
      });

      summary.net_cash_flow = summary?.total_income - summary?.total_expenses;

      return summary;
    } catch (error) {
      console.error('Error getting financial summary:', error);
      throw error;
    }
  }

  // Get expense breakdown by category
  async getExpenseBreakdown(period = 'current_month') {
    try {
      let startDate, endDate;
      const now = new Date();
      
      switch (period) {
        case 'current_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          break;
        case 'current_quarter':
          const quarter = Math.floor(now?.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
          break;
        case 'current_year':
          startDate = new Date(now.getFullYear(), 0, 1);
          endDate = new Date(now.getFullYear(), 11, 31);
          break;
      }

      const { data, error } = await supabase?.from('transactions')?.select(`
          amount,
          category:transaction_categories(name, color_code)
        `)?.eq('transaction_type', 'expense')?.gte('transaction_date', startDate?.toISOString()?.split('T')?.[0])?.lte('transaction_date', endDate?.toISOString()?.split('T')?.[0]);

      if (error) throw error;

      const breakdown = {};
      data?.forEach(transaction => {
        const amount = parseFloat(transaction?.amount) || 0;
        const categoryName = transaction?.category?.name || 'Uncategorized';
        const colorCode = transaction?.category?.color_code || '#6B7280';

        if (!breakdown?.[categoryName]) {
          breakdown[categoryName] = {
            name: categoryName,
            amount: 0,
            color: colorCode
          };
        }
        breakdown[categoryName].amount += amount;
      });

      return Object.values(breakdown);
    } catch (error) {
      console.error('Error getting expense breakdown:', error);
      throw error;
    }
  }

  // Get cash flow data for charts
  async getCashFlowData(months = 6) {
    try {
      let endDate = new Date();
      let startDate = new Date();
      startDate?.setMonth(startDate?.getMonth() - months);

      const { data, error } = await supabase?.from('transactions')?.select('transaction_type, amount, transaction_date')?.gte('transaction_date', startDate?.toISOString()?.split('T')?.[0])?.lte('transaction_date', endDate?.toISOString()?.split('T')?.[0])?.order('transaction_date');

      if (error) throw error;

      const monthlyData = {};
      
      data?.forEach(transaction => {
        const date = new Date(transaction.transaction_date);
        const monthKey = `${date?.getFullYear()}-${(date?.getMonth() + 1)?.toString()?.padStart(2, '0')}`;
        const amount = parseFloat(transaction?.amount) || 0;

        if (!monthlyData?.[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }

        if (transaction?.transaction_type === 'income') {
          monthlyData[monthKey].income += amount;
        } else if (transaction?.transaction_type === 'expense') {
          monthlyData[monthKey].expense += amount;
        }
      });

      // Fill in missing months with zero values
      for (let i = 0; i < months; i++) {
        const date = new Date();
        date?.setMonth(date?.getMonth() - i);
        const monthKey = `${date?.getFullYear()}-${(date?.getMonth() + 1)?.toString()?.padStart(2, '0')}`;
        
        if (!monthlyData?.[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }
      }

      return Object.values(monthlyData)?.sort((a, b) => a?.month?.localeCompare(b?.month));
    } catch (error) {
      console.error('Error getting cash flow data:', error);
      throw error;
    }
  }

  // Upload invoice file
  async uploadInvoice(file, transactionId) {
    try {
      const fileExt = file?.name?.split('.')?.pop();
      const fileName = `${transactionId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase?.storage?.from('invoice-documents')?.upload(fileName, file, {
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase?.storage?.from('invoice-documents')?.getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading invoice:', error);
      throw error;
    }
  }

  // Get recent transactions
  async getRecentTransactions(limit = 10) {
    try {
      const { data, error } = await supabase?.from('transactions')?.select(`
          *,
          vendor:vendors(name),
          category:transaction_categories(name, color_code)
        `)?.order('created_at', { ascending: false })?.limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      throw error;
    }
  }
}

export const transactionService = new TransactionService();