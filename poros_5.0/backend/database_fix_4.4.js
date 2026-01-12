import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseFixer {
  constructor() {
    this.dbPath = path.join(__dirname, '../database/poros.db');
  }

  async fixDatabase() {
    console.log('🔧 开始修复Poros 4.4数据库问题...\n');
    
    const db = new Database(this.dbPath);
    
    try {
      // 1. 修复communication_plans表缺少objectives列的问题
      await this.fixCommunicationPlansTable(db);
      
      // 2. 确保客户数据存在并且ID格式正确
      await this.ensureCustomerData(db);
      
      // 3. 清理并重新插入测试数据
      await this.rebuildTestData(db);
      
      console.log('✅ 数据库修复完成！\n');
      
    } catch (error) {
      console.error('❌ 数据库修复失败:', error.message);
      throw error;
    } finally {
      db.close();
    }
  }

  async fixCommunicationPlansTable(db) {
    console.log('📋 修复 communication_plans 表结构...');
    
    try {
      // 检查表是否存在
      const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='communication_plans'").get();
      
      if (tableExists) {
        // 检查是否已有objectives列
        const columnExists = db.prepare("PRAGMA table_info(communication_plans)").all()
          .some(col => col.name === 'objectives');
        
        if (!columnExists) {
          // 添加objectives列
          db.prepare("ALTER TABLE communication_plans ADD COLUMN objectives TEXT").run();
          console.log('✅ 已添加 objectives 列到 communication_plans 表');
        } else {
          console.log('✅ communication_plans 表结构正确');
        }
      } else {
        console.log('⚠️ communication_plans 表不存在，跳过修复');
      }
    } catch (error) {
      console.error('❌ 修复 communication_plans 表失败:', error.message);
    }
  }

  async ensureCustomerData(db) {
    console.log('👥 检查客户数据...');
    
    try {
      // 检查是否有客户数据
      const customerCount = db.prepare("SELECT COUNT(*) as count FROM customers").get();
      console.log(`📊 当前数据库中有 ${customerCount.count} 个客户`);
      
      if (customerCount.count === 0) {
        console.log('⚠️ 数据库中没有客户数据，将创建测试数据');
        await this.createSampleCustomers(db);
      } else {
        console.log('✅ 客户数据已存在');
        
        // 检查客户ID格式
        const sampleCustomers = db.prepare("SELECT customer_id, name FROM customers LIMIT 5").all();
        console.log('📋 前5个客户信息:');
        sampleCustomers.forEach(customer => {
          console.log(`   - ${customer.name}: ${customer.customer_id}`);
        });
      }
    } catch (error) {
      console.error('❌ 检查客户数据失败:', error.message);
    }
  }

  async createSampleCustomers(db) {
    console.log('🌱 创建测试客户数据...');
    
    const customers = [
      {
        customer_id: '1',
        name: 'Michael Zhang',
        email: 'michael.zhang@email.com',
        phone: '+852 9000****',
        age: 35,
        gender: 'Male',
        address: 'Central, Hong Kong',
        total_assets: 2800000,
        risk_level: 'Growth',
        investment_goal: 'Children Education + Retirement Planning',
        last_contact: '2025-12-10',
        status: 'Active',
        tags: 'VIP Client,High Net Worth,Education Planning',
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
        liquidity_needs: 'Medium-term',
        investment_experience: 8,
        financial_goals: 'Children Education Fund,Retirement Planning,Property Purchase,Business Investment',
        tax_considerations: 'Tax-efficient Investment,MPF Optimization,Insurance Tax Benefits'
      },
      {
        customer_id: '2',
        name: 'Linda Lee',
        email: 'linda.lee@email.com',
        phone: '+852 9001****',
        age: 42,
        gender: 'Female',
        address: 'Causeway Bay, Hong Kong',
        total_assets: 1500000,
        risk_level: 'Moderate',
        investment_goal: 'Asset Preservation & Growth',
        last_contact: '2025-12-09',
        status: 'Active',
        tags: 'Conservative Investment,Poros Expert',
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
        liquidity_needs: 'Long-term',
        investment_experience: 15,
        financial_goals: 'Retirement Security,Wealth Preservation,Healthcare Planning,Charitable Giving',
        tax_considerations: 'Capital Gains Planning,Offshore Investment,Trust Structure'
      },
      {
        customer_id: '3',
        name: 'David Wang',
        email: 'david.wang@email.com',
        phone: '+852 9002****',
        age: 28,
        gender: 'Male',
        address: 'Tsim Sha Tsui, Hong Kong',
        total_assets: 800000,
        risk_level: 'Aggressive',
        investment_goal: 'Rapid Wealth Growth',
        last_contact: '2025-12-08',
        status: 'Pending',
        tags: 'Young Client,Aggressive Investment',
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
        liquidity_needs: 'Short-term',
        investment_experience: 3,
        financial_goals: 'Wealth Accumulation,Property Investment,Business Startup,Early Retirement',
        tax_considerations: 'Tax Loss Harvesting,Salary Sacrifice Schemes'
      }
    ];

    const insertCustomer = db.prepare(`
      INSERT INTO customers (
        customer_id, name, email, phone, age, gender, address, total_assets,
        risk_level, investment_goal, last_contact, status, tags,
        industry_category, industry_subcategory, industry_years_experience,
        industry_company_size, industry_role, annual_salary, bonus_percentage,
        investment_income, total_annual_income, income_growth_rate, expense_ratio,
        liquidity_needs, investment_experience, financial_goals, tax_considerations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    customers.forEach(customer => {
      try {
        insertCustomer.run(
          customer.customer_id, customer.name, customer.email, customer.phone,
          customer.age, customer.gender, customer.address, customer.total_assets,
          customer.risk_level, customer.investment_goal, customer.last_contact,
          customer.status, customer.tags, customer.industry_category,
          customer.industry_subcategory, customer.industry_years_experience,
          customer.industry_company_size, customer.industry_role, customer.annual_salary,
          customer.bonus_percentage, customer.investment_income, customer.total_annual_income,
          customer.income_growth_rate, customer.expense_ratio, customer.liquidity_needs,
          customer.investment_experience, customer.financial_goals, customer.tax_considerations
        );
        console.log(`✅ 已创建客户: ${customer.name} (ID: ${customer.customer_id})`);
      } catch (error) {
        console.error(`❌ 创建客户 ${customer.name} 失败:`, error.message);
      }
    });
  }

  async rebuildTestData(db) {
    console.log('🔄 重建测试数据...');
    
    try {
      // 清空相关表
      db.prepare("DELETE FROM communication_plans").run();
      db.prepare("DELETE FROM communication_records").run();
      db.prepare("DELETE FROM investment_plans").run();
      
      console.log('✅ 已清空测试数据');
    } catch (error) {
      console.error('❌ 清空测试数据失败:', error.message);
    }
  }
}

// 运行修复
const fixer = new DatabaseFixer();
fixer.fixDatabase()
  .then(() => {
    console.log('🎉 数据库修复成功完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 数据库修复失败:', error);
    process.exit(1);
  });