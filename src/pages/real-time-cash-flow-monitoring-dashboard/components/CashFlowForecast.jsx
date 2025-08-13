import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CashFlowForecast = ({ onScenarioModel }) => {
  const [forecastPeriod, setForecastPeriod] = useState('3months');
  const [selectedScenario, setSelectedScenario] = useState('realistic');
  const [showConfidenceBands, setShowConfidenceBands] = useState(true);

  const forecastData = [
    { 
      date: '2025-01', 
      actual: 2640000, 
      realistic: 2640000, 
      optimistic: 2640000, 
      pessimistic: 2640000,
      upperBand: 2640000,
      lowerBand: 2640000
    },
    { 
      date: '2025-02', 
      actual: null, 
      realistic: 2850000, 
      optimistic: 3100000, 
      pessimistic: 2600000,
      upperBand: 3200000,
      lowerBand: 2500000
    },
    { 
      date: '2025-03', 
      actual: null, 
      realistic: 3120000, 
      optimistic: 3450000, 
      pessimistic: 2780000,
      upperBand: 3600000,
      lowerBand: 2400000
    },
    { 
      date: '2025-04', 
      actual: null, 
      realistic: 3280000, 
      optimistic: 3720000, 
      pessimistic: 2840000,
      upperBand: 3900000,
      lowerBand: 2300000
    },
    { 
      date: '2025-05', 
      actual: null, 
      realistic: 3450000, 
      optimistic: 4000000, 
      pessimistic: 2900000,
      upperBand: 4200000,
      lowerBand: 2200000
    },
    { 
      date: '2025-06', 
      actual: null, 
      realistic: 3620000, 
      optimistic: 4280000, 
      pessimistic: 2960000,
      upperBand: 4500000,
      lowerBand: 2100000
    }
  ];

  const periods = [
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '12months', label: '12 Months' }
  ];

  const scenarios = [
    { value: 'realistic', label: 'Realistic', color: '#1e3a8a', description: 'Based on historical trends' },
    { value: 'optimistic', label: 'Optimistic', color: '#10b981', description: '20% growth scenario' },
    { value: 'pessimistic', label: 'Pessimistic', color: '#ef4444', description: 'Conservative estimate' }
  ];

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000)?.toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000)?.toFixed(1)}L`;
    } else {
      return `₹${value?.toLocaleString('en-IN')}`;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 financial-shadow-md">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            {data?.actual && (
              <p className="text-sm">
                <span className="text-muted-foreground">Actual: </span>
                <span className="font-medium text-foreground">{formatCurrency(data?.actual)}</span>
              </p>
            )}
            <p className="text-sm">
              <span className="text-muted-foreground">Realistic: </span>
              <span className="font-medium text-primary">{formatCurrency(data?.realistic)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Optimistic: </span>
              <span className="font-medium text-success">{formatCurrency(data?.optimistic)}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Pessimistic: </span>
              <span className="font-medium text-error">{formatCurrency(data?.pessimistic)}</span>
            </p>
            {showConfidenceBands && (
              <>
                <p className="text-sm">
                  <span className="text-muted-foreground">Upper Band: </span>
                  <span className="font-medium text-muted-foreground">{formatCurrency(data?.upperBand)}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Lower Band: </span>
                  <span className="font-medium text-muted-foreground">{formatCurrency(data?.lowerBand)}</span>
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const currentCash = 2640000;
  const projectedCash = forecastData?.[forecastData?.length - 1]?.[selectedScenario];
  const projectedGrowth = ((projectedCash - currentCash) / currentCash * 100)?.toFixed(1);

  return (
    <div className="bg-card rounded-lg border border-border p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Icon name="TrendingUp" size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Cash Flow Forecast</h3>
            <p className="text-sm text-muted-foreground">AI-powered ARIMA predictions with confidence bands</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.value}
              variant={forecastPeriod === period?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setForecastPeriod(period?.value)}
            >
              {period?.label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={16}
            onClick={onScenarioModel}
            className="ml-2"
          >
            Model
          </Button>
        </div>
      </div>
      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scenarios?.map((scenario) => (
          <div
            key={scenario?.value}
            className={`p-4 rounded-lg border-2 cursor-pointer financial-transition ${
              selectedScenario === scenario?.value
                ? 'border-primary bg-blue-50' :'border-border bg-card hover:bg-muted'
            }`}
            onClick={() => setSelectedScenario(scenario?.value)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: scenario?.color }}
              ></div>
              <span className="font-medium text-foreground">{scenario?.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{scenario?.description}</p>
            <div className="mt-2">
              <span className="text-lg font-bold" style={{ color: scenario?.color }}>
                {formatCurrency(forecastData?.[forecastData?.length - 1]?.[scenario?.value])}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Forecast Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Confidence Bands */}
            {showConfidenceBands && (
              <Area
                type="monotone"
                dataKey="upperBand"
                stackId="1"
                stroke="none"
                fill="#e5e7eb"
                fillOpacity={0.3}
              />
            )}
            {showConfidenceBands && (
              <Area
                type="monotone"
                dataKey="lowerBand"
                stackId="1"
                stroke="none"
                fill="#ffffff"
                fillOpacity={1}
              />
            )}
            
            {/* Reference line for current position */}
            <ReferenceLine x="2025-01" stroke="#6b7280" strokeDasharray="2 2" />
            
            {/* Actual data line */}
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#1f2937" 
              strokeWidth={3}
              dot={{ fill: '#1f2937', strokeWidth: 2, r: 4 }}
              connectNulls={false}
              name="Actual"
            />
            
            {/* Forecast lines */}
            <Line 
              type="monotone" 
              dataKey="realistic" 
              stroke="#1e3a8a" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 3 }}
              name="Realistic"
            />
            <Line 
              type="monotone" 
              dataKey="optimistic" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              name="Optimistic"
            />
            <Line 
              type="monotone" 
              dataKey="pessimistic" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              name="Pessimistic"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Current Position</div>
          <div className="text-lg font-semibold text-primary">{formatCurrency(currentCash)}</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Projected ({selectedScenario})</div>
          <div className="text-lg font-semibold text-success">{formatCurrency(projectedCash)}</div>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Growth Rate</div>
          <div className={`text-lg font-semibold ${projectedGrowth >= 0 ? 'text-success' : 'text-error'}`}>
            {projectedGrowth >= 0 ? '+' : ''}{projectedGrowth}%
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Confidence</div>
          <div className="text-lg font-semibold text-purple-600">87.3%</div>
        </div>
      </div>
      {/* Controls */}
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          iconName={showConfidenceBands ? "EyeOff" : "Eye"}
          iconSize={16}
          onClick={() => setShowConfidenceBands(!showConfidenceBands)}
        >
          {showConfidenceBands ? 'Hide' : 'Show'} Confidence Bands
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={16}
          >
            Export Forecast
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Calculator"
            iconSize={16}
            onClick={onScenarioModel}
          >
            Scenario Modeling
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashFlowForecast;