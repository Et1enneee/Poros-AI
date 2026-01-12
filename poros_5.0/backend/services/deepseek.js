import fetch from 'node-fetch';

class DeepSeekService {
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY;
        this.baseURL = 'https://api.deepseek.com';
        
        if (this.apiKey) {
            console.log('✅ DeepSeek API 已配置');
        } else {
            console.log('⚠️ DeepSeek API 未配置，将使用模拟数据');
        }
    }

    async generateInvestmentAdvice(customerData) {
        const prompt = this.buildInvestmentPrompt(customerData);
        
        if (!this.apiKey) {
            return this.getMockAdvice(customerData);
        }

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的金融投资顾问，为客户提供个性化的投资建议。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 1500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API调用失败: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || this.getMockAdvice(customerData);
        } catch (error) {
            console.error('DeepSeek API调用失败:', error);
            return this.getMockAdvice(customerData);
        }
    }

    buildInvestmentPrompt(customerData) {
        return `请为客户 ${customerData.name} 提供投资建议。
客户信息：
- 总资产：${customerData.total_assets || '未知'} 元
- 风险等级：${customerData.risk_level || '未评估'}
- 投资目标：${customerData.investment_goal || '未明确'}

请提供专业的投资建议，包括资产配置建议和风险提示。`;
    }

    getMockAdvice(customerData) {
        const assets = customerData.total_assets || 0;
        const risk = customerData.risk_level || 'Medium';
        
        let strategy = '';
        let allocation = '';
        
        if (assets < 100000) {
            strategy = '保守型起步策略';
            allocation = '股票20% + 债券50% + 现金30%';
        } else if (assets < 500000) {
            strategy = '稳健成长策略';
            allocation = '股票40% + 债券40% + 现金20%';
        } else {
            strategy = '平衡配置策略';
            allocation = '股票50% + 债券35% + 现金15%';
        }

        return `基于您当前的资产状况（${assets.toLocaleString()}元）和风险承受能力（${risk}），建议采用${strategy}。

资产配置建议：${allocation}

具体建议：
1. 核心投资产品：指数基金、债券基金、货币基金
2. 投资时机：采用定投策略，每月固定投入10-15%的可支配收入
3. 风险控制：保持适当现金储备，定期重新平衡投资组合
4. 长期规划：建议投资期限3-5年，预期年化收益率5-8%

⚠️ 风险提示：投资有风险，请根据自身风险承受能力进行投资。`;
    }
}

export default DeepSeekService;