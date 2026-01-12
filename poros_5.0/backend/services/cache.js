// CacheService ES模块版
class CacheService {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 300; // 5 minutes default
    this.cleanupInterval = null;
    this.initialized = false;
  }

delPattern(pattern) {
  if (!pattern.endsWith('*')) {
    // 精准删除
    this.del(pattern);
    return 1;
  }
  const prefix = pattern.slice(0, -1);
  const keys = this.keys();
  let count = 0;
  keys.forEach(key => {
    if (key.startsWith(prefix)) {
      this.del(key);
      count++;
    }
  });
  return count;
}

async initialize() {
  if (this.initialized) return;
  
  this.cleanupInterval = setInterval(() => {
    this.cleanup();
  }, 60000); // Clean up every minute
  
  this.initialized = true;
  console.log('✅ CacheService initialized');
}

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const timestamp = this.timestamps.get(key);
    const now = Date.now();
    
    if (timestamp && now - timestamp > this.defaultTTL * 1000) {
      this.del(key);
      return undefined;
    }

    return this.cache.get(key);
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
    
    if (ttl !== this.defaultTTL) {
      setTimeout(() => {
        this.del(key);
      }, ttl * 1000);
    }
  }

  del(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  delete(key) {
    return this.del(key);
  }

  has(key) {
    const value = this.get(key);
    return value !== undefined;
  }

  // Get multiple keys
  mget(keys) {
    const result = {};
    keys.forEach(key => {
      result[key] = this.get(key);
    });
    return result;
  }

  // Set multiple keys
  mset(keyValuePairs, ttl = this.defaultTTL) {
    keyValuePairs.forEach(([key, value]) => {
      this.set(key, value, ttl);
    });
  }

  // Get all keys
  keys() {
    return Array.from(this.cache.keys());
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    
    for (const [key, timestamp] of this.timestamps) {
      if (now - timestamp > this.defaultTTL * 1000) {
        expired++;
      }
    }

    return {
      keys: this.cache.size,
      hits: 0, // We don't track hits/misses in this simple implementation
      misses: 0,
      ksize: this.cache.size,
      vsize: this.cache.size,
      expired: expired
    };
  }

  // Clear all cache
  flushAll() {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, timestamp] of this.timestamps) {
      if (now - timestamp > this.defaultTTL * 1000) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      this.del(key);
    });

    if (expiredKeys.length > 0) {
      console.log(`🧹 Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  // Cache market data
  setMarketData(symbol, data, ttl = 60) {
    return this.set(`market:${symbol}`, data, ttl);
  }

  getMarketData(symbol) {
    return this.get(`market:${symbol}`);
  }

  // Cache customer data
  setCustomerData(customerId, data, ttl = 300) {
    return this.set(`customer:${customerId}`, data, ttl);
  }

  getCustomerData(customerId) {
    return this.get(`customer:${customerId}`);
  }

  // Cache portfolio data
  setPortfolioData(portfolioId, data, ttl = 120) {
    return this.set(`portfolio:${portfolioId}`, data, ttl);
  }

  getPortfolioData(portfolioId) {
    return this.get(`portfolio:${portfolioId}`);
  }

  // Cache dashboard data
  setDashboardData(customerId, data, ttl = 60) {
    return this.set(`dashboard:${customerId}`, data, ttl);
  }

  getDashboardData(customerId) {
    return this.get(`dashboard:${customerId}`);
  }

  // Cache investment advice
  setAdviceData(customerId, data, ttl = 600) {
    return this.set(`advice:${customerId}`, data, ttl);
  }

  getAdviceData(customerId) {
    return this.get(`advice:${customerId}`);
  }

  // Invalidate cache for a specific customer
  invalidateCustomerCache(customerId) {
    const patterns = [
      `customer:${customerId}`,
      `portfolio:*`,
      `dashboard:${customerId}`,
      `advice:${customerId}`
    ];

    const keys = this.keys();
    const toDelete = keys.filter(key => 
      patterns.some(pattern => {
        if (pattern.endsWith('*')) {
          return key.startsWith(pattern.slice(0, -1));
        }
        return key === pattern;
      })
    );

    toDelete.forEach(key => this.del(key));
    return toDelete.length;
  }

  // Invalidate market data cache
  invalidateMarketCache(symbol = null) {
    const keys = this.keys();
    const toDelete = symbol 
      ? keys.filter(key => key.startsWith(`market:${symbol}`))
      : keys.filter(key => key.startsWith('market:'));
    
    toDelete.forEach(key => this.del(key));
    return toDelete.length;
  }

  // Warm up cache with common data
  async warmUpCache(dbService, marketDataService) {
    try {
      console.log('🔥 Warming up cache...');

      // Cache popular market symbols
      const popularSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'SPY', 'QQQ', 'VTI'];
      
      for (const symbol of popularSymbols) {
        try {
          const data = await marketDataService.getRealTimeData(symbol);
          if (data) {
            this.setMarketData(symbol, data, 300);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to cache data for ${symbol}:`, error.message);
        }
      }

      // Cache customer data
      const customers = dbService.getCustomers();
      for (const customer of customers.slice(0, 10)) { // Cache first 10 customers
        const portfolios = dbService.getPortfolios(customer.customer_id);
        const advice = dbService.getInvestmentAdvice(customer.customer_id);
        
        this.setCustomerData(customer.customer_id, customer, 600);
        this.setDashboardData(customer.customer_id, { portfolios, advice }, 300);
      }

      console.log('✅ Cache warmed up successfully');
    } catch (error) {
      console.error('❌ Cache warm-up failed:', error);
    }
  }

  // Cleanup on destroy
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.flushAll();
  }
}

export default CacheService;