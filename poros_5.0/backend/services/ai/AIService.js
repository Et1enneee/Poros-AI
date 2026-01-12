import fetch from 'node-fetch';

class AIService {
    constructor() {
        this.baseURL = 'https://api.deepseek.com';
        this.apiKey = process.env.DEEPSEEK_API_KEY;
        
        if (!this.apiKey) {
            console.warn('⚠️ DEEPSEEK_API_KEY 未设置，将使用模拟数据');
            this.useMockData = true;
        } else {
            this.useMockData = false;
            console.log('✅ DeepSeek AI服务已初始化');
        }
    }

    async callDeepSeekAPI(prompt, systemPrompt = '') {
        if (this.useMockData) {
            return this.getMockResponse(prompt);
        }

        try {
            const requestBody = {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt || '你是一个专业的金融投资顾问，为客户提供专业的投资建议。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7,
                stream: false
            };

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error(`DeepSeek API 错误: ${response.status} - ${errorData}`);
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '抱歉，无法生成投资建议。';
        } catch (error) {
            console.error('DeepSeek API 调用失败:', error.message);
            return this.getMockResponse(prompt);
        }
    }

    getMockResponse(prompt) {
        // 模拟AI响应，用于API未配置时
        const mockResponses = [
            "基于您当前的风险承受能力和投资目标，我建议您考虑多元化投资组合，包括股票、债券和基金。建议配置比例为：40%股票基金、30%债券、20%现金类资产、10%另类投资。请注意市场波动风险。",
            "考虑到您的资产规模（50万-200万），建议采用稳健型投资策略。重点关注低估值股票和优质债券基金。定期定额投资可以有效分散市场风险。建议每月投入10-15%的可支配收入进行投资。",
            "基于当前市场环境分析，建议您关注科技、新能源和消费升级等成长性行业。同时保持适当的防御性配置，以应对可能的市场调整。投资需谨慎，建议分散投资以降低风险。",
            "根据您的风险偏好（中等风险），推荐构建平衡型投资组合。包含成长股基金、价值型股票和稳健债券。定期评估投资组合表现，根据市场变化适时调整配置比例。",
            "建议采用定投策略，每月固定投入一定金额投资基金。可以选择指数基金作为核心配置，配合少量主动管理基金。长期投资和复利效应将帮助您实现财富增值目标。"
        ];
        
        return mockResponses[Math.floor(Math.random() * mockResponses.length)];
    }

    async generateInvestmentAdvice(customerData, requestType = 'general') {
        const systemPrompt = `你是一个专业的金融投资顾问，专注于为客户提供个性化的投资建议。

客户信息：
- 姓名：${customerData.name}
- 客户ID：${customerData.customer_id}
- 总资产：${customerData.total_assets?.toLocaleString() || '未提供'} 元
- 风险等级：${customerData.risk_level || '未评估'}
- 投资目标：${customerData.investment_goal || '未明确'}
- 联系方式：${customerData.email || customerData.phone || '未提供'}

请基于以上信息提供专业、实用的投资建议。建议应包括：
1. 资产配置建议
2. 投资产品推荐
3. 风险提示
4. 具体操作建议

请用中文回复，语言专业但通俗易懂。`;

        const userPrompt = `请为客户 ${customerData.name} (客户ID: ${customerData.customer_id}) 生成${requestType}类型的投资建议。客户总资产为 ${customerData.total_assets?.toLocaleString() || '未提供'} 元，风险偏好为 ${customerData.risk_level || '未评估'}，投资目标是 ${customerData.investment_goal || '未明确'}。

请提供详细的投资建议，包括具体的投资策略、产品推荐和风险控制措施。`;

        return await this.callDeepSeekAPI(userPrompt, systemPrompt);
    }

    async generateMarketAnalysis(requestType = 'daily') {
        const systemPrompt = '你是一个专业的市场分析师，为投资客户提供市场分析和趋势预测。';
        const userPrompt = `请生成${requestType}市场分析报告，包括：
1. 当前市场概况
2. 主要行业表现
3. 市场趋势预测
4. 投资机会和风险
5. 具体的投资建议

请基于最新的市场信息进行分析。`;

        return await this.callDeepSeekAPI(userPrompt, systemPrompt);
    }

    async generateRiskAssessment(customerData) {
        const systemPrompt = '你是一个专业的风险评估专家，为投资客户评估投资风险。';
        const userPrompt = `请为客户 ${customerData.name} 进行风险评估，客户信息：
- 总资产：${customerData.total_assets?.toLocaleString() || '未提供'} 元
- 风险等级：${customerData.risk_level || '未评估'}
- 投资目标：${customerData.investment_goal || '未明确'}

请提供：
1. 风险等级评估
2. 风险承受能力分析
3. 投资组合风险建议
4. 风险控制措施`;

        return await this.callDeepSeekAPI(userPrompt, systemPrompt);
    }
}

export default AIService;