import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightCategorySelector = ({ selectedCategory, onCategoryChange, confidenceLevel }) => {
  const categories = [
    {
      id: 'forecasting',
      label: 'Forecasting',
      icon: 'TrendingUp',
      description: 'Predictive analytics and future projections',
      count: 8
    },
    {
      id: 'anomalies',
      label: 'Anomalies',
      icon: 'AlertTriangle',
      description: 'Unusual patterns and outliers detection',
      count: 5
    },
    {
      id: 'recommendations',
      label: 'Recommendations',
      icon: 'Lightbulb',
      description: 'AI-powered optimization suggestions',
      count: 12
    },
    {
      id: 'patterns',
      label: 'Patterns',
      icon: 'BarChart3',
      description: 'Trend analysis and behavioral insights',
      count: 6
    },
    {
      id: 'risks',
      label: 'Risk Analysis',
      icon: 'Shield',
      description: 'Financial risk assessment and mitigation',
      count: 4
    }
  ];

  const getConfidenceColor = (level) => {
    if (level >= 90) return 'text-success';
    if (level >= 75) return 'text-accent';
    if (level >= 60) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceLabel = (level) => {
    if (level >= 90) return 'Very High';
    if (level >= 75) return 'High';
    if (level >= 60) return 'Medium';
    return 'Low';
  };

  return (
    <div className="bg-card rounded-lg border border-border financial-shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Insight Categories</h3>
        </div>
        
        {/* AI Confidence Level */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg">
          <Icon name="Brain" size={16} className="text-muted-foreground" />
          <div className="text-right">
            <p className="text-xs text-muted-foreground">AI Confidence</p>
            <p className={`text-sm font-semibold ${getConfidenceColor(confidenceLevel)}`}>
              {confidenceLevel}% ({getConfidenceLabel(confidenceLevel)})
            </p>
          </div>
        </div>
      </div>
      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`p-4 rounded-lg border text-left financial-transition ${
              selectedCategory === category?.id
                ? 'bg-accent text-accent-foreground border-accent financial-shadow-sm'
                : 'bg-card text-foreground border-border hover:border-accent/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <Icon
                name={category?.icon}
                size={20}
                className={selectedCategory === category?.id ? 'text-accent-foreground' : 'text-accent'}
              />
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                selectedCategory === category?.id
                  ? 'bg-accent-foreground/20 text-accent-foreground'
                  : 'bg-accent/10 text-accent'
              }`}>
                {category?.count}
              </span>
            </div>
            
            <h4 className={`text-sm font-semibold mb-1 ${
              selectedCategory === category?.id ? 'text-accent-foreground' : 'text-foreground'
            }`}>
              {category?.label}
            </h4>
            
            <p className={`text-xs ${
              selectedCategory === category?.id ? 'text-accent-foreground/80' : 'text-muted-foreground'
            }`}>
              {category?.description}
            </p>
          </button>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={14}>
            Refresh Insights
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconSize={14}>
            Export Report
          </Button>
          <Button variant="outline" size="sm" iconName="Settings" iconSize={14}>
            Configure AI
          </Button>
        </div>
      </div>
      {/* AI Status */}
      <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-success">AI Analysis Active</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {new Date()?.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
          })} • Next refresh in 15 minutes
        </p>
      </div>
    </div>
  );
};

export default InsightCategorySelector;