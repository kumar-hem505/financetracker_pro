import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FiscalYearSelector = ({ onYearChange, onComparisonToggle, onAIToggle }) => {
  const [selectedYear, setSelectedYear] = useState('FY 2024-25');
  const [comparisonMode, setComparisonMode] = useState('YoY');
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fiscalYears = [
    'FY 2024-25',
    'FY 2023-24', 
    'FY 2022-23',
    'FY 2021-22'
  ];

  const comparisonOptions = [
    { value: 'YoY', label: 'Year over Year', icon: 'Calendar' },
    { value: 'QoQ', label: 'Quarter over Quarter', icon: 'BarChart3' },
    { value: 'MoM', label: 'Month over Month', icon: 'TrendingUp' }
  ];

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsDropdownOpen(false);
    if (onYearChange) onYearChange(year);
  };

  const handleComparisonChange = (mode) => {
    setComparisonMode(mode);
    if (onComparisonToggle) onComparisonToggle(mode);
  };

  const handleAIToggle = () => {
    const newState = !aiInsightsEnabled;
    setAiInsightsEnabled(newState);
    if (onAIToggle) onAIToggle(newState);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 financial-shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        
        {/* Fiscal Year Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Fiscal Year:</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted financial-transition"
            >
              <span>{selectedYear}</span>
              <Icon name={isDropdownOpen ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-40 bg-popover border border-border rounded-lg financial-shadow-md z-50">
                <div className="py-1">
                  {fiscalYears?.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`w-full text-left px-4 py-2 text-sm financial-transition ${
                        selectedYear === year
                          ? 'bg-accent text-accent-foreground'
                          : 'text-popover-foreground hover:bg-muted'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Mode Toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-foreground">Compare:</span>
          <div className="flex items-center bg-muted rounded-lg p-1">
            {comparisonOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleComparisonChange(option?.value)}
                className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-md financial-transition ${
                  comparisonMode === option?.value
                    ? 'bg-background text-foreground financial-shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title={option?.label}
              >
                <Icon name={option?.icon} size={14} />
                <span className="hidden sm:inline">{option?.value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Insights Toggle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">AI Insights:</span>
          </div>
          
          <button
            onClick={handleAIToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full financial-transition ${
              aiInsightsEnabled ? 'bg-accent' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white financial-transition ${
                aiInsightsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="RefreshCw" iconSize={16}>
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          
          <Button variant="ghost" size="sm" iconName="Download" iconSize={16}>
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
            <span className="sr-only">Dashboard Settings</span>
          </Button>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span>Data Updated: 30 mins ago</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-warning rounded-full" />
            <span>Next Sync: 15 mins</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-muted-foreground">Showing:</span>
          <span className="font-medium text-foreground">
            {comparisonMode === 'YoY' ? 'Annual' : comparisonMode === 'QoQ' ? 'Quarterly' : 'Monthly'} View
          </span>
        </div>
      </div>
    </div>
  );
};

export default FiscalYearSelector;