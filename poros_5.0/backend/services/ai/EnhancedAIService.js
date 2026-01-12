import AIService from './AIService.js';

class EnhancedAIService extends AIService {
    constructor() {
        super();
        console.log('🎯 增强版AI服务已初始化 (支持客制化客户信息)');
    }

    // 获取客户详细信息
    async getCustomerDetails(customerId) {
        try {
            // 这里需要根据实际的客户数据接口来获取详细信息
            const response = await fetch(`/api/customers/${customerId}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                const customer = data.data;
                return {
                    customer_id: customer.customer_id,
                    name: customer.name,
                    age: customer.age,
                    gender: customer.gender,
                    occupation: customer.occupation,
                    annual_income: customer.annual_income,
                    total_assets: customer.total_assets,
                    risk_level: customer.risk_level,
                    investment_experience: customer.investment_experience,
                    investment_goals: customer.investment_goals,
                    preferred_investment_types: customer.preferred_investment_types,
                    communication_preference: customer.communication_preference,
                    personality_traits: customer.personality_traits,
                    financial_situation: customer.financial_situation,
                    family_status: customer.family_status,
                    lifestyle: customer.lifestyle,
                    interests: customer.interests,
                    concerns: customer.concerns
                };
            }
            return null;
        } catch (error) {
            console.error('获取客户详细信息失败:', error);
            return null;
        }
    }

    // 生成客制化投资建议
    async generatePersonalizedInvestmentAdvice(customerId, requestType = 'general') {
        try {
            const customerDetails = await this.getCustomerDetails(customerId);
            
            if (!customerDetails) {
                console.warn('无法获取客户详细信息，使用通用建议');
                return await super.generateInvestmentAdvice({ customer_id: customerId }, requestType);
            }

            // 构建详细的系统提示词
            const systemPrompt = this.buildPersonalizedSystemPrompt(customerDetails);
            
            // 构建用户提示词
            const userPrompt = this.buildPersonalizedUserPrompt(customerDetails, requestType);
            
            // 调用AI API
            const advice = await this.callDeepSeekAPI(userPrompt, systemPrompt);
            
            return advice;
            
        } catch (error) {
            console.error('生成客制化投资建议失败:', error);
            // 回退到通用建议
            return await super.generateInvestmentAdvice({ customer_id: customerId }, requestType);
        }
    }

    // 构建客制化系统提示词
    buildPersonalizedSystemPrompt(customerDetails) {
        return `你是一个专业的高级金融投资顾问，专门为高端客户提供个性化的投资建议服务。

客户详细信息：
- 姓名：${customerDetails.name}
- 客户ID：${customerDetails.customer_id}
- 年龄：${customerDetails.age}岁
- 性别：${customerDetails.gender}
- 职业：${customerDetails.occupation}
- 年收入：${customerDetails.annual_income ? customerDetails.annual_income.toLocaleString() + '元' : '未提供'}
- 总资产：${customerDetails.total_assets ? customerDetails.total_assets.toLocaleString() + '元' : '未提供'}
- 风险等级：${customerDetails.risk_level || '未评估'}
- 投资经验：${customerDetails.investment_experience || '未说明'}
- 投资目标：${customerDetails.investment_goals || '未明确'}
- 偏好投资类型：${customerDetails.preferred_investment_types || '未指定'}
- 沟通偏好：${customerDetails.communication_preference || '标准'}
- 性格特征：${customerDetails.personality_traits || '未评估'}
- 财务状况：${customerDetails.financial_situation || '未说明'}
- 家庭状况：${customerDetails.family_status || '未说明'}
- 生活方式：${customerDetails.lifestyle || '未描述'}
- 兴趣爱好：${customerDetails.interests || '未提及'}
- 主要关切：${customerDetails.concerns || '未提及'}

请基于以上详细信息，为这位客户生成高度个性化的投资建议。

建议要求：
1. 充分考虑客户的个人情况（年龄、收入、风险偏好等）
2. 结合客户的投资经验和目标
3. 考虑客户的性格特征和沟通偏好
4. 关注客户的生活状况和关切点
5. 提供具体可执行的投资策略
6. 使用客户容易理解的语言
7. 体现对客户个人情况的深度理解

请用中文回复，语言专业但亲切友好。`;
    }

    // 构建客制化用户提示词
    buildPersonalizedUserPrompt(customerDetails, requestType) {
        let requestDescription = '';
        
        switch (requestType) {
            case 'investment_plan':
                requestDescription = '请为客户制定一个详细的投资计划，包括资产配置建议和具体操作步骤。';
                break;
            case 'risk_assessment':
                requestDescription = '请对客户进行全面的风险评估，分析其投资风险承受能力。';
                break;
            case 'portfolio_review':
                requestDescription = '请对客户的投资组合进行分析和优化建议。';
                break;
            case 'market_analysis':
                requestDescription = '请基于当前市场环境，为客户提供市场分析和投资机会分析。';
                break;
            default:
                requestDescription = '请为客户提供个性化的投资建议和指导。';
        }
        
        return `客户 ${customerDetails.name} (客户ID: ${customerDetails.customer_id}) 寻求投资建议。

${requestDescription}

客户基本信息：
- 总资产：${customerDetails.total_assets ? customerDetails.total_assets.toLocaleString() + '元' : '未提供'}
- 风险偏好：${customerDetails.risk_level || '未评估'}
- 投资目标：${customerDetails.investment_goals || '未明确'}
- 投资经验：${customerDetails.investment_experience || '未说明'}

请提供详细、专业且个性化的投资建议，包括：
1. 具体的投资策略
2. 资产配置建议
3. 风险控制措施
4. 具体操作建议
5. 预期收益分析
6. 注意事项和建议

请确保建议充分体现对客户个人情况的理解和关怀。`;
    }

    // 生成客制化市场分析
    async generatePersonalizedMarketAnalysis(customerId, requestType = 'daily') {
        try {
            const customerDetails = await this.getCustomerDetails(customerId);
            
            if (!customerDetails) {
                return await super.generateMarketAnalysis(requestType);
            }

            const systemPrompt = `你是一个专业的市场分析师，为投资客户提供个性化的市场分析。

客户信息：
- 姓名：${customerDetails.name}
- 资产规模：${customerDetails.total_assets ? customerDetails.total_assets.toLocaleString() + '元' : '未提供'}
- 风险等级：${customerDetails.risk_level || '未评估'}
- 投资偏好：${customerDetails.preferred_investment_types || '未指定'}
- 主要关切：${customerDetails.concerns || '未提及'}

请基于客户的具体情况，提供个性化的市场分析和投资建议。`;

            const userPrompt = `请为客户 ${customerDetails.name} 生成${requestType}市场分析报告，重点关注：
1. 适合该客户风险等级的市场机会
2. 与客户投资偏好匹配的行业分析
3. 考虑客户资产规模的投资策略
4. 针对客户关切点的风险提示

请提供详细的市场分析和具体的投资建议。`;

            return await this.callDeepSeekAPI(userPrompt, systemPrompt);
            
        } catch (error) {
            console.error('生成客制化市场分析失败:', error);
            return await super.generateMarketAnalysis(requestType);
        }
    }

    // 生成客制化风险评估
    async generatePersonalizedRiskAssessment(customerId) {
        try {
            const customerDetails = await this.getCustomerDetails(customerId);
            
            if (!customerDetails) {
                return await super.generateRiskAssessment({ customer_id: customerId });
            }

            const systemPrompt = `你是一个专业的风险评估专家，为投资客户进行个性化的风险评估。

客户详细信息：
- 姓名：${customerDetails.name}
- 年龄：${customerDetails.age}岁
- 年收入：${customerDetails.annual_income ? customerDetails.annual_income.toLocaleString() + '元' : '未提供'}
- 总资产：${customerDetails.total_assets ? customerDetails.total_assets.toLocaleString() + '元' : '未提供'}
- 家庭状况：${customerDetails.family_status || '未说明'}
- 财务状况：${customerDetails.financial_situation || '未说明'}
- 性格特征：${customerDetails.personality_traits || '未评估'}

请基于客户的个人情况，进行全面的风险评估和建议。`;

            const userPrompt = `请为客户 ${customerDetails.name} 进行详细的风险评估分析：

客户基本信息：
- 总资产：${customerDetails.total_assets ? customerDetails.total_assets.toLocaleString() + '元' : '未提供'}
- 风险等级：${customerDetails.risk_level || '未评估'}
- 投资目标：${customerDetails.investment_goals || '未明确'}
- 投资经验：${customerDetails.investment_experience || '未说明'}

请提供：
1. 详细的风险等级评估
2. 基于客户情况的个性化风险分析
3. 具体的风险控制建议
4. 适合客户的投资组合风险配置
5. 风险监控和调整建议

请确保评估充分考虑客户的个人情况和承受能力。`;

            return await this.callDeepSeekAPI(userPrompt, systemPrompt);
            
        } catch (error) {
            console.error('生成客制化风险评估失败:', error);
            return await super.generateRiskAssessment({ customer_id: customerId });
        }
    }
}

export default EnhancedAIService;