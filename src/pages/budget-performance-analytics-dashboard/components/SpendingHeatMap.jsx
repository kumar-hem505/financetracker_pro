import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SpendingHeatMap = ({ data, categories, timePeriods }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [viewMode, setViewMode] = useState('amount'); // 'amount' or 'variance'

  const getMaxValue = () => {
    return Math.max(...data?.flat()?.map(cell => 
      viewMode === 'amount' ? cell?.amount : Math.abs(cell?.variance)
    ));
  };

  const getCellColor = (cell) => {
    const maxValue = getMaxValue();
    if (viewMode === 'amount') {
      const intensity = cell?.amount / maxValue;
      return `rgba(30, 58, 138, ${intensity})`; // primary color with varying opacity
    } else {
      const intensity = Math.abs(cell?.variance) / maxValue;
      const color = cell?.variance > 0 ? '220, 38, 38' : '5, 150, 105'; // red for over, green for under
      return `rgba(${color}, ${intensity})`;
    }
  };

  const getCellTextColor = (cell) => {
    const maxValue = getMaxValue();
    const intensity = viewMode === 'amount' ? 
      cell?.amount / maxValue : 
      Math.abs(cell?.variance) / maxValue;
    return intensity > 0.5 ? '#ffffff' : '#1f2937';
  };

  const formatValue = (cell) => {
    if (viewMode === 'amount') {
      return `₹${(cell?.amount / 100000)?.toFixed(1)}L`;
    } else {
      return `${cell?.variance > 0 ? '+' : ''}${cell?.variance?.toFixed(1)}%`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Spending Pattern Analysis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Heat map visualization of spending across categories and time periods
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('amount')}
            className={`px-3 py-1 rounded-md text-sm font-medium financial-transition ${
              viewMode === 'amount' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Amount
          </button>
          <button
            onClick={() => setViewMode('variance')}
            className={`px-3 py-1 rounded-md text-sm font-medium financial-transition ${
              viewMode === 'variance' 
                ? 'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Variance
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-13 gap-1 mb-2">
            <div className="text-xs font-medium text-muted-foreground p-2"></div>
            {timePeriods?.map((period) => (
              <div key={period} className="text-xs font-medium text-muted-foreground p-2 text-center">
                {period}
              </div>
            ))}
          </div>

          {/* Heat map grid */}
          <div className="space-y-1">
            {categories?.map((category, categoryIndex) => (
              <div key={category} className="grid grid-cols-13 gap-1">
                <div className="text-xs font-medium text-foreground p-2 truncate" title={category}>
                  {category}
                </div>
                {timePeriods?.map((period, periodIndex) => {
                  const cell = data?.[categoryIndex]?.[periodIndex];
                  const isSelected = selectedCell?.category === categoryIndex && selectedCell?.period === periodIndex;
                  
                  return (
                    <div
                      key={`${category}-${period}`}
                      className={`relative p-2 rounded cursor-pointer financial-transition border ${
                        isSelected ? 'border-primary border-2' : 'border-transparent'
                      }`}
                      style={{ 
                        backgroundColor: getCellColor(cell),
                        color: getCellTextColor(cell)
                      }}
                      onClick={() => setSelectedCell({ category: categoryIndex, period: periodIndex, data: cell })}
                      title={`${category} - ${period}: ${formatValue(cell)}`}
                    >
                      <div className="text-xs font-medium text-center">
                        {formatValue(cell)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Legend:</span>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary/20 rounded"></div>
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary/60 rounded"></div>
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
          
          {selectedCell && (
            <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm text-foreground">
                {categories?.[selectedCell?.category]} - {timePeriods?.[selectedCell?.period]}: {formatValue(selectedCell?.data)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpendingHeatMap;