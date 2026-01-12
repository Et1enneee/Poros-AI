import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Wifi, WifiOff, Clock, Activity } from 'lucide-react';
import { useRealTimeMarketData } from '../hooks/useRealTimeMarketData';
import { StockData, ETFData } from '../services/marketDataService';

const MarketData: React.FC = () => {
  const {
    stockData,
    etfData,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    isAutoRefreshEnabled,
    toggleAutoRefresh
  } = useRealTimeMarketData();

  // Group stock data by market type
  const hkStocks = stockData.filter(item => item.market === 'HK');
  const usStocks = stockData.filter(item => item.market === 'US');
  const crypto = stockData.filter(item => item.market === 'Crypto');

  // Group ETF data by category
  const usETFs = etfData.filter(item => item.category === 'US Stock');
  const hkETFs = etfData.filter(item => item.category === 'HK Stock');
  const emergingMarketsETFs = etfData.filter(item => item.category === 'Emerging Markets');

  const getMarketColor = (market: string) => {
    switch (market) {
      case 'HK': return 'text-red-600';
      case 'US': return 'text-blue-600';
      case 'Crypto': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getMarketBg = (market: string) => {
    switch (market) {
      case 'HK': return 'bg-red-50 border-red-200';
      case 'US': return 'bg-blue-50 border-blue-200';
      case 'Crypto': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getETFColor = (category: string) => {
    switch (category) {
      case 'US Stock': return 'text-blue-600';
      case 'HK Stock': return 'text-red-600';
      case 'Emerging Markets': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getETFBg = (category: string) => {
    switch (category) {
      case 'US Stock': return 'bg-blue-50 border-blue-200';
      case 'HK Stock': return 'bg-red-50 border-red-200';
      case 'Emerging Markets': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Render stock data card
  const renderStockCard = (stock: StockData, marketType: string) => (
    <div key={stock.symbol} className="bg-white rounded p-3 border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="font-medium text-sm">{stock.symbol}</div>
          <div className="text-xs text-gray-600 truncate">{stock.name}</div>
        </div>
        <div className={`text-xs px-2 py-1 rounded ${getMarketColor(marketType)}`}>
          {marketType}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="font-semibold">
          {marketType === 'HK' ? 'HK$' : 
           marketType === 'Crypto' ? '$' : '$'}
          {stock.price.toFixed(stock.price < 1 ? 4 : 2)}
        </div>
        <div className={`flex items-center text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </div>
      </div>
    </div>
  );

  // Render ETF data card
  const renderETFCard = (etf: ETFData) => (
    <div key={etf.symbol} className="bg-white rounded p-3 border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="font-medium text-sm">{etf.symbol}</div>
          <div className="text-xs text-gray-600 truncate">{etf.name}</div>
          <div className="text-xs text-gray-500">Expense Ratio: {(etf.expenseRatio! * 100).toFixed(2)}%</div>
        </div>
        <div className={`text-xs px-2 py-1 rounded ${getETFColor(etf.category)}`}>
          ETF
        </div>
      </div>
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold">
          {etf.category === 'HK Stock' ? 'HK$' : '$'}
          {etf.price.toFixed(2)}
        </div>
        <div className={`flex items-center text-sm ${etf.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {etf.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {etf.changePercent > 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Vol: {etf.volume.toLocaleString()}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with controls */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Live Market Data & ETFs</h3>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-sm text-gray-500">
              {isLoading ? (
                <Activity className="h-4 w-4 mr-1 animate-spin" />
              ) : error ? (
                <WifiOff className="h-4 w-4 mr-1 text-red-500" />
              ) : (
                <Wifi className="h-4 w-4 mr-1 text-green-500" />
              )}
              <span>{isLoading ? 'Loading...' : error ? 'Connection Error' : 'Live'}</span>
            </div>
            {lastUpdated && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleAutoRefresh}
            className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${
              isAutoRefreshEnabled 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {isAutoRefreshEnabled ? 'Auto ON' : 'Auto OFF'}
          </button>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
          <p className="text-xs text-red-600 mt-1">Using cached data or mock data for demonstration</p>
        </div>
      )}

      <div className="space-y-6">
        {/* ETFs Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-4">
          <h4 className="font-semibold mb-3 text-indigo-800">ETF Overview</h4>
          
          {/* US ETFs */}
          <div className={`rounded-lg border p-4 mb-4 ${getETFBg('US Stock')}`}>
            <h5 className={`font-medium mb-3 ${getETFColor('US Stock')}`}>US Stock ETFs</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {usETFs.map(etf => renderETFCard(etf))}
            </div>
          </div>

          {/* HK ETFs */}
          <div className={`rounded-lg border p-4 mb-4 ${getETFBg('HK Stock')}`}>
            <h5 className={`font-medium mb-3 ${getETFColor('HK Stock')}`}>Hong Kong ETFs</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {hkETFs.map(etf => renderETFCard(etf))}
            </div>
          </div>

          {/* Emerging Markets ETFs */}
          <div className={`rounded-lg border p-4 ${getETFBg('Emerging Markets')}`}>
            <h5 className={`font-medium mb-3 ${getETFColor('Emerging Markets')}`}>Emerging Markets ETFs</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergingMarketsETFs.map(etf => renderETFCard(etf))}
            </div>
          </div>
        </div>

        {/* Hong Kong Stocks */}
        <div className={`rounded-lg border p-4 ${getMarketBg('HK')}`}>
          <h4 className={`font-semibold mb-3 ${getMarketColor('HK')}`}>Hong Kong Stocks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hkStocks.map(stock => renderStockCard(stock, 'HK'))}
          </div>
        </div>

        {/* US Stocks */}
        <div className={`rounded-lg border p-4 ${getMarketBg('US')}`}>
          <h4 className={`font-semibold mb-3 ${getMarketColor('US')}`}>US Stocks</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {usStocks.map(stock => renderStockCard(stock, 'US'))}
          </div>
        </div>

        {/* Cryptocurrency */}
        <div className={`rounded-lg border p-4 ${getMarketBg('Crypto')}`}>
          <h4 className={`font-semibold mb-3 ${getMarketColor('Crypto')}`}>Cryptocurrency</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {crypto.map(coin => renderStockCard(coin, 'Crypto'))}
          </div>
        </div>
      </div>

      {/* Exchange Rate Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Exchange Rates</h5>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">USD/HKD</div>
            <div className="font-semibold">7.80</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">USD/CNY</div>
            <div className="font-semibold">7.25</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Data Source</div>
            <div className="font-semibold">Yahoo Finance</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Last Updated</div>
            <div className="font-semibold">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketData;