import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Search,
  Eye,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Target,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { mockCustomers, mockAdvices, adviceHistory } from '../data/mockData';

const AdviceHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [performanceFilter, setPerformanceFilter] = useState<string>('all');

  // Filter history data
  const filteredHistory = adviceHistory.filter(history => {
    const customer = mockCustomers.find(c => c.id === history.customerId);
    const customerName = customer?.name || '';
    
    const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || history.status === statusFilter;
    const matchesPerformance = performanceFilter === 'all' || history.performance === performanceFilter;
    
    return matchesSearch && matchesStatus && matchesPerformance;
  });

  // Statistics
  const stats = {
    total: adviceHistory.length,
    executed: adviceHistory.filter(h => h.status === 'Executed').length,
    pending: adviceHistory.filter(h => h.status === 'Pending').length,
    rejected: adviceHistory.filter(h => h.status === 'Rejected').length,
    avgActualReturn: adviceHistory
      .filter(h => h.status === 'Executed' && h.actualReturn)
      .reduce((sum, h) => sum + (h.actualReturn || 0), 0) / 
      adviceHistory.filter(h => h.status === 'Executed' && h.actualReturn).length || 0,
    avgExpectedReturn: adviceHistory
      .reduce((sum, h) => sum + h.expectedReturn, 0) / adviceHistory.length,
    successRate: (adviceHistory.filter(h => h.performance === 'Exceed' || h.performance === 'Meet').length / 
                  adviceHistory.filter(h => h.status === 'Executed').length * 100) || 0
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

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'Exceed':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'Meet':
        return <Minus className="h-4 w-4 text-blue-500" />;
      case 'Underperform':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Exceed':
        return 'bg-green-100 text-green-800';
      case 'Meet':
        return 'bg-blue-100 text-blue-800';
      case 'Underperform':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Investment Advice History</h1>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Report
          </button>
          <Link 
            to="/advice"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Target className="mr-2 h-4 w-4" />
            Current Advice
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Advices</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.total}</dd>
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
                <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Actual Return</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.avgActualReturn.toFixed(1)}%</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Expected Return</dt>
                <dd className="text-2xl font-bold text-gray-900">{stats.avgExpectedReturn.toFixed(1)}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Advice Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{stats.executed}</div>
            <div className="text-sm text-gray-600">Executed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
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
                placeholder="Search customer name..."
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
              <option value="Executed">Executed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
            >
              <option value="all">All Performance</option>
              <option value="Exceed">Exceeded</option>
              <option value="Meet">Met Expectations</option>
              <option value="Underperform">Underperformed</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Advice History Records</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredHistory.map((history) => {
            const customer = mockCustomers.find(c => c.id === history.customerId);
            const advice = mockAdvices.find(a => a.id === history.adviceId);
            const actualReturn = history.actualReturn || 0;
            const expectedReturn = history.expectedReturn;
            const performance = actualReturn - expectedReturn;
            
            return (
              <div key={history.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(history.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.status)}`}>
                          {history.status}
                        </span>
                      </div>
                      {history.performance && (
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(history.performance)}`}>
                          {getPerformanceIcon(history.performance)}
                          <span className="ml-1">{history.performance}</span>
                        </span>
                      )}
                      {history.executedAt && (
                        <span className="text-sm text-gray-500">{history.executedAt}</span>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{advice?.title}</h4>
                    
                    <div className="flex items-center space-x-6 mb-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium">Customer:</span>
                        <span className="ml-1">{customer?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Expected Return:</span>
                        <span className="ml-1 text-blue-600 font-medium">{expectedReturn}%</span>
                      </div>
                      {history.actualReturn && (
                        <div className="flex items-center">
                          <span className="font-medium">Actual Return:</span>
                          <span className={`ml-1 font-medium ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {actualReturn}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Notes:</span>
                        <p className="mt-1 text-gray-600">{history.notes}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Feedback:</span>
                        <p className="mt-1 text-gray-600">{history.feedback}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center space-x-3">
                      <Link
                        to={`/advice-detail/${history.adviceId}`}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Link>
                      
                      {history.status === 'Pending' && (
                        <>
                          <button className="inline-flex items-center px-3 py-1 border border-transparent rounded text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Confirm
                          </button>
                          <button className="inline-flex items-center px-3 py-1 border border-transparent rounded text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {adviceHistory.filter(h => h.performance === 'Exceed').length}
            </div>
            <div className="text-sm text-gray-600">Exceeded Expectations</div>
            <div className="text-xs text-green-600 mt-1">
              {((adviceHistory.filter(h => h.performance === 'Exceed').length / adviceHistory.filter(h => h.status === 'Executed').length) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-4 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {adviceHistory.filter(h => h.performance === 'Meet').length}
            </div>
            <div className="text-sm text-gray-600">Met Expectations</div>
            <div className="text-xs text-blue-600 mt-1">
              {((adviceHistory.filter(h => h.performance === 'Meet').length / adviceHistory.filter(h => h.status === 'Executed').length) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-4 border border-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {adviceHistory.filter(h => h.performance === 'Underperform').length}
            </div>
            <div className="text-sm text-gray-600">Underperformed</div>
            <div className="text-xs text-red-600 mt-1">
              {((adviceHistory.filter(h => h.performance === 'Underperform').length / adviceHistory.filter(h => h.status === 'Executed').length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdviceHistory;