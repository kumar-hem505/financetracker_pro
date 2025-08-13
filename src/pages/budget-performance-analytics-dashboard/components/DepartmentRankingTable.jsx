import React from 'react';
import Icon from '../../../components/AppIcon';

const DepartmentRankingTable = ({ departments, onDepartmentClick }) => {
  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-success/10 text-success' };
    if (score >= 70) return { label: 'Good', color: 'bg-warning/10 text-warning' };
    return { label: 'Needs Attention', color: 'bg-error/10 text-error' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 financial-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Department Performance</h3>
          <p className="text-sm text-muted-foreground mt-1">Budget utilization ranking</p>
        </div>
        <Icon name="Trophy" size={20} className="text-warning" />
      </div>
      <div className="space-y-4">
        {departments?.map((dept, index) => {
          const badge = getPerformanceBadge(dept?.score);
          const utilizationPercentage = (dept?.spent / dept?.budget) * 100;
          
          return (
            <div
              key={dept?.id}
              onClick={() => onDepartmentClick(dept)}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 financial-transition cursor-pointer"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground truncate">{dept?.name}</h4>
                    <span className={`text-sm font-medium ${getPerformanceColor(dept?.score)}`}>
                      {dept?.score}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{dept?.spent?.toLocaleString('en-IN')} / ₹{dept?.budget?.toLocaleString('en-IN')}</span>
                      <span>{utilizationPercentage?.toFixed(1)}% utilized</span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full financial-transition ${
                          utilizationPercentage > 100 ? 'bg-error' : 
                          utilizationPercentage > 80 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}>
                  {badge?.label}
                </span>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Departments</span>
          <span className="font-medium text-foreground">{departments?.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-muted-foreground">Avg Performance</span>
          <span className="font-medium text-foreground">
            {(departments?.reduce((sum, dept) => sum + dept?.score, 0) / departments?.length)?.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentRankingTable;