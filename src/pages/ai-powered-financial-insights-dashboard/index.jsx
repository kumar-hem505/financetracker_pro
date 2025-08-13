import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Import components
import AIQueryInterface from './components/AIQueryInterface';
import FinancialHealthScore from './components/FinancialHealthScore';
import PredictiveAnalyticsChart from './components/PredictiveAnalyticsChart';
import AnomalyDetectionTimeline from './components/AnomalyDetectionTimeline';
import OptimizationRecommendations from './components/OptimizationRecommendations';
import InsightCategorySelector from './components/InsightCategorySelector';

const AIFinancialInsightsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedInsightCategory, setSelectedInsightCategory] = useState('forecasting');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [aiConfidenceLevel, setAiConfidenceLevel] = useState(87);
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate confidence level fluctuation
      setAiConfidenceLevel(prev => {
        const change = (Math.random() - 0.5) * 4;
        return Math.max(75, Math.min(95, prev + change));
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleNaturalLanguageQuery = async (e) => {
    e?.preventDefault();
    if (!naturalLanguageQuery?.trim()) return;

    setIsProcessingQuery(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessingQuery(false);
      setNaturalLanguageQuery('');
      // In real implementation, this would trigger AI analysis
    }, 2000);
  };

  const quickQueries = [
    'Show me cash flow predictions for next quarter',
    'What are my biggest expense anomalies?',
    'Identify cost optimization opportunities',
    'Analyze seasonal revenue patterns'
  ];

  const aiInsights = [
    {
      type: 'trend',
      message: 'Revenue growth accelerating - 15% increase predicted for Q4',
      confidence: 92
    },
    {
      type: 'anomaly',
      message: '2 high-priority spending anomalies detected requiring attention',
      confidence: 88
    },
    {
      type: 'opportunity',
      message: 'Identified ₹8.5L in potential cost savings through vendor optimization',
      confidence: 85
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI-Powered Financial Insights Dashboard - FinanceTracker Pro</title>
        <meta name="description" content="Advanced AI-powered financial analytics with predictive insights, anomaly detection, and optimization recommendations for comprehensive business intelligence." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`pt-16 pb-20 lg:pb-8 financial-transition ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}>
          <div className="p-6 max-w-[1600px] mx-auto">
            
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
                  <Icon name="Brain" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">AI-Powered Financial Insights</h1>
                  <p className="text-muted-foreground">
                    Advanced analytics and predictive intelligence for strategic financial decisions
                  </p>
                </div>
              </div>

              {/* Natural Language Query Interface */}
              <div className="mt-6 p-4 bg-card rounded-lg border border-border financial-shadow-sm">
                <form onSubmit={handleNaturalLanguageQuery} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Ask me anything about your financial data... (e.g., 'Show me cash flow trends for the last 6 months')"
                      value={naturalLanguageQuery}
                      onChange={(e) => setNaturalLanguageQuery(e?.target?.value)}
                      disabled={isProcessingQuery}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={!naturalLanguageQuery?.trim() || isProcessingQuery}
                    loading={isProcessingQuery}
                    iconName="Send"
                    iconSize={16}
                  >
                    {isProcessingQuery ? 'Analyzing...' : 'Ask AI'}
                  </Button>
                </form>

                {/* Quick Query Suggestions */}
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Try these queries:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQueries?.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => setNaturalLanguageQuery(query)}
                        className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground financial-transition"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights Banner */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiInsights?.map((insight, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border border-border financial-shadow-sm">
                  <div className="flex items-start space-x-3">
                    <Icon 
                      name={insight?.type === 'trend' ? 'TrendingUp' : insight?.type === 'anomaly' ? 'AlertTriangle' : 'Target'} 
                      size={16} 
                      className={insight?.type === 'trend' ? 'text-success' : insight?.type === 'anomaly' ? 'text-warning' : 'text-accent'}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground mb-1">{insight?.message}</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full financial-transition"
                            style={{ width: `${insight?.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{insight?.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-16 gap-6">
              
              {/* Left Column - Insights and Controls */}
              <div className="xl:col-span-4 space-y-6">
                <InsightCategorySelector
                  selectedCategory={selectedInsightCategory}
                  onCategoryChange={setSelectedInsightCategory}
                  confidenceLevel={Math.round(aiConfidenceLevel)}
                />
                
                <FinancialHealthScore />
                
                <AIQueryInterface />
              </div>

              {/* Main Content Area */}
              <div className="xl:col-span-12 space-y-6">
                
                {/* Primary Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <PredictiveAnalyticsChart />
                  </div>
                </div>

                {/* Secondary Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnomalyDetectionTimeline />
                  <OptimizationRecommendations />
                </div>

                {/* AI Processing Status */}
                <div className="p-4 bg-card rounded-lg border border-border financial-shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-lg">
                        <Icon name="Brain" size={16} className="text-success" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-foreground">AI Analysis Engine</h3>
                        <p className="text-xs text-muted-foreground">
                          Continuously analyzing financial patterns and generating insights
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Data Points Analyzed</p>
                        <p className="text-sm font-semibold text-foreground">2.4M+</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Models Running</p>
                        <p className="text-sm font-semibold text-foreground">12</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Last Update</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date()?.toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AIFinancialInsightsDashboard;