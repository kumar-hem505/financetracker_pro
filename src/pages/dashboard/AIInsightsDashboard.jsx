import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transactionService';
import { budgetService } from '../../services/budgetService';
import { 
  generateFinancialInsights,
  generateFinancialForecast,
  detectFinancialAnomalies,
  getTaxOptimizationTips,
  analyzeInvoiceImage
} from '../../utils/gemini';
import { formatCurrency } from '../../utils/supabase';
import { showToast } from '../../components/ui/Toast';
import Modal from '../../components/ui/Modal';
import { Brain, MessageSquare, TrendingUp, AlertTriangle, Target, FileText, Upload, Send, Loader2, Sparkles, Lightbulb } from 'lucide-react';
import Chart from 'react-apexcharts';

export default function AIInsightsDashboard() {
  const { userProfile } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [taxTips, setTaxTips] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Predefined queries for quick access
  const quickQueries = [
    "Show total marketing spend for Q1 2024",
    "Compare travel expenses vs last quarter",
    "What are the top 5 vendors by spending?",
    "Analyze cash flow trends for the past 6 months",
    "Which budget categories are over-utilized?",
    "Predict next quarter\'s expenses",
    "Show GST liability breakdown",
    "Identify unusual spending patterns"
  ];

  // Load initial AI data
  const loadAIData = async () => {
    try {
      setLoading(true);

      // Get financial data for context
      const [financial, transactions, budgets] = await Promise.all([
        transactionService?.getFinancialSummary('current_quarter'),
        transactionService?.getRecentTransactions(50),
        budgetService?.getBudgets({ status: 'active' })
      ]);

      // Generate forecast
      const forecastData = await generateFinancialForecast(transactions, '6months');
      setForecast(forecastData);

      // Detect anomalies
      const anomalyData = await detectFinancialAnomalies(transactions);
      setAnomalies(anomalyData);

      // Get tax optimization tips
      const tips = await getTaxOptimizationTips(financial);
      setTaxTips(tips);

    } catch (error) {
      console.error('Error loading AI data:', error);
      showToast?.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  // Handle natural language query
  const handleQuery = async (queryText = query) => {
    if (!queryText?.trim()) return;

    try {
      setQueryLoading(true);
      
      // Get relevant financial data for context
      const [financial, transactions] = await Promise.all([
        transactionService?.getFinancialSummary('current_quarter'),
        transactionService?.getRecentTransactions(100)
      ]);

      const contextData = {
        financial_summary: financial,
        recent_transactions: transactions?.slice(0, 20) // Limit for API
      };

      const response = await generateFinancialInsights(queryText, contextData);
      
      const newInsight = {
        id: Date.now(),
        query: queryText,
        response,
        timestamp: new Date()?.toISOString()
      };

      setInsights(prev => [newInsight, ...prev?.slice(0, 9)]); // Keep last 10 insights
      setQuery('');

    } catch (error) {
      console.error('Error processing query:', error);
      showToast?.error('Failed to process your query. Please try again.');
    } finally {
      setQueryLoading(false);
    }
  };

  // Handle file upload and analysis
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadLoading(true);
      
      const analysisResult = await analyzeInvoiceImage(selectedFile);
      
      showToast?.success('Invoice analyzed successfully!');
      
      // Create insight from analysis
      const newInsight = {
        id: Date.now(),
        query: `Analyzed invoice: ${selectedFile?.name}`,
        response: `Invoice Analysis Results:\n\n${JSON.stringify(analysisResult, null, 2)}`,
        timestamp: new Date()?.toISOString(),
        type: 'file_analysis'
      };

      setInsights(prev => [newInsight, ...prev?.slice(0, 9)]);
      setSelectedFile(null);
      setShowUploadModal(false);

    } catch (error) {
      console.error('Error analyzing file:', error);
      showToast?.error('Failed to analyze invoice. Please try again.');
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    loadAIData();
  }, []);

  // Forecast Chart Component
  const ForecastChart = () => {
    if (!forecast) return null;

    const chartData = {
      series: [{
        name: 'Predicted Income',
        data: [forecast?.predicted_income || 0]
      }, {
        name: 'Predicted Expenses',
        data: [forecast?.predicted_expenses || 0]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 300
        },
        colors: ['#10B981', '#EF4444'],
        xaxis: {
          categories: [forecast?.forecast_period || 'Next Period']
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return formatCurrency(value);
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return formatCurrency(value);
            }
          }
        }
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Forecast</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <Chart 
          options={chartData?.options}
          series={chartData?.series}
          type="bar"
          height={300}
        />
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Key Trends:</p>
          <ul className="text-sm text-blue-800 space-y-1">
            {forecast?.key_trends?.map((trend, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                {trend}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Anomalies Panel
  const AnomaliesPanel = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Detected Anomalies</h3>
        <AlertTriangle className="w-5 h-5 text-gray-400" />
      </div>
      
      {anomalies?.length > 0 ? (
        <div className="space-y-3">
          {anomalies?.slice(0, 5)?.map((anomaly, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                anomaly?.severity === 'high' ? 'border-red-200 bg-red-50' :
                anomaly?.severity === 'medium'? 'border-yellow-200 bg-yellow-50' : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm mb-1">
                    {anomaly?.type?.replace('_', ' ')?.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {anomaly?.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Suggestion: {anomaly?.suggestion}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  anomaly?.severity === 'high' ? 'bg-red-100 text-red-800' :
                  anomaly?.severity === 'medium'? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {anomaly?.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p>No anomalies detected</p>
          <p className="text-sm">Your financial data looks normal</p>
        </div>
      )}
    </div>
  );

  // Tax Tips Panel
  const TaxTipsPanel = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tax Optimization Tips</h3>
        <Target className="w-5 h-5 text-gray-400" />
      </div>
      
      {taxTips?.length > 0 ? (
        <div className="space-y-4">
          {taxTips?.slice(0, 3)?.map((tip, index) => (
            <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start">
                <Lightbulb className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900 mb-1">
                    {tip?.category?.toUpperCase()} Optimization
                  </p>
                  <p className="text-sm text-green-800 mb-2">
                    {tip?.tip}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-600 font-medium">
                      Potential Savings: {tip?.potential_savings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p>Loading tax optimization tips...</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg" />
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Financial Insights</h1>
          <p className="text-gray-600">
            Get intelligent analysis and recommendations for your financial data
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Analyze Invoice
        </button>
      </div>
      {/* AI Query Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <Brain className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Ask AI Assistant</h3>
        </div>
        
        <div className="space-y-4">
          {/* Query Input */}
          <div className="flex space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              onKeyPress={(e) => e?.key === 'Enter' && handleQuery()}
              placeholder="Ask about your financial data..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={queryLoading}
            />
            <button
              onClick={() => handleQuery()}
              disabled={queryLoading || !query?.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {queryLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Quick Queries */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick queries:</p>
            <div className="flex flex-wrap gap-2">
              {quickQueries?.map((quickQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleQuery(quickQuery)}
                  disabled={queryLoading}
                  className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  {quickQuery}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* AI Insights History */}
      {insights?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Insights</h3>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {insights?.map((insight) => (
              <div key={insight?.id} className="border-l-4 border-blue-400 pl-4 py-2">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {insight?.query}
                </p>
                <div className="text-sm text-gray-600 whitespace-pre-wrap">
                  {insight?.response}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(insight.timestamp)?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* AI Analysis Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastChart />
        <AnomaliesPanel />
      </div>
      <TaxTipsPanel />
      {/* Invoice Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Analyze Invoice with AI"
        description="Upload an invoice or receipt to extract financial data automatically"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Invoice/Receipt
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSelectedFile(e?.target?.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {selectedFile && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Selected: {selectedFile?.name}
              </p>
              <p className="text-xs text-gray-500">
                Size: {(selectedFile?.size / 1024 / 1024)?.toFixed(2)} MB
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={uploadLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || uploadLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploadLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Analyze Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}