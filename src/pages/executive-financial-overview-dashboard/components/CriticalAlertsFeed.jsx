import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CriticalAlertsFeed = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'gst',
      priority: 'high',
      title: 'GST Return Filing Due',
      message: 'GSTR-3B for March 2025 due in 3 days',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: 'File Return',
      isRead: false
    },
    {
      id: 2,
      type: 'budget',
      priority: 'medium',
      title: 'Marketing Budget Alert',
      message: 'Marketing department has exceeded 90% of allocated budget',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      action: 'Review Budget',
      isRead: false
    },
    {
      id: 3,
      type: 'cashflow',
      priority: 'high',
      title: 'Low Cash Flow Warning',
      message: 'Projected cash flow may fall below minimum threshold next week',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      action: 'View Details',
      isRead: true
    },
    {
      id: 4,
      type: 'invoice',
      priority: 'medium',
      title: 'Overdue Invoices',
      message: '₹12.5L in invoices are overdue by more than 30 days',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      action: 'Follow Up',
      isRead: true
    },
    {
      id: 5,
      type: 'compliance',
      priority: 'low',
      title: 'TDS Payment Reminder',
      message: 'TDS payment for Q4 FY24-25 due on April 30th',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      action: 'Schedule Payment',
      isRead: true
    }
  ]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error/10 border-error/20';
      case 'medium': return 'bg-warning/10 border-warning/20';
      case 'low': return 'bg-success/10 border-success/20';
      default: return 'bg-muted/10 border-border';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gst': return 'FileText';
      case 'budget': return 'Target';
      case 'cashflow': return 'TrendingDown';
      case 'invoice': return 'Receipt';
      case 'compliance': return 'Shield';
      default: return 'AlertCircle';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const markAsRead = (alertId) => {
    setAlerts(alerts?.map(alert => 
      alert?.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const unreadCount = alerts?.filter(alert => !alert?.isRead)?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Critical Alerts</h3>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-error rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
          <span className="sr-only">Alert Settings</span>
        </Button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts?.map((alert) => (
          <div 
            key={alert?.id}
            className={`p-4 rounded-lg border financial-transition ${
              alert?.isRead ? 'bg-muted/5 border-border' : getPriorityBg(alert?.priority)
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 p-2 rounded-lg ${
                alert?.priority === 'high' ? 'bg-error/20' :
                alert?.priority === 'medium' ? 'bg-warning/20' : 'bg-success/20'
              }`}>
                <Icon 
                  name={getTypeIcon(alert?.type)} 
                  size={16} 
                  className={getPriorityColor(alert?.priority)}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-sm font-medium ${
                    alert?.isRead ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {alert?.title}
                  </h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTimeAgo(alert?.timestamp)}
                  </span>
                </div>
                
                <p className={`text-sm mb-3 ${
                  alert?.isRead ? 'text-muted-foreground' : 'text-foreground'
                }`}>
                  {alert?.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => markAsRead(alert?.id)}
                    className="text-xs"
                  >
                    {alert?.action}
                  </Button>
                  
                  {!alert?.isRead && (
                    <button
                      onClick={() => markAsRead(alert?.id)}
                      className="text-xs text-muted-foreground hover:text-foreground financial-transition"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="ghost" size="sm" fullWidth iconName="ExternalLink" iconSize={14}>
          View All Alerts
        </Button>
      </div>
    </div>
  );
};

export default CriticalAlertsFeed;