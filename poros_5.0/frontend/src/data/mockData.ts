// Industry classification interface
export interface Industry {
  category: string;
  subcategory: string;
  years_experience: number;
  company_size: 'Startup' | 'Small' | 'Medium' | 'Large' | 'Enterprise';
  role: string;
}

// Income information interface
export interface Income {
  annual_salary: number;
  bonus_percentage: number;
  investment_income: number;
  total_annual_income: number;
  income_growth_rate: number;
  expense_ratio: number;
}

// Customer data interfaces
export interface Customer {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  totalAssets: number;
  riskLevel: 'Conservative' | 'Moderate' | 'Balanced' | 'Growth' | 'Aggressive';
  investmentGoal: string;
  lastContact: string;
  status: 'Active' | 'Pending' | 'Prospect' | 'Churned';
  tags: string[];
  industry: Industry;
  income: Income;
  financial_goals: string[];
  investment_experience: number;
  liquidity_needs: 'Short-term' | 'Medium-term' | 'Long-term';
  tax_considerations: string[];
}

// Investment portfolio data
export interface Investment {
  id: string;
  customerId: string;
  type: 'HK Stock' | 'US Stock' | 'Crypto' | 'ETF' | 'Bond';
  name: string;
  symbol: string;
  amount: number;
  return: number;
  returnRate: number;
  risk: 'Low' | 'Medium' | 'High';
  market: 'HK' | 'US' | 'Crypto';
}

// Market data interface
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: 'HK' | 'US' | 'Crypto';
  sector?: string;
}

// Communication records
export interface Communication {
  id: string;
  customerId: string;
  type: 'Phone' | 'WeChat' | 'Email' | 'Meeting';
  content: string;
  date: string;
  outcome: string;
  nextAction: string;
}

// Investment advice
export interface InvestmentAdvice {
  id: string;
  customerId: string;
  title: string;
  content: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedReturn: number;
  timeFrame: string;
  status: 'Pending' | 'Confirmed' | 'Executed' | 'Rejected';
  createdAt: string;
}

// AI Investment Advice Detail
export interface AIAdviceDetail {
  id: string;
  adviceId: string;
  strategy: string;
  reasoning: string;
  marketAnalysis: string;
  riskAssessment: string;
  expectedReturn: {
    conservative: number;
    moderate: number;
    optimistic: number;
  };
  timeline: {
    phase: string;
    action: string;
    target: string;
    duration: string;
  }[];
  assetAllocation: {
    category: string;
    percentage: number;
    reasoning: string;
    specificProducts: string[];
  }[];
  keyMetrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    beta: number;
  };
}

// Investment Advice History
export interface AdviceHistory {
  id: string;
  customerId: string;
  adviceId: string;
  status: 'Pending' | 'Confirmed' | 'Executed' | 'Rejected';
  executedAt?: string;
  actualReturn?: number;
  expectedReturn: number;
  performance: 'Underperform' | 'Meet' | 'Exceed';
  notes: string;
  feedback: string;
}

// Mock customer data (English names for international standard)
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Michael Zhang',
    avatar: '👨‍💼',
    age: 35,
    gender: 'Male',
    phone: '+852 9000****',
    email: 'zhangsan@email.com',
    address: 'Central, Hong Kong',
    totalAssets: 2800000,
    riskLevel: 'Growth',
    investmentGoal: 'Children Education + Retirement Planning',
    lastContact: '2025-12-10',
    status: 'Active',
    tags: ['VIP Client', 'High Net Worth', 'Education Planning'],
    industry: {
      category: 'Technology',
      subcategory: 'Software Development',
      years_experience: 12,
      company_size: 'Large',
      role: 'Senior Software Engineer'
    },
    income: {
      annual_salary: 850000,
      bonus_percentage: 25,
      investment_income: 120000,
      total_annual_income: 1182500,
      income_growth_rate: 8,
      expense_ratio: 0.6
    },
    financial_goals: ['Children Education Fund', 'Retirement Planning', 'Property Purchase', 'Business Investment'],
    investment_experience: 8,
    liquidity_needs: 'Medium-term',
    tax_considerations: ['Tax-efficient Investment', 'MPF Optimization', 'Insurance Tax Benefits']
  },
  {
    id: '2',
    name: 'Linda Lee',
    avatar: '👩‍💼',
    age: 42,
    gender: 'Female',
    phone: '+852 9001****',
    email: 'limeihua@email.com',
    address: 'Causeway Bay, Hong Kong',
    totalAssets: 1500000,
    riskLevel: 'Moderate',
    investmentGoal: 'Asset Preservation & Growth',
    lastContact: '2025-12-09',
    status: 'Active',
    tags: ['Conservative Investment', 'Poros Expert'],
    industry: {
      category: 'Finance',
      subcategory: 'Investment Banking',
      years_experience: 18,
      company_size: 'Enterprise',
      role: 'Senior Portfolio Manager'
    },
    income: {
      annual_salary: 950000,
      bonus_percentage: 40,
      investment_income: 85000,
      total_annual_income: 1405000,
      income_growth_rate: 6,
      expense_ratio: 0.5
    },
    financial_goals: ['Retirement Security', 'Wealth Preservation', 'Healthcare Planning', 'Charitable Giving'],
    investment_experience: 15,
    liquidity_needs: 'Long-term',
    tax_considerations: ['Capital Gains Planning', 'Offshore Investment', 'Trust Structure']
  },
  {
    id: '3',
    name: 'David Wang',
    avatar: '👨‍💼',
    age: 28,
    gender: 'Male',
    phone: '+852 9002****',
    email: 'wangzhiqiang@email.com',
    address: 'Tsim Sha Tsui, Hong Kong',
    totalAssets: 800000,
    riskLevel: 'Aggressive',
    investmentGoal: 'Rapid Wealth Growth',
    lastContact: '2025-12-08',
    status: 'Pending',
    tags: ['Young Client', 'Aggressive Investment'],
    industry: {
      category: 'Consulting',
      subcategory: 'Management Consulting',
      years_experience: 5,
      company_size: 'Medium',
      role: 'Business Analyst'
    },
    income: {
      annual_salary: 480000,
      bonus_percentage: 15,
      investment_income: 25000,
      total_annual_income: 577000,
      income_growth_rate: 12,
      expense_ratio: 0.75
    },
    financial_goals: ['Wealth Accumulation', 'Property Investment', 'Business Startup', 'Early Retirement'],
    investment_experience: 3,
    liquidity_needs: 'Short-term',
    tax_considerations: ['Tax Loss Harvesting', 'Salary Sacrifice Schemes']
  },
  {
    id: '4',
    name: 'Sophia Chen',
    avatar: '👩‍💼',
    age: 55,
    gender: 'Female',
    phone: '+852 9003****',
    email: 'chenxuemei@email.com',
    address: 'Wan Chai, Hong Kong',
    totalAssets: 3200000,
    riskLevel: 'Conservative',
    investmentGoal: 'Retirement Security',
    lastContact: '2025-12-07',
    status: 'Active',
    tags: ['Retirement Planning', 'Low Risk Preference'],
    industry: {
      category: 'Healthcare',
      subcategory: 'Medical Practice',
      years_experience: 25,
      company_size: 'Enterprise',
      role: 'Chief Medical Officer'
    },
    income: {
      annual_salary: 1200000,
      bonus_percentage: 20,
      investment_income: 180000,
      total_annual_income: 1620000,
      income_growth_rate: 4,
      expense_ratio: 0.45
    },
    financial_goals: ['Retirement Planning', 'Healthcare Security', 'Estate Planning', 'Legacy Building'],
    investment_experience: 20,
    liquidity_needs: 'Long-term',
    tax_considerations: ['Retirement Planning', 'Medical Expense Deductions', 'Estate Tax Planning']
  },
  {
    id: '5',
    name: 'Andrew Liu',
    avatar: '👨‍💼',
    age: 45,
    gender: 'Male',
    phone: '+852 9004****',
    email: 'liujianhua@email.com',
    address: 'Admiralty, Hong Kong',
    totalAssets: 2100000,
    riskLevel: 'Balanced',
    investmentGoal: 'Wealth Preservation',
    lastContact: '2025-12-06',
    status: 'Prospect',
    tags: ['Business Owner', 'Tax Planning'],
    industry: {
      category: 'Manufacturing',
      subcategory: 'Electronics Manufacturing',
      years_experience: 22,
      company_size: 'Medium',
      role: 'Managing Director'
    },
    income: {
      annual_salary: 750000,
      bonus_percentage: 30,
      investment_income: 95000,
      total_annual_income: 1070000,
      income_growth_rate: 7,
      expense_ratio: 0.55
    },
    financial_goals: ['Business Expansion', 'Property Investment', 'Children Education', 'Retirement Planning'],
    investment_experience: 12,
    liquidity_needs: 'Medium-term',
    tax_considerations: ['Business Tax Planning', 'Corporate Structure', 'Dividend Optimization']
  },
  {
    id: '6',
    name: 'Grace Zhao',
    avatar: '👩‍💼',
    age: 31,
    gender: 'Female',
    phone: '+852 9005****',
    email: 'zhaoyating@email.com',
    address: 'Sheung Wan, Hong Kong',
    totalAssets: 950000,
    riskLevel: 'Balanced',
    investmentGoal: 'Property Investment & Growth',
    lastContact: '2025-12-11',
    status: 'Active',
    tags: ['Real Estate Focus', 'Property Investment'],
    industry: {
      category: 'Real Estate',
      subcategory: 'Property Development',
      years_experience: 8,
      company_size: 'Large',
      role: 'Project Manager'
    },
    income: {
      annual_salary: 650000,
      bonus_percentage: 18,
      investment_income: 45000,
      total_annual_income: 812000,
      income_growth_rate: 9,
      expense_ratio: 0.65
    },
    financial_goals: ['Property Portfolio', 'Rental Income', 'Retirement Planning', 'Business Investment'],
    investment_experience: 6,
    liquidity_needs: 'Medium-term',
    tax_considerations: ['Property Tax Planning', 'Rental Income Optimization', 'Stamp Duty Strategies']
  },
  {
    id: '7',
    name: 'Kevin Huang',
    avatar: '👨‍💼',
    age: 38,
    gender: 'Male',
    phone: '+852 9006****',
    email: 'huangzhiqiang@email.com',
    address: 'Quarry Bay, Hong Kong',
    totalAssets: 1750000,
    riskLevel: 'Growth',
    investmentGoal: 'Business Expansion & Wealth Building',
    lastContact: '2025-12-10',
    status: 'Active',
    tags: ['Business Owner', 'Entrepreneur', 'Growth Focus'],
    industry: {
      category: 'Retail',
      subcategory: 'Fashion Retail',
      years_experience: 15,
      company_size: 'Small',
      role: 'Founder & CEO'
    },
    income: {
      annual_salary: 580000,
      bonus_percentage: 35,
      investment_income: 75000,
      total_annual_income: 858000,
      income_growth_rate: 10,
      expense_ratio: 0.6
    },
    financial_goals: ['Business Expansion', 'Property Investment', 'Children Education', 'Early Retirement'],
    investment_experience: 10,
    liquidity_needs: 'Short-term',
    tax_considerations: ['Business Structure', 'Dividend Planning', 'Capital Expenditure Tax Benefits']
  },
  {
    id: '8',
    name: 'Patricia Lam',
    avatar: '👩‍💼',
    age: 48,
    gender: 'Female',
    phone: '+852 9007****',
    email: 'linshuhua@email.com',
    address: 'Mid-Levels, Hong Kong',
    totalAssets: 2850000,
    riskLevel: 'Moderate',
    investmentGoal: 'Retirement & Legacy Planning',
    lastContact: '2025-12-09',
    status: 'Active',
    tags: ['Legal Professional', 'Estate Planning', 'Conservative'],
    industry: {
      category: 'Legal Services',
      subcategory: 'Corporate Law',
      years_experience: 20,
      company_size: 'Medium',
      role: 'Senior Partner'
    },
    income: {
      annual_salary: 1100000,
      bonus_percentage: 25,
      investment_income: 135000,
      total_annual_income: 1510000,
      income_growth_rate: 5,
      expense_ratio: 0.5
    },
    financial_goals: ['Retirement Planning', 'Estate Planning', 'Legacy Building', 'Charitable Giving'],
    investment_experience: 18,
    liquidity_needs: 'Long-term',
    tax_considerations: ['Estate Tax Planning', 'Trust Structures', 'Professional Tax Deductions']
  },
  {
    id: '9',
    name: 'Eric Zhou',
    avatar: '👨‍💼',
    age: 26,
    gender: 'Male',
    phone: '+852 9008****',
    email: 'zhouwenjie@email.com',
    address: 'Kennedy Town, Hong Kong',
    totalAssets: 450000,
    riskLevel: 'Aggressive',
    investmentGoal: 'Rapid Wealth Accumulation',
    lastContact: '2025-12-11',
    status: 'Prospect',
    tags: ['Young Professional', 'Tech Startup', 'High Risk Tolerance'],
    industry: {
      category: 'Media & Entertainment',
      subcategory: 'Digital Marketing',
      years_experience: 4,
      company_size: 'Startup',
      role: 'Marketing Director'
    },
    income: {
      annual_salary: 420000,
      bonus_percentage: 20,
      investment_income: 15000,
      total_annual_income: 519000,
      income_growth_rate: 15,
      expense_ratio: 0.8
    },
    financial_goals: ['Wealth Accumulation', 'Startup Investment', 'Property Purchase', 'Early Retirement'],
    investment_experience: 2,
    liquidity_needs: 'Short-term',
    tax_considerations: ['Startup Investment Tax Benefits', 'Capital Gains Planning', 'Tax-efficient Growth']
  },
  {
    id: '10',
    name: 'Catherine Ng',
    avatar: '👩‍💼',
    age: 52,
    gender: 'Female',
    phone: '+852 9009****',
    email: 'wumeiling@email.com',
    address: 'Repulse Bay, Hong Kong',
    totalAssets: 4200000,
    riskLevel: 'Conservative',
    investmentGoal: 'Wealth Preservation & Income Generation',
    lastContact: '2025-12-08',
    status: 'Active',
    tags: ['Ultra High Net Worth', 'Conservative Strategy', 'Income Focus'],
    industry: {
      category: 'Education',
      subcategory: 'Higher Education',
      years_experience: 28,
      company_size: 'Enterprise',
      role: 'University Professor'
    },
    income: {
      annual_salary: 980000,
      bonus_percentage: 12,
      investment_income: 220000,
      total_annual_income: 1317600,
      income_growth_rate: 3,
      expense_ratio: 0.4
    },
    financial_goals: ['Wealth Preservation', 'Steady Income', 'Charitable Giving', 'Academic Endowment'],
    investment_experience: 25,
    liquidity_needs: 'Long-term',
    tax_considerations: ['Academic Tax Benefits', 'Charitable Deductions', 'Conservative Income Planning']
  }
];

// Mock investment portfolio data with real market symbols
export const mockInvestments: Investment[] = [
  // Hong Kong Stocks
  {
    id: '1',
    customerId: '1',
    type: 'HK Stock',
    name: 'Tencent Holdings Ltd',
    symbol: '0700.HK',
    amount: 800000,
    return: 120000,
    returnRate: 15.0,
    risk: 'High',
    market: 'HK'
  },
  {
    id: '2',
    customerId: '1',
    type: 'HK Stock',
    name: 'Alibaba Group Holding Ltd',
    symbol: '9988.HK',
    amount: 500000,
    return: 80000,
    returnRate: 16.0,
    risk: 'High',
    market: 'HK'
  },
  {
    id: '3',
    customerId: '1',
    type: 'ETF',
    name: 'HSI ETF',
    symbol: '2800.HK',
    amount: 300000,
    return: 15000,
    returnRate: 5.0,
    risk: 'Low',
    market: 'HK'
  },
  // US Stocks
  {
    id: '4',
    customerId: '2',
    type: 'US Stock',
    name: 'Apple Inc',
    symbol: 'AAPL',
    amount: 600000,
    return: 24000,
    returnRate: 4.0,
    risk: 'Medium',
    market: 'US'
  },
  {
    id: '5',
    customerId: '2',
    type: 'US Stock',
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    amount: 400000,
    return: 32000,
    returnRate: 8.0,
    risk: 'Medium',
    market: 'US'
  },
  // Hong Kong Stocks
  {
    id: '6',
    customerId: '3',
    type: 'HK Stock',
    name: 'BYD Company Ltd',
    symbol: '1211.HK',
    amount: 300000,
    return: 75000,
    returnRate: 25.0,
    risk: 'High',
    market: 'HK'
  },
  {
    id: '7',
    customerId: '3',
    type: 'US Stock',
    name: 'Tesla Inc',
    symbol: 'TSLA',
    amount: 200000,
    return: 40000,
    returnRate: 20.0,
    risk: 'High',
    market: 'US'
  },
  // Hong Kong Stocks
  {
    id: '8',
    customerId: '4',
    type: 'Bond',
    name: 'Hong Kong Government Bond',
    symbol: 'HKGB',
    amount: 1200000,
    return: 60000,
    returnRate: 5.0,
    risk: 'Low',
    market: 'HK'
  },
  {
    id: '9',
    customerId: '4',
    type: 'HK Stock',
    name: 'Meituan',
    symbol: '3690.HK',
    amount: 800000,
    return: 32000,
    returnRate: 4.0,
    risk: 'Medium',
    market: 'HK'
  },
  // US Stocks
  {
    id: '10',
    customerId: '5',
    type: 'US Stock',
    name: 'Google LLC',
    symbol: 'GOOGL',
    amount: 800000,
    return: 32000,
    returnRate: 4.0,
    risk: 'Medium',
    market: 'US'
  },
  {
    id: '11',
    customerId: '5',
    type: 'Crypto',
    name: 'Bitcoin',
    symbol: 'BTC',
    amount: 600000,
    return: 30000,
    returnRate: 5.0,
    risk: 'High',
    market: 'Crypto'
  },
  {
    id: '12',
    customerId: '5',
    type: 'Crypto',
    name: 'Ethereum',
    symbol: 'ETH',
    amount: 400000,
    return: 20000,
    returnRate: 5.0,
    risk: 'High',
    market: 'Crypto'
  }
];

// Real market data for Hong Kong, US, and Crypto markets
export const marketData: MarketData[] = [
  // Hong Kong Stocks
  { symbol: '0700.HK', name: 'Tencent Holdings', price: 380.50, change: 8.00, changePercent: 2.1, market: 'HK', sector: 'Technology' },
  { symbol: '9988.HK', name: 'Alibaba Group', price: 85.20, change: -0.68, changePercent: -0.8, market: 'HK', sector: 'E-commerce' },
  { symbol: '3690.HK', name: 'Meituan', price: 165.30, change: 2.44, changePercent: 1.5, market: 'HK', sector: 'Food Delivery' },
  { symbol: '1211.HK', name: 'BYD Company', price: 245.80, change: 7.60, changePercent: 3.2, market: 'HK', sector: 'Automotive' },
  { symbol: '2318.HK', name: 'Ping An Insurance', price: 52.30, change: 1.80, changePercent: 3.57, market: 'HK', sector: 'Insurance' },
  { symbol: '1299.HK', name: 'AIA Group', price: 58.75, change: 0.95, changePercent: 1.64, market: 'HK', sector: 'Insurance' },
  
  // US Stocks
  { symbol: 'AAPL', name: 'Apple Inc', price: 175.43, change: 2.08, changePercent: 1.2, market: 'US', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.85, change: 3.39, changePercent: 0.9, market: 'US', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: -4.56, changePercent: -1.8, market: 'US', sector: 'Automotive' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.65, change: 0.71, changePercent: 0.5, market: 'US', sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 495.20, change: 18.90, changePercent: 3.96, market: 'US', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 153.80, change: -1.20, changePercent: -0.77, market: 'US', sector: 'E-commerce' },
  
  // Cryptocurrency
  { symbol: 'BTC', name: 'Bitcoin', price: 43250, change: 1177, changePercent: 2.8, market: 'Crypto', sector: 'Cryptocurrency' },
  { symbol: 'ETH', name: 'Ethereum', price: 2650, change: 49.4, changePercent: 1.9, market: 'Crypto', sector: 'Cryptocurrency' },
  { symbol: 'ADA', name: 'Cardano', price: 0.485, change: 0.0145, changePercent: 3.1, market: 'Crypto', sector: 'Cryptocurrency' },
  { symbol: 'DOT', name: 'Polkadot', price: 7.85, change: -0.15, changePercent: -1.88, market: 'Crypto', sector: 'Cryptocurrency' },
  { symbol: 'SOL', name: 'Solana', price: 98.45, change: 4.20, changePercent: 4.46, market: 'Crypto', sector: 'Cryptocurrency' },
  { symbol: 'AVAX', name: 'Avalanche', price: 38.90, change: 1.85, changePercent: 4.99, market: 'Crypto', sector: 'Cryptocurrency' },
];

// Mock communication records
export const mockCommunications: Communication[] = [
  {
    id: '1',
    customerId: '1',
    type: 'Meeting',
    content: 'Discussed children education fund investment planning. Client showed strong interest in education insurance products.',
    date: '2025-12-10',
    outcome: 'Client needs to review detailed product information',
    nextAction: 'Send detailed product materials and arrange next meeting'
  },
  {
    id: '2',
    customerId: '1',
    type: 'Phone',
    content: 'Regular follow-up call to understand recent investment experience and market outlook',
    date: '2025-12-05',
    outcome: 'High client satisfaction, willing to increase investment amount',
    nextAction: 'Prepare new investment proposal'
  },
  {
    id: '3',
    customerId: '2',
    type: 'WeChat',
    content: 'Client inquired about the impact of market adjustment on fund investments',
    date: '2025-12-09',
    outcome: 'Addressed client concerns, advised to continue holding',
    nextAction: 'Continue monitoring market changes'
  },
  {
    id: '4',
    customerId: '3',
    type: 'Phone',
    content: 'Client dissatisfied with recent portfolio performance, requested strategy adjustment',
    date: '2025-12-08',
    outcome: 'Suggested reducing stock positions, increasing conservative products',
    nextAction: 'Develop new asset allocation plan'
  },
  {
    id: '5',
    customerId: '4',
    type: 'Meeting',
    content: 'Discussed retirement planning and insurance allocation needs',
    date: '2025-12-07',
    outcome: 'Client approved recommended pension insurance products',
    nextAction: 'Assist with insurance application process'
  },
  {
    id: '6',
    customerId: '5',
    type: 'Email',
    content: 'Sent latest tax planning advice and financial product recommendations',
    date: '2025-12-06',
    outcome: 'Client needs time to consider',
    nextAction: 'Follow up contact in one week'
  }
];

// Mock investment advice
export const mockAdvices: InvestmentAdvice[] = [
  {
    id: '1',
    customerId: '1',
    title: 'Education Fund Portfolio Optimization',
    content: 'Recommend allocating 20% of assets to education insurance products to ensure the safety of children\'s education funds. Also consider partial index fund allocation for long-term returns.',
    riskLevel: 'Medium',
    expectedReturn: 8.5,
    timeFrame: '5-10 years',
    status: 'Pending',
    createdAt: '2025-12-10'
  },
  {
    id: '2',
    customerId: '1',
    title: 'Stock Portfolio Adjustment',
    content: 'Recommend reducing overweighted high-valuation stocks and increasing allocation to quality growth stocks. Focus on healthcare, consumer, and technology sectors.',
    riskLevel: 'High',
    expectedReturn: 12.0,
    timeFrame: '1-3 years',
    status: 'Confirmed',
    createdAt: '2025-12-08'
  },
  {
    id: '3',
    customerId: '2',
    title: 'Conservative Investment Plan',
    content: 'Current asset allocation is relatively conservative. Recommend moderate increase in mixed fund allocation to enhance overall return levels.',
    riskLevel: 'Medium',
    expectedReturn: 6.5,
    timeFrame: '2-5 years',
    status: 'Executed',
    createdAt: '2025-12-05'
  },
  {
    id: '4',
    customerId: '3',
    title: 'Risk Control Recommendations',
    content: 'Current investment portfolio risk is relatively high. Recommend reducing high-risk stock allocation and increasing bond and financial product proportions.',
    riskLevel: 'Low',
    expectedReturn: 5.0,
    timeFrame: '1-2 years',
    status: 'Pending',
    createdAt: '2025-12-08'
  },
  {
    id: '5',
    customerId: '4',
    title: 'Retirement Security Enhancement',
    content: 'Recommend increasing commercial pension insurance allocation while configuring partial pension target funds to build a diversified retirement security system.',
    riskLevel: 'Low',
    expectedReturn: 4.5,
    timeFrame: '10-20 years',
    status: 'Confirmed',
    createdAt: '2025-12-07'
  }
];

// Exchange rates for HKD/USD conversion
export const exchangeRates = {
  USD: 1.0,
  HKD: 7.80,
  CNY: 7.25
};

// Dashboard statistics
export const dashboardStats = {
  totalCustomers: mockCustomers.length,
  totalAssets: mockCustomers.reduce((sum, customer) => sum + customer.totalAssets, 0),
  avgAssets: 0,
  activeCustomers: mockCustomers.filter(c => c.status === 'Active').length,
  pendingFollowUps: mockCustomers.filter(c => c.status === 'Pending').length,
  totalInvestments: mockInvestments.length,
  avgReturnRate: 0,
  highRiskCustomers: mockCustomers.filter(c => c.riskLevel === 'Aggressive').length,
  hkStocksCount: mockInvestments.filter(i => i.market === 'HK').length,
  usStocksCount: mockInvestments.filter(i => i.market === 'US').length,
  cryptoCount: mockInvestments.filter(i => i.market === 'Crypto').length
};

// Calculate averages
dashboardStats.avgAssets = dashboardStats.totalAssets / dashboardStats.totalCustomers;
dashboardStats.avgReturnRate = mockInvestments.reduce((sum, inv) => sum + inv.returnRate, 0) / mockInvestments.length;

// AI Investment Advice Details
export const aiAdviceDetails: AIAdviceDetail[] = [
  {
    id: '1',
    adviceId: '1',
    strategy: 'Education Fund Portfolio Optimization',
    reasoning: 'Based on your child\'s current age and your 12-year investment experience, we recommend a balanced approach that prioritizes capital preservation while achieving moderate growth. The 5-10 year timeframe aligns perfectly with your liquidity needs.',
    marketAnalysis: 'Current market conditions show stable growth in education-related sectors. Healthcare and consumer staples sectors demonstrate resilience during economic uncertainty. Technology sector offers growth potential with manageable risk.',
    riskAssessment: 'Medium risk level appropriate for your Growth risk profile. Portfolio diversification across sectors reduces concentration risk while maintaining growth potential.',
    expectedReturn: {
      conservative: 6.5,
      moderate: 8.5,
      optimistic: 11.2
    },
    timeline: [
      {
        phase: 'Immediate (0-3 months)',
        action: 'Establish education insurance policy',
        target: 'Secure 20% allocation',
        duration: '3 months'
      },
      {
        phase: 'Short-term (3-12 months)',
        action: 'Build core ETF positions',
        target: 'Accumulate 15% allocation',
        duration: '9 months'
      },
      {
        phase: 'Medium-term (1-5 years)',
        action: 'Optimize allocation',
        target: 'Rebalance quarterly',
        duration: 'Ongoing'
      }
    ],
    assetAllocation: [
      {
        category: 'Education Insurance',
        percentage: 20,
        reasoning: 'Capital protection with guaranteed returns',
        specificProducts: ['Education Life Insurance', 'Education Endowment']
      },
      {
        category: 'Conservative Funds',
        percentage: 30,
        reasoning: 'Stable returns with low volatility',
        specificProducts: ['Bond Fund', 'Money Market Fund']
      },
      {
        category: 'Growth Funds',
        percentage: 35,
        reasoning: 'Capital appreciation potential',
        specificProducts: ['Equity Fund', 'Balanced Fund']
      },
      {
        category: 'Alternative Investments',
        percentage: 15,
        reasoning: 'Portfolio diversification',
        specificProducts: ['REITs', 'Commodity Fund']
      }
    ],
    keyMetrics: {
      sharpeRatio: 1.2,
      maxDrawdown: -8.5,
      volatility: 12.3,
      beta: 0.85
    }
  }
];

// Investment Advice History
export const adviceHistory: AdviceHistory[] = [
  {
    id: '1',
    customerId: '1',
    adviceId: '3',
    status: 'Executed',
    executedAt: '2025-11-15',
    actualReturn: 7.2,
    expectedReturn: 6.5,
    performance: 'Exceed',
    notes: 'Client satisfied with performance. Portfolio exceeded expectations due to strong equity market performance.',
    feedback: 'Excellent execution. Recommend continuing current strategy.'
  },
  {
    id: '2',
    customerId: '2',
    adviceId: '2',
    status: 'Executed',
    executedAt: '2025-10-20',
    actualReturn: 5.8,
    expectedReturn: 6.0,
    performance: 'Meet',
    notes: 'Conservative approach worked well in market downturn.',
    feedback: 'Strategy performed as expected during volatile period.'
  },
  {
    id: '3',
    customerId: '3',
    adviceId: '4',
    status: 'Rejected',
    notes: 'Client concerned about lower expected returns and chose alternative strategy.',
    feedback: 'Client preferred higher risk tolerance than recommended.',
    expectedReturn: 5.0,
    performance: 'Underperform'
  }
];

// Industry distribution data for dashboard
export const industryDistribution = [
  { industry: 'Technology', count: 2, percentage: 40 },
  { industry: 'Finance', count: 1, percentage: 20 },
  { industry: 'Healthcare', count: 1, percentage: 20 },
  { industry: 'Manufacturing', count: 1, percentage: 20 }
];

// Income level distribution for dashboard
export const incomeDistribution = [
  { range: '< 600K', count: 1, percentage: 10 },
  { range: '600K - 1M', count: 2, percentage: 20 },
  { range: '1M - 1.5M', count: 3, percentage: 30 },
  { range: '1.5M+', count: 4, percentage: 40 }
];

// Enhanced industry distribution with more detailed data
export const enhancedIndustryDistribution = [
  { 
    industry: 'Technology', 
    count: 2, 
    percentage: 20,
    subcategories: ['Software Development', 'Digital Marketing'],
    avgIncome: 950000,
    avgAssets: 2800000
  },
  { 
    industry: 'Finance', 
    count: 1, 
    percentage: 10,
    subcategories: ['Investment Banking'],
    avgIncome: 1405000,
    avgAssets: 1500000
  },
  { 
    industry: 'Healthcare', 
    count: 1, 
    percentage: 10,
    subcategories: ['Medical Practice'],
    avgIncome: 1620000,
    avgAssets: 3200000
  },
  { 
    industry: 'Manufacturing', 
    count: 1, 
    percentage: 10,
    subcategories: ['Electronics Manufacturing'],
    avgIncome: 1070000,
    avgAssets: 2100000
  },
  { 
    industry: 'Real Estate', 
    count: 1, 
    percentage: 10,
    subcategories: ['Property Development'],
    avgIncome: 812000,
    avgAssets: 950000
  },
  { 
    industry: 'Retail', 
    count: 1, 
    percentage: 10,
    subcategories: ['Fashion Retail'],
    avgIncome: 858000,
    avgAssets: 1750000
  },
  { 
    industry: 'Legal Services', 
    count: 1, 
    percentage: 10,
    subcategories: ['Corporate Law'],
    avgIncome: 1510000,
    avgAssets: 2850000
  },
  { 
    industry: 'Media & Entertainment', 
    count: 1, 
    percentage: 10,
    subcategories: ['Digital Marketing'],
    avgIncome: 519000,
    avgAssets: 450000
  },
  { 
    industry: 'Education', 
    count: 1, 
    percentage: 10,
    subcategories: ['Higher Education'],
    avgIncome: 1317600,
    avgAssets: 4200000
  }
];

// Enhanced financial goals with more detail
export const enhancedFinancialGoals = {
  'Education Planning': {
    priority: 'High',
    timeline: '5-15 years',
    estimatedAmount: 500000,
    products: ['Education Insurance', 'Education Fund', 'Investment-linked Insurance']
  },
  'Retirement Planning': {
    priority: 'High',
    timeline: '10-30 years',
    estimatedAmount: 3000000,
    products: ['Pension Insurance', 'Retirement Fund', 'MPF', 'Annuity']
  },
  'Property Investment': {
    priority: 'Medium',
    timeline: '3-10 years',
    estimatedAmount: 2000000,
    products: ['Property Fund', 'REITs', 'Mortgage Insurance']
  },
  'Wealth Preservation': {
    priority: 'High',
    timeline: 'Long-term',
    estimatedAmount: 5000000,
    products: ['Conservative Funds', 'Bonds', 'Stable Income Products']
  },
  'Business Investment': {
    priority: 'Medium',
    timeline: '1-5 years',
    estimatedAmount: 1000000,
    products: ['Growth Funds', 'Equity Investment', 'Business Insurance']
  }
};

// AI Investment Advice Summary for Dashboard
export const aiAdviceSummary = {
  totalAdvices: mockAdvices.length,
  pendingAdvices: mockAdvices.filter(a => a.status === 'Pending').length,
  averageConfidence: 85.6,
  avgExpectedReturn: mockAdvices.reduce((sum, a) => sum + a.expectedReturn, 0) / mockAdvices.length,
  riskDistribution: {
    low: mockAdvices.filter(a => a.riskLevel === 'Low').length,
    medium: mockAdvices.filter(a => a.riskLevel === 'Medium').length,
    high: mockAdvices.filter(a => a.riskLevel === 'High').length
  }
};