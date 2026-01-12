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
import adviceRoutes from './routes/advice_4.4.js';
import dashboardRoutes from './routes/dashboard.js';
import communicationRoutes from './routes/communications.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { cacheMiddleware, cacheManager } from './middleware/cache.js';

// Import services - v4.4 versions
import { DatabaseService } from './services/database_4.4.js';
import { MarketDataService } from './services/marketData.js';
import { CacheService } from './services/cache.js';
import { SparkService } from './services/spark_4.4.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(requestLogger);

// Static file serving
app.use('/static', express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Poros 4.4 Backend API is running',
    version: '4.4',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/market', marketRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/advice', adviceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/communications', communicationRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Route ${req.originalUrl} not found`,
    version: '4.4'
  });
});

async function startServer() {
  console.log('🚀 Starting Poros 4.4 Backend Server...\n');
  
  try {
    // Initialize services
    const dbService = new DatabaseService();
    const marketDataService = new MarketDataService();
    const cacheService = new CacheService();
    const sparkService = new SparkService();
    
    console.log('📦 Initializing database service...');
    await dbService.initialize();
    
    // Fix database issues on startup
    await fixAndSeedDatabase(dbService);
    
    console.log('📦 Initializing market data service...');
    await marketDataService.initialize();
    
    console.log('📦 Initializing cache service...');
    cacheManager.initialize();
    
    console.log('📦 Initializing Spark AI service...');
    
    // Make services available to routes
    app.locals.dbService = dbService;
    app.locals.marketDataService = marketDataService;
    app.locals.cacheService = cacheService;
    app.locals.sparkService = sparkService;
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Poros Backend API running on port ${PORT}`);
      console.log('🏢 Company: Poros Technologies');
      console.log('🌍 Environment: development');
      console.log('📊 Health check: http://localhost:' + PORT + '/api/health');
      console.log(`🤖 AI Service: ${sparkService.APPID ? '讯飞星火大模型已配置' : '使用模拟数据'}`);
      console.log('✅ Server ready for requests\n');
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📴 SIGTERM received, shutting down gracefully');
      server.close(async () => {
        await dbService.close();
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('📴 SIGINT received, shutting down gracefully');
      server.close(async () => {
        await dbService.close();
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

async function fixAndSeedDatabase(dbService) {
  console.log('🔧 Checking database integrity...');
  
  try {
    // Import and run database fixer
    const { default: DatabaseFixer } = await import('./database_fix_4.4.js');
    const fixer = new DatabaseFixer();
    await fixer.fixDatabase();
    
    console.log('✅ Database fixes completed');
  } catch (error) {
    console.warn('⚠️ Database fixes failed (this may be normal if data already exists):', error.message);
  }
}

// Start the server
startServer().catch(error => {
  console.error('💥 Failed to start Poros 4.4 backend:', error);
  process.exit(1);
});