import express from 'express';
import { NotFoundError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get real-time market data for a symbol
router.get('/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const marketDataService = req.app.locals.marketDataService;
    
    if (!marketDataService) {
      throw new Error('Market data service not available');
    }

    const data = await marketDataService.getRealTimeData(symbol.toUpperCase());
    
    if (!data) {
      throw new NotFoundError(`Market data not found for symbol: ${symbol}`);
    }

    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get batch market data for multiple symbols
router.post('/batch', async (req, res, next) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Symbols array is required'
      });
    }

    const marketDataService = req.app.locals.marketDataService;
    const data = await marketDataService.getBatchData(symbols);

    res.json({
      success: true,
      data,
      count: Object.keys(data).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get ETF data
router.get('/etf/list', async (req, res, next) => {
  try {
    const marketDataService = req.app.locals.marketDataService;
    const etfData = await marketDataService.getETFData();

    res.json({
      success: true,
      data: etfData,
      count: Object.keys(etfData).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get market summary
router.get('/summary', async (req, res, next) => {
  try {
    const marketDataService = req.app.locals.marketDataService;
    const summary = await marketDataService.getMarketSummary();

    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Search symbols
router.get('/search', async (req, res, next) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const marketDataService = req.app.locals.marketDataService;
    const results = await marketDataService.searchSymbols(query);

    res.json({
      success: true,
      data: results,
      count: results.length,
      query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get popular symbols
router.get('/popular', (req, res) => {
  const popularSymbols = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' }
  ];

  res.json({
    success: true,
    data: popularSymbols,
    count: popularSymbols.length,
    timestamp: new Date().toISOString()
  });
});

// Health check for market data service
router.get('/health', (req, res) => {
  const marketDataService = req.app.locals.marketDataService;
  
  res.json({
    success: true,
    data: {
      status: 'healthy',
      service: 'market-data',
      isRunning: marketDataService?.isRunning || false,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;