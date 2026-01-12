import EnhancedAIService from './EnhancedAIService.js';

class InvestmentAdvisor {
    constructor() {
        this.aiService = new EnhancedAIService();
        console.log('🎯 投资顾问服务已初始化 (基于增强版DeepSeek AI)');
    }

    async generateInvestmentPlan(customerId, options = {}) {
        try {
            console.log(`🎯 开始为客户 ${customerId} 生成个性化投资计划...`);

            // 获取AI生成的客制化投资建议
            const aiAdvice = await this.aiService.generatePersonalizedInvestmentAdvice(customerId, 'investment_plan');
            
            // 获取客户详细信息用于个性化计划
            const customerDetails = await this.aiService.getCustomerDetails(customerId);
            
            const investmentPlan = {
                customer_id: customerId,
                plan_id: `PLAN_${Date.now()}`,
                customer_name: customerDetails?.name || '未知客户',
                customer_details: customerDetails, // 添加完整客户信息
                generated_advice: aiAdvice,
                personalized_recommendations: this.generatePersonalizedRecommendations(customerDetails),
                risk_assessment: await this.generatePersonalizedRiskAssessment(customerId),
                action_plan: this.generatePersonalizedActionPlan(customerDetails),
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30天后过期
            };

            console.log(`✅ 个性化投资计划生成成功`);
            return investmentPlan;

        } catch (error) {
            console.error('❌ 投资计划生成失败:', error.message);
            throw error;
        }
    }

    generatePersonalizedRecommendations(customerDetails) {
        if (!customerDetails) {
            return this.getDefaultRecommendations();
        }

        const totalAssets = customerDetails.total_assets || 0;
        const riskLevel = customerDetails.risk_level || 'Medium';
        const age = customerDetails.age || 35;
        const annualIncome = customerDetails.annual_income || 0;
        const investmentExperience = customerDetails.investment_experience || 'beginner';
        const familyStatus = customerDetails.family_status || 'single';
        
        // 根据年龄调整策略
        let ageAdjustedStrategy = '';
        if (age < 30) {
            ageAdjustedStrategy = '成长型投资策略（年轻可承受更高风险）';
        } else if (age < 50) {
            ageAdjustedStrategy = '平衡型投资策略（中年稳健成长）';
        } else {
            ageAdjustedStrategy = '保守型投资策略（接近退休需稳定收益）';
        }

        // 根据资产规模调整策略
        let assetAdjustedStrategy = '';
        if (totalAssets < 100000) {
            assetAdjustedStrategy = '小额投资起步策略（积少成多）';
        } else if (totalAssets < 500000) {
            assetAdjustedStrategy = '稳健成长策略（适当风险平衡）';
        } else if (totalAssets < 2000000) {
            assetAdjustedStrategy = '平衡配置策略（多元化投资）';
        } else {
            assetAdjustedStrategy = '高净值定制策略（专业管理）';
        }

        // 根据风险等级和年龄确定资产配置
        let allocation = '';
        if (age < 35) {
            switch (riskLevel.toLowerCase()) {
                case 'conservative': allocation = '股票30% + 债券50% + 现金20%'; break;
                case 'medium': allocation = '股票50% + 债券30% + 现金20%'; break;
                case 'high': allocation = '股票70% + 债券20% + 现金10%'; break;
                default: allocation = '股票50% + 债券30% + 现金20%';
            }
        } else if (age < 50) {
            switch (riskLevel.toLowerCase()) {
                case 'conservative': allocation = '股票25% + 债券55% + 现金20%'; break;
                case 'medium': allocation = '股票40% + 债券45% + 现金15%'; break;
                case 'high': allocation = '股票60% + 债券30% + 现金10%'; break;
                default: allocation = '股票40% + 债券45% + 现金15%';
            }
        } else {
            switch (riskLevel.toLowerCase()) {
                case 'conservative': allocation = '股票20% + 债券60% + 现金20%'; break;
                case 'medium': allocation = '股票30% + 债券55% + 现金15%'; break;
                case 'high': allocation = '股票45% + 债券40% + 现金15%'; break;
                default: allocation = '股票30% + 债券55% + 现金15%';
            }
        }

        // 根据投资经验调整建议
        let experienceAdjustment = '';
        switch (investmentExperience) {
            case 'beginner': experienceAdjustment = '建议从低风险产品开始，逐步学习投资知识'; break;
            case 'intermediate': experienceAdjustment = '可以尝试中等复杂度的投资产品'; break;
            case 'advanced': experienceAdjustment = '可以考虑多元化投资组合和高级策略'; break;
            default: experienceAdjustment = '建议循序渐进地增加投资经验';
        }

        return {
            investment_strategy: `${ageAdjustedStrategy} + ${assetAdjustedStrategy}`,
            asset_allocation: allocation,
            age_based_advice: `基于您${age}岁的年龄，建议采用${age < 35 ? '积极' : age < 50 ? '稳健' : '保守'}的投资策略`,
            experience_adjustment: experienceAdjustment,
            family_consideration: familyStatus !== 'single' ? '考虑家庭因素，建议增加保险和稳定性投资' : '单身状态，可以承担相对更高的投资风险',
            recommended_products: this.getPersonalizedProducts(riskLevel, age, investmentExperience),
            investment_timeline: '1-3年长期投资（根据市场情况灵活调整）',
            rebalancing_frequency: '每季度评估一次，根据人生阶段调整'
        };
    }

    async generatePersonalizedRiskAssessment(customerId) {
        const customerDetails = await this.aiService.getCustomerDetails(customerId);
        const aiRiskAssessment = await this.aiService.generatePersonalizedRiskAssessment(customerId);
        
        if (!customerDetails) {
            return {
                risk_level: 'Medium',
                risk_score: 50,
                ai_analysis: aiRiskAssessment
            };
        }

        const riskFactors = this.analyzePersonalizedRiskFactors(customerDetails);
        
        return {
            risk_level: customerDetails.risk_level || 'Medium',
            risk_score: this.calculatePersonalizedRiskScore(customerDetails),
            personalized_risk_factors: riskFactors,
            risk_mitigation: this.generatePersonalizedRiskMitigation(customerDetails),
            life_stage_considerations: this.analyzeLifeStageRisks(customerDetails),
            ai_analysis: aiRiskAssessment
        };
    }

    analyzePersonalizedRiskFactors(customerDetails) {
        const factors = [];
        const age = customerDetails.age || 35;
        const familyStatus = customerDetails.family_status || 'single';
        const financialSituation = customerDetails.financial_situation || 'stable';
        
        if (age < 30) {
            factors.push('年龄风险较低，可以承受更高风险');
        } else if (age > 50) {
            factors.push('年龄较大，建议保守投资策略');
        }
        
        if (familyStatus !== 'single') {
            factors.push('家庭责任增加，需要考虑保险和稳定性');
        }
        
        switch (financialSituation) {
            case 'debt': factors.push('负债状况需要特别关注现金流'); break;
            case 'stable': factors.push('财务状况稳定，可以适当承担投资风险'); break;
            case 'wealthy': factors.push('财务状况良好，可以考虑多元化投资'); break;
        }
        
        return factors;
    }

    generatePersonalizedRiskMitigation(customerDetails) {
        const mitigations = [
            '分散投资降低单一资产风险',
            '定期重新平衡投资组合',
            '保持适当现金储备'
        ];
        
        const age = customerDetails.age || 35;
        const riskLevel = customerDetails.risk_level || 'Medium';
        
        if (age > 50) {
            mitigations.push('增加债券和稳定收益产品比例');
        }
        
        if (riskLevel === 'High') {
            mitigations.push('设置止损机制，控制最大损失');
        }
        
        mitigations.push('定期审查投资表现，及时调整策略');
        
        return mitigations;
    }

    analyzeLifeStageRisks(customerDetails) {
        const age = customerDetails.age || 35;
        const familyStatus = customerDetails.family_status || 'single';
        
        if (age < 30) {
            return {
                current_stage: '事业起步期',
                key_concerns: ['财富积累', '技能提升', '风险承受能力较高'],
                investment_focus: ['成长型投资', '技能提升投资', '长期规划']
            };
        } else if (age < 50) {
            return {
                current_stage: '事业发展期',
                key_concerns: ['家庭责任', '财富增值', '风险管理'],
                investment_focus: ['平衡配置', '保险规划', '教育基金']
            };
        } else {
            return {
                current_stage: '财富保全期',
                key_concerns: ['退休规划', '资产保全', '稳定收益'],
                investment_focus: ['保守投资', '收益稳定', '遗产规划']
            };
        }
    }

    generatePersonalizedActionPlan(customerDetails) {
        if (!customerDetails) {
            return this.getDefaultActionPlan();
        }

        const age = customerDetails.age || 35;
        const riskLevel = customerDetails.risk_level || 'Medium';
        const investmentExperience = customerDetails.investment_experience || 'beginner';
        const familyStatus = customerDetails.family_status || 'single';
        
        const immediateActions = [
            '完善风险评估问卷',
            '确定投资目标和期限'
        ];
        
        if (investmentExperience === 'beginner') {
            immediateActions.push('学习投资基础知识');
        }
        
        if (familyStatus !== 'single') {
            immediateActions.push('完善家庭保险规划');
        }
        
        immediateActions.push('开设投资账户');
        immediateActions.push('制定投资预算');
        
        const shortTermGoals = [
            '完成初始投资配置',
            '建立定期投资计划'
        ];
        
        if (age < 40) {
            shortTermGoals.push('建立应急基金（6-12个月生活费）');
        }
        
        if (riskLevel === 'High') {
            shortTermGoals.push('学习风险控制技巧');
        }
        
        shortTermGoals.push('设置投资提醒');
        
        const longTermGoals = [
            '实现财富增值目标',
            '建立多元化投资组合',
            '优化税务筹划'
        ];
        
        if (age > 40) {
            longTermGoals.push('开始退休规划');
        }
        
        longTermGoals.push('定期评估投资策略');
        
        return {
            immediate_actions: immediateActions,
            short_term_goals: shortTermGoals,
            long_term_goals: longTermGoals,
            personalized_considerations: [
                `基于您${age}岁的年龄，建议重点关注${age < 35 ? '成长' : age < 50 ? '平衡' : '稳定'}型投资策略`,
                `作为${investmentExperience}级投资者，建议${investmentExperience === 'beginner' ? '循序渐进' : '适度创新'}`,
                `考虑到您的${familyStatus === 'single' ? '单身' : '家庭'}状况，需要特别关注${familyStatus === 'single' ? '个人风险控制' : '家庭保障'}`
            ]
        };
    }

    getPersonalizedProducts(riskLevel, age, experience) {
        let baseProducts = this.getRecommendedProducts(riskLevel);
        
        if (age > 50) {
            // 年长者更适合稳健产品
            baseProducts = baseProducts.filter(p => 
                !p.includes('成长') && !p.includes('高风险')
            );
        }
        
        if (experience === 'beginner') {
            // 新手更适合简单产品
            baseProducts.push('基金定投', '银行理财');
        }
        
        return baseProducts;
    }

    calculatePersonalizedRiskScore(customerDetails) {
        let score = 50; // 基础分
        const age = customerDetails.age || 35;
        const assets = customerDetails.total_assets || 0;
        const income = customerDetails.annual_income || 0;
        
        // 根据年龄调整
        if (age < 30) score += 20;
        else if (age < 50) score += 10;
        else if (age > 60) score -= 20;
        
        // 根据资产规模调整
        if (assets < 100000) score -= 20;
        else if (assets < 500000) score += 10;
        else if (assets >= 1000000) score += 20;
        
        // 根据收入调整
        if (income > 200000) score += 15;
        else if (income < 50000) score -= 10;
        
        // 根据风险等级调整
        switch (customerDetails.risk_level?.toLowerCase()) {
            case 'conservative': score -= 30; break;
            case 'medium': score += 0; break;
            case 'high': score += 30; break;
        }
        
        return Math.max(0, Math.min(100, score));
    }

    getDefaultRecommendations() {
        return {
            investment_strategy: '默认平衡策略',
            asset_allocation: '股票40% + 债券40% + 现金20%',
            recommended_products: this.getRecommendedProducts('Medium'),
            investment_timeline: '1-3年长期投资',
            rebalancing_frequency: '每季度评估一次'
        };
    }

    getDefaultActionPlan() {
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
                '蓝筹股票',
                'REITs'
            ],
            high: [
                '成长型股票基金',
                '科技主题基金',
                '新兴市场基金',
                '另类投资产品'
            ]
        };

        return products[riskLevel.toLowerCase()] || products.medium;
    }

    async generatePersonalizedMarketSummary() {
        try {
            console.log('📊 生成个性化市场分析摘要...');
            
            // 这里可以获取特定客户的市场分析
            // const customerId = 'specific_customer_id';
            // const marketAnalysis = await this.aiService.generatePersonalizedMarketAnalysis(customerId, 'daily');
            
            // 暂时使用通用市场分析
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
                personalized_considerations: [
                    '根据不同年龄段和风险偏好选择适合的投资策略',
                    '建议关注与个人投资目标匹配的行业板块',
                    '考虑个人财务状况制定合适的投资金额'
                ],
                trading_signals: [
                    '看涨信号：消费板块',
                    '中性信号：金融板块',
                    '谨慎信号：地产板块'
                ]
            };
        } catch (error) {
            console.error('个性化市场分析生成失败:', error.message);
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