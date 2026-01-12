import express from 'express';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all portfolios for a customer
router.get('/customer/:customerId', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const customer = dbService.getCustomerById(customerId);
    if (!customer) {
      throw new NotFoundError(`Customer not found: ${customerId}`);
    }

    const portfolios = dbService.getPortfolios(customerId);

    res.json({
      success: true,
      data: portfolios,
      count: portfolios.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get portfolio by ID
router.get('/:portfolioId', (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const portfolio = dbService.getPortfolioById(portfolioId);
    
    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found: ${portfolioId}`);
    }

    // Get holdings for this portfolio
    const holdings = dbService.query(`
      SELECT h.*, md.name, md.price as current_price
      FROM holdings h
      LEFT JOIN market_data md ON h.symbol = md.symbol
      WHERE h.portfolio_id = ?
      ORDER BY h.symbol
    `, [portfolioId]);

    // Get transactions for this portfolio
    const transactions = dbService.query(`
      SELECT * FROM transactions 
      WHERE portfolio_id = ? 
      ORDER BY transaction_date DESC
    `, [portfolioId]);

    res.json({
      success: true,
      data: {
        ...portfolio,
        holdings,
        transactions,
        summary: {
          total_holdings: holdings.length,
          total_market_value: holdings.reduce((sum, h) => sum + (h.market_value || 0), 0),
          total_unrealized_pnl: holdings.reduce((sum, h) => sum + (h.unrealized_pnl || 0), 0)
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Create new portfolio
router.post('/', (req, res, next) => {
  try {
    const portfolioData = req.body;
    
    // Validate required fields
    const requiredFields = ['customer_id', 'portfolio_name'];
    const missingFields = requiredFields.filter(field => !portfolioData[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const dbService = req.app.locals.dbService;
    
    // Check if customer exists
    const customer = dbService.getCustomerById(portfolioData.customer_id);
    if (!customer) {
      throw new NotFoundError(`Customer not found: ${portfolioData.customer_id}`);
    }

    const result = dbService.run(`
      INSERT INTO portfolios (customer_id, portfolio_name, total_value, cash_balance, 
                            investment_amount, risk_level)
      VALUES (@customer_id, @portfolio_name, @total_value, @cash_balance, 
              @investment_amount, @risk_level)
    `, {
      customer_id: portfolioData.customer_id,
      portfolio_name: portfolioData.portfolio_name,
      total_value: portfolioData.total_value || 0,
      cash_balance: portfolioData.cash_balance || 0,
      investment_amount: portfolioData.investment_amount || 0,
      risk_level: portfolioData.risk_level || 'moderate'
    });

    const newPortfolio = dbService.getPortfolioById(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      data: newPortfolio,
      message: 'Portfolio created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Update portfolio
router.put('/:portfolioId', (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const updateData = req.body;
    
    const dbService = req.app.locals.dbService;
    const existingPortfolio = dbService.getPortfolioById(portfolioId);
    
    if (!existingPortfolio) {
      throw new NotFoundError(`Portfolio not found: ${portfolioId}`);
    }

    const updateQuery = `
      UPDATE portfolios SET 
        portfolio_name = @portfolio_name,
        total_value = @total_value,
        cash_balance = @cash_balance,
        investment_amount = @investment_amount,
        risk_level = @risk_level,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `;

    dbService.run(updateQuery, { 
      id: portfolioId, 
      ...updateData 
    });

    const updatedPortfolio = dbService.getPortfolioById(portfolioId);

    res.json({
      success: true,
      data: updatedPortfolio,
      message: 'Portfolio updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Delete portfolio
router.delete('/:portfolioId', (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const existingPortfolio = dbService.getPortfolioById(portfolioId);
    
    if (!existingPortfolio) {
      throw new NotFoundError(`Portfolio not found: ${portfolioId}`);
    }

    // Delete associated data
    dbService.run('DELETE FROM transactions WHERE portfolio_id = ?', [portfolioId]);
    dbService.run('DELETE FROM holdings WHERE portfolio_id = ?', [portfolioId]);
    
    // Delete portfolio
    dbService.run('DELETE FROM portfolios WHERE id = ?', [portfolioId]);

    res.json({
      success: true,
      message: 'Portfolio deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Add holding to portfolio
router.post('/:portfolioId/holdings', (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const holdingData = req.body;
    
    // Validate required fields
    const requiredFields = ['symbol', 'quantity', 'avg_cost'];
    const missingFields = requiredFields.filter(field => !holdingData[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const dbService = req.app.locals.dbService;
    
    // Check if portfolio exists
    const portfolio = dbService.getPortfolioById(portfolioId);
    if (!portfolio) {
      throw new NotFoundError(`Portfolio not found: ${portfolioId}`);
    }

    const result = dbService.run(`
      INSERT INTO holdings (portfolio_id, symbol, quantity, avg_cost, current_price, market_value, unrealized_pnl)
      VALUES (@portfolio_id, @symbol, @quantity, @avg_cost, @current_price, @market_value, @unrealized_pnl)
    `, {
      portfolio_id: portfolioId,
      symbol: holdingData.symbol.toUpperCase(),
      quantity: holdingData.quantity,
      avg_cost: holdingData.avg_cost,
      current_price: holdingData.current_price || holdingData.avg_cost,
      market_value: (holdingData.current_price || holdingData.avg_cost) * holdingData.quantity,
      unrealized_pnl: ((holdingData.current_price || holdingData.avg_cost) - holdingData.avg_cost) * holdingData.quantity
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        portfolio_id: portfolioId,
        ...holdingData
      },
      message: 'Holding added successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Update holding
router.put('/:portfolioId/holdings/:holdingId', (req, res, next) => {
  try {
    const { portfolioId, holdingId } = req.params;
    const updateData = req.body;
    
    const dbService = req.app.locals.dbService;
    
    const updateQuery = `
      UPDATE holdings SET 
        symbol = @symbol,
        quantity = @quantity,
        avg_cost = @avg_cost,
        current_price = @current_price,
        market_value = @current_price * @quantity,
        unrealized_pnl = (@current_price - @avg_cost) * @quantity,
        last_updated = CURRENT_TIMESTAMP
      WHERE id = @id AND portfolio_id = @portfolio_id
    `;

    const result = dbService.run(updateQuery, {
      id: holdingId,
      portfolio_id: portfolioId,
      symbol: updateData.symbol?.toUpperCase(),
      quantity: updateData.quantity,
      avg_cost: updateData.avg_cost,
      current_price: updateData.current_price
    });

    if (result.changes === 0) {
      throw new NotFoundError(`Holding not found: ${holdingId}`);
    }

    res.json({
      success: true,
      message: 'Holding updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Delete holding
router.delete('/:portfolioId/holdings/:holdingId', (req, res, next) => {
  try {
    const { portfolioId, holdingId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const result = dbService.run(
      'DELETE FROM holdings WHERE id = ? AND portfolio_id = ?', 
      [holdingId, portfolioId]
    );

    if (result.changes === 0) {
      throw new NotFoundError(`Holding not found: ${holdingId}`);
    }

    res.json({
      success: true,
      message: 'Holding deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export default router;