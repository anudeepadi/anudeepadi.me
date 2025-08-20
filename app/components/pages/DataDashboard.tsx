"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter
} from "recharts";
import { Slide } from "../../animation/Slide";

interface DataPoint {
  timestamp: string;
  hour: number;
  cpuUsage: number;
  memoryUsage: number;
  networkIn: number;
  networkOut: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeUsers: number;
}

interface FilterOptions {
  timeRange: '1h' | '6h' | '24h' | '7d';
  metric: 'all' | 'performance' | 'network' | 'users';
}

type ChartType = 'line' | 'area' | 'bar' | 'scatter';

const COLORS = ['#33E092', '#0CCE6B', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DataDashboard() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: '24h',
    metric: 'all'
  });
  const [selectedChart, setSelectedChart] = useState<ChartType>('line');
  const [isRealTime, setIsRealTime] = useState(true);

  // Real-time data simulation
  useEffect(() => {
    if (!isRealTime) return;
    
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Generate realistic time-series data
  const generateTimeSeriesData = (timeRange: string): DataPoint[] => {
    const now = currentTime;
    const ranges = {
      '1h': { points: 60, interval: 60000 }, // 1 minute intervals
      '6h': { points: 72, interval: 300000 }, // 5 minute intervals
      '24h': { points: 48, interval: 1800000 }, // 30 minute intervals
      '7d': { points: 168, interval: 3600000 } // 1 hour intervals
    };
    
    const { points, interval } = ranges[timeRange as keyof typeof ranges];
    
    return Array.from({ length: points }, (_, i) => {
      const timestamp = new Date(now - (points - i - 1) * interval);
      const hour = timestamp.getHours();
      
      // Add realistic patterns and noise
      const baseLoad = 0.3 + 0.4 * Math.sin((hour - 6) * Math.PI / 12);
      const randomNoise = () => (Math.random() - 0.5) * 0.2;
      const spikes = Math.random() < 0.05 ? 0.3 : 0; // 5% chance of spike
      
      return {
        timestamp: timestamp.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          ...(timeRange === '7d' && { month: '2-digit', day: '2-digit' })
        }),
        hour,
        cpuUsage: Math.max(0, Math.min(100, (baseLoad + randomNoise() + spikes) * 100)),
        memoryUsage: Math.max(0, Math.min(100, (baseLoad * 0.8 + randomNoise() + spikes * 0.5) * 100)),
        networkIn: Math.max(0, (baseLoad * 50 + randomNoise() * 20 + spikes * 30)),
        networkOut: Math.max(0, (baseLoad * 30 + randomNoise() * 15 + spikes * 20)),
        responseTime: Math.max(10, baseLoad * 200 + randomNoise() * 50 + spikes * 300),
        throughput: Math.max(0, baseLoad * 1000 + randomNoise() * 200 + spikes * 500),
        errorRate: Math.max(0, Math.min(10, baseLoad * 2 + randomNoise() + spikes * 5)),
        activeUsers: Math.max(0, Math.floor(baseLoad * 500 + randomNoise() * 100 + spikes * 200))
      };
    });
  };

  const data = useMemo(() => generateTimeSeriesData(filters.timeRange), [filters.timeRange, currentTime]);

  // Performance metrics calculations
  const metrics = useMemo(() => {
    if (data.length === 0) return null;
    
    const latest = data[data.length - 1];
    const previous = data[data.length - 2] || latest;
    
    return {
      avgCpu: (data.reduce((sum, d) => sum + d.cpuUsage, 0) / data.length).toFixed(1),
      avgMemory: (data.reduce((sum, d) => sum + d.memoryUsage, 0) / data.length).toFixed(1),
      avgResponseTime: (data.reduce((sum, d) => sum + d.responseTime, 0) / data.length).toFixed(0),
      totalThroughput: data.reduce((sum, d) => sum + d.throughput, 0).toFixed(0),
      avgErrorRate: (data.reduce((sum, d) => sum + d.errorRate, 0) / data.length).toFixed(2),
      currentUsers: latest.activeUsers,
      cpuTrend: latest.cpuUsage > previous.cpuUsage ? 'up' : latest.cpuUsage < previous.cpuUsage ? 'down' : 'stable',
      memoryTrend: latest.memoryUsage > previous.memoryUsage ? 'up' : latest.memoryUsage < previous.memoryUsage ? 'down' : 'stable'
    };
  }, [data]);

  // Resource distribution for pie chart
  const resourceData = useMemo(() => [
    { name: 'CPU', value: parseFloat(metrics?.avgCpu || '0'), color: COLORS[0] },
    { name: 'Memory', value: parseFloat(metrics?.avgMemory || '0'), color: COLORS[1] },
    { name: 'Network', value: data.length > 0 ? (data[data.length - 1].networkIn + data[data.length - 1].networkOut) / 2 : 0, color: COLORS[2] },
    { name: 'Storage', value: Math.random() * 30 + 20, color: COLORS[3] } // Simulated
  ], [metrics, data]);

  // Export functionality
  const exportData = (format: 'csv' | 'json') => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    if (format === 'csv') {
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = `${headers}\n${rows}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${timestamp}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Filter data based on metric selection
  const filteredChartData = useMemo(() => {
    if (filters.metric === 'all') return data;
    
    return data.map(d => {
      const base = { timestamp: d.timestamp, hour: d.hour };
      switch (filters.metric) {
        case 'performance':
          return { ...base, cpuUsage: d.cpuUsage, memoryUsage: d.memoryUsage, responseTime: d.responseTime };
        case 'network':
          return { ...base, networkIn: d.networkIn, networkOut: d.networkOut };
        case 'users':
          return { ...base, activeUsers: d.activeUsers, throughput: d.throughput };
        default:
          return d;
      }
    });
  }, [data, filters.metric]);

  const renderChart = () => {
    const commonProps = {
      data: filteredChartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (selectedChart) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Area type="monotone" dataKey="cpuUsage" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
            <Area type="monotone" dataKey="memoryUsage" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.6} />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="throughput" fill={COLORS[0]} />
            <Bar dataKey="activeUsers" fill={COLORS[1]} />
          </BarChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="number" dataKey="cpuUsage" name="CPU" stroke="#9CA3AF" fontSize={12} />
            <YAxis type="number" dataKey="memoryUsage" name="Memory" stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Scatter name="Resource Usage" data={filteredChartData} fill={COLORS[0]} />
          </ScatterChart>
        );
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Line type="monotone" dataKey="cpuUsage" stroke={COLORS[0]} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="memoryUsage" stroke={COLORS[1]} strokeWidth={2} dot={false} />
            {filters.metric === 'all' && (
              <Line type="monotone" dataKey="responseTime" stroke={COLORS[2]} strokeWidth={2} dot={false} />
            )}
          </LineChart>
        );
    }
  };

  return (
    <section className="mt-32 max-w-7xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Real-Time Data Visualization Dashboard
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-4xl">
            Comprehensive monitoring dashboard with real-time data simulation, multiple chart types, 
            advanced filtering, and export capabilities. Monitor system performance, network traffic, 
            and user analytics with interactive visualizations.
          </p>
        </div>
      </Slide>

      {/* Controls */}
      <Slide delay={0.25}>
        <div className="flex flex-wrap gap-4 mb-8 p-6 dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg">
          {/* Time Range Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Time Range</label>
            <select
              value={filters.timeRange}
              onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as FilterOptions['timeRange'] }))}
              className="px-3 py-2 border dark:border-zinc-700 border-zinc-300 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          {/* Metric Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Metrics</label>
            <select
              value={filters.metric}
              onChange={(e) => setFilters(prev => ({ ...prev, metric: e.target.value as FilterOptions['metric'] }))}
              className="px-3 py-2 border dark:border-zinc-700 border-zinc-300 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="all">All Metrics</option>
              <option value="performance">Performance</option>
              <option value="network">Network</option>
              <option value="users">Users & Throughput</option>
            </select>
          </div>

          {/* Chart Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Chart Type</label>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as ChartType)}
              className="px-3 py-2 border dark:border-zinc-700 border-zinc-300 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            >
              <option value="line">Line Chart</option>
              <option value="area">Area Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
          </div>

          {/* Real-time Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Data Mode</label>
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isRealTime 
                  ? 'bg-primary-color text-white' 
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {isRealTime ? 'Real-time ●' : 'Static'}
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Export</label>
            <div className="flex gap-2">
              <button
                onClick={() => exportData('csv')}
                className="px-3 py-2 bg-secondary-color text-white rounded-md hover:bg-tertiary-color transition-colors text-sm"
              >
                CSV
              </button>
              <button
                onClick={() => exportData('json')}
                className="px-3 py-2 bg-tertiary-color text-white rounded-md hover:bg-secondary-color transition-colors text-sm"
              >
                JSON
              </button>
            </div>
          </div>
        </div>
      </Slide>

      {/* Performance Metrics */}
      {metrics && (
        <Slide delay={0.35}>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg CPU</p>
              <p className="text-2xl font-semibold text-primary-color">{metrics.avgCpu}%</p>
              <span className={`text-xs ${
                metrics.cpuTrend === 'up' ? 'text-red-500' : 
                metrics.cpuTrend === 'down' ? 'text-green-500' : 'text-zinc-500'
              }`}>
                {metrics.cpuTrend === 'up' ? '↗' : metrics.cpuTrend === 'down' ? '↘' : '→'}
              </span>
            </div>
            
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Avg Memory</p>
              <p className="text-2xl font-semibold text-secondary-color">{metrics.avgMemory}%</p>
              <span className={`text-xs ${
                metrics.memoryTrend === 'up' ? 'text-red-500' : 
                metrics.memoryTrend === 'down' ? 'text-green-500' : 'text-zinc-500'
              }`}>
                {metrics.memoryTrend === 'up' ? '↗' : metrics.memoryTrend === 'down' ? '↘' : '→'}
              </span>
            </div>
            
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Response Time</p>
              <p className="text-2xl font-semibold text-tertiary-color">{metrics.avgResponseTime}ms</p>
            </div>
            
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Throughput</p>
              <p className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300">{metrics.totalThroughput}</p>
            </div>
            
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Error Rate</p>
              <p className="text-2xl font-semibold text-red-500">{metrics.avgErrorRate}%</p>
            </div>
            
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Active Users</p>
              <p className="text-2xl font-semibold text-blue-500">{metrics.currentUsers}</p>
            </div>
          </div>
        </Slide>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Slide delay={0.45}>
          <div className="lg:col-span-2 dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              System Metrics - {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        </Slide>

        {/* Resource Distribution */}
        <Slide delay={0.55}>
          <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Resource Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  >
                    {resourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Slide>
      </div>
    </section>
  );
}