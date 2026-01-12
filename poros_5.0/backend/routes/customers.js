import express from 'express';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

// Get all customers
router.get('/', (req, res, next) => {
  try {
    const dbService = req.app.locals.dbService;
    const customers = dbService.getCustomers();

    res.json({
      success: true,
      data: customers,
      count: customers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get customer by ID
router.get('/:customerId', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const customer = dbService.getCustomerById(customerId);
    
    if (!customer) {
      throw new NotFoundError(`Customer not found: ${customerId}`);
    }

    res.json({
      success: true,
      data: customer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Create new customer
router.post('/', (req, res, next) => {
  try {
    const customerData = req.body;
    
    // Validate required fields
    const requiredFields = ['customer_id', 'name', 'email'];
    const missingFields = requiredFields.filter(field => !customerData[field]);
    
    if (missingFields.length > 0) {
      throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Generate customer ID if not provided
    if (!customerData.customer_id) {
      customerData.customer_id = `CUST_${Date.now()}`;
    }

    const dbService = req.app.locals.dbService;
    const result = dbService.createCustomer(customerData);

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        customer_id: customerData.customer_id,
        ...customerData
      },
      message: 'Customer created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Update customer
router.put('/:customerId', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const updateData = req.body;
    
    const dbService = req.app.locals.dbService;
    const existingCustomer = dbService.getCustomerById(customerId);
    
    if (!existingCustomer) {
      throw new NotFoundError(`Customer not found: ${customerId}`);
    }

    // Use the new updateCustomer method
    dbService.updateCustomer(customerId, updateData);

    const updatedCustomer = dbService.getCustomerById(customerId);

    res.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Delete customer
router.delete('/:customerId', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const existingCustomer = dbService.getCustomerById(customerId);
    
    if (!existingCustomer) {
      throw new NotFoundError(`Customer not found: ${customerId}`);
    }

    // Delete associated data first (portfolios, transactions, advice)
    dbService.run('DELETE FROM transactions WHERE portfolio_id IN (SELECT id FROM portfolios WHERE customer_id = ?)', [customerId]);
    dbService.run('DELETE FROM holdings WHERE portfolio_id IN (SELECT id FROM portfolios WHERE customer_id = ?)', [customerId]);
    dbService.run('DELETE FROM portfolios WHERE customer_id = ?', [customerId]);
    dbService.run('DELETE FROM investment_advice WHERE customer_id = ?', [customerId]);
    
    // Delete customer
    dbService.run('DELETE FROM customers WHERE customer_id = ?', [customerId]);

    // Invalidate cache
    const cacheService = req.app.locals.cacheService;
    if (cacheService) {
      cacheService.invalidateCustomerCache(customerId);
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Get customer portfolio summary
router.get('/:customerId/portfolio-summary', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const customer = dbService.getCustomerById(customerId);
    if (!customer) {
      throw new NotFoundError(`Customer not found: ${customerId}`);
    }

    const portfolios = dbService.getPortfolios(customerId);
    
    const summary = {
      customer_id: customerId,
      total_portfolios: portfolios.length,
      total_value: portfolios.reduce((sum, p) => sum + (p.total_value || 0), 0),
      total_invested: portfolios.reduce((sum, p) => sum + (p.investment_amount || 0), 0),
      total_cash: portfolios.reduce((sum, p) => sum + (p.cash_balance || 0), 0),
      portfolios: portfolios
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

// Get customer investment advice
router.get('/:customerId/advice', (req, res, next) => {
  try {
    const { customerId } = req.params;
    const dbService = req.app.locals.dbService;
    
    const customer = dbService.getCustomerById(customerId);
    if (!customer) {
      throw new NotFoundError(`Customer not found: ${customerId}`);
    }

    const advice = dbService.getInvestmentAdvice(customerId);

    res.json({
      success: true,
      data: advice,
      count: advice.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Search customers
router.get('/search', (req, res, next) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.length < 1) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const dbService = req.app.locals.dbService;
    const customers = dbService.getCustomers();
    
    const filtered = customers.filter(customer => 
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.customer_id.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
      query,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

export default router;