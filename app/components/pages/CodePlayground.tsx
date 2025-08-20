"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
// Simple UUID generator to avoid conflicts
const generateId = () => Math.random().toString(36).substr(2, 9);
import { Slide } from "../../animation/Slide";

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  files: Omit<CodeFile, 'id'>[];
  icon: string;
}

type Language = 'javascript' | 'typescript' | 'python' | 'html' | 'css';

const DEFAULT_TEMPLATES: CodeTemplate[] = [
  {
    id: 'react-component',
    name: 'React Component',
    description: 'A functional React component with hooks',
    language: 'typescript',
    icon: '⚛️',
    files: [
      {
        name: 'App.tsx',
        content: `import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
}

const Counter: React.FC<CounterProps> = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Interactive Counter</h2>
      <div style={{ fontSize: '2rem', margin: '20px' }}>
        Count: {count}
      </div>
      <div>
        <button onClick={decrement} style={{ margin: '5px' }}>
          -
        </button>
        <button onClick={reset} style={{ margin: '5px' }}>
          Reset
        </button>
        <button onClick={increment} style={{ margin: '5px' }}>
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;`,
        language: 'typescript'
      }
    ]
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    description: 'Interactive chart with D3.js concepts',
    language: 'javascript',
    icon: '📊',
    files: [
      {
        name: 'chart.js',
        content: `// Interactive Data Visualization Demo
const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 }
];

function createChart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const width = 400;
  const height = 200;
  const maxValue = Math.max(...data.map(d => d.value));
  
  // Clear previous chart
  container.innerHTML = '';
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.border = '1px solid #ccc';
  
  // Create bars
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * (height - 40);
    const barWidth = width / data.length - 10;
    const x = index * (width / data.length) + 5;
    const y = height - barHeight - 20;
    
    // Create bar
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barWidth);
    rect.setAttribute('height', barHeight);
    rect.setAttribute('fill', '#3b82f6');
    rect.setAttribute('rx', '3');
    
    // Add hover effect
    rect.addEventListener('mouseenter', () => {
      rect.setAttribute('fill', '#1d4ed8');
    });
    rect.addEventListener('mouseleave', () => {
      rect.setAttribute('fill', '#3b82f6');
    });
    
    svg.appendChild(rect);
    
    // Add label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x + barWidth / 2);
    text.setAttribute('y', height - 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.textContent = item.name;
    svg.appendChild(text);
    
    // Add value
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', x + barWidth / 2);
    valueText.setAttribute('y', y - 5);
    valueText.setAttribute('text-anchor', 'middle');
    valueText.setAttribute('font-size', '10');
    valueText.setAttribute('fill', '#666');
    valueText.textContent = item.value;
    svg.appendChild(valueText);
  });
  
  container.appendChild(svg);
}

// Create chart container and render
document.body.innerHTML = '<div id="chart-container"></div>';
createChart('chart-container');

console.log('📊 Interactive chart created!');
console.log('Data:', data);`,
        language: 'javascript'
      }
    ]
  },
  {
    id: 'python-data-analysis',
    name: 'Python Data Analysis',
    description: 'Data processing and visualization with Python',
    language: 'python',
    icon: '🐍',
    files: [
      {
        name: 'analysis.py',
        content: `# Python Data Analysis Demo
import json
import statistics
from typing import List, Dict

# Sample dataset
sales_data = [
    {"month": "Jan", "revenue": 12000, "customers": 150},
    {"month": "Feb", "revenue": 15000, "customers": 180},
    {"month": "Mar", "revenue": 18000, "customers": 220},
    {"month": "Apr", "revenue": 22000, "customers": 280},
    {"month": "May", "revenue": 19000, "customers": 240},
    {"month": "Jun", "revenue": 25000, "customers": 320}
]

def analyze_sales_data(data: List[Dict]) -> Dict:
    """Comprehensive sales data analysis"""
    
    revenues = [item["revenue"] for item in data]
    customers = [item["customers"] for item in data]
    
    analysis = {
        "total_revenue": sum(revenues),
        "avg_revenue": statistics.mean(revenues),
        "median_revenue": statistics.median(revenues),
        "revenue_growth": calculate_growth_rate(revenues),
        "total_customers": sum(customers),
        "avg_customers": statistics.mean(customers),
        "customer_growth": calculate_growth_rate(customers),
        "revenue_per_customer": sum(revenues) / sum(customers),
        "best_month": max(data, key=lambda x: x["revenue"])["month"],
        "worst_month": min(data, key=lambda x: x["revenue"])["month"]
    }
    
    return analysis

def calculate_growth_rate(values: List[float]) -> float:
    """Calculate overall growth rate"""
    if len(values) < 2:
        return 0.0
    return ((values[-1] - values[0]) / values[0]) * 100

def generate_insights(analysis: Dict) -> List[str]:
    """Generate business insights from analysis"""
    insights = []
    
    if analysis["revenue_growth"] > 0:
        insights.append(f"📈 Revenue grew by {analysis['revenue_growth']:.1f}% over the period")
    else:
        insights.append(f"📉 Revenue declined by {abs(analysis['revenue_growth']):.1f}%")
    
    if analysis["customer_growth"] > 0:
        insights.append(f"👥 Customer base grew by {analysis['customer_growth']:.1f}%")
    
    insights.append(f"💰 Average revenue per customer: ${analysis['revenue_per_customer']:.2f}")
    insights.append(f"🏆 Best performing month: {analysis['best_month']}")
    insights.append(f"📊 Median monthly revenue: ${analysis['median_revenue']:,}")
    
    return insights

# Execute analysis
print("🔍 Sales Data Analysis Report")
print("=" * 40)

analysis_results = analyze_sales_data(sales_data)

print(f"Total Revenue: ${analysis_results['total_revenue']:,}")
print(f"Average Monthly Revenue: ${analysis_results['avg_revenue']:,.2f}")
print(f"Total Customers: {analysis_results['total_customers']:,}")
print(f"Revenue per Customer: ${analysis_results['revenue_per_customer']:.2f}")

print("\\n📋 Key Insights:")
for insight in generate_insights(analysis_results):
    print(f"  • {insight}")

print("\\n📊 Monthly Breakdown:")
for month_data in sales_data:
    efficiency = month_data["revenue"] / month_data["customers"]
    print(f"  {month_data['month']}: ${month_data['revenue']:,} "
          f"({month_data['customers']} customers, ${efficiency:.2f}/customer)")

print("\\n✅ Analysis complete!")`,
        language: 'python'
      }
    ]
  },
  {
    id: 'web-components',
    name: 'Modern Web Components',
    description: 'HTML, CSS, and JavaScript working together',
    language: 'html',
    icon: '🌐',
    files: [
      {
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Dashboard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .dashboard {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .metric {
            font-size: 2.5rem;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #f0f0f0;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }
        
        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.2s;
        }
        
        .btn:hover {
            background: #5a6fd8;
        }
        
        .interactive-area {
            margin-top: 20px;
            padding: 20px;
            background: #f8f9ff;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="card">
            <h3>📊 Performance Metrics</h3>
            <div class="metric" id="performance-score">95</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 95%"></div>
            </div>
            <p>Website Performance Score</p>
        </div>
        
        <div class="card">
            <h3>👥 Active Users</h3>
            <div class="metric" id="user-count">1,247</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 78%"></div>
            </div>
            <p>Currently online</p>
        </div>
        
        <div class="card">
            <h3>💰 Revenue</h3>
            <div class="metric" id="revenue">$52,340</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 85%"></div>
            </div>
            <p>This month</p>
        </div>
        
        <div class="card">
            <h3>🚀 Interactive Demo</h3>
            <p>Click the button to see live updates!</p>
            <button class="btn" onclick="updateMetrics()">Refresh Data</button>
            
            <div class="interactive-area">
                <h4>Live Chart</h4>
                <canvas id="mini-chart" width="250" height="100"></canvas>
            </div>
        </div>
    </div>

    <script>
        function updateMetrics() {
            // Simulate real-time data updates
            const performanceEl = document.getElementById('performance-score');
            const userCountEl = document.getElementById('user-count');
            const revenueEl = document.getElementById('revenue');
            
            // Generate random but realistic values
            const newPerformance = Math.floor(Math.random() * 15) + 85;
            const newUsers = Math.floor(Math.random() * 500) + 1000;
            const newRevenue = Math.floor(Math.random() * 20000) + 40000;
            
            // Animate the updates
            animateNumber(performanceEl, parseInt(performanceEl.textContent), newPerformance);
            animateNumber(userCountEl, parseInt(userCountEl.textContent.replace(',', '')), newUsers, true);
            animateNumber(revenueEl, parseInt(revenueEl.textContent.replace(/[$,]/g, '')), newRevenue, false, '$');
            
            // Update progress bars
            updateProgressBars();
            
            // Redraw chart
            drawChart();
        }
        
        function animateNumber(element, start, end, addCommas = false, prefix = '') {
            const duration = 1000;
            const startTime = Date.now();
            
            function update() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (end - start) * progress);
                
                let displayValue = addCommas ? current.toLocaleString() : current.toString();
                element.textContent = prefix + displayValue;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            update();
        }
        
        function updateProgressBars() {
            const bars = document.querySelectorAll('.progress-fill');
            bars.forEach(bar => {
                const newWidth = Math.floor(Math.random() * 30) + 70;
                bar.style.width = newWidth + '%';
            });
        }
        
        function drawChart() {
            const canvas = document.getElementById('mini-chart');
            const ctx = canvas.getContext('2d');
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Generate sample data
            const data = Array.from({length: 10}, () => Math.random() * 80 + 10);
            const maxValue = Math.max(...data);
            
            // Draw chart
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            data.forEach((value, index) => {
                const x = (index / (data.length - 1)) * canvas.width;
                const y = canvas.height - (value / maxValue) * canvas.height;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            // Add dots
            ctx.fillStyle = '#764ba2';
            data.forEach((value, index) => {
                const x = (index / (data.length - 1)) * canvas.width;
                const y = canvas.height - (value / maxValue) * canvas.height;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Initialize chart on load
        drawChart();
        
        // Auto-refresh every 5 seconds for demo
        setInterval(() => {
            updateMetrics();
        }, 5000);
        
        console.log('🌐 Interactive dashboard loaded!');
        console.log('✨ Features: Auto-refresh, animations, responsive design');
    </script>
</body>
</html>`,
        language: 'html'
      }
    ]
  }
];

export default function CodePlayground() {
  const { theme } = useTheme();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isSharing, setIsSharing] = useState(false);
  const pyodideRef = useRef<any>(null);

  // Initialize with default template
  useEffect(() => {
    loadTemplate(DEFAULT_TEMPLATES[0]);
  }, []);

  // Load Pyodide for Python execution
  useEffect(() => {
    const loadPyodide = async () => {
      if (typeof window !== 'undefined' && !pyodideRef.current) {
        try {
          const { loadPyodide } = await import('pyodide');
          pyodideRef.current = await loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
          });
          console.log('🐍 Pyodide loaded successfully');
        } catch (error) {
          console.error('Failed to load Pyodide:', error);
        }
      }
    };

    loadPyodide();
  }, []);

  const loadTemplate = (template: CodeTemplate) => {
    const newFiles = template.files.map(file => ({
      ...file,
      id: generateId()
    }));
    setFiles(newFiles);
    setActiveFileId(newFiles[0]?.id || '');
    setSelectedLanguage(template.language as Language);
    setOutput('');
  };

  const createNewFile = () => {
    const newFile: CodeFile = {
      id: generateId(),
      name: `new-file.${selectedLanguage === 'typescript' ? 'ts' : selectedLanguage === 'python' ? 'py' : 'js'}`,
      content: getDefaultContent(selectedLanguage),
      language: selectedLanguage
    };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const getDefaultContent = (language: Language): string => {
    const defaults = {
      javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
      typescript: '// Write your TypeScript code here\nconst message: string = "Hello, World!";\nconsole.log(message);',
      python: '# Write your Python code here\nprint("Hello, World!")',
      html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
      css: '/* Write your CSS here */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}'
    };
    return defaults[language];
  };

  const updateFileContent = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId ? { ...file, content } : file
    ));
  };

  const updateFileName = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, name: newName } : file
    ));
  };

  const deleteFile = (fileId: string) => {
    if (files.length <= 1) return; // Keep at least one file
    
    setFiles(prev => prev.filter(file => file.id !== fileId));
    if (activeFileId === fileId) {
      const remainingFiles = files.filter(file => file.id !== fileId);
      setActiveFileId(remainingFiles[0]?.id || '');
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) {
      setOutput('❌ No active file found');
      setIsRunning(false);
      return;
    }

    try {
      if (activeFile.language === 'python') {
        await runPythonCode(activeFile.content);
      } else if (activeFile.language === 'javascript' || activeFile.language === 'typescript') {
        runJavaScriptCode(activeFile.content);
      } else if (activeFile.language === 'html') {
        runHTMLCode(activeFile.content);
      } else {
        setOutput('🔧 Code execution not supported for this language yet');
      }
    } catch (error) {
      setOutput(`❌ Error: ${error}`);
    }

    setIsRunning(false);
  };

  const runPythonCode = async (code: string) => {
    if (!pyodideRef.current) {
      setOutput('❌ Python environment not loaded. Please wait and try again.');
      return;
    }

    try {
      // Capture Python output
      pyodideRef.current.runPython(`
        import sys
        from io import StringIO
        sys.stdout = StringIO()
      `);

      // Run user code
      pyodideRef.current.runPython(code);

      // Get output
      const stdout = pyodideRef.current.runPython('sys.stdout.getvalue()');
      setOutput(stdout || '✅ Code executed successfully (no output)');
    } catch (error: any) {
      setOutput(`❌ Python Error: ${error.message}`);
    }
  };

  const runJavaScriptCode = (code: string) => {
    try {
      // Create a custom console for capturing output
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ')),
        error: (...args: any[]) => logs.push(`❌ ${args.join(' ')}`),
        warn: (...args: any[]) => logs.push(`⚠️ ${args.join(' ')}`),
        info: (...args: any[]) => logs.push(`ℹ️ ${args.join(' ')}`)
      };

      // Execute code with custom console
      const wrappedCode = `
        (function(console) {
          ${code}
        })(${JSON.stringify(customConsole)});
      `;

      eval(wrappedCode);
      setOutput(logs.length > 0 ? logs.join('\n') : '✅ Code executed successfully (no output)');
    } catch (error: any) {
      setOutput(`❌ JavaScript Error: ${error.message}`);
    }
  };

  const runHTMLCode = (code: string) => {
    // For HTML, we'll show a preview message
    setOutput('🌐 HTML code ready! For full preview, copy the code to a separate HTML file.');
  };

  const shareCode = async () => {
    setIsSharing(true);
    try {
      // In a real implementation, you'd send this to your backend
      const shareData = {
        files: files,
        language: selectedLanguage,
        timestamp: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const shareId = generateId();
      const url = `${window.location.origin}/playground/share/${shareId}`;
      setShareUrl(url);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(url);
      setOutput(`📋 Share URL copied to clipboard!\n🔗 ${url}`);
    } catch (error) {
      setOutput(`❌ Failed to share code: ${error}`);
    }
    setIsSharing(false);
  };

  const activeFile = files.find(file => file.id === activeFileId);

  return (
    <section id="playground-section" className="mt-32 max-w-7xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Interactive Code Playground
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-4xl">
            Write, execute, and share code in multiple languages with real-time output. 
            Supports JavaScript, TypeScript, Python, HTML, and CSS with full Monaco Editor features.
          </p>
        </div>
      </Slide>

      {/* Templates */}
      <Slide delay={0.25}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
            Quick Start Templates
          </h3>
          <div className="flex flex-wrap gap-3">
            {DEFAULT_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => loadTemplate(template)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <span>{template.icon}</span>
                <span className="text-sm font-medium">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      </Slide>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <Slide delay={0.35}>
          <div className="lg:col-span-2 dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg overflow-hidden">
            {/* File Tabs */}
            <div className="border-b dark:border-zinc-700 border-zinc-200 p-2 flex items-center justify-between">
              <div className="flex items-center gap-1 overflow-x-auto">
                {files.map(file => (
                  <div key={file.id} className="flex items-center group">
                    <button
                      onClick={() => setActiveFileId(file.id)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        activeFileId === file.id
                          ? 'bg-primary-color text-white'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {file.name}
                    </button>
                    {files.length > 1 && (
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="ml-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={createNewFile}
                  className="px-2 py-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  +
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="px-2 py-1 text-sm border dark:border-zinc-600 border-zinc-300 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                </select>
              </div>
            </div>

            {/* Editor */}
            <div className="h-96">
              {activeFile && (
                <Editor
                  height="100%"
                  language={activeFile.language}
                  value={activeFile.content}
                  onChange={(value) => updateFileContent(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on'
                  }}
                />
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t dark:border-zinc-700 border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-color text-white rounded-md hover:bg-secondary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <span>▶️</span>
                      Run Code
                    </>
                  )}
                </button>

                <button
                  onClick={shareCode}
                  disabled={isSharing}
                  className="flex items-center gap-2 px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  {isSharing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <span>🔗</span>
                      Share
                    </>
                  )}
                </button>
              </div>

              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                Press Ctrl+Enter to run
              </div>
            </div>
          </div>
        </Slide>

        {/* Output Panel */}
        <Slide delay={0.45}>
          <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b dark:border-zinc-700 border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Output
              </h3>
            </div>
            
            <div className="p-4">
              <pre className="text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 p-4 rounded-md overflow-auto max-h-80 whitespace-pre-wrap">
                {output || '🚀 Click "Run Code" to see output here...'}
              </pre>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t dark:border-zinc-700 border-zinc-200">
              <h4 className="text-sm font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => setOutput('')}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                  🗑️ Clear Output
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                  📋 Copy Output
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([activeFile?.content || ''], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = activeFile?.name || 'code.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                  💾 Download File
                </button>
              </div>
            </div>
          </div>
        </Slide>
      </div>
    </section>
  );
}