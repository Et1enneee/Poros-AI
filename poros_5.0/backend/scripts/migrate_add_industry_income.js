import { DatabaseService } from '../services/database.js';

async function migrateIndustryIncome() {
  console.log('🔄 Starting migration: Add industry and income fields to customers table');
  
  const dbService = new DatabaseService();
  
  try {
    await dbService.initialize();
    
    // Check if columns already exist
    const columnsExist = dbService.query(`
      SELECT name FROM pragma_table_info('customers') 
      WHERE name IN ('industry_category', 'industry_subcategory', 'industry_years_experience', 
                     'industry_company_size', 'industry_role', 'annual_salary', 'bonus_percentage',
                     'investment_income', 'total_annual_income', 'income_growth_rate', 'expense_ratio',
                     'financial_goals', 'investment_experience', 'liquidity_needs', 'tax_considerations')
    `);
    
    const existingColumns = columnsExist.map(col => col.name);
    console.log('📋 Existing columns:', existingColumns);
    
    // Define new columns to add
    const columnsToAdd = [
      { name: 'industry_category', type: 'TEXT' },
      { name: 'industry_subcategory', type: 'TEXT' },
      { name: 'industry_years_experience', type: 'INTEGER' },
      { name: 'industry_company_size', type: 'TEXT' },
      { name: 'industry_role', type: 'TEXT' },
      { name: 'annual_salary', type: 'DECIMAL(15,2)' },
      { name: 'bonus_percentage', type: 'DECIMAL(5,2)' },
      { name: 'investment_income', type: 'DECIMAL(15,2)' },
      { name: 'total_annual_income', type: 'DECIMAL(15,2)' },
      { name: 'income_growth_rate', type: 'DECIMAL(5,2)' },
      { name: 'expense_ratio', type: 'DECIMAL(5,4)' },
      { name: 'financial_goals', type: 'TEXT' }, // JSON array as text
      { name: 'investment_experience', type: 'INTEGER' },
      { name: 'liquidity_needs', type: 'TEXT' },
      { name: 'tax_considerations', type: 'TEXT' } // JSON array as text
    ];
    
    // Add columns that don't exist
    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        try {
          const sql = `ALTER TABLE customers ADD COLUMN ${column.name} ${column.type}`;
          dbService.run(sql);
          console.log(`✅ Added column: ${column.name} (${column.type})`);
        } catch (error) {
          console.error(`❌ Failed to add column ${column.name}:`, error.message);
        }
      } else {
        console.log(`⏭️ Column ${column.name} already exists, skipping`);
      }
    }
    
    // Update existing customers with default data if no industry/income data exists
    console.log('🔄 Updating existing customers with default industry/income data...');
    
    const existingCustomers = dbService.query(`
      SELECT customer_id, name FROM customers 
      WHERE industry_category IS NULL OR total_annual_income IS NULL
    `);
    
    const defaultIndustryData = {
      '张三': {
        industry_category: 'Technology',
        industry_subcategory: 'Software Development',
        industry_years_experience: 12,
        industry_company_size: 'Large',
        industry_role: 'Senior Software Engineer',
        annual_salary: 850000,
        bonus_percentage: 25,
        investment_income: 120000,
        total_annual_income: 1182500,
        income_growth_rate: 8,
        expense_ratio: 0.6,
        financial_goals: JSON.stringify(['Children Education Fund', 'Retirement Planning', 'Property Purchase', 'Business Investment']),
        investment_experience: 8,
        liquidity_needs: 'Medium-term',
        tax_considerations: JSON.stringify(['Tax-efficient Investment', 'MPF Optimization', 'Insurance Tax Benefits'])
      },
      '李美华': {
        industry_category: 'Finance',
        industry_subcategory: 'Investment Banking',
        industry_years_experience: 18,
        industry_company_size: 'Enterprise',
        industry_role: 'Senior Portfolio Manager',
        annual_salary: 950000,
        bonus_percentage: 40,
        investment_income: 85000,
        total_annual_income: 1405000,
        income_growth_rate: 6,
        expense_ratio: 0.5,
        financial_goals: JSON.stringify(['Retirement Security', 'Wealth Preservation', 'Healthcare Planning', 'Charitable Giving']),
        investment_experience: 15,
        liquidity_needs: 'Long-term',
        tax_considerations: JSON.stringify(['Capital Gains Planning', 'Offshore Investment', 'Trust Structure'])
      },
      '王志强': {
        industry_category: 'Consulting',
        industry_subcategory: 'Management Consulting',
        industry_years_experience: 5,
        industry_company_size: 'Medium',
        industry_role: 'Business Analyst',
        annual_salary: 480000,
        bonus_percentage: 15,
        investment_income: 25000,
        total_annual_income: 577000,
        income_growth_rate: 12,
        expense_ratio: 0.75,
        financial_goals: JSON.stringify(['Wealth Accumulation', 'Property Investment', 'Business Startup', 'Early Retirement']),
        investment_experience: 3,
        liquidity_needs: 'Short-term',
        tax_considerations: JSON.stringify(['Tax Loss Harvesting', 'Salary Sacrifice Schemes'])
      },
      '陈雪梅': {
        industry_category: 'Healthcare',
        industry_subcategory: 'Medical Practice',
        industry_years_experience: 25,
        industry_company_size: 'Enterprise',
        industry_role: 'Chief Medical Officer',
        annual_salary: 1200000,
        bonus_percentage: 20,
        investment_income: 180000,
        total_annual_income: 1620000,
        income_growth_rate: 4,
        expense_ratio: 0.45,
        financial_goals: JSON.stringify(['Retirement Planning', 'Healthcare Security', 'Estate Planning', 'Legacy Building']),
        investment_experience: 20,
        liquidity_needs: 'Long-term',
        tax_considerations: JSON.stringify(['Retirement Planning', 'Medical Expense Deductions', 'Estate Tax Planning'])
      },
      '刘建华': {
        industry_category: 'Manufacturing',
        industry_subcategory: 'Electronics Manufacturing',
        industry_years_experience: 22,
        industry_company_size: 'Medium',
        industry_role: 'Managing Director',
        annual_salary: 750000,
        bonus_percentage: 30,
        investment_income: 95000,
        total_annual_income: 1070000,
        income_growth_rate: 7,
        expense_ratio: 0.55,
        financial_goals: JSON.stringify(['Business Expansion', 'Property Investment', 'Children Education', 'Retirement Planning']),
        investment_experience: 12,
        liquidity_needs: 'Medium-term',
        tax_considerations: JSON.stringify(['Business Tax Planning', 'Corporate Structure', 'Dividend Optimization'])
      }
    };
    
    for (const customer of existingCustomers) {
      const defaultData = defaultIndustryData[customer.name];
      if (defaultData) {
        try {
          const updateFields = Object.keys(defaultData).map(key => `${key} = @${key}`).join(', ');
          const sql = `
            UPDATE customers 
            SET ${updateFields}
            WHERE customer_id = @customer_id
          `;
          
          dbService.run(sql, { ...defaultData, customer_id: customer.customer_id });
          console.log(`✅ Updated customer: ${customer.name}`);
        } catch (error) {
          console.error(`❌ Failed to update customer ${customer.name}:`, error.message);
        }
      }
    }
    
    console.log('✅ Migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    dbService.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateIndustryIncome();
}