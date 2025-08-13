import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnomalyDetectionTimeline = () => {
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [timeFilter, setTimeFilter] = useState('30days');

  const anomalies = [
    {
      id: 1,
      date: '2024-08-12',
      time: '14:30',
      type: 'expense_spike',
      severity: 'high',
      category: 'Office Supplies',
      amount: 45000,
      normalRange: '8,000 - 12,000',
      description: 'Unusual spike in office supplies expense',
      explanation: `AI detected a 300% increase in office supplies spending. This appears to be a bulk purchase of computer equipment and furniture for the new office setup.`,
      suggestion: 'Verify if this is a planned capital expenditure. Consider categorizing as CapEx if equipment purchase.',
      vendor: 'TechMart Solutions',
      status: 'investigating'
    },
    {
      id: 2,
      date: '2024-08-10',
      time: '09:15',
      type: 'payment_pattern',
      severity: 'medium',
      category: 'Marketing',
      amount: 120000,
      normalRange: '50,000 - 80,000',
      description: 'New vendor payment outside normal pattern',
      explanation: `First-time payment to a new marketing vendor. The amount is 50% higher than typical marketing expenses and lacks historical payment pattern.`,
      suggestion: 'Review vendor credentials and contract terms. Ensure proper approval workflow was followed.',
      vendor: 'Digital Growth Agency',
      status: 'resolved'
    },
    {
      id: 3,
      date: '2024-08-08',
      time: '16:45',
      type: 'frequency_anomaly',
      severity: 'low',
      category: 'Travel',
      amount: 85000,
      normalRange: '15,000 - 25,000',
      description: 'Unusual frequency in international travel',
      explanation: `5x increase in international travel expenses this month. Multiple bookings for the same destination within a short timeframe.`,
      suggestion: 'Confirm if this relates to a specific project or business expansion. Consider travel policy compliance.',
      vendor: 'Global Travel Services',
      status: 'acknowledged'
    },
    {
      id: 4,
      date: '2024-08-05',
      time: '11:20',
      type: 'timing_anomaly',
      severity: 'medium',
      category: 'Utilities',
      amount: 35000,
      normalRange: '18,000 - 22,000',
      description: 'Off-schedule utility payment',
      explanation: `Utility payment made 15 days earlier than usual schedule. Amount is also 60% higher than previous months.`,
      suggestion: 'Check for billing errors or rate changes. Verify if additional services were added.',
      vendor: 'City Power Corporation',
      status: 'investigating'
    },
    {
      id: 5,
      date: '2024-08-03',
      time: '13:10',
      type: 'duplicate_risk',
      severity: 'high',
      category: 'Professional Services',
      amount: 75000,
      normalRange: '40,000 - 60,000',
      description: 'Potential duplicate payment detected',
      explanation: `Similar amount paid to the same vendor within 48 hours. Invoice numbers are sequential, suggesting possible duplicate processing.`,
      suggestion: 'Immediately review payment records and contact vendor to confirm. Implement duplicate payment controls.',
      vendor: 'Legal Associates LLP',
      status: 'urgent'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-error/10 border-error/20';
      case 'medium':
        return 'bg-warning/10 border-warning/20';
      case 'low':
        return 'bg-accent/10 border-accent/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'text-success bg-success/10';
      case 'investigating':
        return 'text-warning bg-warning/10';
      case 'acknowledged':
        return 'text-accent bg-accent/10';
      case 'urgent':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'expense_spike':
        return 'TrendingUp';
      case 'payment_pattern':
        return 'AlertCircle';
      case 'frequency_anomaly':
        return 'BarChart3';
      case 'timing_anomaly':
        return 'Clock';
      case 'duplicate_risk':
        return 'Copy';
      default:
        return 'AlertTriangle';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(amount);
  };

  const timeFilters = [
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: '90days', label: '90 Days' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border financial-shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Anomaly Detection</h3>
        </div>
        <div className="flex items-center space-x-2">
          {timeFilters?.map((filter) => (
            <Button
              key={filter?.id}
              variant={timeFilter === filter?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeFilter(filter?.id)}
            >
              {filter?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-error/10 rounded-lg border border-error/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-foreground">High</span>
          </div>
          <p className="text-lg font-bold text-error mt-1">2</p>
        </div>
        <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-foreground">Medium</span>
          </div>
          <p className="text-lg font-bold text-warning mt-1">2</p>
        </div>
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">Low</span>
          </div>
          <p className="text-lg font-bold text-accent mt-1">1</p>
        </div>
        <div className="p-3 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-foreground">Resolved</span>
          </div>
          <p className="text-lg font-bold text-success mt-1">1</p>
        </div>
      </div>
      {/* Timeline */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {anomalies?.map((anomaly, index) => (
          <div
            key={anomaly?.id}
            className={`p-4 rounded-lg border cursor-pointer financial-transition ${
              selectedAnomaly === anomaly?.id
                ? 'ring-2 ring-accent ring-offset-2' :''
            } ${getSeverityBg(anomaly?.severity)}`}
            onClick={() => setSelectedAnomaly(selectedAnomaly === anomaly?.id ? null : anomaly?.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Icon
                  name={getTypeIcon(anomaly?.type)}
                  size={20}
                  className={getSeverityColor(anomaly?.severity)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {anomaly?.description}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(anomaly?.status)}`}>
                      {anomaly?.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                    <span>{anomaly?.date} at {anomaly?.time}</span>
                    <span>{anomaly?.category}</span>
                    <span>{anomaly?.vendor}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="font-semibold text-foreground">
                      {formatCurrency(anomaly?.amount)}
                    </span>
                    <span className="text-muted-foreground">
                      Normal: ₹{anomaly?.normalRange}
                    </span>
                  </div>
                </div>
              </div>
              <Icon
                name={selectedAnomaly === anomaly?.id ? 'ChevronUp' : 'ChevronDown'}
                size={16}
                className="text-muted-foreground"
              />
            </div>

            {/* Expanded Details */}
            {selectedAnomaly === anomaly?.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-1">AI Analysis</h5>
                  <p className="text-sm text-muted-foreground">{anomaly?.explanation}</p>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-1">Recommended Action</h5>
                  <p className="text-sm text-muted-foreground">{anomaly?.suggestion}</p>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Button variant="outline" size="sm" iconName="Eye" iconSize={14}>
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" iconName="MessageSquare" iconSize={14}>
                    Add Note
                  </Button>
                  <Button variant="outline" size="sm" iconName="CheckCircle" iconSize={14}>
                    Mark Resolved
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* AI Insights */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2">
          <Icon name="Brain" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">AI Pattern Analysis</p>
            <p className="text-xs text-muted-foreground">
              Detected 2 high-priority anomalies requiring immediate attention. 
              Pattern suggests possible process gaps in vendor onboarding and duplicate payment controls. 
              Recommend implementing automated approval workflows for new vendors above ₹50,000.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetectionTimeline;