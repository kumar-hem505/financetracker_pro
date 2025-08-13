import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveTransactionFeed = ({ onProcessPayment, onViewTransaction }) => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  const mockTransactions = [
    {
      id: 'TXN-2025-001',
      type: 'inflow',
      amount: 125000,
      description: 'Payment received from Acme Corp',
      vendor: 'Acme Corp',
      category: 'Sales Revenue',
      status: 'completed',
      timestamp: new Date(Date.now() - 300000),
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN-2025-002',
      type: 'outflow',
      amount: 45000,
      description: 'Office rent payment',
      vendor: 'Property Management Ltd',
      category: 'Rent',
      status: 'pending',
      timestamp: new Date(Date.now() - 600000),
      paymentMethod: 'UPI'
    },
    {
      id: 'TXN-2025-003',
      type: 'inflow',
      amount: 78000,
      description: 'Service fee from Client XYZ',
      vendor: 'Client XYZ',
      category: 'Service Income',
      status: 'completed',
      timestamp: new Date(Date.now() - 900000),
      paymentMethod: 'NEFT'
    },
    {
      id: 'TXN-2025-004',
      type: 'outflow',
      amount: 32000,
      description: 'Vendor payment overdue',
      vendor: 'Tech Solutions Inc',
      category: 'Technology',
      status: 'overdue',
      timestamp: new Date(Date.now() - 1800000),
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 'TXN-2025-005',
      type: 'inflow',
      amount: 95000,
      description: 'Invoice payment received',
      vendor: 'Global Enterprises',
      category: 'Sales Revenue',
      status: 'processing',
      timestamp: new Date(Date.now() - 2400000),
      paymentMethod: 'RTGS'
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newTransaction = {
        id: `TXN-2025-${String(Date.now())?.slice(-3)}`,
        type: Math.random() > 0.5 ? 'inflow' : 'outflow',
        amount: Math.floor(Math.random() * 200000) + 10000,
        description: 'New transaction received',
        vendor: 'Live Update',
        category: 'Miscellaneous',
        status: 'completed',
        timestamp: new Date(),
        paymentMethod: 'UPI'
      };
      
      setTransactions(prev => [newTransaction, ...prev?.slice(0, 9)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000)?.toFixed(1)}L`;
    } else {
      return `₹${amount?.toLocaleString('en-IN')}`;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp?.toLocaleDateString('en-IN');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { icon: 'Clock', color: 'text-warning' };
      case 'processing':
        return { icon: 'Loader', color: 'text-primary' };
      case 'overdue':
        return { icon: 'AlertCircle', color: 'text-error' };
      default:
        return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getTypeIcon = (type) => {
    return type === 'inflow' 
      ? { icon: 'ArrowDownLeft', color: 'text-success' }
      : { icon: 'ArrowUpRight', color: 'text-error' };
  };

  const filteredTransactions = transactions?.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'inflow') return transaction?.type === 'inflow';
    if (filter === 'outflow') return transaction?.type === 'outflow';
    if (filter === 'overdue') return transaction?.status === 'overdue';
    return true;
  });

  const overdueCount = transactions?.filter(t => t?.status === 'overdue')?.length;
  const pendingCount = transactions?.filter(t => t?.status === 'pending')?.length;

  return (
    <div className="bg-card rounded-lg border border-border p-6 financial-shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Icon name="Activity" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Live Transaction Feed</h3>
            <p className="text-sm text-muted-foreground">Real-time payment monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      {/* Alert Summary */}
      {(overdueCount > 0 || pendingCount > 0) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Action Required</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {overdueCount > 0 && `${overdueCount} overdue payments`}
            {overdueCount > 0 && pendingCount > 0 && ', '}
            {pendingCount > 0 && `${pendingCount} pending approvals`}
          </div>
        </div>
      )}
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { value: 'all', label: 'All', count: transactions?.length },
          { value: 'inflow', label: 'Inflows', count: transactions?.filter(t => t?.type === 'inflow')?.length },
          { value: 'outflow', label: 'Outflows', count: transactions?.filter(t => t?.type === 'outflow')?.length },
          { value: 'overdue', label: 'Overdue', count: overdueCount }
        ]?.map((filterOption) => (
          <Button
            key={filterOption?.value}
            variant={filter === filterOption?.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterOption?.value)}
            className="text-xs"
          >
            {filterOption?.label} ({filterOption?.count})
          </Button>
        ))}
      </div>
      {/* Transaction List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTransactions?.map((transaction) => {
          const statusIcon = getStatusIcon(transaction?.status);
          const typeIcon = getTypeIcon(transaction?.type);
          
          return (
            <div
              key={transaction?.id}
              className="flex items-center space-x-3 p-3 bg-muted rounded-lg hover:bg-muted/80 financial-transition cursor-pointer"
              onClick={() => onViewTransaction && onViewTransaction(transaction)}
            >
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="p-2 bg-card rounded-lg">
                    <Icon name={typeIcon?.icon} size={16} className={typeIcon?.color} />
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <Icon name={statusIcon?.icon} size={12} className={statusIcon?.color} />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {transaction?.description}
                  </p>
                  <span className={`text-sm font-semibold ${
                    transaction?.type === 'inflow' ? 'text-success' : 'text-error'
                  }`}>
                    {transaction?.type === 'inflow' ? '+' : '-'}{formatCurrency(transaction?.amount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{transaction?.vendor}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{transaction?.paymentMethod}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTime(transaction?.timestamp)}</span>
                </div>
              </div>
              {transaction?.status === 'overdue' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="CreditCard"
                  iconSize={14}
                  onClick={(e) => {
                    e?.stopPropagation();
                    onProcessPayment && onProcessPayment(transaction);
                  }}
                  className="text-xs"
                >
                  Pay Now
                </Button>
              )}
            </div>
          );
        })}
      </div>
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconSize={16}
            fullWidth
          >
            Add Transaction
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
            fullWidth
          >
            Export Feed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveTransactionFeed;