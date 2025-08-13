import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BudgetFilters = ({ 
  selectedDepartments, 
  onDepartmentChange, 
  selectedPeriod, 
  onPeriodChange,
  varianceThreshold,
  onVarianceThresholdChange,
  onSaveView,
  onRefresh,
  lastUpdated
}) => {
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'it', label: 'Information Technology' }
  ];

  const periodOptions = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'current-quarter', label: 'Current Quarter' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-quarter', label: 'Last Quarter' },
    { value: 'last-year', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const varianceOptions = [
    { value: 'all', label: 'All Variances' },
    { value: '5', label: '> 5% Variance' },
    { value: '10', label: '> 10% Variance' },
    { value: '15', label: '> 15% Variance' },
    { value: '20', label: '> 20% Variance' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 financial-shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
          <div className="flex-1 min-w-0">
            <Select
              label="Departments"
              options={departmentOptions}
              value={selectedDepartments}
              onChange={onDepartmentChange}
              multiple
              searchable
              placeholder="Select departments..."
              className="w-full"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Select
              label="Period"
              options={periodOptions}
              value={selectedPeriod}
              onChange={onPeriodChange}
              placeholder="Select period..."
              className="w-full"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Select
              label="Variance Filter"
              options={varianceOptions}
              value={varianceThreshold}
              onChange={onVarianceThresholdChange}
              placeholder="Filter by variance..."
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 lg:ml-4">
          <Button
            variant="outline"
            size="sm"
            iconName="Bookmark"
            iconPosition="left"
            onClick={onSaveView}
          >
            Save View
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRefresh}
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Status Bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>Last updated: {lastUpdated}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={14} />
            <span>
              {selectedDepartments?.length === 1 && selectedDepartments?.[0] === 'all' ?'All departments' 
                : `${selectedDepartments?.length} department${selectedDepartments?.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live data</span>
        </div>
      </div>
    </div>
  );
};

export default BudgetFilters;