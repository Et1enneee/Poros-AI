import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes
import marketRoutes from './routes/market.js';
import customerRoutes from './routes/customers.js';
import portfolioRoutes from './routes/portfolio.js';
import adviceRoutes from './routes/advice.js';
import dashboardRoutes from './routes/dashboard.js';
import communicationRoutes from './routes/communications.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { cacheMiddleware, cacheManager } from './middleware/cache.js';

// Import services
import DatabaseService from './services/database.js';
import { MarketDataService } from './services/marketData.js';
import CacheService from './services/cache.js';
import { SparkService } from './services/spark.js';
import InvestmentAdvisor from './services/ai/InvestmentAdvisor.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression and parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:3000', 'http://localhost:5173']
    : true,
  credentials: true
}));

// Logging
app.use(requestLogger);

// Initialize services
const dbService = new DatabaseService();
const marketDataService = new MarketDataService();
const cacheService = new CacheService();
const sparkService = new SparkService();
const investmentAdvisor = new InvestmentAdvisor();

// Make services available to routes
app.locals.dbService = dbService;
app.locals.marketDataService = marketDataService;
app.locals.cacheService = cacheService;
app.locals.sparkService = sparkService;
app.locals.investmentAdvisor = investmentAdvisor;

// Health check endpoint
app.get('/api/health', (req, res) => {
  const aiStatus = {
    provider: '讯飞星火大模型 + 增强版DeepSeek',
    apiConfigured: !!(process.env.SPARK_APPID && process.env.SPARK_API_KEY && process.env.SPARK_API_SECRET) || !!process.env.DEEPSEEK_API_KEY,
    capabilities: ['个性化投资建议', '客户信息深度分析', '智能风险评估', '投资策略优化', '客制化市场分析']
  };
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Poros Backend API',
    version: '5.0.1 - Communication修复 + AI客制化版本',
    company: 'Poros Technologies',
    description: 'Poros 5.0.1 - Communication功能完全修复 + 增强版AI客制化服务',
    environment: process.env.NODE_ENV || 'development',
    ai_service: aiStatus,
    database: {
      type: 'SQLite',
      path: dbService.dbPath,
      status: 'connected'
    },
    fixes: {
      communication_records: '✅ 已修复communication记录添加问题',
      database_schema: '✅ 已修复SQLite数据库架构问题',
      ai_personalization: '✅ 已实现AI客制化服务',
      api_error_handling: '✅ 已改进API错误处理'
    },
    new_features: {
      enhanced_ai: '🎯 增强版AI服务，支持客户详细信息个性化',
      personalized_advice: '🎯 基于客户年龄、收入、风险偏好的个性化投资建议',
      life_stage_analysis: '🎯 基于人生阶段的投资策略分析',
      custom_risk_assessment: '🎯 客制化风险评估和缓解建议'
    }
  });
});

// API routes
app.use('/api/market', cacheMiddleware(300), marketRoutes); // Cache for 5 minutes
app.use('/api/customers', customerRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/dashboard', cacheMiddleware(60), dashboardRoutes); // Cache for 1 minute
app.use('/api/communications', communicationRoutes);

// Serve static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
const server = app.listen(PORT, async () => {
  try {
    // Initialize database
    await dbService.initialize();
    console.log(`✅ SQLite数据库初始化成功`);
    
    // Initialize AI service
    console.log(`✅ 增强版AI服务已就绪`);
    const aiConfigured = !!(process.env.SPARK_APPID && process.env.SPARK_API_KEY && process.env.SPARK_API_SECRET) || !!process.env.DEEPSEEK_API_KEY;
    if (aiConfigured) {
      console.log(`✅ AI API 配置完成`);
    } else {
      console.log(`⚠️ AI API 未配置，使用模拟数据`);
    }
    
    // Start market data updates
    marketDataService.startRealTimeUpdates();
    console.log(`✅ Market data service started`);
    
    console.log(`🚀 Poros Backend API running on port ${PORT}`);
    console.log(`🏢 Company: Poros Technologies`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎯 Communication功能已修复 - 现在可以正常添加沟通记录了！`);
    console.log(`🤖 AI客制化服务已启用 - 现在可以为每个客户提供个性化投资建议！`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM. Graceful shutdown...');
  server.close(async () => {
    try {
      await dbService.close();
      console.log('✅ Database closed');
    } catch (error) {
      console.error('❌ Error closing database:', error);
    }
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT. Graceful shutdown...');
  server.close(async () => {
    try {
      await dbService.close();
      console.log('✅ Database closed');
    } catch (error) {
      console.error('❌ Error closing database:', error);
    }
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;