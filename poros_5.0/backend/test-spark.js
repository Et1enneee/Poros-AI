import { SparkService } from './services/spark.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function testSparkAPI() {
    console.log('🧪 开始测试讯飞星火 API 配置...\n');
    
    const sparkService = new SparkService();
    
    // 测试数据
    const customerData = {
        customer_id: 'test_customer_1',
        customer_info: {
            name: '测试客户',
            age: 35,
            riskLevel: 'Growth',
            totalAssets: 1500000,
            investmentExperience: 5,
            liquidityNeeds: 'Medium-term',
            financialGoals: ['资产增值', '子女教育']
        },
        investment_goal: 'growth',
        investment_period: 'medium',
        risk_tolerance: 'moderate',
        market_conditions: ['bull_market'],
        additional_considerations: ['diversification']
    };

    try {
        console.log('📤 发送测试请求...');
        const result = await sparkService.generateInvestmentAdvice(
            customerData.customer_info,
            customerData
        );
        
        console.log('✅ API 测试成功！\n');
        console.log('🤖 模型类型:', result.model);
        console.log('📊 风险等级:', result.riskLevel);
        console.log('💰 预期收益:', result.expectedReturn + '%');
        console.log('\n📝 生成的建议:');
        console.log('=' * 50);
        console.log(result.advice);
        console.log('=' * 50);
        
        return true;
    } catch (error) {
        console.error('❌ API 测试失败:', error.message);
        return false;
    }
}

// 运行测试
testSparkAPI().then(success => {
    if (success) {
        console.log('\n🎉 讯飞星火 API 配置正确，可以正常使用！');
    } else {
        console.log('\n⚠️ 请检查 API 配置和密钥设置');
    }
});