import AIService from './AIService.js';

class InvestmentAdvisor {
    constructor() {
        this.aiService = new AIService();
        console.log('🎯 投资顾问服务已初始化 (基于DeepSeek AI)');
    }

    async generateInvestmentPlan(customerData, options = {}) {
        try {
            console.log(`🎯 开始为客户 ${customerData.name} 生成投资计划...`);

            // 获取AI生成的投资建议
            const aiAdvice = await this.aiService.generateInvestmentAdvice(customerData, 'investment_plan');
            
            // 基于客户数据生成个性化投资计划
            const investmentPlan = {
                customer_id: customerData.customer_id,
                plan_id: `PLAN_${Date.now()}`,
                customer_name: customerData.name,
                total_assets: customerData.total_assets || 0,
                risk_level: customerData.risk_level || 'Medium',
                investment_goal: customerData.investment_goal || '财富增值',
                generated_advice: aiAdvice,
                recommendations: this.generateRecommendations(customerData),
                risk_assessment: await this.generateRiskAssessment(customerData),
                action_plan: this.generateActionPlan(customerData),
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30天后过期
            };

            console.log(`✅ 投资计划生成成功`);
            return investmentPlan;

        } catch (error) {
            console.error('❌ 投资计划生成失败:', error.message);
            throw error;
        }
    }

    generateRecommendations(customerData) {
        const totalAssets = customerData.total_assets || 0;
        const riskLevel = customerData.risk_level || 'Medium';
        
        // 根据资产规模确定投资策略
        let strategy = '';
        if (totalAssets < 100000) {
            strategy = '保守型起步策略';
        } else if (totalAssets < 500000) {
            strategy = '稳健成长策略';
        } else if (totalAssets < 2000000) {
            strategy = '平衡配置策略';
        } else {
            strategy = '高净值定制策略';
        }

        // 根据风险等级确定资产配置
        let allocation = '';
        switch (riskLevel.toLowerCase()) {
            case 'conservative':
                allocation = '股票20% + 债券50% + 现金30%';
                break;
            case 'medium':
                allocation = '股票40% + 债券40% + 现金20%';
                break;
            case 'high':
                allocation = '股票60% + 债券30% + 现金10%';
                break;
            default:
                allocation = '股票40% + 债券40% + 现金20%';
        }

        return {
            investment_strategy: strategy,
            asset_allocation: allocation,
            recommended_products: this.getRecommendedProducts(riskLevel),
            investment_timeline: '1-3年长期投资',
            rebalancing_frequency: '每季度评估一次'
        };
    }

    async generateRiskAssessment(customerData) {
        const aiRiskAssessment = await this.aiService.generateRiskAssessment(customerData);
        
        return {
            risk_level: customerData.risk_level || 'Medium',
            risk_score: this.calculateRiskScore(customerData),
            risk_factors: [
                '市场波动风险',
                '通胀风险',
                '流动性风险',
                '信用风险'
            ],
            risk_mitigation: [
                '分散投资降低单一资产风险',
                '定期重新平衡投资组合',
                '保持适当现金储备',
                '定期审查投资表现'
            ],
            ai_analysis: aiRiskAssessment
        };
    }

    generateActionPlan(customerData) {
        return {
            immediate_actions: [
                '完善风险评估问卷',
                '确定投资目标和期限',
                '开设投资账户',
                '制定投资预算'
            ],
            short_term_goals: [
                '完成初始投资配置',
                '建立定期投资计划',
                '学习投资基础知识',
                '设置投资提醒'
            ],
            long_term_goals: [
                '实现财富增值目标',
                '建立多元化投资组合',
                '优化税务筹划',
                '定期评估投资策略'
            ]
        };
    }

    getRecommendedProducts(riskLevel) {
        const products = {
            conservative: [
                '货币基金',
                '银行理财产品',
                '国债',
                '企业债券基金'
            ],
            medium: [
                '混合型基金',
                '指数基金',
                '债券基金',
                '蓝筹股票'
            ],
            high: [
                '成长型股票基金',
                '科技主题基金',
                'REITs',
                '另类投资产品'
            ]
        };

        return products[riskLevel.toLowerCase()] || products.medium;
    }

    calculateRiskScore(customerData) {
        // 简化的风险评分算法
        let score = 50; // 基础分
        const assets = customerData.total_assets || 0;
        
        // 根据资产规模调整
        if (assets < 100000) score -= 20;
        else if (assets < 500000) score += 10;
        else if (assets >= 1000000) score += 20;

        // 根据风险等级调整
        switch (customerData.risk_level?.toLowerCase()) {
            case 'conservative': score -= 30; break;
            case 'medium': score += 0; break;
            case 'high': score += 30; break;
        }

        return Math.max(0, Math.min(100, score));
    }

    async generateMarketSummary() {
        try {
            console.log('📊 生成市场分析摘要...');
            const marketAnalysis = await this.aiService.generateMarketAnalysis('daily');
            
            return {
                market_date: new Date().toISOString(),
                market_overview: marketAnalysis,
                key_insights: [
                    '当前市场呈现结构性机会',
                    '科技和消费板块值得关注',
                    '债券市场相对稳定',
                    '建议保持适度谨慎态度'
                ],
                trading_signals: [
                    '看涨信号：消费板块',
                    '中性信号：金融板块',
                    '谨慎信号：地产板块'
                ]
            };
        } catch (error) {
            console.error('市场分析生成失败:', error.message);
            return {
                market_date: new Date().toISOString(),
                market_overview: '市场分析暂时无法获取，请稍后重试。',
                key_insights: ['市场分析功能维护中'],
                trading_signals: ['暂无交易信号']
            };
        }
    }
}

export default InvestmentAdvisor;