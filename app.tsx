import React, { useState, useRef } from 'react';
import { Upload, Play, Plus, BarChart3, Brain, Settings, Download, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterPlot, Scatter, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';

const SocialDataAnalyzer = () => {
  const [apiKey, setApiKey] = useState('');
  const [dataset, setDataset] = useState(null);
  const [columns, setColumns] = useState([]);
  const [cells, setCells] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  // Sample analysis templates for social science
  const analysisTemplates = [
    {
      title: "Descriptive Statistics",
      description: "Get basic stats, missing data overview, and distributions",
      type: "descriptive"
    },
    {
      title: "Chi-Square Test",
      description: "Test relationships between categorical variables",
      type: "chi-square"
    },
    {
      title: "Correlation Analysis",
      description: "Explore relationships between numeric variables",
      type: "correlation"
    },
    {
      title: "Missing Data Analysis",
      description: "Identify patterns in missing data",
      type: "missing-data"
    },
    {
      title: "Demographic Breakdown",
      description: "Analyze by demographic categories",
      type: "demographic"
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const headers = results.data[0].map(h => h.trim());
            const rows = results.data.slice(1).filter(row => row.some(cell => cell.trim()));
            
            setDataset(rows);
            setColumns(headers);
            
            // Add welcome cell
            setCells([{
              id: Date.now(),
              type: 'info',
              content: `Dataset loaded! ${rows.length} rows, ${headers.length} columns`,
              output: null
            }]);
          }
        },
        header: false,
        skipEmptyLines: true
      });
    }
  };

  const addCell = (type = 'code') => {
    const newCell = {
      id: Date.now(),
      type: type,
      content: type === 'code' ? '# Write your analysis code here\n' : '',
      output: null
    };
    setCells([...cells, newCell]);
  };

  const runAnalysis = async (cellId, analysisType) => {
    if (!dataset || !apiKey) return;
    
    setIsLoading(true);
    
    // Mock analysis results for different types
    const mockAnalyses = {
      descriptive: {
        title: "Descriptive Statistics",
        stats: {
          totalRows: dataset.length,
          totalColumns: columns.length,
          missingData: Math.floor(dataset.length * 0.1),
          completeness: "89%"
        },
        chart: {
          type: 'bar',
          data: columns.slice(0, 5).map(col => ({
            name: col,
            value: Math.floor(Math.random() * 100)
          }))
        }
      },
      'chi-square': {
        title: "Chi-Square Test Results",
        stats: {
          chiSquare: "12.45",
          pValue: "0.032",
          significance: "Significant at p < 0.05",
          interpretation: "There is a significant association between the variables"
        },
        chart: {
          type: 'pie',
          data: [
            { name: 'Category A', value: 35 },
            { name: 'Category B', value: 45 },
            { name: 'Category C', value: 20 }
          ]
        }
      },
      correlation: {
        title: "Correlation Analysis",
        stats: {
          strongCorrelations: 3,
          averageCorrelation: "0.42",
          significantPairs: 8
        },
        chart: {
          type: 'scatter',
          data: Array.from({length: 50}, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100
          }))
        }
      }
    };

    // Simulate AI analysis
    setTimeout(() => {
      const result = mockAnalyses[analysisType] || mockAnalyses.descriptive;
      
      setCells(cells.map(cell => 
        cell.id === cellId 
          ? { ...cell, output: result }
          : cell
      ));
      
      setIsLoading(false);
    }, 1500);
  };

  const renderChart = (chartData) => {
    if (!chartData) return null;

    switch (chartData.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterPlot>
              <CartesianGrid />
              <XAxis dataKey="x" />
              <YAxis dataKey="y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={chartData.data} fill="#8884d8" />
            </ScatterPlot>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const renderCell = (cell) => {
    return (
      <div key={cell.id} className="border border-gray-200 rounded-lg mb-4 bg-white">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">
            {cell.type === 'code' ? 'Code Cell' : 'Analysis Cell'}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => runAnalysis(cell.id, 'descriptive')}
              className="p-1 text-gray-500 hover:text-blue-600"
              disabled={isLoading}
            >
              <Play size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {cell.type === 'code' ? (
            <textarea
              value={cell.content}
              onChange={(e) => setCells(cells.map(c => 
                c.id === cell.id ? { ...c, content: e.target.value } : c
              ))}
              className="w-full h-24 p-3 border rounded font-mono text-sm bg-gray-50"
              placeholder="Enter your analysis code or select from templates..."
            />
          ) : (
            <div className="text-sm text-gray-600">{cell.content}</div>
          )}
          
          {cell.output && (
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold text-lg mb-3">{cell.output.title}</h4>
              
              {cell.output.stats && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  {Object.entries(cell.output.stats).map(([key, value]) => (
                    <div key={key} className="bg-blue-50 p-3 rounded">
                      <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="font-semibold text-blue-800">{value}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {cell.output.chart && (
                <div className="bg-gray-50 p-4 rounded">
                  {renderChart(cell.output.chart)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-900">Social Science Data Analyzer</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-500" />
                <input
                  type="password"
                  placeholder="OpenAI API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="px-3 py-1 border rounded text-sm w-40"
                />
              </div>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Upload size={16} />
                Upload CSV
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-semibold mb-3">Dataset Info</h3>
              {dataset ? (
                <div className="text-sm space-y-2">
                  <div>Rows: <span className="font-medium">{dataset.length}</span></div>
                  <div>Columns: <span className="font-medium">{columns.length}</span></div>
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-1">Columns:</div>
                    <div className="max-h-32 overflow-y-auto">
                      {columns.map((col, i) => (
                        <div key={i} className="text-xs bg-gray-50 px-2 py-1 rounded mb-1">{col}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No dataset loaded</div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Analysis Templates</h3>
              <div className="space-y-2">
                {analysisTemplates.map((template, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const newCell = {
                        id: Date.now(),
                        type: 'analysis',
                        content: template.description,
                        output: null
                      };
                      setCells([...cells, newCell]);
                      setTimeout(() => runAnalysis(newCell.id, template.type), 100);
                    }}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50 transition-colors"
                    disabled={!dataset || !apiKey}
                  >
                    <div className="font-medium text-sm">{template.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Analysis Notebook</h2>
                  <button
                    onClick={() => addCell('code')}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <Plus size={16} />
                    Add Cell
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {cells.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Brain size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Upload a CSV file and start analyzing!</p>
                    <p className="text-sm mt-2">Use the templates on the left or add your own code cells.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cells.map(renderCell)}
                  </div>
                )}
                
                {isLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-600">Running analysis...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDataAnalyzer;
