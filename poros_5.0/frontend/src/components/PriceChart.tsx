import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { useRealTimeMarketData } from '../hooks/useRealTimeMarketData';

// @ts-ignore
const XAxisComponent = XAxis as any;
// @ts-ignore
const YAxisComponent = YAxis as any;
// @ts-ignore
const TooltipComponent = Tooltip as any;
// @ts-ignore
const LegendComponent = Legend as any;
// @ts-ignore
const LineComponent = Line as any;

interface PriceChartProps {
  title?: string;
  symbols?: string[];
  showETF?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  title = "Market Price Trends", 
  symbols = ['AAPL', 'MSFT', 'GOOGL'],
  showETF = true 
}) => {
  const { stockData, etfData, lastUpdated } = useRealTimeMarketData();
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M'>('1D');
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(symbols);

  // Generate mock historical data (would fetch from API in production)
  const generateHistoricalData = (symbols: string[], range: string) => {
    const points = range === '1D' ? 24 : range === '1W' ? 7 : 30;
    const data = [];
    
    for (let i = points; i >= 0; i--) {
      const date = new Date();
      if (range === '1D') {
        date.setHours(date.getHours() - i);
      } else if (range === '1W') {
        date.setDate(date.getDate() - i);
      } else {
        date.setDate(date.getDate() - i);
      }
      
      const dataPoint: any = {
        time: range === '1D' ? date.toLocaleTimeString() : date.toLocaleDateString(),
        timestamp: date.getTime()
      };
      
      // Generate mock price data for each selected symbol
      selectedSymbols.forEach(symbol => {
        const currentData = [...stockData, ...etfData].find(item => item.symbol === symbol);
        if (currentData) {
          // Generate historical volatility based on current price
          const volatility = currentData.price * 0.05; // 5% volatility
          const randomChange = (Math.random() - 0.5) * volatility * 2;
          dataPoint[symbol] = currentData.price + randomChange * (i / points);
        }
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const chartData = useMemo(() => {
    return generateHistoricalData(selectedSymbols, timeRange);
  }, [selectedSymbols, timeRange, stockData, etfData]);

  // Available symbols list
  const availableSymbols = useMemo(() => {
    const stockSymbols = stockData.map(item => ({ symbol: item.symbol, name: item.name, type: 'Stock' }));
    const etfSymbols = etfData.map(item => ({ symbol: item.symbol, name: item.name, type: 'ETF' }));
    return [...stockSymbols, ...etfSymbols];
  }, [stockData, etfData]);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  const toggleSymbol = (symbol: string) => {
    setSelectedSymbols(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol].slice(0, 6) // Display maximum 6 lines
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          {title}
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* Time range selection */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['1D', '1W', '1M'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Symbol selector */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Select Symbols to Display:</div>
        <div className="flex flex-wrap gap-2">
          {availableSymbols.slice(0, 12).map((item, index) => (
            <button
              key={item.symbol}
              onClick={() => toggleSymbol(item.symbol)}
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedSymbols.includes(item.symbol)
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              style={{ borderColor: selectedSymbols.includes(item.symbol) ? colors[index % colors.length] : undefined }}
            >
              <span className="mr-1">{item.symbol}</span>
              <span className="text-gray-500">({item.type})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {selectedSymbols.length > 0 ? (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxisComponent 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxisComponent 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
              />
              <TooltipComponent 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: string) => [
                  `$${Number(value).toFixed(2)}`,
                  name
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <LegendComponent />
              {selectedSymbols.map((symbol, index) => (
                <LineComponent
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Select symbols above to display price trends</p>
          </div>
        </div>
      )}

      {/* Market summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {selectedSymbols.slice(0, 4).map((symbol, index) => {
            const data = [...stockData, ...etfData].find(item => item.symbol === symbol);
            if (!data) return null;
            
            return (
              <div key={symbol} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="font-medium">{symbol}</span>
                </div>
                <div className={`flex items-center ${
                  data.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.change >= 0 ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  <span>{data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(2)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceChart;