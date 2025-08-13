import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DashboardControls = ({ onAccountChange, onTimeRangeChange, onRefreshToggle, onExport }) => {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('5');

  const accountOptions = [
    { value: 'all', label: 'All Accounts' },
    { value: 'primary', label: 'Primary Account - HDFC Bank (****1234)' },
    { value: 'savings', label: 'Savings Account - ICICI Bank (****5678)' },
    { value: 'current', label: 'Current Account - SBI (****9012)' },
    { value: 'petty', label: 'Petty Cash Account' }
  ];

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const refreshIntervalOptions = [
    { value: '1', label: '1 minute' },
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' }
  ];

  const handleAccountChange = (value) => {
    setSelectedAccount(value);
    onAccountChange && onAccountChange(value);
  };

  const handleTimeRangeChange = (value) => {
    setSelectedTimeRange(value);
    onTimeRangeChange && onTimeRangeChange(value);
  };

  const handleRefreshToggle = () => {
    const newAutoRefresh = !autoRefresh;
    setAutoRefresh(newAutoRefresh);
    onRefreshToggle && onRefreshToggle(newAutoRefresh, refreshInterval);
  };

  const handleRefreshIntervalChange = (value) => {
    setRefreshInterval(value);
    onRefreshToggle && onRefreshToggle(autoRefresh, value);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 financial-shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        
        {/* Left Section - Account and Time Range */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Building2" size={16} className="text-muted-foreground" />
            <Select
              options={accountOptions}
              value={selectedAccount}
              onChange={handleAccountChange}
              placeholder="Select account"
              className="min-w-[200px]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <Select
              options={timeRangeOptions}
              value={selectedTimeRange}
              onChange={handleTimeRangeChange}
              placeholder="Select time range"
              className="min-w-[150px]"
            />
          </div>
        </div>

        {/* Right Section - Auto Refresh and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          
          {/* Auto Refresh Controls */}
          <div className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
            <div className="flex items-center space-x-2">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                iconName={autoRefresh ? "Pause" : "Play"}
                iconSize={14}
                onClick={handleRefreshToggle}
              >
                {autoRefresh ? 'Pause' : 'Resume'}
              </Button>
              
              {autoRefresh && (
                <Select
                  options={refreshIntervalOptions}
                  value={refreshInterval}
                  onChange={handleRefreshIntervalChange}
                  className="min-w-[100px]"
                />
              )}
            </div>
            
            {autoRefresh && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Auto</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconSize={16}
            >
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={16}
              onClick={onExport}
            >
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconSize={16}
            >
              Settings
            </Button>
          </div>
        </div>
      </div>
      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Database" size={14} />
              <span>Last updated: {new Date()?.toLocaleTimeString('en-IN')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Wifi" size={14} />
              <span>Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={14} />
              <span>Secure</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Viewing:</span>
            <span className="font-medium text-foreground">
              {accountOptions?.find(opt => opt?.value === selectedAccount)?.label}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium text-foreground">
              {timeRangeOptions?.find(opt => opt?.value === selectedTimeRange)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;