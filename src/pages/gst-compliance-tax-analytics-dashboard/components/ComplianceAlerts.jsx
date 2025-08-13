import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceAlerts = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'error',
      title: 'GSTR-1 Filing Overdue',
      message: 'July 2024 GSTR-1 return is 2 days overdue. Penalty: ₹500/day',
      timestamp: '2024-08-13T10:30:00',
      action: 'File Now',
      actionType: 'file-gstr1',
      priority: 'high',
      dismissed: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'ITC Mismatch Detected',
      message: 'Input Tax Credit variance of ₹15,000 found in GSTR-2A vs claimed amount',
      timestamp: '2024-08-13T09:15:00',
      action: 'Reconcile',
      actionType: 'reconcile-itc',
      priority: 'medium',
      dismissed: false
    },
    {
      id: 3,
      type: 'info',
      title: 'GSTR-3B Due Soon',
      message: 'Monthly summary return for July 2024 due in 7 days',
      timestamp: '2024-08-13T08:00:00',
      action: 'Prepare',
      actionType: 'prepare-gstr3b',
      priority: 'medium',
      dismissed: false
    },
    {
      id: 4,
      type: 'success',
      title: 'GSTR-2A Updated',
      message: 'Auto-populated purchase return successfully updated with latest data',
      timestamp: '2024-08-12T16:45:00',
      action: 'View',
      actionType: 'view-gstr2a',
      priority: 'low',
      dismissed: false
    },
    {
      id: 5,
      type: 'warning',
      title: 'Invalid GSTIN Detected',
      message: '3 transactions with invalid GSTIN format require correction',
      timestamp: '2024-08-12T14:20:00',
      action: 'Fix',
      actionType: 'fix-gstin',
      priority: 'high',
      dismissed: false
    }
  ]);

  const getAlertIcon = (type) => {
    const icons = {
      error: { name: 'AlertCircle', color: 'text-error' },
      warning: { name: 'AlertTriangle', color: 'text-warning' },
      info: { name: 'Info', color: 'text-primary' },
      success: { name: 'CheckCircle', color: 'text-success' }
    };
    return icons?.[type] || icons?.info;
  };

  const getAlertBg = (type) => {
    const backgrounds = {
      error: 'bg-error/5 border-error/20',
      warning: 'bg-warning/5 border-warning/20',
      info: 'bg-primary/5 border-primary/20',
      success: 'bg-success/5 border-success/20'
    };
    return backgrounds?.[type] || backgrounds?.info;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const handleAction = (actionType, alertId) => {
    console.log(`Executing action: ${actionType} for alert: ${alertId}`);
    // Action handlers would be implemented here
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts?.map(alert => 
      alert?.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const activeAlerts = alerts?.filter(alert => !alert?.dismissed);
  const highPriorityCount = activeAlerts?.filter(alert => alert?.priority === 'high')?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Compliance Alerts</h3>
          {highPriorityCount > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">
              {highPriorityCount} High Priority
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
            Settings
          </Button>
          <Button variant="ghost" size="sm" iconName="Bell" iconSize={16}>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activeAlerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <h4 className="text-lg font-medium text-foreground mb-2">All Clear!</h4>
            <p className="text-sm text-muted-foreground">No compliance alerts at this time.</p>
          </div>
        ) : (
          activeAlerts?.map((alert) => {
            const alertIcon = getAlertIcon(alert?.type);
            
            return (
              <div
                key={alert?.id}
                className={`border rounded-lg p-4 ${getAlertBg(alert?.type)} financial-transition`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={alertIcon?.name} 
                      size={20} 
                      className={alertIcon?.color}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground mb-1">
                        {alert?.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert?.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{formatTimestamp(alert?.timestamp)}</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          alert?.priority === 'high' ? 'bg-error/20 text-error' :
                          alert?.priority === 'medium'? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                        }`}>
                          {alert?.priority?.charAt(0)?.toUpperCase() + alert?.priority?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => dismissAlert(alert?.id)}
                    iconName="X"
                    iconSize={14}
                  >
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={alert?.type === 'error' ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => handleAction(alert?.actionType, alert?.id)}
                    >
                      {alert?.action}
                    </Button>
                    {alert?.type === 'error' && (
                      <Button variant="ghost" size="xs" iconName="ExternalLink" iconSize={14}>
                        Learn More
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {activeAlerts?.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {activeAlerts?.length} active alerts
            </div>
            <Button variant="outline" size="sm" iconName="Archive" iconSize={16}>
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceAlerts;