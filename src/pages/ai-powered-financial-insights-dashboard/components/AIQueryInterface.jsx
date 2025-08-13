import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AIQueryInterface = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'ai',
      message: `Welcome to AI Financial Insights! I can help you analyze your financial data. Try asking me questions like:\n\n• "What are my top spending categories this month?"\n• "Show me cash flow predictions for next quarter"\n• "Identify any unusual transactions"`,
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'user',
      message: 'What are the main spending anomalies in the last 30 days?',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'ai',
      message: `I've identified 3 significant spending anomalies:\n\n1. **Office Supplies**: ₹45,000 spike (300% above average)\n2. **Marketing**: Unusual ₹1,20,000 payment to new vendor\n3. **Travel**: 5x increase in international travel expenses\n\nWould you like me to investigate any of these further?`,
      timestamp: new Date(Date.now() - 180000)
    }
  ]);

  const handleSubmitQuery = async (e) => {
    e?.preventDefault();
    if (!query?.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: query,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setQuery('');

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: generateAIResponse(query),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateAIResponse = (userQuery) => {
    const responses = [
      `Based on your financial data analysis:\n\n• **Revenue Growth**: 12% increase compared to last month\n• **Expense Optimization**: Identified ₹2,50,000 in potential savings\n• **Cash Flow**: Projected positive trend for next 3 months\n\nWould you like detailed insights on any specific area?`,
      `Here's what I found in your financial patterns:\n\n• **Seasonal Trends**: Q4 typically shows 25% revenue increase\n• **Vendor Analysis**: Top 3 vendors account for 60% of expenses\n• **Budget Variance**: Marketing budget is 15% under-utilized\n\nShall I create a detailed report on these findings?`,
      `Financial health analysis complete:\n\n• **Liquidity Ratio**: 2.3 (Excellent)\n• **Debt-to-Equity**: 0.4 (Healthy)\n• **Profit Margin**: 18% (Above industry average)\n\nRecommendation: Consider investing surplus cash in growth opportunities.`
    ];
    return responses?.[Math.floor(Math.random() * responses?.length)];
  };

  const suggestedQueries = [
    'Analyze my cash flow trends',
    'Show budget vs actual variance',
    'Predict next quarter revenue',
    'Find cost optimization opportunities'
  ];

  return (
    <div className="bg-card rounded-lg border border-border financial-shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Brain" size={20} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
          <div className="flex items-center space-x-1 ml-auto">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Ask me anything about your financial data
        </p>
      </div>
      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-96">
        {chatHistory?.map((message) => (
          <div
            key={message?.id}
            className={`flex ${message?.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message?.type === 'user' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground'
              }`}
            >
              <div className="text-sm whitespace-pre-line">{message?.message}</div>
              <div className="text-xs opacity-70 mt-1">
                {message?.timestamp?.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm">AI is analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Suggested Queries */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Suggested queries:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground financial-transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <form onSubmit={handleSubmitQuery} className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ask me about your finances..."
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              disabled={isProcessing}
            />
          </div>
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={!query?.trim() || isProcessing}
            iconName="Send"
            iconSize={16}
          >
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIQueryInterface;