import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AIInsightsPanel = ({ insights, onInsightClick }) => {
  const [expandedInsight, setExpandedInsight] = useState(null);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'anomaly': return 'AlertTriangle';
      case 'optimization': return 'TrendingUp';
      case 'prediction': return 'Brain';
      case 'recommendation': return 'Lightbulb';
      default: return 'Info';
    }
  };

  const getInsightColor = (type, severity) => {
    if (severity === 'high') return 'text-error';
    if (severity === 'medium') return 'text-warning';
    if (type === 'optimization') return 'text-success';
    return 'text-primary';
  };

  const getInsightBadge = (type, severity) => {
    const colors = {
      high: 'bg-error/10 text-error',
      medium: 'bg-warning/10 text-warning',
      low: 'bg-primary/10 text-primary'
    };
    
    const labels = {
      anomaly: 'Anomaly',
      optimization: 'Opportunity',
      prediction: 'Forecast',
      recommendation: 'Suggestion'
    };

    return {
      color: colors?.[severity] || colors?.low,
      label: labels?.[type] || 'Insight'
    };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Brain" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
            <p className="text-sm text-muted-foreground">Intelligent budget analysis</p>
          </div>
        </div>
        
        <Button variant="outline" size="sm" iconName="RefreshCw" iconSize={16}>
          Refresh
        </Button>
      </div>
      <div className="space-y-4">
        {insights?.map((insight) => {
          const badge = getInsightBadge(insight?.type, insight?.severity);
          const isExpanded = expandedInsight === insight?.id;
          
          return (
            <div
              key={insight?.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/30 financial-transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getInsightIcon(insight?.type)} 
                    size={18} 
                    className={getInsightColor(insight?.type, insight?.severity)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
                        {badge?.label}
                      </span>
                      {insight?.severity === 'high' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                          High Priority
                        </span>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-foreground mb-1">{insight?.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight?.summary}</p>
                    
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm text-foreground mb-3">{insight?.details}</p>
                        
                        {insight?.recommendations && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-foreground">Recommendations:</h5>
                            <ul className="space-y-1">
                              {insight?.recommendations?.map((rec, index) => (
                                <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                  <Icon name="ArrowRight" size={14} className="mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {insight?.impact && (
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon name="Target" size={14} className="text-primary" />
                              <span className="text-sm font-medium text-foreground">Potential Impact</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{insight?.impact}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-3">
                  <span className="text-xs text-muted-foreground">{insight?.timestamp}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                    iconSize={16}
                    onClick={() => setExpandedInsight(isExpanded ? null : insight?.id)}
                  />
                </div>
              </div>
              {insight?.actionRequired && (
                <div className="mt-3 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ExternalLink"
                    iconPosition="right"
                    onClick={() => onInsightClick(insight)}
                    className="w-full sm:w-auto"
                  >
                    Take Action
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {insights?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Brain" size={48} className="text-muted-foreground/50 mx-auto mb-3" />
          <h4 className="font-medium text-foreground mb-2">No insights available</h4>
          <p className="text-sm text-muted-foreground">
            AI analysis will appear here as data becomes available
          </p>
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by AI Analytics</span>
          <span>Updated 2 minutes ago</span>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPanel;