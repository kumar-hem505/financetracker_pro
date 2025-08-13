import { supabase } from '../utils/supabase';

export class BudgetService {
  // Get all budgets with spending data
  async getBudgets(filters = {}) {
    try {
      let query = supabase?.from('budgets')?.select(`
          *,
          category:transaction_categories(name, color_code)
        `)?.order('created_at', { ascending: false });

      // Apply filters
      if (filters?.department) {
        query = query?.eq('department', filters?.department);
      }
      
      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }
      
      if (filters?.period) {
        const now = new Date();
        switch (filters?.period) {
          case 'current':
            query = query?.lte('period_start', now?.toISOString()?.split('T')?.[0])?.gte('period_end', now?.toISOString()?.split('T')?.[0]);
            break;
          case 'upcoming':
            query = query?.gt('period_start', now?.toISOString()?.split('T')?.[0]);
            break;
          case 'past':
            query = query?.lt('period_end', now?.toISOString()?.split('T')?.[0]);
            break;
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Calculate utilization percentage for each budget
      const budgetsWithUtilization = data?.map(budget => ({
        ...budget,
        utilization_percentage: budget?.allocated_amount > 0 
          ? (budget?.spent_amount / budget?.allocated_amount) * 100 
          : 0,
        remaining_amount: budget?.allocated_amount - budget?.spent_amount,
        days_remaining: this.calculateDaysRemaining(budget?.period_end)
      })) || [];

      return budgetsWithUtilization;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  }

  // Create new budget
  async createBudget(budgetData) {
    try {
      const { data, error } = await supabase?.from('budgets')?.insert(budgetData)?.select(`
          *,
          category:transaction_categories(name, color_code)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  }

  // Update budget
  async updateBudget(id, updates) {
    try {
      const { data, error } = await supabase?.from('budgets')?.update(updates)?.eq('id', id)?.select(`
          *,
          category:transaction_categories(name, color_code)
        `)?.single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  }

  // Delete budget
  async deleteBudget(id) {
    try {
      const { error } = await supabase?.from('budgets')?.delete()?.eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }

  // Get budget performance summary
  async getBudgetPerformanceSummary() {
    try {
      const { data, error } = await supabase?.from('budgets')?.select('*')?.eq('status', 'active');

      if (error) throw error;

      const summary = {
        total_budgets: data?.length || 0,
        total_allocated: 0,
        total_spent: 0,
        total_remaining: 0,
        overrun_count: 0,
        on_track_count: 0,
        at_risk_count: 0
      };

      data?.forEach(budget => {
        const allocated = parseFloat(budget?.allocated_amount) || 0;
        const spent = parseFloat(budget?.spent_amount) || 0;
        const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;

        summary.total_allocated += allocated;
        summary.total_spent += spent;
        summary.total_remaining += (allocated - spent);

        if (utilization > 100) {
          summary.overrun_count++;
        } else if (utilization > (budget?.alert_threshold || 80)) {
          summary.at_risk_count++;
        } else {
          summary.on_track_count++;
        }
      });

      summary.average_utilization = summary?.total_allocated > 0 
        ? (summary?.total_spent / summary?.total_allocated) * 100 
        : 0;

      return summary;
    } catch (error) {
      console.error('Error getting budget performance summary:', error);
      throw error;
    }
  }

  // Get department-wise budget breakdown
  async getDepartmentBudgetBreakdown() {
    try {
      const { data, error } = await supabase?.from('budgets')?.select('department, allocated_amount, spent_amount')?.eq('status', 'active');

      if (error) throw error;

      const departmentData = {};
      
      data?.forEach(budget => {
        const department = budget?.department || 'Unassigned';
        const allocated = parseFloat(budget?.allocated_amount) || 0;
        const spent = parseFloat(budget?.spent_amount) || 0;

        if (!departmentData?.[department]) {
          departmentData[department] = {
            department,
            allocated: 0,
            spent: 0,
            budgets_count: 0
          };
        }

        departmentData[department].allocated += allocated;
        departmentData[department].spent += spent;
        departmentData[department].budgets_count++;
      });

      return Object.values(departmentData)?.map(dept => ({
        ...dept,
        utilization: dept?.allocated > 0 ? (dept?.spent / dept?.allocated) * 100 : 0,
        remaining: dept?.allocated - dept?.spent
      }));
    } catch (error) {
      console.error('Error getting department budget breakdown:', error);
      throw error;
    }
  }

  // Get budget alerts
  async getBudgetAlerts() {
    try {
      const { data, error } = await supabase?.from('budgets')?.select('*')?.eq('status', 'active');

      if (error) throw error;

      const alerts = [];

      data?.forEach(budget => {
        const allocated = parseFloat(budget?.allocated_amount) || 0;
        const spent = parseFloat(budget?.spent_amount) || 0;
        const utilization = allocated > 0 ? (spent / allocated) * 100 : 0;
        const threshold = budget?.alert_threshold || 80;

        if (utilization >= 100) {
          alerts?.push({
            type: 'overrun',
            priority: 'critical',
            budget_id: budget?.id,
            budget_name: budget?.name,
            message: `Budget exceeded by ₹${(spent - allocated)?.toLocaleString('en-IN')}`,
            utilization: utilization
          });
        } else if (utilization >= threshold) {
          alerts?.push({
            type: 'threshold',
            priority: utilization >= 90 ? 'high' : 'medium',
            budget_id: budget?.id,
            budget_name: budget?.name,
            message: `Budget utilization at ${utilization?.toFixed(1)}%`,
            utilization: utilization
          });
        }

        // Check for upcoming budget end dates
        const daysRemaining = this.calculateDaysRemaining(budget?.period_end);
        if (daysRemaining <= 7 && daysRemaining > 0) {
          alerts?.push({
            type: 'expiring',
            priority: 'medium',
            budget_id: budget?.id,
            budget_name: budget?.name,
            message: `Budget expires in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`,
            days_remaining: daysRemaining
          });
        }
      });

      return alerts?.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
      });
    } catch (error) {
      console.error('Error getting budget alerts:', error);
      throw error;
    }
  }

  // Get budget trends (monthly comparison)
  async getBudgetTrends(months = 6) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate?.setMonth(startDate?.getMonth() - months);

      const { data, error } = await supabase?.from('budgets')?.select('name, department, allocated_amount, spent_amount, period_start, period_end')?.gte('period_start', startDate?.toISOString()?.split('T')?.[0])?.lte('period_end', endDate?.toISOString()?.split('T')?.[0])?.order('period_start');

      if (error) throw error;

      const monthlyTrends = {};
      
      data?.forEach(budget => {
        const startDate = new Date(budget.period_start);
        const monthKey = `${startDate?.getFullYear()}-${(startDate?.getMonth() + 1)?.toString()?.padStart(2, '0')}`;
        
        if (!monthlyTrends?.[monthKey]) {
          monthlyTrends[monthKey] = {
            month: monthKey,
            total_allocated: 0,
            total_spent: 0,
            budget_count: 0
          };
        }

        monthlyTrends[monthKey].total_allocated += parseFloat(budget?.allocated_amount) || 0;
        monthlyTrends[monthKey].total_spent += parseFloat(budget?.spent_amount) || 0;
        monthlyTrends[monthKey].budget_count++;
      });

      return Object.values(monthlyTrends)?.map(trend => ({
          ...trend,
          utilization: trend?.total_allocated > 0 ? (trend?.total_spent / trend?.total_allocated) * 100 : 0
        }))?.sort((a, b) => a?.month?.localeCompare(b?.month));
    } catch (error) {
      console.error('Error getting budget trends:', error);
      throw error;
    }
  }

  // Helper function to calculate days remaining
  calculateDaysRemaining(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const budgetService = new BudgetService();