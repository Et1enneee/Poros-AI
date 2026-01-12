import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle,
  UserPlus,
  Download,
  Edit,
  MoreHorizontal,
  Star,
  Target
} from 'lucide-react';
import { mockCustomers, mockInvestments, dashboardStats } from '../data/mockData';

const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter customer data
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || customer.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
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
      case 'Conservative': return 'text-green-600 bg-green-50';
      case 'Moderate': return 'text-blue-600 bg-blue-50';
      case 'Balanced': return 'text-yellow-600 bg-yellow-50';
      case 'Growth': return 'text-orange-600 bg-orange-50';
      case 'Aggressive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCustomerInvestments = (customerId: string) => {
    return mockInvestments.filter(inv => inv.customerId === customerId);
  };

  const getCustomerTotalReturn = (customerId: string) => {
    const investments = getCustomerInvestments(customerId);
    return investments.reduce((sum, inv) => sum + inv.return, 0);
  };

  const getCustomerAvgReturnRate = (customerId: string) => {
    const investments = getCustomerInvestments(customerId);
    if (investments.length === 0) return 0;
    return investments.reduce((sum, inv) => sum + inv.returnRate, 0) / investments.length;
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                <dd className="text-2xl font-bold text-gray-900">{dashboardStats.totalCustomers}</dd>
                <dd className="text-sm text-gray-500">
                  Active: {dashboardStats.activeCustomers} clients
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Assets (HKD)</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {(dashboardStats.totalAssets / 10000).toFixed(0)}W
                </dd>
                <dd className="text-sm text-gray-500">
                  Avg: {(dashboardStats.avgAssets / 10000).toFixed(0)}W/person
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Average Return Rate</dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {dashboardStats.avgReturnRate.toFixed(1)}%
                </dd>
                <dd className="text-sm text-gray-500">
                  High Risk: {dashboardStats.highRiskCustomers} clients
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Follow-ups</dt>
                <dd className="text-2xl font-bold text-gray-900">{dashboardStats.pendingFollowUps}</dd>
                <dd className="text-sm text-gray-500">
                  Requires immediate contact
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer name, phone or email..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="w-40">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Prospect">Prospect</option>
                <option value="Churned">Churned</option>
              </select>
            </div>
            
            <div className="w-40">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="all">All Risk Profiles</option>
                <option value="Conservative">Conservative</option>
                <option value="Moderate">Moderate</option>
                <option value="Balanced">Balanced</option>
                <option value="Growth">Growth</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>
            
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List/Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => {
            const investments = getCustomerInvestments(customer.id);
            const totalReturn = getCustomerTotalReturn(customer.id);
            const avgReturnRate = getCustomerAvgReturnRate(customer.id);
            
            return (
              <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Customer Header Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                          {customer.avatar}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                        <p className="text-sm text-gray-500">{customer.age} years • {customer.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 h-4 w-4" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2 h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4" />
                      {customer.address}
                    </div>
                  </div>

                  {/* Risk Profile */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(customer.riskLevel)}`}>
                      <Target className="mr-1 h-3 w-3" />
                      {customer.riskLevel}
                    </span>
                  </div>

                  {/* Asset Information */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(customer.totalAssets / 10000).toFixed(0)}W
                      </div>
                      <div className="text-xs text-gray-500">Total Assets</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(totalReturn / 10000).toFixed(1)}W
                      </div>
                      <div className="text-xs text-gray-500">Total Returns</div>
                    </div>
                  </div>

                  {/* Investment Information */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Avg Return Rate</span>
                      <span className={`font-medium ${avgReturnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {avgReturnRate >= 0 ? '+' : ''}{avgReturnRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Investment Products</span>
                      <span className="font-medium">{investments.length}</span>
                    </div>
                  </div>

                  {/* Industry and Income Information */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Industry</span>
                      <span className="font-medium text-gray-900">{customer.industry.category}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Role</span>
                      <span className="font-medium text-gray-900">{customer.industry.role}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Income</span>
                      <span className="font-medium text-green-600">
                        HK$ {(customer.income.total_annual_income / 10000).toFixed(1)}W
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {customer.tags.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          +{customer.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/customer/${customer.id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Link>
                    <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                      <Phone className="mr-1 h-4 w-4" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry & Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => {
                const totalReturn = getCustomerTotalReturn(customer.id);
                const avgReturnRate = getCustomerAvgReturnRate(customer.id);
                
                return (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                            {customer.avatar}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.age} years • {customer.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.industry.category}</div>
                      <div className="text-sm text-gray-500">{customer.industry.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        HK$ {(customer.income.total_annual_income / 10000).toFixed(1)}W
                      </div>
                      <div className="text-sm text-gray-500">
                        Growth: +{customer.income.income_growth_rate}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {(customer.totalAssets / 10000).toFixed(0)}W
                      </div>
                      <div className={`text-sm ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Returns: {(totalReturn / 10000).toFixed(1)}W
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(customer.riskLevel)}`}>
                        {customer.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        to={`/customer/${customer.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Link>
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200">
                        <Phone className="mr-1 h-3 w-3" />
                        Contact
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* No Search Results */}
      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please try adjusting search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;