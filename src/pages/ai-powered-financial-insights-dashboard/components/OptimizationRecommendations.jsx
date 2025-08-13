import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OptimizationRecommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [implementedRecommendations, setImplementedRecommendations] = useState(new Set());

  const recommendations = [
    {
      id: 1,
      category: 'cost_reduction',
      priority: 'high',
      title: 'Consolidate Software Subscriptions',
      description: 'Multiple overlapping software subscriptions detected across departments',
      impact: 'Save ₹2,50,000 annually',
      effort: 'Medium',
      timeline: '2-3 weeks',
      details: `AI analysis found 15 software subscriptions with overlapping functionality:\n\n• 3 different project management tools\n• 4 communication platforms\n• 2 duplicate accounting software licenses\n\nConsolidating to best-in-class solutions can reduce costs by 40%.`,
      actionItems: [
        'Audit all software subscriptions',
        'Survey teams for actual usage',
        'Negotiate enterprise deals',
        'Plan migration timeline'
      ],
      confidence: 92
    },
    {
      id: 2,
      category: 'cash_flow',
      priority: 'high',
      title: 'Optimize Payment Terms',
      description: 'Extend payable terms while maintaining vendor relationships',
      impact: 'Improve cash flow by ₹15,00,000',
      effort: 'Low',
      timeline: '1-2 weeks',
      details: `Analysis of vendor payment patterns shows opportunities to optimize cash flow:\n\n• 60% of vendors accept 45-day terms\n• Current average payment: 22 days\n• Potential cash flow improvement: ₹15L\n\nNegotiating extended terms with key vendors can significantly improve working capital.`,
      actionItems: [
        'Identify top 20 vendors by spend',
        'Review current payment terms',
        'Negotiate extended terms',
        'Update payment processes'
      ],
      confidence: 88
    },
    {
      id: 3,
      category: 'revenue',
      priority: 'medium',
      title: 'Implement Dynamic Pricing',
      description: 'AI-driven pricing optimization based on demand patterns',
      impact: 'Increase revenue by 8-12%',
      effort: 'High',
      timeline: '6-8 weeks',
      details: `Market analysis reveals pricing optimization opportunities:\n\n• Peak demand periods: 15% price elasticity\n• Off-peak periods: 25% discount tolerance\n• Competitor pricing gaps identified\n\nDynamic pricing can capture additional value during high-demand periods.`,
      actionItems: [
        'Analyze demand patterns',
        'Study competitor pricing',
        'Develop pricing algorithms',
        'A/B test implementation'
      ],
      confidence: 76
    },
    {
      id: 4,
      category: 'tax',
      priority: 'medium',
      title: 'Optimize Tax Structure',
      description: 'Restructure expenses for better tax efficiency',
      impact: 'Save ₹3,50,000 in taxes',
      effort: 'Medium',
      timeline: '4-6 weeks',
      details: `Tax optimization analysis reveals several opportunities:\n\n• R&D expenses: ₹8L eligible for additional deductions\n• Equipment purchases: Accelerated depreciation benefits\n• Employee benefits: Tax-efficient restructuring\n\nProper categorization and timing can reduce tax liability significantly.`,
      actionItems: [
        'Review expense categorization',
        'Consult tax advisor',
        'Restructure employee benefits',
        'Plan equipment purchases'
      ],
      confidence: 84
    },
    {
      id: 5,
      category: 'efficiency',
      priority: 'low',
      title: 'Automate Invoice Processing',
      description: 'Reduce manual processing time and errors',
      impact: 'Save 20 hours/week',
      effort: 'Medium',
      timeline: '3-4 weeks',
      details: `Invoice processing analysis shows automation opportunities:\n\n• Current processing time: 45 minutes per invoice\n• Error rate: 8% requiring rework\n• Volume: 200+ invoices monthly\n\nAutomation can reduce processing time by 80% and eliminate errors.`,
      actionItems: [
        'Evaluate automation tools',
        'Set up OCR processing',
        'Configure approval workflows',
        'Train team on new process'
      ],
      confidence: 91
    },
    {
      id: 6,
      category: 'investment',
      priority: 'low',
      title: 'Diversify Cash Reserves',
      description: 'Optimize idle cash through strategic investments',
      impact: 'Generate ₹1,80,000 additional income',
      effort: 'Low',
      timeline: '1-2 weeks',
      details: `Cash flow analysis reveals excess liquidity opportunities:\n\n• Average idle cash: ₹45L\n• Current returns: 3.5% savings account\n• Recommended: Diversified portfolio (6-8% returns)\n\nStrategic allocation can generate significant additional income while maintaining liquidity.`,
      actionItems: [
        'Assess liquidity requirements',
        'Research investment options',
        'Consult financial advisor',
        'Implement investment strategy'
      ],
      confidence: 79
    }
  ];

  const categories = [
    { id: 'all', label: 'All Recommendations', icon: 'List' },
    { id: 'cost_reduction', label: 'Cost Reduction', icon: 'TrendingDown' },
    { id: 'cash_flow', label: 'Cash Flow', icon: 'DollarSign' },
    { id: 'revenue', label: 'Revenue', icon: 'TrendingUp' },
    { id: 'tax', label: 'Tax Optimization', icon: 'FileText' },
    { id: 'efficiency', label: 'Efficiency', icon: 'Zap' },
    { id: 'investment', label: 'Investment', icon: 'Target' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-accent bg-accent/10 border-accent/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'High':
        return 'text-error';
      case 'Medium':
        return 'text-warning';
      case 'Low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations?.filter(rec => rec?.category === selectedCategory);

  const handleImplement = (id) => {
    setImplementedRecommendations(prev => new Set([...prev, id]));
  };

  const totalPotentialSavings = recommendations?.reduce((total, rec) => {
    const match = rec?.impact?.match(/₹([\d,]+)/);
    if (match) {
      return total + parseInt(match?.[1]?.replace(/,/g, ''));
    }
    return total;
  }, 0);

  return (
    <div className="bg-card rounded-lg border border-border financial-shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Lightbulb" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Potential Impact</p>
          <p className="text-lg font-bold text-success">
            ₹{totalPotentialSavings?.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <Button
            key={category?.id}
            variant={selectedCategory === category?.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category?.id)}
            iconName={category?.icon}
            iconSize={14}
          >
            {category?.label}
          </Button>
        ))}
      </div>
      {/* Recommendations List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredRecommendations?.map((recommendation) => (
          <div
            key={recommendation?.id}
            className={`p-4 rounded-lg border financial-transition ${
              implementedRecommendations?.has(recommendation?.id)
                ? 'bg-success/5 border-success/20' :'bg-card border-border hover:border-accent/30'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-semibold text-foreground">
                    {recommendation?.title}
                  </h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(recommendation?.priority)}`}>
                    {recommendation?.priority}
                  </span>
                  {implementedRecommendations?.has(recommendation?.id) && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-success/10 text-success border border-success/20">
                      Implemented
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {recommendation?.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Impact</p>
                    <p className="text-sm font-medium text-success">{recommendation?.impact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Effort</p>
                    <p className={`text-sm font-medium ${getEffortColor(recommendation?.effort)}`}>
                      {recommendation?.effort}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="text-sm font-medium text-foreground">{recommendation?.timeline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-sm font-medium text-foreground">{recommendation?.confidence}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-foreground mb-2">Analysis Details</h5>
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
                {recommendation?.details}
              </p>
              
              <h5 className="text-sm font-medium text-foreground mb-2">Action Items</h5>
              <ul className="space-y-1">
                {recommendation?.actionItems?.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="CheckCircle2" size={14} className="text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 pt-3 border-t border-border">
              {!implementedRecommendations?.has(recommendation?.id) ? (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleImplement(recommendation?.id)}
                    iconName="CheckCircle"
                    iconSize={14}
                  >
                    Mark as Implemented
                  </Button>
                  <Button variant="outline" size="sm" iconName="Calendar" iconSize={14}>
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm" iconName="MessageSquare" iconSize={14}>
                    Discuss
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">Implementation Tracked</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Summary */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
        <div className="flex items-start space-x-2">
          <Icon name="Brain" size={16} className="text-accent mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">AI Optimization Summary</p>
            <p className="text-xs text-muted-foreground">
              Based on 12 months of financial data analysis, implementing these recommendations 
              could improve your financial position by ₹{totalPotentialSavings?.toLocaleString('en-IN')} annually. 
              Priority should be given to high-impact, low-effort initiatives for quick wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationRecommendations;