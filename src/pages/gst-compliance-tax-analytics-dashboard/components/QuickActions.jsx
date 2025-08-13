import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Generate GSTR-1',
      description: 'Prepare outward supplies return',
      icon: 'FileText',
      color: 'primary',
      action: 'generate-gstr1',
      urgent: true
    },
    {
      id: 2,
      title: 'Reconcile 2A vs 2B',
      description: 'Match purchase returns',
      icon: 'GitCompare',
      color: 'accent',
      action: 'reconcile-2a2b',
      urgent: false
    },
    {
      id: 3,
      title: 'ITC Analysis',
      description: 'Review input tax credit',
      icon: 'Calculator',
      color: 'success',
      action: 'itc-analysis',
      urgent: false
    },
    {
      id: 4,
      title: 'Penalty Calculator',
      description: 'Calculate late filing penalties',
      icon: 'AlertTriangle',
      color: 'warning',
      action: 'penalty-calc',
      urgent: true
    },
    {
      id: 5,
      title: 'Bulk Upload',
      description: 'Import transaction data',
      icon: 'Upload',
      color: 'secondary',
      action: 'bulk-upload',
      urgent: false
    },
    {
      id: 6,
      title: 'Compliance Report',
      description: 'Generate compliance summary',
      icon: 'BarChart3',
      color: 'primary',
      action: 'compliance-report',
      urgent: false
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
      accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
      success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
      secondary: 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20'
    };
    return colors?.[color] || colors?.primary;
  };

  const handleAction = (actionType) => {
    console.log(`Executing action: ${actionType}`);
    // Action handlers would be implemented here
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <Button variant="ghost" size="sm" iconName="Settings" iconSize={16}>
          Customize
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className={`relative border rounded-lg p-4 financial-transition cursor-pointer ${getColorClasses(action?.color)}`}
            onClick={() => handleAction(action?.action)}
          >
            {action?.urgent && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-current/10">
                <Icon name={action?.icon} size={20} className="text-current" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-current mb-1">{action?.title}</h4>
                <p className="text-xs opacity-80 text-current">{action?.description}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {action?.urgent && (
                  <span className="text-xs font-medium text-error">Urgent</span>
                )}
              </div>
              <Icon name="ChevronRight" size={16} className="text-current opacity-60" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            2 urgent actions pending
          </div>
          <Button variant="outline" size="sm" iconName="ExternalLink" iconSize={16}>
            View All Actions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;