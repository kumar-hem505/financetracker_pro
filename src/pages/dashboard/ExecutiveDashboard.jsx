import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transactionService';
import { budgetService } from '../../services/budgetService';
import { formatCurrency } from '../../utils/supabase';
import { showToast } from '../../components/ui/Toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  PieChart,
  BarChart3,
  Target,
  RefreshCw
} from 'lucide-react';
import Chart from 'react-apexcharts';

export default function ExecutiveDashboard() {
  const { userProfile } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        financial,
        budget,
        cashFlow,
        expenses,
        alerts
      ] = await Promise.all([
        transactionService?.getFinancialSummary('current_month'),
        budgetService?.getBudgetPerformanceSummary(),
        transactionService?.getCashFlowData(6),
        transactionService?.getExpenseBreakdown('current_month'),
        budgetService?.getBudgetAlerts()
      ]);

      setFinancialSummary(financial);
      setBudgetSummary(budget);
      setCashFlowData(cashFlow);
      setExpenseBreakdown(expenses);
      setBudgetAlerts(alerts?.slice(0, 5)); // Top 5 alerts

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast?.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    showToast?.success('Dashboard data refreshed');
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // KPI Cards Component
  const KPICards = () => {
    const kpis = [
      {
        title: 'Net Cash Flow',
        value: financialSummary?.net_cash_flow || 0,
        icon: financialSummary?.net_cash_flow >= 0 ? TrendingUp : TrendingDown,
        color: financialSummary?.net_cash_flow >= 0 ? 'text-green-600' : 'text-red-600',
        bgColor: financialSummary?.net_cash_flow >= 0 ? 'bg-green-50' : 'bg-red-50',
        change: '+12.5%', // This would be calculated from previous period
        isPositive: true
      },
      {
        title: 'Total Income',
        value: financialSummary?.total_income || 0,
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        change: '+8.2%',
        isPositive: true
      },
      {
        title: 'Total Expenses',
        value: financialSummary?.total_expenses || 0,
        icon: TrendingDown,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        change: '+5.1%',
        isPositive: false
      },
      {
        title: 'Budget Utilization',
        value: budgetSummary?.average_utilization || 0,
        icon: Target,
        color: budgetSummary?.average_utilization > 80 ? 'text-yellow-600' : 'text-blue-600',
        bgColor: budgetSummary?.average_utilization > 80 ? 'bg-yellow-50' : 'bg-blue-50',
        isPercentage: true,
        change: '-2.3%',
        isPositive: false
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis?.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{kpi?.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kpi?.isPercentage 
                    ? `${kpi?.value?.toFixed(1)}%` 
                    : formatCurrency(kpi?.value)
                  }
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-sm font-medium ${
                    kpi?.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi?.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi?.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi?.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Cash Flow Chart Component
  const CashFlowChart = () => {
    const chartData = {
      series: [
        {
          name: 'Income',
          data: cashFlowData?.map(item => item?.income) || []
        },
        {
          name: 'Expenses',
          data: cashFlowData?.map(item => item?.expense) || []
        }
      ],
      options: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#10B981', '#EF4444'],
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        xaxis: {
          categories: cashFlowData?.map(item => {
            const [year, month] = item?.month?.split('-');
            return new Date(year, month - 1)?.toLocaleDateString('en-IN', { 
              month: 'short',
              year: '2-digit'
            });
          }) || []
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return formatCurrency(value);
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return formatCurrency(value);
            }
          }
        },
        grid: {
          borderColor: '#f3f4f6'
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right'
        }
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Cash Flow Trend</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <Chart 
          options={chartData?.options}
          series={chartData?.series}
          type="line"
          height={350}
        />
      </div>
    );
  };

  // Expense Breakdown Chart Component
  const ExpenseBreakdownChart = () => {
    const chartData = {
      series: expenseBreakdown?.map(item => item?.amount) || [],
      options: {
        chart: {
          type: 'donut',
          height: 350
        },
        labels: expenseBreakdown?.map(item => item?.name) || [],
        colors: expenseBreakdown?.map(item => item?.color) || [],
        plotOptions: {
          pie: {
            donut: {
              size: '65%'
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return `${val?.toFixed(1)}%`;
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return formatCurrency(value);
            }
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        }
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
          <PieChart className="w-5 h-5 text-gray-400" />
        </div>
        {expenseBreakdown?.length > 0 ? (
          <Chart 
            options={chartData?.options}
            series={chartData?.series}
            type="donut"
            height={350}
          />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No expense data available
          </div>
        )}
      </div>
    );
  };

  // Budget Alerts Component
  const BudgetAlertsPanel = () => {
    const alertColors = {
      critical: 'border-red-200 bg-red-50',
      high: 'border-orange-200 bg-orange-50',
      medium: 'border-yellow-200 bg-yellow-50',
      low: 'border-blue-200 bg-blue-50'
    };

    const alertIcons = {
      overrun: '🔴',
      threshold: '⚠️',
      expiring: '📅'
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Budget Alerts</h3>
          <AlertTriangle className="w-5 h-5 text-gray-400" />
        </div>
        {budgetAlerts?.length > 0 ? (
          <div className="space-y-3">
            {budgetAlerts?.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${alertColors?.[alert?.priority]}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">
                      {alertIcons?.[alert?.type]}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {alert?.budget_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {alert?.message}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${alert?.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      alert?.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert?.priority === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                    {alert?.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p>No active budget alerts</p>
            <p className="text-sm">All budgets are within normal limits</p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4]?.map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Overview</h1>
          <p className="text-gray-600">
            Welcome back, {userProfile?.full_name || 'User'}! Here's your financial overview.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`
            flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          `}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart />
        <ExpenseBreakdownChart />
      </div>

      {/* Budget Alerts */}
      <BudgetAlertsPanel />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Budgets</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgetSummary?.total_budgets || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {financialSummary?.transaction_count || 0}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tax Liability</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency((financialSummary?.total_gst || 0) + (financialSummary?.total_tds || 0))}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}