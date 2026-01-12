import { DatabaseService } from '../services/database.js';
import { MarketDataService } from '../services/marketData.js';

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');
  
  const dbService = new DatabaseService();
  const marketDataService = new MarketDataService();
  
  try {
    await dbService.initialize();
    
    // Sample customers
    const customers = [
      {
        customer_id: 'CUST_001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        age: 35,
        income_range: '$100,000 - $150,000',
        risk_tolerance: 'moderate',
        investment_horizon: '10-15 years',
        investment_goals: 'Retirement planning, children education'
      },
      {
        customer_id: 'CUST_002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0102',
        age: 28,
        income_range: '$75,000 - $100,000',
        risk_tolerance: 'aggressive',
        investment_horizon: '20+ years',
        investment_goals: 'Long-term wealth building'
      },
      {
        customer_id: 'CUST_003',
        name: 'Michael Brown',
        email: 'michael.brown@email.com',
        phone: '+1-555-0103',
        age: 58,
        income_range: '$150,000 - $200,000',
        risk_tolerance: 'conservative',
        investment_horizon: '5-10 years',
        investment_goals: 'Retirement income, capital preservation'
      },
      {
        customer_id: 'CUST_004',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1-555-0104',
        age: 42,
        income_range: '$120,000 - $180,000',
        risk_tolerance: 'moderate',
        investment_horizon: '15-20 years',
        investment_goals: 'Retirement, house purchase'
      },
      {
        customer_id: 'CUST_005',
        name: 'Robert Wilson',
        email: 'robert.wilson@email.com',
        phone: '+1-555-0105',
        age: 31,
        income_range: '$90,000 - $120,000',
        risk_tolerance: 'moderate',
        investment_horizon: '10-15 years',
        investment_goals: 'Wealth accumulation, financial independence'
      }
    ];

    // Insert customers
    for (const customer of customers) {
      try {
        dbService.createCustomer(customer);
        console.log(`✅ Created customer: ${customer.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to create customer ${customer.name}:`, error.message);
      }
    }

    // Sample portfolios
    const portfolios = [
      {
        customer_id: 'CUST_001',
        portfolio_name: 'Growth Portfolio',
        total_value: 125000.00,
        cash_balance: 5000.00,
        investment_amount: 120000.00,
        risk_level: 'moderate'
      },
      {
        customer_id: 'CUST_001',
        portfolio_name: 'Conservative Portfolio',
        total_value: 75000.00,
        cash_balance: 3000.00,
        investment_amount: 72000.00,
        risk_level: 'conservative'
      },
      {
        customer_id: 'CUST_002',
        portfolio_name: 'Aggressive Growth',
        total_value: 95000.00,
        cash_balance: 2000.00,
        investment_amount: 93000.00,
        risk_level: 'high'
      },
      {
        customer_id: 'CUST_003',
        portfolio_name: 'Retirement Fund',
        total_value: 450000.00,
        cash_balance: 15000.00,
        investment_amount: 435000.00,
        risk_level: 'conservative'
      },
      {
        customer_id: 'CUST_004',
        portfolio_name: 'Balanced Portfolio',
        total_value: 180000.00,
        cash_balance: 8000.00,
        investment_amount: 172000.00,
        risk_level: 'moderate'
      },
      {
        customer_id: 'CUST_005',
        portfolio_name: 'Investment Account',
        total_value: 85000.00,
        cash_balance: 3500.00,
        investment_amount: 81500.00,
        risk_level: 'moderate'
      }
    ];

    // Insert portfolios
    const portfolioIds = [];
    for (const portfolio of portfolios) {
      try {
        const result = dbService.run(`
          INSERT INTO portfolios (customer_id, portfolio_name, total_value, cash_balance, 
                                investment_amount, risk_level)
          VALUES (@customer_id, @portfolio_name, @total_value, @cash_balance, 
                  @investment_amount, @risk_level)
        `, portfolio);
        portfolioIds.push(result.lastInsertRowid);
        console.log(`✅ Created portfolio: ${portfolio.portfolio_name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to create portfolio ${portfolio.portfolio_name}:`, error.message);
        portfolioIds.push(null);
      }
    }

    // Sample holdings
    const holdings = [
      // Portfolio 1 holdings (Growth Portfolio - CUST_001)
      { portfolio_id: portfolioIds[0], symbol: 'AAPL', quantity: 100, avg_cost: 150.00 },
      { portfolio_id: portfolioIds[0], symbol: 'GOOGL', quantity: 50, avg_cost: 120.00 },
      { portfolio_id: portfolioIds[0], symbol: 'MSFT', quantity: 75, avg_cost: 250.00 },
      { portfolio_id: portfolioIds[0], symbol: 'SPY', quantity: 200, avg_cost: 400.00 },
      
      // Portfolio 2 holdings (Conservative Portfolio - CUST_001)
      { portfolio_id: portfolioIds[1], symbol: 'VTI', quantity: 150, avg_cost: 200.00 },
      { portfolio_id: portfolioIds[1], symbol: 'AGG', quantity: 300, avg_cost: 100.00 },
      { portfolio_id: portfolioIds[1], symbol: 'GLD', quantity: 50, avg_cost: 180.00 },
      
      // Portfolio 3 holdings (Aggressive Growth - CUST_002)
      { portfolio_id: portfolioIds[2], symbol: 'TSLA', quantity: 100, avg_cost: 200.00 },
      { portfolio_id: portfolioIds[2], symbol: 'QQQ', quantity: 200, avg_cost: 350.00 },
      { portfolio_id: portfolioIds[2], symbol: 'NVDA', quantity: 50, avg_cost: 400.00 },
      
      // Portfolio 4 holdings (Retirement Fund - CUST_003)
      { portfolio_id: portfolioIds[3], symbol: 'VTI', quantity: 800, avg_cost: 180.00 },
      { portfolio_id: portfolioIds[3], symbol: 'AGG', quantity: 1200, avg_cost: 95.00 },
      { portfolio_id: portfolioIds[3], symbol: 'VEA', quantity: 600, avg_cost: 45.00 },
      
      // Portfolio 5 holdings (Balanced Portfolio - CUST_004)
      { portfolio_id: portfolioIds[4], symbol: 'AAPL', quantity: 200, avg_cost: 140.00 },
      { portfolio_id: portfolioIds[4], symbol: 'SPY', quantity: 300, avg_cost: 380.00 },
      { portfolio_id: portfolioIds[4], symbol: 'VWO', quantity: 400, avg_cost: 42.00 },
      
      // Portfolio 6 holdings (Investment Account - CUST_005)
      { portfolio_id: portfolioIds[5], symbol: 'QQQ', quantity: 100, avg_cost: 320.00 },
      { portfolio_id: portfolioIds[5], symbol: 'VTI', quantity: 200, avg_cost: 190.00 }
    ];

    // Insert holdings and update market data
    for (const holding of holdings) {
      try {
        if (holding.portfolio_id) {
          // Insert holding
          dbService.run(`
            INSERT INTO holdings (portfolio_id, symbol, quantity, avg_cost, current_price, market_value, unrealized_pnl)
            VALUES (@portfolio_id, @symbol, @quantity, @avg_cost, @avg_cost, @avg_cost * @quantity, 0)
          `, holding);

          // Update market data
          const marketData = marketDataService.getMockData(holding.symbol);
          dbService.updateMarketData(holding.symbol, {
            name: marketData.name,
            price: marketData.price,
            change_amount: marketData.change,
            change_percent: marketData.changePercent,
            volume: marketData.volume,
            market_cap: marketData.marketCap
          });

          console.log(`✅ Added holding: ${holding.symbol} to portfolio ${holding.portfolio_id}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to add holding ${holding.symbol}:`, error.message);
      }
    }

    // Sample investment advice
    const advice = [
      {
        customer_id: 'CUST_001',
        advice_type: 'rebalancing',
        title: 'Portfolio Rebalancing Recommended',
        description: 'Your portfolio has drifted from target allocation. Consider rebalancing to maintain risk profile.',
        recommended_actions: 'Sell 5% of AAPL and buy VTI to restore target allocation',
        risk_level: 'moderate',
        expected_return: 0.06,
        priority: 2
      },
      {
        customer_id: 'CUST_002',
        advice_type: 'growth',
        title: 'Tax-Loss Harvesting Opportunity',
        description: 'Consider harvesting tax losses to offset capital gains from growth positions.',
        recommended_actions: 'Review positions with unrealized losses for tax-loss harvesting opportunities',
        risk_level: 'low',
        expected_return: 0.02,
        priority: 1
      },
      {
        customer_id: 'CUST_003',
        advice_type: 'retirement',
        title: 'Retirement Income Planning',
        description: 'With retirement approaching, focus on income-generating investments.',
        recommended_actions: 'Increase allocation to dividend-paying stocks and reduce growth positions',
        risk_level: 'conservative',
        expected_return: 0.04,
        priority: 3
      },
      {
        customer_id: 'CUST_004',
        advice_type: 'diversification',
        title: 'International Diversification',
        description: 'Consider adding international exposure to improve diversification.',
        recommended_actions: 'Allocate 20% to international developed and emerging markets',
        risk_level: 'moderate',
        expected_return: 0.07,
        priority: 2
      },
      {
        customer_id: 'CUST_005',
        advice_type: 'long_term',
        title: 'Dollar-Cost Averaging Strategy',
        description: 'Consider implementing a systematic investment plan for long-term wealth building.',
        recommended_actions: 'Set up automatic monthly investments of $1,000 into diversified ETFs',
        risk_level: 'moderate',
        expected_return: 0.07,
        priority: 1
      }
    ];

    // Insert investment advice
    for (const adviceItem of advice) {
      try {
        dbService.createAdvice(adviceItem);
        console.log(`✅ Created advice: ${adviceItem.title}`);
      } catch (error) {
        console.warn(`⚠️ Failed to create advice ${adviceItem.title}:`, error.message);
      }
    }

    // Sample transactions
    const transactions = [
      {
        portfolio_id: portfolioIds[0],
        symbol: 'AAPL',
        transaction_type: 'buy',
        quantity: 100,
        price: 150.00,
        amount: 15000.00,
        fees: 9.95,
        notes: 'Initial position building'
      },
      {
        portfolio_id: portfolioIds[0],
        symbol: 'SPY',
        transaction_type: 'buy',
        quantity: 200,
        price: 400.00,
        amount: 80000.00,
        fees: 9.95,
        notes: 'Core equity position'
      },
      {
        portfolio_id: portfolioIds[2],
        symbol: 'TSLA',
        transaction_type: 'buy',
        quantity: 100,
        price: 200.00,
        amount: 20000.00,
        fees: 9.95,
        notes: 'Growth position'
      }
    ];

    // Insert transactions
    for (const transaction of transactions) {
      try {
        if (transaction.portfolio_id) {
          dbService.run(`
            INSERT INTO transactions (portfolio_id, symbol, transaction_type, quantity, price, amount, fees, notes)
            VALUES (@portfolio_id, @symbol, @transaction_type, @quantity, @price, @amount, @fees, @notes)
          `, transaction);
          console.log(`✅ Added transaction: ${transaction.symbol} ${transaction.transaction_type}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to add transaction:`, error.message);
      }
    }

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Created ${customers.length} customers`);
    console.log(`💼 Created ${portfolios.length} portfolios`);
    console.log(`📈 Added ${holdings.length} holdings`);
    console.log(`💡 Created ${advice.length} investment advice items`);
    console.log(`💳 Added ${transactions.length} transactions`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    dbService.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}