import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Filter,
  Search,
  Eye,
  MessageSquare,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Clock,
  Building2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const mockCustomers = [
    {
      id: 1,
      name: 'Li Wei',
      email: 'li.wei@email.com',
      phone: '+852 9123 4567',
      totalAssets: 2500000,
      riskLevel: 'Balanced',
      status: 'Active',
      joinDate: '2023-01-15',
      lastContact: '2024-12-20'
    },
    {
      id: 2,
      name: 'Chen Ming',
      email: 'chen.ming@email.com',
      phone: '+852 9876 5432',
      totalAssets: 1800000,
      riskLevel: 'Conservative',
      status: 'Active',
      joinDate: '2023-03-22',
      lastContact: '2024-12-18'
    },
    {
      id: 3,
      name: 'Wang Lei',
      email: 'wang.lei@email.com',
      phone: '+852 8765 4321',
      totalAssets: 3200000,
      riskLevel: 'Growth',
      status: 'Active',
      joinDate: '2022-11-08',
      lastContact: '2024-12-22'
    },
    {
      id: 4,
      name: 'Zhang Mei',
      email: 'zhang.mei@email.com',
      phone: '+852 7654 3210',
      totalAssets: 950000,
      riskLevel: 'Moderate',
      status: 'Pending',
      joinDate: '2024-11-15',
      lastContact: '2024-12-15'
    },
    {
      id: 5,
      name: 'Liu Hao',
      email: 'liu.hao@email.com',
      phone: '+852 6543 2109',
      totalAssets: 4200000,
      riskLevel: 'Aggressive',
      status: 'Active',
      joinDate: '2022-08-30',
      lastContact: '2024-12-21'
    }
  ];

  const mockInvestments = [
    { id: 1, customerId: 1, symbol: '0700.HK', type: 'HK Stock', amount: 500000, return: 12.5 },
    { id: 2, customerId: 1, symbol: 'AAPL', type: 'US Stock', amount: 300000, return: 18.2 },
    { id: 3, customerId: 2, symbol: '2800.HK', type: 'ETF', amount: 800000, return: 8.7 },
    { id: 4, customerId: 3, symbol: 'BTC', type: 'Crypto', amount: 200000, return: 45.3 },
    { id: 5, customerId: 3, symbol: 'SPY', type: 'ETF', amount: 600000, return: 15.8 },
    { id: 6, customerId: 4, symbol: 'QQQ', type: 'ETF', amount: 400000, return: 22.1 },
    { id: 7, customerId: 5, symbol: 'NVDA', type: 'US Stock', amount: 800000, return: 35.7 },
  ];

  // ETF data with real-time pricing
  const etfData = [
    { symbol: 'VTI', name: 'Total Stock Market', price: 255.32, change: 2.14, changePercent: 0.84 },
    { symbol: 'QQQ', name: 'Nasdaq-100', price: 421.85, change: -1.25, changePercent: -0.30 },
    { symbol: 'SPY', name: 'S&P 500', price: 478.92, change: 1.87, changePercent: 0.39 },
    { symbol: '2800.HK', name: 'FTSE China A50', price: 28.45, change: 0.32, changePercent: 1.14 },
    { symbol: '2828.HK', name: 'Hang Seng China Enterprises', price: 6234, change: 89, changePercent: 1.45 }
  ];

  // Calculate statistics
  const totalCustomers = mockCustomers.length;
  const totalAssets = mockCustomers.reduce((sum, customer) => sum + customer.totalAssets, 0);
  const activeCustomers = mockCustomers.filter(customer => customer.status === 'Active').length;
  const pendingCustomers = mockCustomers.filter(customer => customer.status === 'Pending').length;
  const averageAssets = totalAssets / totalCustomers;

  // Customer distribution by risk level
  const riskDistribution = [
    { name: 'Conservative', value: mockCustomers.filter(c => c.riskLevel === 'Conservative').length, color: '#10B981' },
    { name: 'Moderate', value: mockCustomers.filter(c => c.riskLevel === 'Moderate').length, color: '#3B82F6' },
    { name: 'Balanced', value: mockCustomers.filter(c => c.riskLevel === 'Balanced').length, color: '#F59E0B' },
    { name: 'Growth', value: mockCustomers.filter(c => c.riskLevel === 'Growth').length, color: '#F97316' },
    { name: 'Aggressive', value: mockCustomers.filter(c => c.riskLevel === 'Aggressive').length, color: '#EF4444' },
  ];

  // Monthly performance data
  const monthlyPerformance = [
    { month: 'Jan', totalAssets: 8500000, newCustomers: 2 },
    { month: 'Feb', totalAssets: 9200000, newCustomers: 1 },
    { month: 'Mar', totalAssets: 10100000, newCustomers: 3 },
    { month: 'Apr', totalAssets: 10800000, newCustomers: 2 },
    { month: 'May', totalAssets: 11500000, newCustomers: 1 },
    { month: 'Jun', totalAssets: 12200000, newCustomers: 4 },
    { month: 'Jul', totalAssets: 12800000, newCustomers: 2 },
    { month: 'Aug', totalAssets: 13400000, newCustomers: 3 },
    { month: 'Sep', totalAssets: 13900000, newCustomers: 1 },
    { month: 'Oct', totalAssets: 14500000, newCustomers: 2 },
    { month: 'Nov', totalAssets: 15100000, newCustomers: 3 },
    { month: 'Dec', totalAssets: 15700000, newCustomers: 2 }
  ];

  // ETF overview data
  const etfOverview = etfData.map(etf => ({
    name: etf.symbol,
    fullName: etf.name,
    price: etf.price,
    change: etf.change,
    changePercent: etf.changePercent,
    category: etf.symbol.includes('.HK') ? 'HK Market' : 'US Market'
  }));

  // Customer asset distribution
  const assetDistribution = mockCustomers.map(customer => ({
    name: customer.name,
    totalAssets: customer.totalAssets / 10000, // Convert to ten thousand HKD
    returnRate: Math.random() * 20 - 5,
  }));

  // Investment type distribution
  const investmentTypes = [
    { name: 'HK Stocks', value: mockInvestments.filter(i => i.type === 'HK Stock').length, color: '#EF4444' },
    { name: 'US Stocks', value: mockInvestments.filter(i => i.type === 'US Stock').length, color: '#3B82F6' },
    { name: 'Crypto', value: mockInvestments.filter(i => i.type === 'Crypto').length, color: '#10B981' },
    { name: 'ETFs', value: mockInvestments.filter(i => i.type === 'ETF').length, color: '#F59E0B' },
  ];

  // Filter customer data
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Prospect': return 'bg-blue-100 text-blue-800';
      case 'Churned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Conservative': return 'text-green-600';
      case 'Moderate': return 'text-blue-600';
      case 'Balanced': return 'text-yellow-600';
      case 'Growth': return 'text-orange-600';
      case 'Aggressive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of client portfolio and investment performance</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Users className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-semibold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets (HKD)</p>
              <p className="text-2xl font-semibold text-gray-900">{(totalAssets / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Assets</p>
              <p className="text-2xl font-semibold text-gray-900">{(averageAssets / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{((activeCustomers / totalCustomers) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'totalAssets' ? `${(value as number / 1000000).toFixed(1)}M` : value,
                name === 'totalAssets' ? 'Total Assets' : 'New Customers'
              ]} />
              <Legend />
              <Line type="monotone" dataKey="totalAssets" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="newCustomers" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ETF Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">ETF Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {etfOverview.map((etf, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{etf.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{etf.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{etf.price}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${etf.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {etf.change >= 0 ? '+' : ''}{etf.change}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${etf.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{etf.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Customer List</h3>
            <div className="flex space-x-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Prospect">Prospect</option>
                <option value="Churned">Churned</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Assets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    HKD {(customer.totalAssets / 1000000).toFixed(1)}M
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getRiskLevelColor(customer.riskLevel)}`}>
                      {customer.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastContact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/customer/${customer.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/communications`}
                      className="text-green-600 hover:text-green-900"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;