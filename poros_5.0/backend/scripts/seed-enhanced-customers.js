import { DatabaseService } from '../services/database.js';

async function seedEnhancedCustomers() {
  console.log('🌱 Seeding database with enhanced customer data (industry & income)...');
  
  const dbService = new DatabaseService();
  
  try {
    await dbService.initialize();
    
    // Enhanced customer data with industry and income information
    const enhancedCustomers = [
      {
        customer_id: 'CUST_001',
        name: '张三',
        email: 'zhangsan@email.com',
        phone: '+852 9000****',
        age: 35,
        gender: 'Male',
        address: 'Central, Hong Kong',
        total_assets: 2800000,
        risk_level: 'Growth',
        investment_goal: 'Children Education + Retirement Planning',
        last_contact: '2025-12-10',
        status: 'Active',
        tags: JSON.stringify(['VIP Client', 'High Net Worth', 'Education Planning']),
        // Industry information
        industry_category: 'Technology',
        industry_subcategory: 'Software Development',
        industry_years_experience: 12,
        industry_company_size: 'Large',
        industry_role: 'Senior Software Engineer',
        // Income information
        annual_salary: 850000,
        bonus_percentage: 25,
        investment_income: 120000,
        total_annual_income: 1182500,
        income_growth_rate: 8,
        expense_ratio: 0.6,
        // Other fields
        financial_goals: JSON.stringify(['Children Education Fund', 'Retirement Planning', 'Property Purchase', 'Business Investment']),
        investment_experience: 8,
        liquidity_needs: 'Medium-term',
        tax_considerations: JSON.stringify(['Tax-efficient Investment', 'MPF Optimization', 'Insurance Tax Benefits'])
      },
      {
        customer_id: 'CUST_002',
        name: '李美华',
        email: 'limeihua@email.com',
        phone: '+852 9001****',
        age: 42,
        gender: 'Female',
        address: 'Causeway Bay, Hong Kong',
        total_assets: 1500000,
        risk_level: 'Moderate',
        investment_goal: 'Asset Preservation & Growth',
        last_contact: '2025-12-09',
        status: 'Active',
        tags: JSON.stringify(['Conservative Investment', 'Poros Expert']),
        // Industry information
        industry_category: 'Finance',
        industry_subcategory: 'Investment Banking',
        industry_years_experience: 18,
        industry_company_size: 'Enterprise',
        industry_role: 'Senior Portfolio Manager',
        // Income information
        annual_salary: 950000,
        bonus_percentage: 40,
        investment_income: 85000,
        total_annual_income: 1405000,
        income_growth_rate: 6,
        expense_ratio: 0.5,
        // Other fields
        financial_goals: JSON.stringify(['Retirement Security', 'Wealth Preservation', 'Healthcare Planning', 'Charitable Giving']),
        investment_experience: 15,
        liquidity_needs: 'Long-term',
        tax_considerations: JSON.stringify(['Capital Gains Planning', 'Offshore Investment', 'Trust Structure'])
      },
      {
        customer_id: 'CUST_003',
        name: '王志强',
        email: 'wangzhiqiang@email.com',
        phone: '+852 9002****',
        age: 28,
        gender: 'Male',
        address: 'Tsim Sha Tsui, Hong Kong',
        total_assets: 800000,
        risk_level: 'Aggressive',
        investment_goal: 'Rapid Wealth Growth',
        last_contact: '2025-12-08',
        status: 'Pending',
        tags: JSON.stringify(['Young Client', 'Aggressive Investment']),
        // Industry information
        industry_category: 'Consulting',
        industry_subcategory: 'Management Consulting',
        industry_years_experience: 5,
        industry_company_size: 'Medium',
        industry_role: 'Business Analyst',
        // Income information
        annual_salary: 480000,
        bonus_percentage: 15,
        investment_income: 25000,
        total_annual_income: 577000,
        income_growth_rate: 12,
        expense_ratio: 0.75,
        // Other fields
        financial_goals: JSON.stringify(['Wealth Accumulation', 'Property Investment', 'Business Startup', 'Early Retirement']),
        investment_experience: 3,
        liquidity_needs: 'Short-term',
        tax_considerations: JSON.stringify(['Tax Loss Harvesting', 'Salary Sacrifice Schemes'])
      },
      {
        customer_id: 'CUST_004',
        name: '陈雪梅',
        email: 'chenxuemei@email.com',
        phone: '+852 9003****',
        age: 55,
        gender: 'Female',
        address: 'Wan Chai, Hong Kong',
        total_assets: 3200000,
        risk_level: 'Conservative',
        investment_goal: 'Retirement Security',
        last_contact: '2025-12-07',
        status: 'Active',
        tags: JSON.stringify(['Retirement Planning', 'Low Risk Preference']),
        // Industry information
        industry_category: 'Healthcare',
        industry_subcategory: 'Medical Practice',
        industry_years_experience: 25,
        industry_company_size: 'Enterprise',
        industry_role: 'Chief Medical Officer',
        // Income information
        annual_salary: 1200000,
        bonus_percentage: 20,
        investment_income: 180000,
        total_annual_income: 1620000,
        income_growth_rate: 4,
        expense_ratio: 0.45,
        // Other fields
        financial_goals: JSON.stringify(['Retirement Planning', 'Healthcare Security', 'Estate Planning', 'Legacy Building']),
        investment_experience: 20,
        liquidity_needs: 'Long-term',
        tax_considerations: JSON.stringify(['Retirement Planning', 'Medical Expense Deductions', 'Estate Tax Planning'])
      },
      {
        customer_id: 'CUST_005',
        name: '刘建华',
        email: 'liujianhua@email.com',
        phone: '+852 9004****',
        age: 45,
        gender: 'Male',
        address: 'Admiralty, Hong Kong',
        total_assets: 2100000,
        risk_level: 'Balanced',
        investment_goal: 'Wealth Preservation',
        last_contact: '2025-12-06',
        status: 'Prospect',
        tags: JSON.stringify(['Business Owner', 'Tax Planning']),
        // Industry information
        industry_category: 'Manufacturing',
        industry_subcategory: 'Electronics Manufacturing',
        industry_years_experience: 22,
        industry_company_size: 'Medium',
        industry_role: 'Managing Director',
        // Income information
        annual_salary: 750000,
        bonus_percentage: 30,
        investment_income: 95000,
        total_annual_income: 1070000,
        income_growth_rate: 7,
        expense_ratio: 0.55,
        // Other fields
        financial_goals: JSON.stringify(['Business Expansion', 'Property Investment', 'Children Education', 'Retirement Planning']),
        investment_experience: 12,
        liquidity_needs: 'Medium-term',
        tax_considerations: JSON.stringify(['Business Tax Planning', 'Corporate Structure', 'Dividend Optimization'])
      },
      {
        customer_id: 'CUST_006',
        name: '赵雅婷',
        email: 'zhaoyating@email.com',
        phone: '+852 9005****',
        age: 31,
        gender: 'Female',
        address: 'Sheung Wan, Hong Kong',
        total_assets: 950000,
        risk_level: 'Balanced',
        investment_goal: 'Property Investment & Growth',
        last_contact: '2025-12-11',
        status: 'Active',
        tags: JSON.stringify(['Real Estate Focus', 'Property Investment']),
        // Industry information
        industry_category: 'Real Estate',
        industry_subcategory: 'Property Development',
        industry_years_experience: 8,
        industry_company_size: 'Large',
        industry_role: 'Project Manager',
        // Income information
        annual_salary: 650000,
        bonus_percentage: 18,
        investment_income: 45000,
        total_annual_income: 812000,
        income_growth_rate: 9,
        expense_ratio: 0.65,
        // Other fields
        financial_goals: JSON.stringify(['Property Portfolio', 'Rental Income', 'Retirement Planning', 'Business Investment']),
        investment_experience: 6,
        liquidity_needs: 'Medium-term',
        tax_considerations: JSON.stringify(['Property Tax Planning', 'Rental Income Optimization', 'Stamp Duty Strategies'])
      },
      {
        customer_id: 'CUST_007',
        name: '黄志强',
        email: 'huangzhiqiang@email.com',
        phone: '+852 9006****',
        age: 38,
        gender: 'Male',
        address: 'Quarry Bay, Hong Kong',
        total_assets: 1750000,
        risk_level: 'Growth',
        investment_goal: 'Business Expansion & Wealth Building',
        last_contact: '2025-12-10',
        status: 'Active',
        tags: JSON.stringify(['Business Owner', 'Entrepreneur', 'Growth Focus']),
        // Industry information
        industry_category: 'Retail',
        industry_subcategory: 'Fashion Retail',
        industry_years_experience: 15,
        industry_company_size: 'Small',
        industry_role: 'Founder & CEO',
        // Income information
        annual_salary: 580000,
        bonus_percentage: 35,
        investment_income: 75000,
        total_annual_income: 858000,
        income_growth_rate: 10,
        expense_ratio: 0.6,
        // Other fields
        financial_goals: JSON.stringify(['Business Expansion', 'Property Investment', 'Children Education', 'Early Retirement']),
        investment_experience: 10,
        liquidity_needs: 'Short-term',
        tax_considerations: JSON.stringify(['Business Structure', 'Dividend Planning', 'Capital Expenditure Tax Benefits'])
      },
      {
        customer_id: 'CUST_008',
        name: '林淑华',
        email: 'linshuhua@email.com',
        phone: '+852 9007****',
        age: 48,
        gender: 'Female',
        address: 'Mid-Levels, Hong Kong',
        total_assets: 2850000,
        risk_level: 'Moderate',
        investment_goal: 'Retirement & Legacy Planning',
        last_contact: '2025-12-09',
        status: 'Active',
        tags: JSON.stringify(['Legal Professional', 'Estate Planning', 'Conservative']),
        // Industry information
        industry_category: 'Legal Services',
        industry_subcategory: 'Corporate Law',
        industry_years_experience: 20,
        industry_company_size: 'Medium',
        industry_role: 'Senior Partner',
        // Income information
        annual_salary: 1100000,
        bonus_percentage: 25,
        investment_income: 135000,
        total_annual_income: 1510000,
        income_growth_rate: 5,
        expense_ratio: 0.5,
        // Other fields
        financial_goals: JSON.stringify(['Retirement Planning', 'Estate Planning', 'Legacy Building', 'Charitable Giving']),
        investment_experience: 18,
        liquidity_needs: 'Long-term',
        tax_considerations: JSON.stringify(['Estate Tax Planning', 'Trust Structures', 'Professional Tax Deductions'])
      },
      {
        customer_id: 'CUST_009',
        name: '周文杰',
        email: 'zhouwenjie@email.com',
        phone: '+852 9008****',
        age: 26,
        gender: 'Male',
        address: 'Kennedy Town, Hong Kong',
        total_assets: 450000,
        risk_level: 'Aggressive',
        investment_goal: 'Rapid Wealth Accumulation',
        last_contact: '2025-12-11',
        status: 'Prospect',
        tags: JSON.stringify(['Young Professional', 'Tech Startup', 'High Risk Tolerance']),
        // Industry information
        industry_category: 'Media & Entertainment',
        industry_subcategory: 'Digital Marketing',
        industry_years_experience: 4,
        industry_company_size: 'Startup',
        industry_role: 'Marketing Director',
        // Income information
        annual_salary: 420000,
        bonus_percentage: 20,
        investment_income: 15000,
        total_annual_income: 519000,
        income_growth_rate: 15,
        expense_ratio: 0.8,
        // Other fields
        financial_goals: JSON.stringify(['Wealth Accumulation', 'Startup Investment', 'Property Purchase', 'Early Retirement']),
        investment_experience: 2,
        liquidity_needs: 'Short-term',
        tax_considerations: JSON.stringify(['Startup Investment Tax Benefits', 'Capital Gains Planning', 'Tax-efficient Growth'])
      },
      {
        customer_id: 'CUST_010',
        name: '吴美玲',
        email: 'wumeiling@email.com',
        phone: '+852 9009****',
        age: 52,
        gender: 'Female',
        address: 'Repulse Bay, Hong Kong',
        total_assets: 4200000,
        risk_level: 'Conservative',
        investment_goal: 'Wealth Preservation & Income Generation',
        last_contact: '2025-12-08',
        status: 'Active',
        tags: JSON.stringify(['Ultra High Net Worth', 'Conservative Strategy', 'Income Focus']),
        // Industry information
        industry_category: 'Education',
        industry_subcategory: 'Higher Education',
        industry_years_experience: 28,
        industry_company_size: 'Enterprise',
        industry_role: 'University Professor',
        // Income information
        annual_salary: 980000,
        bonus_percentage: 12,
        investment_income: 220000,
        total_annual_income: 1317600,
        income_growth_rate: 3,
        expense_ratio: 0.4,
        // Other fields
        financial_goals: JSON.stringify(['Wealth Preservation', 'Steady Income', 'Charitable Giving', 'Academic Endowment']),
        investment_experience: 25,
        liquidity_needs: 'Long-term',
        tax_considerations: JSON.stringify(['Academic Tax Benefits', 'Charitable Deductions', 'Conservative Income Planning'])
      }
    ];

    // Clear existing customers first
    console.log('🧹 Clearing existing customer data...');
    dbService.run('DELETE FROM customers');
    
    // Insert enhanced customers
    for (const customer of enhancedCustomers) {
      try {
        dbService.createCustomer(customer);
        console.log(`✅ Created customer: ${customer.name} (${customer.customer_id})`);
      } catch (error) {
        console.error(`❌ Failed to create customer ${customer.name}:`, error.message);
      }
    }
    
    console.log('✅ Enhanced customer seeding completed successfully');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    dbService.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEnhancedCustomers();
}