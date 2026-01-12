import { useState, useEffect, useCallback, useRef } from 'react';
import { marketDataService, StockData, ETFData } from '../services/marketDataService';

interface UseRealTimeMarketDataReturn {
  stockData: StockData[];
  etfData: ETFData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
  isAutoRefreshEnabled: boolean;
  toggleAutoRefresh: () => void;
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const useRealTimeMarketData = (): UseRealTimeMarketDataReturn => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [etfData, setETFData] = useState<ETFData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Refresh data function
  const refreshData = useCallback(async () => {
    // Cancel previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);

      // Fetch stock and ETF data in parallel
      const [stockResults, etfResults] = await Promise.all([
        marketDataService.getBatchStockData(),
        marketDataService.getBatchETFData()
      ]);

      setStockData(stockResults);
      setETFData(etfResults);
      setLastUpdated(new Date());
      
      console.log(`Data refreshed at ${new Date().toLocaleTimeString()}`, {
        stocks: stockResults.length,
        etfs: etfResults.length
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch market data';
      setError(errorMessage);
      console.error('Error refreshing market data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle auto refresh
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshEnabled(prev => !prev);
  }, []);

  // Initialize data loading
  useEffect(() => {
    refreshData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [refreshData]);

  // Auto refresh logic
  useEffect(() => {
    if (isAutoRefreshEnabled) {
      intervalRef.current = setInterval(() => {
        refreshData();
      }, REFRESH_INTERVAL);
      
      console.log('Auto-refresh enabled, interval set to 5 minutes');
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('Auto-refresh disabled');
      }
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoRefreshEnabled, refreshData]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAutoRefreshEnabled) {
        // Immediately refresh data when page becomes visible
        console.log('Page became visible, refreshing data...');
        refreshData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAutoRefreshEnabled, refreshData]);

  return {
    stockData,
    etfData,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    isAutoRefreshEnabled,
    toggleAutoRefresh
  };
};