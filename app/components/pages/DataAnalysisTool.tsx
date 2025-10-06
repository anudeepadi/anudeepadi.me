"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Slide } from "../../animation/Slide";

interface DataRow {
  [key: string]: string | number;
}

interface DataStats {
  column: string;
  type: 'numeric' | 'categorical';
  count: number;
  nullCount: number;
  uniqueCount: number;
  mean?: number;
  median?: number;
  std?: number;
  min?: number;
  max?: number;
  topValues?: { value: string | number; count: number; percentage: number }[];
}

interface CorrelationData {
  variable1: string;
  variable2: string;
  correlation: number;
  strength: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
}

type ChartType = 'bar' | 'line' | 'scatter' | 'pie' | 'histogram';
type AnalysisTab = 'overview' | 'explore' | 'insights' | 'correlations';

// Sample datasets for demonstration
const SAMPLE_DATASETS = {
  sales: {
    name: "Sales Performance Data",
    description: "Monthly sales data across different regions and products",
    data: [
      { month: "Jan", region: "North", product: "Laptops", sales: 45000, units: 150, profit: 13500 },
      { month: "Jan", region: "South", product: "Laptops", sales: 52000, units: 173, profit: 15600 },
      { month: "Jan", region: "East", product: "Phones", sales: 38000, units: 380, profit: 11400 },
      { month: "Feb", region: "North", product: "Laptops", sales: 48000, units: 160, profit: 14400 },
      { month: "Feb", region: "South", product: "Phones", sales: 41000, units: 410, profit: 12300 },
      { month: "Mar", region: "East", product: "Tablets", sales: 35000, units: 140, profit: 10500 },
      { month: "Mar", region: "North", product: "Phones", sales: 44000, units: 440, profit: 13200 },
      { month: "Apr", region: "South", product: "Laptops", sales: 55000, units: 183, profit: 16500 },
      { month: "Apr", region: "East", product: "Phones", sales: 39000, units: 390, profit: 11700 },
      { month: "May", region: "North", product: "Tablets", sales: 32000, units: 128, profit: 9600 },
      { month: "May", region: "South", product: "Phones", sales: 42000, units: 420, profit: 12600 },
      { month: "Jun", region: "East", product: "Laptops", sales: 49000, units: 163, profit: 14700 }
    ]
  },
  weather: {
    name: "Weather Analysis Data",
    description: "Temperature, humidity, and precipitation data",
    data: [
      { date: "2024-01", temperature: 32, humidity: 65, precipitation: 2.1, city: "New York" },
      { date: "2024-02", temperature: 35, humidity: 62, precipitation: 1.8, city: "New York" },
      { date: "2024-03", temperature: 45, humidity: 58, precipitation: 3.2, city: "New York" },
      { date: "2024-01", temperature: 72, humidity: 45, precipitation: 0.5, city: "Los Angeles" },
      { date: "2024-02", temperature: 75, humidity: 42, precipitation: 0.8, city: "Los Angeles" },
      { date: "2024-03", temperature: 78, humidity: 40, precipitation: 0.3, city: "Los Angeles" },
      { date: "2024-01", temperature: 28, humidity: 68, precipitation: 3.5, city: "Chicago" },
      { date: "2024-02", temperature: 31, humidity: 65, precipitation: 2.9, city: "Chicago" },
      { date: "2024-03", temperature: 42, humidity: 60, precipitation: 4.1, city: "Chicago" }
    ]
  },
  performance: {
    name: "Website Performance Metrics",
    description: "Page load times, bounce rates, and user engagement",
    data: [
      { page: "Home", loadTime: 1.2, bounceRate: 35, pageViews: 12500, conversionRate: 3.2 },
      { page: "Products", loadTime: 2.1, bounceRate: 42, pageViews: 8900, conversionRate: 5.8 },
      { page: "About", loadTime: 0.9, bounceRate: 28, pageViews: 3200, conversionRate: 1.1 },
      { page: "Contact", loadTime: 1.5, bounceRate: 38, pageViews: 2100, conversionRate: 8.5 },
      { page: "Blog", loadTime: 1.8, bounceRate: 45, pageViews: 5600, conversionRate: 2.3 },
      { page: "Pricing", loadTime: 1.4, bounceRate: 33, pageViews: 4200, conversionRate: 12.1 }
    ]
  }
};

export default function DataAnalysisTool() {
  const [data, setData] = useState<DataRow[]>([]);
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample dataset
  const loadSampleDataset = (key: keyof typeof SAMPLE_DATASETS) => {
    const dataset = SAMPLE_DATASETS[key];
    setData(dataset.data);
    setFileName(dataset.name);
    setSelectedColumns([]);
  };

  // Parse CSV file
  const parseCSV = (csvText: string): DataRow[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows: DataRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length === headers.length) {
        const row: DataRow = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to parse as number, otherwise keep as string
          const numValue = parseFloat(value);
          row[header] = !isNaN(numValue) && isFinite(numValue) ? numValue : value;
        });
        rows.push(row);
      }
    }

    return rows;
  };

  // Handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedData = parseCSV(csvText);
        setData(parsedData);
        setSelectedColumns([]);
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Error parsing CSV file. Please check the format.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  }, []);

  // Get column names and types
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  const numericColumns = useMemo(() => {
    return columns.filter(col => 
      data.some(row => typeof row[col] === 'number')
    );
  }, [columns, data]);

  const categoricalColumns = useMemo(() => {
    return columns.filter(col => 
      !numericColumns.includes(col)
    );
  }, [columns, numericColumns]);

  // Calculate statistics for each column
  const columnStats = useMemo((): DataStats[] => {
    if (data.length === 0) return [];

    return columns.map(column => {
      const values = data.map(row => row[column]).filter(v => v !== null && v !== undefined && v !== '');
      const isNumeric = values.every(v => typeof v === 'number');
      
      const stat: DataStats = {
        column,
        type: isNumeric ? 'numeric' : 'categorical',
        count: values.length,
        nullCount: data.length - values.length,
        uniqueCount: new Set(values).size
      };

      if (isNumeric) {
        const numValues = values as number[];
        numValues.sort((a, b) => a - b);
        
        stat.mean = numValues.reduce((sum, val) => sum + val, 0) / numValues.length;
        stat.median = numValues.length % 2 === 0 
          ? (numValues[Math.floor(numValues.length / 2) - 1] + numValues[Math.floor(numValues.length / 2)]) / 2
          : numValues[Math.floor(numValues.length / 2)];
        stat.min = Math.min(...numValues);
        stat.max = Math.max(...numValues);
        stat.std = Math.sqrt(numValues.reduce((sum, val) => sum + Math.pow(val - stat.mean!, 2), 0) / numValues.length);
      } else {
        // Top values for categorical data
        const valueCounts = values.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        stat.topValues = Object.entries(valueCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([value, count]) => ({
            value,
            count,
            percentage: (count / values.length) * 100
          }));
      }

      return stat;
    });
  }, [data, columns]);

  // Calculate correlations between numeric columns
  const correlations = useMemo((): CorrelationData[] => {
    if (numericColumns.length < 2) return [];

    const correlationData: CorrelationData[] = [];

    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];

        const values1 = data.map(row => row[col1] as number).filter(v => !isNaN(v));
        const values2 = data.map(row => row[col2] as number).filter(v => !isNaN(v));

        if (values1.length !== values2.length) continue;

        const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
        const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

        const numerator = values1.reduce((sum, val, idx) => sum + (val - mean1) * (values2[idx] - mean2), 0);
        const denominator = Math.sqrt(
          values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
          values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
        );

        const correlation = denominator === 0 ? 0 : numerator / denominator;
        
        let strength: CorrelationData['strength'] = 'Very Weak';
        const absCorr = Math.abs(correlation);
        if (absCorr >= 0.8) strength = 'Very Strong';
        else if (absCorr >= 0.6) strength = 'Strong';
        else if (absCorr >= 0.4) strength = 'Moderate';
        else if (absCorr >= 0.2) strength = 'Weak';

        correlationData.push({
          variable1: col1,
          variable2: col2,
          correlation,
          strength
        });
      }
    }

    return correlationData.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }, [data, numericColumns]);

  // Prepare chart data based on selected columns
  const chartData = useMemo(() => {
    if (selectedColumns.length === 0) return [];

    if (chartType === 'pie') {
      // For pie charts, use first categorical column
      const catCol = selectedColumns.find(col => categoricalColumns.includes(col));
      if (!catCol) return [];

      const valueCounts = data.reduce((acc, row) => {
        const value = String(row[catCol]);
        const currentCount = Number(acc[value] || 0);
        acc[value] = currentCount + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(valueCounts).map(([name, value]) => ({ name, value }));
    }

    // For other charts, use all data with selected columns
    return data.map((row, index) => {
      const chartRow: any = { index };
      selectedColumns.forEach(col => {
        chartRow[col] = row[col];
      });
      return chartRow;
    });
  }, [data, selectedColumns, chartType, categoricalColumns]);

  // Generate insights
  const insights = useMemo(() => {
    if (data.length === 0) return [];

    const insights: string[] = [];

    // Data overview insights
    insights.push(`Dataset contains ${data.length} rows and ${columns.length} columns`);
    
    if (numericColumns.length > 0) {
      insights.push(`Found ${numericColumns.length} numeric columns: ${numericColumns.join(', ')}`);
    }

    // Statistical insights
    columnStats.forEach(stat => {
      if (stat.type === 'numeric' && stat.mean !== undefined) {
        if (stat.std! / stat.mean > 0.5) {
          insights.push(`${stat.column} shows high variability (CV: ${((stat.std! / stat.mean) * 100).toFixed(1)}%)`);
        }
      }
      
      if (stat.nullCount > 0) {
        insights.push(`${stat.column} has ${stat.nullCount} missing values (${((stat.nullCount / data.length) * 100).toFixed(1)}%)`);
      }
    });

    // Correlation insights
    const strongCorrelations = correlations.filter(corr => Math.abs(corr.correlation) > 0.6);
    strongCorrelations.slice(0, 3).forEach(corr => {
      insights.push(`Strong ${corr.correlation > 0 ? 'positive' : 'negative'} correlation between ${corr.variable1} and ${corr.variable2} (r=${corr.correlation.toFixed(3)})`);
    });

    return insights;
  }, [data, columns, numericColumns, columnStats, correlations]);

  // Export functions
  const exportData = (format: 'csv' | 'json') => {
    if (data.length === 0) return;

    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'csv') {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => row[header]).join(','))
      ].join('\n');
      content = csvContent;
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${Date.now()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

  return (
    <section id="analysis-section" className="mt-32 max-w-7xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Data Analysis Tool
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-4xl">
            Upload CSV files or explore sample datasets with interactive statistical analysis, 
            data visualization, and automated insights generation.
          </p>
        </div>
      </Slide>

      {/* Data Import Section */}
      <Slide delay={0.25}>
        <div className="mb-6">
          <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Data Import
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div>
                <h4 className="font-medium mb-3 text-zinc-800 dark:text-zinc-200">Upload CSV File</h4>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-primary-color transition-colors text-center"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-color border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Click to upload CSV file
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Sample Datasets */}
              <div>
                <h4 className="font-medium mb-3 text-zinc-800 dark:text-zinc-200">Sample Datasets</h4>
                <div className="space-y-2">
                  {Object.entries(SAMPLE_DATASETS).map(([key, dataset]) => (
                    <button
                      key={key}
                      onClick={() => loadSampleDataset(key as keyof typeof SAMPLE_DATASETS)}
                      className="w-full text-left p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {dataset.name}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {dataset.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {fileName && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <span>✅</span>
                  <span className="text-sm">
                    Loaded: {fileName} ({data.length} rows, {columns.length} columns)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Slide>

      {/* Analysis Tabs */}
      {data.length > 0 && (
        <>
          <Slide delay={0.35}>
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                {[
                  { id: 'overview', label: 'Overview', icon: '📋' },
                  { id: 'explore', label: 'Explore', icon: '🔍' },
                  { id: 'insights', label: 'Insights', icon: '💡' },
                  { id: 'correlations', label: 'Correlations', icon: '🔗' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AnalysisTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-color text-white'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Slide>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <Slide delay={0.45}>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Dataset Summary */}
                <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                    Dataset Summary
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400">Total Rows:</span>
                        <div className="font-semibold text-primary-color">{data.length.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400">Total Columns:</span>
                        <div className="font-semibold text-primary-color">{columns.length}</div>
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400">Numeric Columns:</span>
                        <div className="font-semibold text-green-600">{numericColumns.length}</div>
                      </div>
                      <div>
                        <span className="text-zinc-600 dark:text-zinc-400">Categorical Columns:</span>
                        <div className="font-semibold text-blue-600">{categoricalColumns.length}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-zinc-800 dark:text-zinc-200">Columns</h4>
                      <div className="flex flex-wrap gap-1">
                        {columns.map(col => (
                          <span
                            key={col}
                            className={`px-2 py-1 text-xs rounded-md ${
                              numericColumns.includes(col)
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => exportData('csv')}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        📄 Export CSV
                      </button>
                      <button
                        onClick={() => exportData('json')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        📋 Export JSON
                      </button>
                    </div>
                  </div>
                </div>

                {/* Column Statistics */}
                <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                    Column Statistics
                  </h3>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {columnStats.map(stat => (
                      <div key={stat.column} className="border-b dark:border-zinc-700 border-zinc-200 pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-zinc-800 dark:text-zinc-200">{stat.column}</h4>
                          <span className={`px-2 py-1 text-xs rounded-md ${
                            stat.type === 'numeric'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {stat.type}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <div>Count: {stat.count}</div>
                          <div>Unique: {stat.uniqueCount}</div>
                          {stat.type === 'numeric' && (
                            <>
                              <div>Mean: {stat.mean?.toFixed(2)}</div>
                              <div>Std: {stat.std?.toFixed(2)}</div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Slide>
          )}

          {/* Explore Tab */}
          {activeTab === 'explore' && (
            <Slide delay={0.45}>
              <div className="space-y-6">
                {/* Chart Controls */}
                <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                    Data Visualization
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Chart Type
                      </label>
                      <select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value as ChartType)}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700"
                      >
                        <option value="bar">Bar Chart</option>
                        <option value="line">Line Chart</option>
                        <option value="scatter">Scatter Plot</option>
                        <option value="pie">Pie Chart</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                        Select Columns
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {columns.map(col => (
                          <button
                            key={col}
                            onClick={() => {
                              setSelectedColumns(prev => 
                                prev.includes(col) 
                                  ? prev.filter(c => c !== col)
                                  : [...prev, col]
                              );
                            }}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                              selectedColumns.includes(col)
                                ? 'bg-primary-color text-white'
                                : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600'
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  {selectedColumns.length > 0 && chartData.length > 0 && (
                    <div style={{ height: '400px' }}>
                      {chartType === 'bar' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={selectedColumns[0]} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedColumns.filter(col => numericColumns.includes(col)).map((col, index) => (
                              <Bar key={col} dataKey={col} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                      
                      {chartType === 'line' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={selectedColumns[0]} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {selectedColumns.filter(col => numericColumns.includes(col)).map((col, index) => (
                              <Line key={col} type="monotone" dataKey={col} stroke={COLORS[index % COLORS.length]} />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                      
                      {chartType === 'scatter' && selectedColumns.length >= 2 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={selectedColumns[0]} />
                            <YAxis dataKey={selectedColumns[1]} />
                            <Tooltip />
                            <Scatter dataKey={selectedColumns[1]} fill={COLORS[0]} />
                          </ScatterChart>
                        </ResponsiveContainer>
                      )}
                      
                      {chartType === 'pie' && (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Slide>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <Slide delay={0.45}>
              <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Automated Insights
                </h3>
                
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md">
                      <span className="text-primary-color text-lg">💡</span>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Slide>
          )}

          {/* Correlations Tab */}
          {activeTab === 'correlations' && (
            <Slide delay={0.45}>
              <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Correlation Analysis
                </h3>
                
                {correlations.length > 0 ? (
                  <div className="space-y-3">
                    {correlations.map((corr, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-md">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                            {corr.variable1} ↔ {corr.variable2}
                          </div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            {corr.strength} correlation
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                Math.abs(corr.correlation) > 0.7 ? 'bg-red-500' :
                                Math.abs(corr.correlation) > 0.5 ? 'bg-orange-500' :
                                Math.abs(corr.correlation) > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-mono ${
                            corr.correlation > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {corr.correlation.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
                    No numeric columns available for correlation analysis.
                  </p>
                )}
              </div>
            </Slide>
          )}
        </>
      )}

      {/* Empty State */}
      {data.length === 0 && (
        <Slide delay={0.35}>
          <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
              Ready for Data Analysis
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Upload a CSV file or select a sample dataset to get started with interactive data analysis.
            </p>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              Features: Statistical analysis • Data visualization • Correlation analysis • Automated insights
            </div>
          </div>
        </Slide>
      )}
    </section>
  );
}