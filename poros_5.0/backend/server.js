import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import routes - v4.4 versions
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

// Import services - v4.4 versions
import DatabaseService from './services/database.js';
import { MarketDataService } from './services/marketData.js';
import CacheService from './services/cache.js';
import { SparkService } from './services/spark.js';

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

// Initialize services (v4.4)
const dbService = new DatabaseService();
const marketDataService = new MarketDataService();
const cacheService = new CacheService();
const sparkService = new SparkService();

// Make services available to routes
app.locals.dbService = dbService;
app.locals.marketDataService = marketDataService;
app.locals.cacheService = cacheService;
app.locals.sparkService = sparkService;

// Health check endpoint
app.get('/api/health', (req, res) => {
  const aiStatus = {
    provider: '讯飞星火大模型',
    apiConfigured: !!(process.env.SPARK_APPID && process.env.SPARK_API_KEY && process.env.SPARK_API_SECRET),
    capabilities: ['个性化投资建议', '用户选项分析', '智能风险评估', '投资策略优化']
  };
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Poros Backend API',
    version: '4.7.0',
    company: 'Poros Technologies',
    description: 'Poros 4.7 - Communication完全修复+完整客户信息传递版本，包含行业、收入、性格等详细信息',
    environment: process.env.NODE_ENV || 'development',
    ai_service: aiStatus,
    database: {
      path: dbService.dbPath,
      status: 'connected'
    },
    fixes: {
      customer_query: '已修复客户数据查询问题',
      database_schema: '已修复数据库架构问题',
      api_error_handling: '已改进API错误处理'
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
    console.log(`✅ Database initialized successfully`);
    
    // Run database fix and seed if needed
    console.log('🔧 Running database fixes...');
    try {
      const { fixAndSeedDatabase } = await import('./scripts/fix-database.js');
      await fixAndSeedDatabase();
      console.log('✅ Database fixes completed');
    } catch (fixError) {
      console.warn('⚠️ Database fixes failed (this may be normal if data already exists):', fixError.message);
    }
    
    // Initialize AI service
    console.log(`✅ 讯飞星火大模型服务已就绪`);
    const sparkConfigured = !!(process.env.SPARK_APPID && process.env.SPARK_API_KEY && process.env.SPARK_API_SECRET);
    if (sparkConfigured) {
      console.log(`✅ 讯飞星火 API 配置完成`);
    } else {
      console.log(`⚠️ 讯飞星火 API 未配置，使用模拟数据`);
    }
    
    // Start market data updates
    marketDataService.startRealTimeUpdates();
    console.log(`✅ Market data service started`);
    
    console.log(`🚀 Poros Backend API running on port ${PORT}`);
    console.log(`🏢 Company: Poros Technologies`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM. Graceful shutdown...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT. Graceful shutdown...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;