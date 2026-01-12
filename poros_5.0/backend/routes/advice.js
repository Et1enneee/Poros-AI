import express from 'express';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const router = express.Router();

// Spark AI Investment Advice Generation (v4.10 - Complete Fix Version)
router.post('/spark-advice', async (req, res, next) => {
  try {
    const { customer_id, user_selections } = req.body;
    
    console.log('📋 收到AI建议生成请求:', { customer_id, user_selections });
    
    if (!customer_id) {
      throw new ValidationError('客户ID是必需的');
    }

    const dbService = req.app.locals.dbService;
    const sparkService = req.app.locals.sparkService;
    
    if (!sparkService) {
      throw new ValidationError('讯飞星火服务不可用');
    }

    // 4.5版本：使用详细客户信息查询（包含所有相关数据）
    let customer = null;
    
    try {
      // 使用新的详细客户信息查询方法
      customer = dbService.getDetailedCustomerInfo(customer_id);
      
      // 如果详细查询失败，尝试基础查询作为备用
      if (!customer) {
        console.log(`⚠️ 详细查询失败 ${customer_id}，尝试基础查询...`);
        
        // 首先尝试作为数字ID查询
        customer = dbService.getCustomerById(customer_id);
        
        // 如果找不到，尝试作为文本ID查询
        if (!customer) {
          customer = dbService.getCustomerByCustomerId(customer_id);
        }
        
        // 如果还是找不到，尝试模糊查询
        if (!customer) {
          customer = dbService.getCustomerByName(customer_id);
        }
        
        // 如果找到基础客户信息，转换为详细格式
        if (customer) {
          const detailedCustomer = dbService.getDetailedCustomerInfo(customer.id);
          customer = detailedCustomer || customer;
        }
      }
      
    } catch (dbError) {
      console.error('❌ 数据库查询错误:', dbError.message);
      // 如果数据库查询失败，使用模拟数据进行演示
      console.log('🔄 使用模拟客户数据进行演示...');
      customer = getMockCustomer(customer_id);
    }

    // 如果仍然找不到客户，返回友好的错误信息
    if (!customer) {
      const availableCustomers = dbService.getAllCustomers().map(c => `${c.name} (${c.customer_id})`);
      throw new NotFoundError(`客户不存在: ${customer_id}. 可用客户: ${availableCustomers.join(', ')}`);
    }

    console.log(`✅ 找到客户: ${customer.name} (ID: ${customer.customer_id || customer.id})`);
    
    // 构建完整的客户信息（4.7版本：包含所有详细信息）
    const customerInfo = {
      // 基本信息
      name: customer.name || 'Unknown Client',
      age: customer.age || 35,
      riskLevel: customer.risk_level || customer.riskLevel || 'Moderate',
      totalAssets: customer.total_assets || customer.totalAssets || 1000000,
      investmentExperience: customer.investment_experience || customer.investmentExperience || 5,
      liquidityNeeds: customer.liquidity_needs || customer.liquidityNeeds || 'Medium-term',
      financialGoals: customer.financial_goals ? 
        (typeof customer.financial_goals === 'string' ? 
          customer.financial_goals.split(',').map(g => g.trim()) : 
          customer.financial_goals
        ) : ['Asset Growth', 'Investment Growth'],
      
      // 行业信息 (4.7版本新增)
      industryCategory: customer.industry_category || 'Professional Services',
      industrySubcategory: customer.industry_subcategory || 'General',
      industryYearsExperience: customer.industry_years_experience || 0,
      industryCompanySize: customer.industry_company_size || 'Medium',
      industryRole: customer.industry_role || 'Employee',
      
      // 收入情况 (4.7版本新增)
      annualSalary: customer.annual_salary || 0,
      bonusPercentage: customer.bonus_percentage || 0,
      investmentIncome: customer.investment_income || 0,
      totalAnnualIncome: customer.total_annual_income || 0,
      incomeGrowthRate: customer.income_growth_rate || 0,
      expenseRatio: customer.expense_ratio || 0.7,
      
      // 详细投资信息
      portfolios: customer.portfolios || [],
      investmentPlans: customer.investmentPlans || [],
      communicationPlans: customer.communicationPlans || [],
      communicationRecords: customer.communicationRecords || [],
      
      // 统计数据
      totalPortfolios: customer.totalPortfolios || 0,
      totalInvestmentPlans: customer.totalInvestmentPlans || 0,
      lastCommunicationDate: customer.lastCommunicationDate || null,
      
      // 客户标识
      customerId: customer.customer_id || customer.id,
      internalId: customer.id,
      
      // 性格和偏好 (4.7版本增强)
      taxConsiderations: customer.tax_considerations || 'Standard',
      tags: customer.tags || '',
      status: customer.status || 'Active'
    };

    console.log(`📊 客户详细信息已准备完成，包含：`);
    console.log(`   - 基本信息: ${customerInfo.name}, ${customerInfo.age}岁, ${customerInfo.industryRole}`);
    console.log(`   - 行业背景: ${customerInfo.industryCategory} (${customerInfo.industryYearsExperience}年经验)`);
    console.log(`   - 收入情况: 年收入HKD ${customerInfo.totalAnnualIncome.toLocaleString()}`);
    console.log(`   - 投资组合: ${customerInfo.portfolios.length} 个投资组合，${customerInfo.investmentPlans.length} 个投资计划`);

    console.log('🤖 Using Spark AI to generate investment advice (v4.10)...');
    
    // 使用讯飞星火生成投资建议
    const sparkAdvice = await sparkService.generateInvestmentAdvice(
      customerInfo, 
      user_selections || {}
    );

    // 返回成功响应
    res.json({
      success: true,
      advice: sparkAdvice.advice,
      riskLevel: sparkAdvice.riskLevel,
      expectedReturn: sparkAdvice.expectedReturn,
      model: sparkAdvice.model,
      customer: customerInfo,
      timestamp: new Date().toISOString(),
      version: '4.10'
    });

  } catch (error) {
    console.error('❌ 讯飞星火投资建议生成失败:', error.message);
    
    // 返回友好的错误响应
    res.status(error instanceof NotFoundError ? 404 : 
               error instanceof ValidationError ? 400 : 500).json({
      success: false,
      error: error.name || 'InternalServerError',
      message: error.message,
      version: '4.10'
    });
  }
});

// 获取系统状态信息
router.get('/status', (req, res) => {
  const sparkService = req.app.locals.sparkService;
  const dbService = req.app.locals.dbService;
  
  const sparkStatus = sparkService ? {
    spark_ai_service: 'available',
    model: '讯飞星火大模型',
    version: '4.10',
    configured: !!(sparkService.APPID && sparkService.APIKey && sparkService.APISecret)
  } : {
    spark_ai_service: 'unavailable'
  };

  const dbStatus = dbService ? {
    database: 'connected',
    version: '4.10'
  } : {
    database: 'unavailable'
  };

  res.json({
    success: true,
    status: {
      backend: 'Poros 4.10 - Complete Database & Communication Fix Version',
      spark_ai: sparkStatus,
      database: dbStatus,
      timestamp: new Date().toISOString()
    }
  });
});

// 获取可用客户列表
router.get('/customers', (req, res) => {
  try {
    const dbService = req.app.locals.dbService;
    
    if (!dbService) {
      // 返回模拟客户数据
      return res.json({
        success: true,
        customers: getMockCustomers(),
        source: 'mock'
      });
    }

    const customers = dbService.getAllCustomers();
    res.json({
      success: true,
      customers: customers,
      source: 'database'
    });
    
  } catch (error) {
    console.error('❌ 获取客户列表失败:', error.message);
    
    // 如果数据库查询失败，返回模拟数据
    res.json({
      success: true,
      customers: getMockCustomers(),
      source: 'mock_fallback'
    });
  }
});

// 辅助函数：获取模拟客户
function getMockCustomer(customerId) {
  const mockCustomers = getMockCustomers();
  return mockCustomers.find(c => c.id === customerId || c.customer_id === customerId);
}

// 辅助函数：获取可用客户列表
function getAvailableCustomers() {
  const mockCustomers = getMockCustomers();
  return mockCustomers.map(c => `${c.name} (ID: ${c.id})`);
}

// 辅助函数：获取模拟客户数据
function getMockCustomers() {
  return [
    {
      id: '1',
      customer_id: '1',
      name: 'Michael Zhang',
      age: 35,
      risk_level: 'Growth',
      total_assets: 2800000,
      investment_experience: 8,
      liquidity_needs: 'Medium-term',
      financial_goals: ['Children Education Fund', 'Retirement Planning']
    },
    {
      id: '2',
      customer_id: '2', 
      name: 'Linda Lee',
      age: 42,
      risk_level: 'Moderate',
      total_assets: 1500000,
      investment_experience: 15,
      liquidity_needs: 'Long-term',
      financial_goals: ['Retirement Security', 'Wealth Preservation']
    },
    {
      id: '3',
      customer_id: '3',
      name: 'David Wang', 
      age: 28,
      risk_level: 'Aggressive',
      total_assets: 800000,
      investment_experience: 3,
      liquidity_needs: 'Short-term',
      financial_goals: ['Wealth Accumulation', 'Property Investment']
    }
  ];
}

export default router;