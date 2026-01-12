import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  AlertCircle,
  Plus,
  Edit,
  Download,
  MessageSquare,
  Building2,
  Briefcase,
  TrendingDown,
  User,
  CreditCard,
  FileText
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  mockCustomers, 
  mockInvestments, 
  mockCommunications, 
  aiAdviceDetails,
  adviceHistory 
} from '../data/mockData';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const customer = mockCustomers.find(c => c.id === id);
  const customerInvestments = mockInvestments.filter(i => i.customerId === id);
  const customerCommunications = mockCommunications.filter(c => c.customerId === id);

  if (!customer) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Customer Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">Please check if the customer ID is correct.</p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Investment portfolio distribution data
  const investmentData = customerInvestments.map(inv => ({
    name: inv.type,
    value: inv.amount,
    percentage: (inv.amount / customer.totalAssets * 100).toFixed(1)
  }));

  // Return rate data
  const returnData = customerInvestments.map(inv => ({
    name: inv.name.substring(0, 8) + '...',
    amount: inv.amount / 10000,
    returnRate: inv.returnRate,
    return: inv.return
  }));

  // Time series data (simulated historical returns)
  const historicalData = [
    { month: 'Jan', return: 2.5 },
    { month: 'Feb', return: 4.2 },
    { month: 'Mar', return: 1.8 },
    { month: 'Apr', return: 6.5 },
    { month: 'May', return: 3.2 },
    { month: 'Jun', return: 5.8 },
    { month: 'Jul', return: 7.2 },
    { month: 'Aug', return: 4.5 },
    { month: 'Sep', return: 8.1 },
    { month: 'Oct', return: 6.8 },
    { month: 'Nov', return: 9.2 },
    { month: 'Dec', return: 10.5 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Conservative': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-blue-600 bg-blue-50';
      case 'Balanced': return 'text-yellow-600 bg-yellow-50';
      case 'Growth': return 'text-orange-600 bg-orange-50';
      case 'Aggressive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-700 bg-green-100';
      case 'Pending': return 'text-yellow-700 bg-yellow-100';
      case 'Prospect': return 'text-blue-700 bg-blue-100';
      case 'Churned': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </button>
        </div>
      </div>

      {/* Customer Basic Information Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-6">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                {customer.avatar}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="mr-2 h-4 w-4" />
                  {customer.phone}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2 h-4 w-4" />
                  {customer.address}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4" />
                  {customer.age} years
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="mr-2 h-4 w-4" />
                  {customer.investmentGoal}
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="mr-2 h-4 w-4" />
                  {customer.industry.category} - {customer.industry.role}
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(customer.riskLevel)}`}>
                    {customer.riskLevel}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Assets</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {(customer.totalAssets / 10000).toFixed(1)}W
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Returns</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {(customerInvestments.reduce((sum, inv) => sum + inv.return, 0) / 10000).toFixed(1)}W
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Return Rate</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {(customerInvestments.reduce((sum, inv) => sum + inv.returnRate, 0) / customerInvestments.length).toFixed(1)}%
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'overview', name: 'Investment Overview', icon: TrendingUp },
              { key: 'portfolio', name: 'Portfolio', icon: DollarSign },
              { key: 'profile', name: 'Customer Profile', icon: User },
              { key: 'communications', name: 'Communications', icon: MessageSquare }
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
          {/* Investment Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Portfolio Distribution */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Portfolio Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {/* @ts-ignore */}
                    <RechartsPieChart>
                      {/* @ts-ignore */}
                      <Pie
                        data={investmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {investmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      {/* @ts-ignore */}
                      <Tooltip formatter={(value) => [`${(value / 10000).toFixed(1)}W`, 'Amount']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                {/* Return Trend */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Annual Return Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {/* @ts-ignore */}
                    <LineChart data={historicalData}>
                      {/* @ts-ignore */}
                      <CartesianGrid strokeDasharray="3 3" />
                      {/* @ts-ignore */}
                      <XAxis dataKey="month" />
                      {/* @ts-ignore */}
                      <YAxis label={{ value: 'Return Rate (%)', angle: -90, position: 'insideLeft' }} />
                      {/* @ts-ignore */}
                      <Tooltip formatter={(value) => [`${value}%`, 'Return Rate']} />
                      {/* @ts-ignore */}
                      <Line type="monotone" dataKey="return" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Investment Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Details</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Return Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Return Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customerInvestments.map((investment) => (
                        <tr key={investment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {investment.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {investment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {(investment.amount / 10000).toFixed(1)}W
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`font-medium ${investment.returnRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.returnRate > 0 ? '+' : ''}{investment.returnRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`font-medium ${investment.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {(investment.return / 10000).toFixed(1)}W
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Asset Distribution Bar Chart */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Product Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {/* @ts-ignore */}
                    <BarChart data={returnData}>
                      {/* @ts-ignore */}
                      <CartesianGrid strokeDasharray="3 3" />
                      {/* @ts-ignore */}
                      <XAxis dataKey="name" />
                      {/* @ts-ignore */}
                      <YAxis label={{ value: 'Amount (10K HKD)', angle: -90, position: 'insideLeft' }} />
                      {/* @ts-ignore */}
                      <Tooltip formatter={(value) => [`${value}W`, 'Investment Amount']} />
                      {/* @ts-ignore */}
                      <Bar dataKey="amount" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Return Rate Comparison */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Return Rate Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    {/* @ts-ignore */}
                    <BarChart data={returnData}>
                      {/* @ts-ignore */}
                      <CartesianGrid strokeDasharray="3 3" />
                      {/* @ts-ignore */}
                      <XAxis dataKey="name" />
                      {/* @ts-ignore */}
                      <YAxis label={{ value: 'Return Rate (%)', angle: -90, position: 'insideLeft' }} />
                      {/* @ts-ignore */}
                      <Tooltip formatter={(value) => [`${value}%`, 'Return Rate']} />
                      {/* @ts-ignore */}
                      <Bar dataKey="returnRate" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {customerInvestments.filter(i => i.risk === 'Low').length}
                    </div>
                    <div className="text-sm text-gray-500">Low Risk Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {customerInvestments.filter(i => i.risk === 'Medium').length}
                    </div>
                    <div className="text-sm text-gray-500">Medium Risk Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {customerInvestments.filter(i => i.risk === 'High').length}
                    </div>
                    <div className="text-sm text-gray-500">High Risk Products</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Income Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Income Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      HK${(customer.income.annual_salary / 10000).toFixed(0)}W
                    </div>
                    <div className="text-sm text-gray-500">Annual Salary</div>
                    <div className="text-xs text-green-600">+{customer.income.bonus_percentage}% bonus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      HK${(customer.income.investment_income / 10000).toFixed(0)}W
                    </div>
                    <div className="text-sm text-gray-500">Investment Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      HK${(customer.income.total_annual_income / 10000).toFixed(0)}W
                    </div>
                    <div className="text-sm text-gray-500">Total Annual Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      +{customer.income.income_growth_rate}%
                    </div>
                    <div className="text-sm text-gray-500">Growth Rate</div>
                  </div>
                </div>
              </div>

              {/* Financial Goals */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600" />
                  Financial Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Primary Objectives</h4>
                    <div className="space-y-2">
                      {customer.financial_goals.map((goal, index) => (
                        <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <div className="flex-shrink-0">
                            <Target className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-blue-900">{goal}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Investment Profile</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Experience</span>
                        <span className="text-sm text-gray-900">{customer.investment_experience} years</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Liquidity Needs</span>
                        <span className="text-sm text-gray-900">{customer.liquidity_needs}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Expense Ratio</span>
                        <span className="text-sm text-gray-900">{(customer.income.expense_ratio * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Considerations */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  Tax Considerations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {customer.tax_considerations.map((consideration, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm font-medium text-purple-900">{consideration}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Industry Background */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5 text-indigo-600" />
                  Enhanced Industry Background
                </h3>
                
                {/* Industry Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{customer.industry.category}</div>
                    <div className="text-sm text-indigo-500">Primary Industry</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{customer.industry.subcategory}</div>
                    <div className="text-sm text-purple-500">Specialization</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{customer.industry.years_experience}</div>
                    <div className="text-sm text-green-500">Years Experience</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{customer.industry.company_size}</div>
                    <div className="text-sm text-blue-500">Company Size</div>
                  </div>
                </div>

                {/* Current Position and Career Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Current Position</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Job Title:</span>
                        <span className="text-sm font-medium text-gray-900">{customer.industry.role}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Experience Level:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {customer.industry.years_experience > 20 ? 'Expert' : 
                           customer.industry.years_experience > 10 ? 'Senior' : 
                           customer.industry.years_experience > 5 ? 'Mid-level' : 'Junior'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Career Stability:</span>
                        <span className={`text-sm font-medium ${
                          customer.industry.years_experience > 15 ? 'text-green-600' : 
                          customer.industry.years_experience > 5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {customer.industry.years_experience > 15 ? 'Very Stable' : 
                           customer.industry.years_experience > 5 ? 'Moderate' : 'Developing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Industry Insights</h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Industry Growth:</span> 
                        {customer.industry.category === 'Technology' ? ' High Growth Sector' :
                         customer.industry.category === 'Finance' ? ' Stable Growth' :
                         customer.industry.category === 'Healthcare' ? ' Growing Demand' :
                         customer.industry.category === 'Manufacturing' ? ' Mature Industry' : ' Variable Growth'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Income Potential:</span> 
                        {customer.income.total_annual_income > 1200000 ? ' High' :
                         customer.income.total_annual_income > 800000 ? ' Above Average' : ' Average'}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Investment Affinity:</span> 
                        {customer.riskLevel === 'Aggressive' || customer.riskLevel === 'Growth' ? ' High' :
                         customer.riskLevel === 'Balanced' ? ' Moderate' : ' Conservative'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Income Analysis */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-600" />
                  Enhanced Income Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Income Breakdown */}
                  <div className="lg:col-span-2">
                    <h4 className="text-md font-medium text-gray-700 mb-3">Income Breakdown</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">Base Salary</div>
                          <div className="text-xs text-gray-500">Primary income source</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            HK${(customer.income.annual_salary / 10000).toFixed(0)}W
                          </div>
                          <div className="text-xs text-blue-500">
                            {((customer.income.annual_salary / customer.income.total_annual_income) * 100).toFixed(0)}% of total
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">Bonus Income</div>
                          <div className="text-xs text-gray-500">{customer.income.bonus_percentage}% performance bonus</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            HK${(customer.income.annual_salary * customer.income.bonus_percentage / 100 / 10000).toFixed(0)}W
                          </div>
                          <div className="text-xs text-green-500">
                            {customer.income.bonus_percentage}% of base
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">Investment Income</div>
                          <div className="text-xs text-gray-500">Portfolio returns</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">
                            HK${(customer.income.investment_income / 10000).toFixed(0)}W
                          </div>
                          <div className="text-xs text-purple-500">
                            {((customer.income.investment_income / customer.income.total_annual_income) * 100).toFixed(0)}% of total
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Income Metrics */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Income Metrics</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Annual Growth Rate</div>
                        <div className="text-lg font-bold text-green-600">
                          +{customer.income.income_growth_rate}%
                        </div>
                        <div className="text-xs text-gray-500">Year-over-year</div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Expense Ratio</div>
                        <div className="text-lg font-bold text-blue-600">
                          {(customer.income.expense_ratio * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Living expenses</div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Investment Capacity</div>
                        <div className="text-lg font-bold text-purple-600">
                          {((1 - customer.income.expense_ratio) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Available for investment</div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Monthly Income</div>
                        <div className="text-lg font-bold text-indigo-600">
                          HK${(customer.income.total_annual_income / 12 / 10000).toFixed(0)}W
                        </div>
                        <div className="text-xs text-gray-500">Average monthly</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Financial Goals */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Target className="mr-2 h-5 w-5 text-blue-600" />
                  Enhanced Financial Goals Analysis
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Primary Financial Objectives</h4>
                    <div className="space-y-3">
                      {customer.financial_goals.map((goal, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-blue-900">{goal}</div>
                            <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                              goal.includes('Education') || goal.includes('Retirement') ? 'bg-red-100 text-red-800' :
                              goal.includes('Property') || goal.includes('Business') ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {goal.includes('Education') || goal.includes('Retirement') ? 'High Priority' :
                               goal.includes('Property') || goal.includes('Business') ? 'Medium Priority' : 'Personal Goal'}
                            </div>
                          </div>
                          <div className="text-sm text-blue-700">
                            {goal.includes('Education') ? 'Timeline: 5-15 years | Est. Amount: HK$500K' :
                             goal.includes('Retirement') ? 'Timeline: 10-30 years | Est. Amount: HK$3M+' :
                             goal.includes('Property') ? 'Timeline: 3-10 years | Est. Amount: HK$2M' :
                             goal.includes('Business') ? 'Timeline: 1-5 years | Est. Amount: HK$1M' :
                             goal.includes('Wealth') ? 'Timeline: Long-term | Est. Amount: Variable' : 'Custom timeline'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-3">Goal Alignment Analysis</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Goal-Asset Alignment</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex justify-between">
                            <span>Current Assets:</span>
                            <span className="font-medium">HK${(customer.totalAssets / 10000).toFixed(0)}W</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Investment Experience:</span>
                            <span className="font-medium">{customer.investment_experience} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Tolerance:</span>
                            <span className={`font-medium ${
                              customer.riskLevel === 'Aggressive' ? 'text-red-600' :
                              customer.riskLevel === 'Growth' ? 'text-orange-600' :
                              customer.riskLevel === 'Balanced' ? 'text-yellow-600' :
                              customer.riskLevel === 'Moderate' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {customer.riskLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Liquidity Planning</h5>
                        <div className="text-sm text-gray-600">
                          <div className="mb-2">
                            <span className="font-medium">Primary Liquidity Need:</span> {customer.liquidity_needs}
                          </div>
                          <div className="mb-2">
                            <span className="font-medium">Tax Efficiency Focus:</span> 
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {customer.tax_considerations.slice(0, 2).map((consideration, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {consideration}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Investment Readiness</h5>
                        <div className="text-sm">
                          <div className={`flex items-center mb-1 ${
                            customer.investment_experience >= 10 ? 'text-green-600' :
                            customer.investment_experience >= 5 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              customer.investment_experience >= 10 ? 'bg-green-500' :
                              customer.investment_experience >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-medium">
                              {customer.investment_experience >= 10 ? 'Highly Experienced' :
                               customer.investment_experience >= 5 ? 'Moderately Experienced' : 'Building Experience'}
                            </span>
                          </div>
                          <div className={`flex items-center ${
                            customer.income.expense_ratio <= 0.5 ? 'text-green-600' :
                            customer.income.expense_ratio <= 0.65 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              customer.income.expense_ratio <= 0.5 ? 'bg-green-500' :
                              customer.income.expense_ratio <= 0.65 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="font-medium">
                              {customer.income.expense_ratio <= 0.5 ? 'Excellent Savings Rate' :
                               customer.income.expense_ratio <= 0.65 ? 'Good Savings Rate' : 'High Expenses'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Communication Records */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Communication Records</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </button>
              </div>
              
              <div className="space-y-4">
                {customerCommunications.map((comm) => (
                  <div key={comm.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {comm.type}
                          </span>
                          <span className="text-sm text-gray-500">{comm.date}</span>
                        </div>
                        <p className="text-gray-900 mb-2">{comm.content}</p>
                        <div className="text-sm text-gray-600">
                          <strong>Outcome:</strong> {comm.outcome}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>Next Action:</strong> {comm.nextAction}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;