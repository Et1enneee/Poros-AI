import axios from 'axios';

// ETF data structure
export interface ETFData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  category: 'US Stock' | 'HK Stock' | 'Emerging Markets';
  expenseRatio?: number;
  lastUpdated: Date;
}

// Real-time stock data structure
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  market: 'HK' | 'US' | 'Crypto';
  sector?: string;
  lastUpdated: Date;
}

// ETF list configuration
export const ETF_LIST = {
  US_STOCKS: [
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', category: 'US Stock' as const },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust (Nasdaq-100)', category: 'US Stock' as const },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', category: 'US Stock' as const },
    { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', category: 'US Stock' as const },
  ],
  HK_STOCKS: [
    { symbol: '2800.HK', name: 'FTSE China A50 ETF', category: 'HK Stock' as const },
    { symbol: '2828.HK', name: 'Hang Seng ETF', category: 'HK Stock' as const },
  ],
  EMERGING_MARKETS: [
    { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', category: 'Emerging Markets' as const },
    { symbol: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF', category: 'Emerging Markets' as const },
  ]
};

// Main stock list
export const STOCK_LIST = {
  HK: ['0700.HK', '9988.HK', '3690.HK', '1211.HK', '2318.HK', '1299.HK'],
  US: ['AAPL', 'MSFT', 'TSLA', 'GOOGL', 'NVDA', 'AMZN'],
  CRYPTO: ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX']
};

// Yahoo Finance API configuration
const YAHOO_FINANCE_BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Use multiple data sources for improved reliability
class MarketDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  // Fetch real-time data from Yahoo Finance
  private async fetchYahooFinance(symbol: string): Promise<any> {
    try {
      const url = `${YAHOO_FINANCE_BASE_URL}/${symbol}`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch data for ${symbol}:`, error);
      return null;
    }
  }

  // Parse Yahoo Finance data
  private parseYahooFinanceData(yahooData: any, symbol: string): StockData | null {
    if (!yahooData?.chart?.result?.[0]) return null;

    const result = yahooData.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];
    
    if (!meta || !quote) return null;

    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;
    const volume = meta.regularMarketVolume || 0;

    return {
      symbol,
      name: meta.longName || meta.shortName || symbol,
      price: currentPrice,
      change,
      changePercent,
      volume,
      market: this.getMarketFromSymbol(symbol),
      sector: meta.sector || '',
      lastUpdated: new Date(meta.regularMarketTime * 1000)
    };
  }

  // Get market type
  private getMarketFromSymbol(symbol: string): 'HK' | 'US' | 'Crypto' {
    if (symbol.endsWith('.HK')) return 'HK';
    if (['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'AVAX'].includes(symbol)) return 'Crypto';
    return 'US';
  }

  // Generate mock data (as fallback)
  private generateMockData(symbol: string, name: string, market: 'HK' | 'US' | 'Crypto'): StockData {
    const basePrice = market === 'HK' ? Math.random() * 300 + 50 : 
                     market === 'Crypto' ? Math.random() * 50000 + 10000 :
                     Math.random() * 200 + 50;
    
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      name,
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000),
      market,
      lastUpdated: new Date()
    };
  }

  // Get single stock data
  async getStockData(symbol: string, name?: string): Promise<StockData> {
    const cacheKey = `stock_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    let stockData: StockData;
    const market = this.getMarketFromSymbol(symbol);
    
    // Try to fetch real data from Yahoo Finance
    const yahooData = await this.fetchYahooFinance(symbol);
    if (yahooData) {
      const parsedData = this.parseYahooFinanceData(yahooData, symbol);
      if (parsedData) {
        stockData = parsedData;
      } else {
        stockData = this.generateMockData(symbol, name || symbol, market);
      }
    } else {
      stockData = this.generateMockData(symbol, name || symbol, market);
    }

    this.cache.set(cacheKey, { data: stockData, timestamp: Date.now() });
    return stockData;
  }

  // Get ETF data
  async getETFData(symbol: string, name: string, category: 'US Stock' | 'HK Stock' | 'Emerging Markets'): Promise<ETFData> {
    const cacheKey = `etf_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    let etfData: ETFData;
    
    // Try to fetch real price data
    try {
      const yahooData = await this.fetchYahooFinance(symbol);
      if (yahooData) {
        const stockData = this.parseYahooFinanceData(yahooData, symbol);
        if (stockData) {
          etfData = {
            symbol: stockData.symbol,
            name,
            price: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent,
            volume: stockData.volume,
            category,
            expenseRatio: this.getExpenseRatio(symbol),
            lastUpdated: stockData.lastUpdated
          };
        } else {
          etfData = this.generateMockETFData(symbol, name, category);
        }
      } else {
        etfData = this.generateMockETFData(symbol, name, category);
      }
    } catch (error) {
      etfData = this.generateMockETFData(symbol, name, category);
    }

    this.cache.set(cacheKey, { data: etfData, timestamp: Date.now() });
    return etfData;
  }

  // Generate mock ETF data
  private generateMockETFData(symbol: string, name: string, category: 'US Stock' | 'HK Stock' | 'Emerging Markets'): ETFData {
    const basePrice = category === 'HK Stock' ? Math.random() * 50 + 20 :
                     category === 'Emerging Markets' ? Math.random() * 60 + 30 :
                     Math.random() * 500 + 100;
    
    const change = (Math.random() - 0.5) * basePrice * 0.05;
    const changePercent = (change / basePrice) * 100;
    
    return {
      symbol,
      name,
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 50000000),
      marketCap: Math.floor(Math.random() * 500000000000),
      category,
      expenseRatio: this.getExpenseRatio(symbol),
      lastUpdated: new Date()
    };
  }

  // Get expense ratio information
  private getExpenseRatio(symbol: string): number {
    const expenseRatios: { [key: string]: number } = {
      'VTI': 0.0003,
      'QQQ': 0.0020,
      'SPY': 0.0009,
      'VEA': 0.0005,
      'VWO': 0.0008,
      'IEMG': 0.0011,
      '2800.HK': 0.0010,
      '2828.HK': 0.0012
    };
    return expenseRatios[symbol] || 0.0010;
  }

  // Batch get stock data
  async getBatchStockData(): Promise<StockData[]> {
    const promises: Promise<StockData>[] = [];
    
    // Collect all stock data requests
    [...STOCK_LIST.HK, ...STOCK_LIST.US, ...STOCK_LIST.CRYPTO].forEach(symbol => {
      promises.push(this.getStockData(symbol));
    });

    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter((result): result is PromiseFulfilledResult<StockData> => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching batch stock data:', error);
      return [];
    }
  }

  // Batch get ETF data
  async getBatchETFData(): Promise<ETFData[]> {
    const promises: Promise<ETFData>[] = [];
    
    // Collect all ETF data requests
    [...ETF_LIST.US_STOCKS, ...ETF_LIST.HK_STOCKS, ...ETF_LIST.EMERGING_MARKETS].forEach(etf => {
      promises.push(this.getETFData(etf.symbol, etf.name, etf.category));
    });

    try {
      const results = await Promise.allSettled(promises);
      return results
        .filter((result): result is PromiseFulfilledResult<ETFData> => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Error fetching batch ETF data:', error);
      return [];
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();