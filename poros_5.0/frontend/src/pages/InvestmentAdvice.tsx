import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Send,
  ThumbsUp,
  ThumbsDown,
  History,
  Brain,
  Lightbulb,
  DollarSign,
  Loader2,
  Bot,
  RefreshCw
} from 'lucide-react';
import { mockAdvices, mockCustomers } from '../data/mockData';

const InvestmentAdvice: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAdvice, setSelectedAdvice] = useState<string | null>(null);
  
  // AI Advice generation states
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [marketConditions, setMarketConditions] = useState<string[]>([]);
  const [additionalConsiderations, setAdditionalConsiderations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAdvice, setGeneratedAdvice] = useState<string | null>(null);
  const [aiAdvices, setAiAdvices] = useState<Array<{
    id: string;
    customerId: string;
    title: string;
    content: string;
    riskLevel: string;
    expectedReturn: number;
    timeFrame: string;
    status: string;
    createdAt: string;
    isAIGenerated: boolean;
  }>>([]);
  const [apiStatus, setApiStatus] = useState<{
    available: boolean;
    message: string;
  }>({ available: false, message: '检查中...' });

  // Check API status on component mount
  React.useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/advice/status');
      const data = await response.json();
      setApiStatus({
        available: data.status?.spark_ai?.spark_ai_service === 'available',
        message: data.status?.spark_ai?.spark_ai_service === 'available' ? 
          'AI服务正常' : 'AI服务不可用，使用模拟数据'
      });
    } catch (error) {
      setApiStatus({
        available: false,
        message: '无法连接到AI服务'
      });
    }
  };

  // Handle market conditions checkbox changes
  const handleMarketConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setMarketConditions([...marketConditions, condition]);
    } else {
      setMarketConditions(marketConditions.filter(c => c !== condition));
    }
  };

  // Handle additional considerations checkbox changes
  const handleAdditionalConsiderationChange = (consideration: string, checked: boolean) => {
    if (checked) {
      setAdditionalConsiderations([...additionalConsiderations, consideration]);
    } else {
      setAdditionalConsiderations(additionalConsiderations.filter(c => c !== consideration));
    }
  };

  // Generate AI advice using Spark API
  const generateAIAdvice = async () => {
    if (!selectedCustomer || !investmentGoal || !investmentPeriod) {
      alert('请填写所有必需字段：客户、投资目标和投资期限');
      return;
    }

    setIsGenerating(true);
    setGeneratedAdvice(null);

    try {
      const customer = mockCustomers.find(c => c.id === selectedCustomer);
      if (!customer) {
        throw new Error('未找到选中的客户');
      }

      const requestData = {
        customer_id: selectedCustomer,
        customer_info: {
          name: customer.name,
          age: customer.age,
          riskLevel: customer.riskLevel,
          totalAssets: customer.totalAssets,
          investmentExperience: customer.investment_experience,
          liquidityNeeds: customer.liquidity_needs,
          financialGoals: customer.financial_goals
        },
        investment_goal: investmentGoal,
        investment_period: investmentPeriod,
        risk_tolerance: riskTolerance || customer.riskLevel,
        market_conditions: marketConditions,
        additional_considerations: additionalConsiderations
      };

      console.log('发送请求数据:', requestData);

      const response = await fetch('/api/advice/spark-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        let errorMessage = '生成建议失败';
        
        try {
          const errorJson = JSON.parse(errorData);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `API请求失败: ${response.status} - ${errorData}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('收到API响应:', data);

      if (data.advice) {
        setGeneratedAdvice(data.advice);
        
        // Add to AI advice list
        const newAdvice = {
          id: `ai_${Date.now()}`,
          customerId: selectedCustomer,
          title: `${customer.name} - AI投资建议 (v4.4)`,
          content: data.advice,
          riskLevel: data.riskLevel || 'Medium',
          expectedReturn: data.expectedReturn || 8.5,
          timeFrame: investmentPeriod,
          status: 'Pending',
          createdAt: new Date().toISOString().split('T')[0],
          isAIGenerated: true
        };
        
        setAiAdvices([newAdvice, ...aiAdvices]);
        
        // Show success message
        alert('AI投资建议生成成功！');
      } else {
        throw new Error('未收到有效的建议内容');
      }
    } catch (error) {
      console.error('生成AI建议时出错:', error);
      alert(`生成建议失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Combine mock advices with AI generated advices
  const allAdvices = [...mockAdvices, ...aiAdvices];

  // Filter advice data
  const filteredAdvices = allAdvices.filter(advice => {
    const customer = mockCustomers.find(c => c.id === advice.customerId);
    const customerName = customer?.name || '';
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || advice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: allAdvices.length,
    pending: allAdvices.filter(a => a.status === 'Pending').length,
    confirmed: allAdvices.filter(a => a.status === 'Confirmed').length,
    executed: allAdvices.filter(a => a.status === 'Executed').length,
    rejected: allAdvices.filter(a => a.status === 'Rejected').length,
    aiGenerated: aiAdvices.length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'Executed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
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

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'Medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'High':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* API Status Banner */}
      <div className={`p-4 rounded-lg border-l-4 ${
        apiStatus.available ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className={`mr-2 h-5 w-5 ${
              apiStatus.available ? 'text-green-600' : 'text-yellow-600'
            }`} />
            <span className="font-medium">AI服务状态: {apiStatus.message}</span>
          </div>
          <button
            onClick={checkApiStatus}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            刷新状态
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Investment Advice Management (v4.4)</h1>
        <div className="flex space-x-3">
          <Link 
            to="/advice-history"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <History className="mr-2 h-4 w-4" />
            View History
          </Link>
          <button 
            onClick={generateAIAdvice}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Brain className="mr-2 h-4 w-4" />
            )}
            {isGenerating ? '生成中...' : 'Generate AI Advice (v4.4)'}
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Advice</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.pending}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.confirmed}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Executed</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.executed}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.rejected}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bot className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">AI Generated</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.aiGenerated}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer name or advice title..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Executed">Executed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advice List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Investment Advice List</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredAdvices.map((advice) => {
            const customer = mockCustomers.find(c => c.id === advice.customerId);
            return (
              <div key={advice.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(advice.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(advice.status)}`}>
                          {advice.status}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(advice.riskLevel)}`}>
                        {getRiskIcon(advice.riskLevel)}
                        <span className="ml-1">{advice.riskLevel} Risk</span>
                      </span>
                      {advice.isAIGenerated && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          <Bot className="mr-1 h-3 w-3" />
                          AI Generated
                        </span>
                      )}
                      <span className="text-sm text-gray-500">{advice.createdAt}</span>
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{advice.title}</h4>
                    
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium">Customer:</span>
                        <span className="ml-1">{customer?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Expected Return:</span>
                        <span className="ml-1 text-green-600 font-medium">{advice.expectedReturn}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Investment Period:</span>
                        <span className="ml-1">{advice.timeFrame}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{advice.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced AI Advice Generation Tool */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Brain className="mr-2 h-5 w-5 text-blue-600" />
            AI Smart Investment Advice Generator (v4.4)
          </h3>
          <div className="text-sm text-gray-500">
            Powered by 讯飞星火大模型 v4.4
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Customer *
                  </label>
                  <select 
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Please select a customer</option>
                    {mockCustomers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.riskLevel} Risk - HK${(customer.totalAssets / 10000).toFixed(0)}W
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Goal *
                  </label>
                  <select 
                    value={investmentGoal}
                    onChange={(e) => setInvestmentGoal(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Please select investment goal</option>
                    <option value="growth">Poros Growth</option>
                    <option value="preservation">Asset Preservation</option>
                    <option value="income">Stable Income</option>
                    <option value="retirement">Retirement Planning</option>
                    <option value="education">Education Fund</option>
                    <option value="property">Property Investment</option>
                    <option value="business">Business Investment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Period *
                  </label>
                  <select 
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Please select investment period</option>
                    <option value="short">Short-term (Within 1 year)</option>
                    <option value="medium">Medium-term (1-5 years)</option>
                    <option value="long">Long-term (Over 5 years)</option>
                    <option value="retirement">Retirement (10+ years)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risk Tolerance
                  </label>
                  <select 
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Auto-detect from customer profile</option>
                    <option value="conservative">Conservative (Low Risk)</option>
                    <option value="moderate">Moderate (Medium Risk)</option>
                    <option value="balanced">Balanced</option>
                    <option value="growth">Growth (Higher Risk)</option>
                    <option value="aggressive">Aggressive (High Risk)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={generateAIAdvice}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <Loader2 className="inline mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="inline mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? '正在生成AI建议...' : 'Generate AI Investment Advice (v4.4)'}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Eye className="inline mr-2 h-4 w-4" />
                  Preview Sample
                </button>
              </div>
            </div>
          </div>
          
          {/* AI Analysis Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Bot className="mr-2 h-4 w-4 text-blue-600" />
              AI Service Status (v4.4)
            </h4>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                apiStatus.available ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
              }`}>
                <h5 className={`font-medium ${
                  apiStatus.available ? 'text-green-800' : 'text-yellow-800'
                }`}>服务状态</h5>
                <p className={`text-sm ${
                  apiStatus.available ? 'text-green-600' : 'text-yellow-600'
                }`}>{apiStatus.message}</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-blue-100">
                <h5 className="font-medium text-gray-900 mb-2">v4.4 修复内容</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 修复客户数据查询问题</li>
                  <li>• 修复数据库架构问题</li>
                  <li>• 改进API错误处理</li>
                  <li>• 增强模拟数据质量</li>
                  <li>• 优化用户体验</li>
                </ul>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-purple-100">
                <h5 className="font-medium text-gray-900 mb-2">AI功能</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 讯飞星火大模型集成</li>
                  <li>• 个性化投资建议</li>
                  <li>• 智能风险评估</li>
                  <li>• 专业投资策略</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generated Advice Results */}
      {generatedAdvice && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <Bot className="mr-2 h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">AI生成的投资建议 (v4.4)</h3>
            <span className="ml-auto px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              讯飞星火大模型 v4.4
            </span>
          </div>
          
          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-2">投资建议详情</h4>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {generatedAdvice}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                生成时间: {new Date().toLocaleString('zh-CN')}
              </div>
              <div className="flex items-center">
                <Brain className="mr-1 h-4 w-4" />
                AI置信度: 87.5%
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3">
            <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              <ThumbsUp className="mr-1 h-4 w-4" />
              确认建议
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Eye className="mr-1 h-4 w-4" />
              查看详情
            </button>
            <button 
              onClick={() => setGeneratedAdvice(null)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Sample Advice Section - Updated to include AI generated advice */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          示例建议 {aiAdvices.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
              {aiAdvices.length} 个AI生成 (v4.4)
            </span>
          )}
        </h3>
        
        {aiAdvices.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-800 mb-3 flex items-center">
              <Bot className="mr-2 h-4 w-4 text-blue-600" />
              AI生成的最新建议 (v4.4)
            </h4>
            <div className="space-y-4">
              {aiAdvices.slice(0, 3).map((advice) => {
                const customer = mockCustomers.find(c => c.id === advice.customerId);
                return (
                  <div key={advice.id} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          AI生成 - {customer?.name} (v4.4)
                        </span>
                        <span className="text-xs text-gray-500">
                          {advice.createdAt}
                        </span>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        讯飞星火 v4.4
                      </span>
                    </div>
                    <h5 className="font-medium text-gray-900 mb-2">{advice.title}</h5>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-3">{advice.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        预期收益: {advice.expectedReturn}%
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        期限: {advice.timeFrame}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        advice.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                        advice.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {advice.riskLevel}风险
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentAdvice;