import express from 'express';

const router = express.Router();

// Get dashboard overview
router.get('/overview', (req, res, next) => {
  try {
    const dbService = req.app.locals.dbService;
    
    // Get overview statistics
    const totalCustomers = dbService.query('SELECT COUNT(*) as count FROM customers')[0].count;
    const totalPortfolios = dbService.query('SELECT COUNT(*) as count FROM portfolios')[0].count;
    const totalValue = dbService.query('SELECT SUM(total_value) as total FROM portfolios')[0].total || 0;
    const totalInvested = dbService.query('SELECT SUM(investment_amount) as total FROM portfolios')[0].total || 0;
    
    // Get recent activity
    const recentCustomers = dbService.query(`
      SELECT * FROM customers 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    const recentTransactions = dbService.query(`
      SELECT t.*, p.portfolio_name, c.name as customer_name
      FROM transactions t
      JOIN portfolios p ON t.portfolio_id = p.id
      JOIN customers c ON p.customer_id = c.customer_id
      ORDER BY t.transaction_date DESC
      LIMIT 10
    `);
    
    // Get pending advice
    const pendingAdvice = dbService.query(`
      SELECT ia.*, c.name as customer_name
      FROM investment_advice ia
      JOIN customers c ON ia.customer_id = c.customer_id
      WHERE ia.status = 'pending'
      ORDER BY ia.priority DESC, ia.created_at DESC
      LIMIT 10
    `);

    const overview = {
      statistics: {
        totalCustomers,
        totalPortfolios,
        totalValue: parseFloat(totalValue),
        totalInvested: parseFloat(totalInvested),
        totalCash: parseFloat(totalValue) - parseFloat(totalInvested),
        totalUnrealizedPnL: parseFloat(totalValue) - parseFloat(totalInvested)
      },
      recentCustomers,
      recentTransactions,
      pendingAdvice,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get market summary for dashboard
router.get('/market', async (req, res, next) => {
  try {
    const marketDataService = req.app.locals.marketDataService;
    
    if (!marketDataService) {
      return res.status(503).json({
        success: false,
        error: 'Market data service not available'
      });
    }

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

// Get customer portfolio performance
router.get('/customer/:customerId/performance', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    // Check if customer exists
    const customer = dbService.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Get portfolio performance data
    const portfolios = dbService.getPortfolios(customerId);
    
    const performance = {
      customer: {
        id: customer.customer_id,
        name: customer.name,
        risk_tolerance: customer.risk_tolerance
      },
      portfolios: portfolios.map(portfolio => {
        const return_pct = portfolio.total_value > 0 
          ? ((portfolio.total_value - portfolio.investment_amount) / portfolio.investment_amount) * 100
          : 0;
        
        return {
          id: portfolio.id,
          name: portfolio.portfolio_name,
          total_value: portfolio.total_value,
          invested: portfolio.investment_amount,
          cash: portfolio.cash_balance,
          return_pct: parseFloat(return_pct.toFixed(2)),
          return_amount: portfolio.total_value - portfolio.investment_amount,
          holdings_count: portfolio.holdings_count,
          risk_level: portfolio.risk_level
        };
      }),
      summary: {
        total_value: portfolios.reduce((sum, p) => sum + (p.total_value || 0), 0),
        total_invested: portfolios.reduce((sum, p) => sum + (p.investment_amount || 0), 0),
        total_return_pct: 0, // Will be calculated below
        total_return_amount: 0
      },
      timestamp: new Date().toISOString()
    };

    // Calculate overall performance
    if (performance.summary.total_invested > 0) {
      performance.summary.total_return_pct = parseFloat(
        ((performance.summary.total_value - performance.summary.total_invested) / 
         performance.summary.total_invested * 100).toFixed(2)
      );
      performance.summary.total_return_amount = performance.summary.total_value - performance.summary.total_invested;
    }

    res.json({
      success: true,
      data: performance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get asset allocation analysis
router.get('/customer/:customerId/asset-allocation', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    // Check if customer exists
    const customer = dbService.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    // Get all holdings for the customer
    const holdings = dbService.query(`
      SELECT h.*, p.portfolio_name
      FROM holdings h
      JOIN portfolios p ON h.portfolio_id = p.id
      WHERE p.customer_id = ?
    `, [customerId]);

    // Categorize holdings by asset type (simplified classification)
    const assetAllocation = {
      'US Stocks': [],
      'International Stocks': [],
      'Bonds': [],
      'ETFs': [],
      'Cash': [],
      'Other': []
    };

    let totalValue = 0;
    
    holdings.forEach(holding => {
      const value = holding.market_value || (holding.current_price * holding.quantity);
      totalValue += value;
      
      const symbol = holding.symbol.toUpperCase();
      
      // Simple classification logic
      if (['SPY', 'QQQ', 'VTI', 'VEA', 'VWO', 'AGG'].includes(symbol)) {
        assetAllocation['ETFs'].push({
          symbol: holding.symbol,
          value,
          percentage: 0 // Will be calculated later
        });
      } else if (['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'].includes(symbol)) {
        assetAllocation['US Stocks'].push({
          symbol: holding.symbol,
          value,
          percentage: 0
        });
      } else if (symbol.includes('BOND') || symbol.includes('TLT') || symbol.includes('AGG')) {
        assetAllocation['Bonds'].push({
          symbol: holding.symbol,
          value,
          percentage: 0
        });
      } else {
        assetAllocation['Other'].push({
          symbol: holding.symbol,
          value,
          percentage: 0
        });
      }
    });

    // Calculate percentages
    Object.keys(assetAllocation).forEach(category => {
      assetAllocation[category].forEach(item => {
        item.percentage = totalValue > 0 ? parseFloat((item.value / totalValue * 100).toFixed(2)) : 0;
      });
    });

    const summary = {
      total_value: totalValue,
      categories: Object.keys(assetAllocation).map(category => ({
        name: category,
        value: assetAllocation[category].reduce((sum, item) => sum + item.value, 0),
        percentage: totalValue > 0 ? parseFloat((assetAllocation[category].reduce((sum, item) => sum + item.value, 0) / totalValue * 100).toFixed(2)) : 0,
        items: assetAllocation[category]
      })),
      recommendation: generateAllocationRecommendation(customer, assetAllocation, totalValue),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get risk analysis
router.get('/customer/:customerId/risk-analysis', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const customer = dbService.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
    }

    const portfolios = dbService.getPortfolios(customerId);
    
    // Calculate risk metrics
    const riskAnalysis = {
      customer_profile: {
        risk_tolerance: customer.risk_tolerance,
        age: customer.age,
        investment_horizon: customer.investment_horizon,
        income_range: customer.income_range
      },
      portfolio_risk: {
        overall_risk_score: calculateRiskScore(customer, portfolios),
        risk_distribution: analyzeRiskDistribution(portfolios),
        concentration_risk: analyzeConcentrationRisk(portfolios),
        volatility_estimate: estimatePortfolioVolatility(portfolios)
      },
      recommendations: generateRiskRecommendations(customer, portfolios),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: riskAnalysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function generateAllocationRecommendation(customer, allocation, totalValue) {
  const recommendations = [];
  
  if (customer.risk_tolerance === 'conservative' && allocation['Bonds'].length === 0) {
    recommendations.push({
      type: 'warning',
      message: 'Consider adding bond exposure for risk reduction',
      action: 'Allocate 30-40% to government and investment-grade bonds'
    });
  }
  
  if (customer.risk_tolerance === 'aggressive' && allocation['International Stocks'].length === 0) {
    recommendations.push({
      type: 'suggestion',
      message: 'Add international exposure for growth potential',
      action: 'Allocate 20-30% to international developed and emerging markets'
    });
  }
  
  return recommendations;
}

function calculateRiskScore(customer, portfolios) {
  let score = 50; // Base score
  
  // Age factor
  if (customer.age < 30) score += 20;
  else if (customer.age > 60) score -= 20;
  
  // Risk tolerance factor
  switch (customer.risk_tolerance) {
    case 'conservative': score -= 20; break;
    case 'moderate': score += 0; break;
    case 'aggressive': score += 20; break;
  }
  
  return Math.max(0, Math.min(100, score));
}

function analyzeRiskDistribution(portfolios) {
  const distribution = { low: 0, moderate: 0, high: 0 };
  
  portfolios.forEach(portfolio => {
    distribution[portfolio.risk_level]++;
  });
  
  return distribution;
}

function analyzeConcentrationRisk(portfolios) {
  // Simplified concentration analysis
  return {
    top_holding_percentage: Math.random() * 30 + 10, // Mock data
    sector_concentration: Math.random() * 40 + 20,
    recommendation: 'Consider diversifying across more holdings'
  };
}

function estimatePortfolioVolatility(portfolios) {
  // Mock volatility estimation
  return {
    estimated_annual_volatility: (Math.random() * 20 + 10).toFixed(1),
    risk_level: 'moderate'
  };
}

function generateRiskRecommendations(customer, portfolios) {
  const recommendations = [];
  
  if (customer.risk_tolerance === 'conservative' && portfolios.some(p => p.risk_level === 'high')) {
    recommendations.push('Consider rebalancing high-risk positions');
  }
  
  if (customer.age > 55 && portfolios.some(p => p.risk_level === 'high')) {
    recommendations.push('Gradually shift towards more conservative investments');
  }
  
  return recommendations;
}

export default router;