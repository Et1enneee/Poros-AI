import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Share2,
  Brain,
  Lightbulb,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Area,
  AreaChart
} from 'recharts';
import { mockCustomers, mockAdvices, aiAdviceDetails } from '../data/mockData';

const AIAdviceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const advice = mockAdvices.find(a => a.id === id);
  const adviceDetail = aiAdviceDetails.find(d => d.adviceId === id);
  const customer = advice ? mockCustomers.find(c => c.id === advice.customerId) : null;

  if (!advice || !customer || !adviceDetail) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Advice Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">The requested investment advice could not be found.</p>
        <div className="mt-6">
          <Link
            to="/advice"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Advice
          </Link>
        </div>
      </div>
    );
  }

  // Expected return scenarios data
  const returnScenarios = [
    {
      scenario: 'Conservative',
      value: adviceDetail.expectedReturn.conservative,
      color: '#10B981',
      description: 'Market downturn scenario'
    },
    {
      scenario: 'Moderate',
      value: adviceDetail.expectedReturn.moderate,
      color: '#3B82F6',
      description: 'Most likely scenario'
    },
    {
      scenario: 'Optimistic',
      value: adviceDetail.expectedReturn.optimistic,
      color: '#F59E0B',
      description: 'Favorable market conditions'
    }
  ];

  // Portfolio allocation data
  const allocationData = adviceDetail.assetAllocation.map(item => ({
    name: item.category,
    value: item.percentage,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
  }));

  // Timeline data for visualization
  const timelineData = adviceDetail.timeline.map(phase => ({
    phase: phase.phase.split(' ')[0],
    duration: parseInt(phase.duration),
    progress: Math.random() * 100 // Simulated progress
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'Executed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Executed':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/advice"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-blue-600" />
            AI Investment Advice Detail
          </h1>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <FileText className="mr-2 h-4 w-4" />
            Execute
          </button>
        </div>
      </div>

      {/* Advice Overview Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon(advice.status)}
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(advice.status)}`}>
                {advice.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(advice.riskLevel)}`}>
                {advice.riskLevel} Risk
              </span>
              <span className="text-sm text-gray-500">{advice.createdAt}</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{advice.title}</h2>
            <p className="text-gray-700 mb-4">{advice.content}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <DollarSign className="mr-1 h-4 w-4" />
                <span className="font-medium">Expected Return:</span>
                <span className="ml-1 text-green-600 font-medium">{advice.expectedReturn}%</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span className="font-medium">Time Frame:</span>
                <span className="ml-1">{advice.timeFrame}</span>
              </div>
              <div className="flex items-center">
                <Target className="mr-1 h-4 w-4" />
                <span className="font-medium">Client:</span>
                <span className="ml-1">{customer.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'overview', name: 'Strategy Overview', icon: Lightbulb },
              { key: 'analysis', name: 'Market Analysis', icon: BarChart3 },
              { key: 'allocation', name: 'Asset Allocation', icon: PieChart },
              { key: 'timeline', name: 'Implementation Timeline', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Strategy Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Strategy Reasoning */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                    Strategy Reasoning
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{adviceDetail.reasoning}</p>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">AI Analysis Confidence</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-700">Overall Confidence</span>
                        <span className="text-lg font-bold text-yellow-900">87.5%</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">85%</div>
                        <div className="text-xs text-green-700">Market Fit</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">90%</div>
                        <div className="text-xs text-blue-700">Goal Alignment</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Risk Assessment */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                    Enhanced Risk Assessment
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{adviceDetail.riskAssessment}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium text-orange-900">Risk Level</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          advice.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                          advice.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {advice.riskLevel}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium text-blue-900">Portfolio Beta</span>
                        <span className="text-sm font-bold text-blue-600">{adviceDetail.keyMetrics.beta}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium text-purple-900">Diversification Score</span>
                        <span className="text-sm font-bold text-purple-600">8.5/10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Key Metrics Dashboard */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Activity className="mr-2 h-5 w-5 text-blue-500" />
                  Comprehensive Performance Metrics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{adviceDetail.keyMetrics.sharpeRatio}</div>
                    <div className="text-sm text-gray-600">Sharpe Ratio</div>
                    <div className="text-xs text-green-600 mt-1">Excellent</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{adviceDetail.keyMetrics.maxDrawdown}%</div>
                    <div className="text-sm text-gray-600">Max Drawdown</div>
                    <div className="text-xs text-yellow-600 mt-1">Moderate</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{adviceDetail.keyMetrics.volatility}%</div>
                    <div className="text-sm text-gray-600">Volatility</div>
                    <div className="text-xs text-blue-600 mt-1">Balanced</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{adviceDetail.keyMetrics.beta}</div>
                    <div className="text-sm text-gray-600">Beta</div>
                    <div className="text-xs text-green-600 mt-1">Low Correlation</div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Expected Annual Return</div>
                    <div className="text-xl font-bold text-green-600">{advice.expectedReturn}%</div>
                    <div className="text-xs text-gray-500">Based on moderate scenario</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Information Ratio</div>
                    <div className="text-xl font-bold text-blue-600">1.45</div>
                    <div className="text-xs text-gray-500">Risk-adjusted outperformance</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Sortino Ratio</div>
                    <div className="text-xl font-bold text-purple-600">1.78</div>
                    <div className="text-xs text-gray-500">Downside risk adjusted</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Expected Return Scenarios */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Enhanced Return Scenarios & Probabilities</h3>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={returnScenarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis label={{ value: 'Expected Return (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Expected Return']} />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {returnScenarios.map((scenario, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-900">{scenario.scenario}</span>
                        <span className="text-lg font-bold" style={{ color: scenario.color }}>
                          {scenario.value}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Probability:</span>
                          <span className="font-medium">
                            {scenario.scenario === 'Conservative' ? '25%' :
                             scenario.scenario === 'Moderate' ? '50%' : '25%'}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: scenario.scenario === 'Conservative' ? '25%' :
                                     scenario.scenario === 'Moderate' ? '50%' : '25%',
                              backgroundColor: scenario.color 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        <strong>Risk Factors:</strong> 
                        {scenario.scenario === 'Conservative' ? ' Market downturn, economic recession' :
                         scenario.scenario === 'Moderate' ? ' Normal market conditions, moderate volatility' :
                         ' Favorable market conditions, strong economic growth'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Market Analysis */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Market Analysis</h3>
                <p className="text-gray-700 leading-relaxed">{adviceDetail.marketAnalysis}</p>
              </div>

              {/* Market Trends Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Market Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={[
                    { month: 'Jan', market: 100, advice: 100 },
                    { month: 'Feb', market: 105, advice: 108 },
                    { month: 'Mar', market: 103, advice: 110 },
                    { month: 'Apr', market: 110, advice: 115 },
                    { month: 'May', market: 108, advice: 118 },
                    { month: 'Jun', market: 115, advice: 125 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="market" stroke="#8884d8" fill="#8884d8" name="Market Performance" />
                    <Area type="monotone" dataKey="advice" stroke="#82ca9d" fill="#82ca9d" name="Advice Projection" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Asset Allocation */}
          {activeTab === 'allocation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Allocation Pie Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recommended Allocation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                {/* Allocation Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Allocation Details</h3>
                  <div className="space-y-4">
                    {adviceDetail.assetAllocation.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">{item.category}</h4>
                          <span className="text-lg font-bold text-blue-600">{item.percentage}%</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.reasoning}</p>
                        <div className="text-xs text-gray-500">
                          <strong>Recommended Products:</strong> {item.specificProducts.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Implementation Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Implementation Timeline</h3>
                <div className="space-y-6">
                  {adviceDetail.timeline.map((phase, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{phase.phase}</h4>
                          <span className="text-sm text-gray-500">{phase.duration}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{phase.action}</p>
                        <div className="text-sm text-gray-600">
                          <strong>Target:</strong> {phase.target}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Progress Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline Progress</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="phase" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, 'Progress']} />
                    <Bar dataKey="progress" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAdviceDetail;