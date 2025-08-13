import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilingCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('August 2024');

  const filingSchedule = [
    {
      id: 1,
      returnType: 'GSTR-1',
      dueDate: '2024-08-11',
      status: 'overdue',
      description: 'Outward supplies return for July 2024',
      penalty: '₹500/day',
      priority: 'high'
    },
    {
      id: 2,
      returnType: 'GSTR-3B',
      dueDate: '2024-08-20',
      status: 'pending',
      description: 'Monthly summary return for July 2024',
      penalty: '₹50/day',
      priority: 'high'
    },
    {
      id: 3,
      returnType: 'GSTR-2A',
      dueDate: '2024-08-12',
      status: 'filed',
      description: 'Auto-populated purchase return',
      penalty: 'N/A',
      priority: 'medium'
    },
    {
      id: 4,
      returnType: 'GSTR-9',
      dueDate: '2024-12-31',
      status: 'upcoming',
      description: 'Annual return for FY 2023-24',
      penalty: '₹100/day',
      priority: 'medium'
    },
    {
      id: 5,
      returnType: 'GSTR-4',
      dueDate: '2024-08-30',
      status: 'draft',
      description: 'Quarterly return for Q1 2024-25',
      penalty: '₹50/day',
      priority: 'low'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      overdue: 'bg-error/10 text-error border-error/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      filed: 'bg-success/10 text-success border-success/20',
      upcoming: 'bg-primary/10 text-primary border-primary/20',
      draft: 'bg-muted text-muted-foreground border-border'
    };
    return colors?.[status] || colors?.draft;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      high: { name: 'AlertTriangle', color: 'text-error' },
      medium: { name: 'Clock', color: 'text-warning' },
      low: { name: 'Info', color: 'text-muted-foreground' }
    };
    return icons?.[priority] || icons?.low;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Filing Calendar</h3>
        <div className="flex items-center space-x-2">
          <Icon name="Calendar" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{selectedMonth}</span>
        </div>
      </div>
      <div className="space-y-4">
        {filingSchedule?.map((filing) => {
          const daysUntilDue = getDaysUntilDue(filing?.dueDate);
          const priorityIcon = getPriorityIcon(filing?.priority);

          return (
            <div 
              key={filing?.id}
              className={`border rounded-lg p-4 ${getStatusColor(filing?.status)} financial-transition hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={priorityIcon?.name} 
                    size={16} 
                    className={priorityIcon?.color}
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{filing?.returnType}</h4>
                    <p className="text-xs opacity-80 mt-1">{filing?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatDate(filing?.dueDate)}</div>
                  {filing?.status !== 'filed' && (
                    <div className="text-xs opacity-80 mt-1">
                      {daysUntilDue > 0 ? `${daysUntilDue} days left` : 
                       daysUntilDue === 0 ? 'Due today' : 
                       `${Math.abs(daysUntilDue)} days overdue`}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs">
                  <span className="opacity-80">Penalty: {filing?.penalty}</span>
                  <span className={`px-2 py-1 rounded-full font-medium ${
                    filing?.priority === 'high' ? 'bg-error/20 text-error' :
                    filing?.priority === 'medium'? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    {filing?.priority?.charAt(0)?.toUpperCase() + filing?.priority?.slice(1)} Priority
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {filing?.status === 'draft' && (
                    <Button variant="outline" size="xs" iconName="Edit" iconSize={14}>
                      Edit
                    </Button>
                  )}
                  {(filing?.status === 'pending' || filing?.status === 'overdue') && (
                    <Button variant="default" size="xs" iconName="Send" iconSize={14}>
                      File Now
                    </Button>
                  )}
                  {filing?.status === 'filed' && (
                    <Button variant="ghost" size="xs" iconName="Download" iconSize={14}>
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Next filing due in 9 days
          </div>
          <Button variant="outline" size="sm" iconName="Calendar" iconSize={16}>
            View Full Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilingCalendar;