import axios from 'axios';
import cron from 'node-cron';

export class MarketDataService {
  constructor() {
    this.updateInterval = null;
    this.isRunning = false;
    this.apiKey = process.env.YAHOO_FINANCE_API_KEY;
    this.baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart';
    this.fallbackData = this.getFallbackData();
  }

  // Get real-time market data for a symbol
  async getRealTimeData(symbol) {
    try {
      // Try to get cached data first
      const cacheKey = `realtime:${symbol}`;
      
      // For demo purposes, return mock data if no API key
      if (!this.apiKey) {
        return this.getMockData(symbol);
      }

      const response = await axios.get(`${this.baseUrl}/${symbol}`, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.data && response.data.chart && response.data.chart.result && response.data.chart.result[0]) {
        const result = response.data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
        return {
          symbol: meta.symbol,
          name: meta.longName || meta.symbol,
          price: meta.regularMarketPrice,
          change: meta.regularMarketPrice - meta.previousClose,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
          volume: meta.regularMarketVolume,
          marketCap: meta.marketCap,
          high: meta.regularMarketDayHigh,
          low: meta.regularMarketDayLow,
          open: meta.regularMarketOpen,
          previousClose: meta.previousClose,
          lastUpdated: new Date().toISOString()
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.warn(`⚠️ Failed to fetch real-time data for ${symbol}:`, error.message);
      return this.getMockData(symbol);
    }
  }

  // Get batch market data
  async getBatchData(symbols) {
    const results = {};
    
    for (const symbol of symbols) {
      try {
        results[symbol] = await this.getRealTimeData(symbol);
      } catch (error) {
        console.warn(`⚠️ Failed to fetch data for ${symbol}:`, error.message);
        results[symbol] = this.getMockData(symbol);
      }
    }
    
    return results;
  }

  // Get ETF data
  async getETFData() {
    const etfSymbols = ['SPY', 'QQQ', 'VTI', 'VEA', 'VWO', 'AGG', 'GLD', 'TLT'];
    const etfData = {};
    
    for (const symbol of etfSymbols) {
      try {
        etfData[symbol] = await this.getRealTimeData(symbol);
      } catch (error) {
        etfData[symbol] = this.getMockETFData(symbol);
      }
    }
    
    return etfData;
  }

  // Start real-time updates
  startRealTimeUpdates() {
    if (this.isRunning) {
      console.log('⚠️ Market data updates already running');
      return;
    }

    this.isRunning = true;
    console.log('📊 Starting market data updates...');

    // Update every 30 seconds during market hours (9:30 AM - 4:00 PM EST)
    this.updateInterval = cron.schedule('*/30 9-16 * * 1-5', async () => {
      console.log('🔄 Updating market data...');
      await this.updateAllData();
    }, {
      scheduled: false
    });

    this.updateInterval.start();
    this.updateAllData(); // Initial update
  }

  // Stop real-time updates
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      this.updateInterval.stop();
      this.updateInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Market data updates stopped');
  }

  // Update all market data
  async updateAllData() {
    try {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'SPY', 'QQQ', 'VTI'];
      const batchData = await this.getBatchData(symbols);
      
      // Store updated data (this would be saved to database)
      console.log('✅ Market data updated:', Object.keys(batchData).length, 'symbols');
      
      return batchData;
    } catch (error) {
      console.error('❌ Failed to update market data:', error);
      return this.fallbackData;
    }
  }

  // Mock data for demonstration
  getMockData(symbol) {
    const mockPrices = {
      'AAPL': { price: 195.12, change: 2.34, changePercent: 1.21 },
      'GOOGL': { price: 141.87, change: -1.23, changePercent: -0.86 },
      'MSFT': { price: 378.91, change: 4.56, changePercent: 1.22 },
      'AMZN': { price: 156.78, change: -0.89, changePercent: -0.56 },
      'TSLA': { price: 242.65, change: 8.91, changePercent: 3.81 },
      'SPY': { price: 478.92, change: 3.21, changePercent: 0.67 },
      'QQQ': { price: 391.45, change: 2.89, changePercent: 0.74 },
      'VTI': { price: 234.67, change: 1.45, changePercent: 0.62 }
    };

    const data = mockPrices[symbol] || { price: 100, change: 0, changePercent: 0 };
    
    return {
      symbol,
      name: this.getSymbolName(symbol),
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 100000000000,
      high: data.price + Math.random() * 5,
      low: data.price - Math.random() * 5,
      open: data.price - Math.random() * 2,
      previousClose: data.price - data.change,
      lastUpdated: new Date().toISOString(),
      isMockData: true
    };
  }

  getMockETFData(symbol) {
    const etfNames = {
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'VTI': 'Vanguard Total Stock Market ETF',
      'VEA': 'Vanguard FTSE Developed Markets ETF',
      'VWO': 'Vanguard FTSE Emerging Markets ETF',
      'AGG': 'iShares Core U.S. Aggregate Bond ETF',
      'GLD': 'SPDR Gold Trust',
      'TLT': 'iShares 20+ Year Treasury Bond ETF'
    };

    const mockData = this.getMockData(symbol);
    return {
      ...mockData,
      name: etfNames[symbol] || mockData.name,
      category: this.getETFCategoroy(symbol),
      expenseRatio: (Math.random() * 0.5 + 0.05).toFixed(3),
      assets: Math.floor(Math.random() * 500000000000) + 10000000000,
      dividendYield: (Math.random() * 5).toFixed(2)
    };
  }

  getSymbolName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'SPY': 'SPDR S&P 500 ETF',
      'QQQ': 'Invesco QQQ Trust',
      'VTI': 'Vanguard Total Stock Market ETF'
    };
    return names[symbol] || symbol;
  }

  getETFCategoroy(symbol) {
    const categories = {
      'SPY': 'Large Blend',
      'QQQ': 'Large Growth',
      'VTI': 'Large Blend',
      'VEA': 'Foreign Large Blend',
      'VWO': 'Diversified Emerging Markets',
      'AGG': 'Intermediate Core Bond',
      'GLD': 'Commodities',
      'TLT': 'Long Government'
    };
    return categories[symbol] || 'Unknown';
  }

  getFallbackData() {
    return {
      'AAPL': this.getMockData('AAPL'),
      'GOOGL': this.getMockData('GOOGL'),
      'MSFT': this.getMockData('MSFT'),
      'AMZN': this.getMockData('AMZN'),
      'TSLA': this.getMockData('TSLA'),
      'SPY': this.getMockData('SPY'),
      'QQQ': this.getMockData('QQQ'),
      'VTI': this.getMockData('VTI')
    };
  }

  // Get market summary
  async getMarketSummary() {
    try {
      const majorIndices = ['^GSPC', '^IXIC', '^DJI', '^RUT']; // S&P 500, NASDAQ, Dow, Russell
      const summary = {};
      
      for (const index of majorIndices) {
        try {
          const data = await this.getRealTimeData(index);
          summary[index] = data;
        } catch (error) {
          summary[index] = this.getMockData(index);
        }
      }
      
      return summary;
    } catch (error) {
      console.error('❌ Failed to get market summary:', error);
      return this.fallbackData;
    }
  }

  // Search for symbols
  async searchSymbols(query) {
    // Mock search results for demonstration
    const mockResults = [
      { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Equity' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity' },
      { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Equity' },
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF' }
    ];

    const filtered = mockResults.filter(item => 
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  }
}