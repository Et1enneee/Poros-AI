---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 3045022046fe2ee98fba5629efd6bbbb9b43e3699e86c5b46c434624e64a7f73bd5bfe34022100cf2f1c5c6b6551da6a1ede6a3b4d37181fab3f1c5dfe737e27ae57882abeeae8
    ReservedCode2: 3045022100f0382495e7537cea93d89a8668bfb589ef692671869fc29105814d778ced1bce0220134cf3e2a173e628640ecb41732d3671f67d9383b6988a13f5b5ab1e44c83a92
---

# Poros - 技术架构文档

## 概述

Poros是一个基于现代Web技术栈构建的全栈应用，采用前后端分离架构，支持本地部署和容器化部署。

## 技术栈

### 前端技术栈
- **React 18**: 现代化前端框架
- **TypeScript**: 类型安全的JavaScript
- **Vite**: 快速的构建工具
- **Tailwind CSS**: 实用优先的CSS框架
- **Radix UI**: 无障碍的UI组件库
- **Recharts**: 数据可视化图表库
- **React Router**: 客户端路由
- **Axios**: HTTP客户端

### 后端技术栈
- **Node.js**: JavaScript运行时
- **Express.js**: Web应用框架
- **SQLite**: 轻量级数据库
- **better-sqlite3**: SQLite Node.js驱动
- **Winston**: 日志库
- **Joi**: 数据验证库

### 开发工具
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Nodemon**: 开发时自动重启
- **Docker**: 容器化部署

## 架构设计

### 整体架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   SQLite DB     │
│   (Port 5173)   │◄──►│   (Port 3001)   │◄──►│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         └──────────────►│  Market Data    │◄─────────────┘
                         │  Service        │
                         └─────────────────┘
```

### 目录结构

```
wealth-management-platform/
├── backend/                     # 后端应用
│   ├── middleware/             # 中间件
│   │   ├── errorHandler.js     # 错误处理
│   │   ├── logger.js          # 日志中间件
│   │   └── cache.js           # 缓存中间件
│   ├── routes/                # 路由定义
│   │   ├── market.js          # 市场数据路由
│   │   ├── customers.js       # 客户管理路由
│   │   ├── portfolio.js       # 投资组合路由
│   │   ├── advice.js          # 投资建议路由
│   │   └── dashboard.js       # 仪表板路由
│   ├── services/              # 业务逻辑服务
│   │   ├── database.js        # 数据库服务
│   │   ├── marketData.js      # 市场数据服务
│   │   └── cache.js           # 缓存服务
│   ├── scripts/               # 数据库脚本
│   │   ├── init-database.js   # 数据库初始化
│   │   └── seed-database.js   # 种子数据
│   ├── server.js              # 主服务器文件
│   └── package.json           # 后端依赖
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── components/        # React组件
│   │   ├── pages/            # 页面组件
│   │   ├── hooks/            # 自定义Hook
│   │   ├── services/         # API服务
│   │   ├── lib/              # 工具函数
│   │   └── data/             # 模拟数据
│   ├── public/               # 静态资源
│   ├── package.json          # 前端依赖
│   └── vite.config.ts        # Vite配置
├── database/                  # 数据库文件
├── docs/                     # 技术文档
├── scripts/                  # 部署脚本
├── docker-compose.yml        # Docker编排
└── README.md                # 部署文档
```

## 核心组件设计

### 1. 数据库层 (Database Layer)

#### 设计原则
- **单一职责**: 每个服务类负责特定的数据操作
- **连接池**: 复用数据库连接，提高性能
- **事务支持**: 保证数据一致性
- **索引优化**: 提高查询性能

#### 核心服务类

```javascript
// DatabaseService - 数据库操作封装
class DatabaseService {
  // 通用CRUD操作
  query(sql, params)      // 查询多条记录
  get(sql, params)        // 查询单条记录
  run(sql, params)        // 执行插入/更新/删除
  
  // 业务方法
  getCustomers()          // 获取所有客户
  getPortfolios(customerId) // 获取客户投资组合
  updateMarketData(symbol, data) // 更新市场数据
}
```

#### 数据库表结构

```sql
-- 客户表
customers (
  id, customer_id, name, email, phone,
  age, income_range, risk_tolerance,
  investment_horizon, investment_goals,
  created_at, updated_at
)

-- 投资组合表
portfolios (
  id, customer_id, portfolio_name,
  total_value, cash_balance, investment_amount,
  risk_level, created_at, updated_at
)

-- 持仓表
holdings (
  id, portfolio_id, symbol, quantity,
  avg_cost, current_price, market_value,
  unrealized_pnl, last_updated
)

-- 市场数据表
market_data (
  id, symbol, name, price, change_amount,
  change_percent, volume, market_cap,
  pe_ratio, dividend_yield, last_updated
)

-- 投资建议表
investment_advice (
  id, customer_id, advice_type, title,
  description, recommended_actions, risk_level,
  expected_return, priority, status, created_at
)
```

### 2. 业务逻辑层 (Business Logic Layer)

#### 市场数据服务 (MarketDataService)

```javascript
class MarketDataService {
  // 实时数据获取
  async getRealTimeData(symbol)
  
  // 批量数据获取
  async getBatchData(symbols)
  
  // ETF数据获取
  async getETFData()
  
  // 市场摘要
  async getMarketSummary()
  
  // 自动更新
  startRealTimeUpdates()
}
```

#### 缓存服务 (CacheService)

```javascript
class CacheService {
  // 基础缓存操作
  get(key)
  set(key, value, ttl)
  del(key)
  
  // 业务缓存
  setMarketData(symbol, data, ttl)
  setCustomerData(customerId, data, ttl)
  setPortfolioData(portfolioId, data, ttl)
  
  // 缓存管理
  invalidateCustomerCache(customerId)
  warmUpCache(dbService, marketDataService)
}
```

### 3. API层 (API Layer)

#### 路由设计原则
- **RESTful风格**: 遵循REST API设计规范
- **分层架构**: 路由 -> 控制器 -> 服务 -> 数据访问
- **错误处理**: 统一的错误处理机制
- **数据验证**: 输入参数验证

#### 主要路由模块

```javascript
// 市场数据路由
GET    /api/market/:symbol           // 获取实时数据
POST   /api/market/batch             // 批量获取数据
GET    /api/market/etf/list          // ETF列表
GET    /api/market/summary           // 市场摘要

// 客户管理路由
GET    /api/customers                // 获取所有客户
GET    /api/customers/:id            // 获取特定客户
POST   /api/customers                // 创建客户
PUT    /api/customers/:id            // 更新客户
DELETE /api/customers/:id            // 删除客户

// 投资组合路由
GET    /api/portfolio/customer/:id   // 客户投资组合
GET    /api/portfolio/:id            // 投资组合详情
POST   /api/portfolio                // 创建投资组合
POST   /api/portfolio/:id/holdings   // 添加持仓
```

### 4. 中间件层 (Middleware Layer)

#### 缓存中间件

```javascript
// 缓存装饰器
export const cache = (ttl = 300) => {
  return (req, res, next) => {
    const key = `cache:${req.method}:${req.originalUrl}`;
    
    // 尝试获取缓存数据
    const cached = cacheService.get(key);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(cached);
    }
    
    // 拦截响应进行缓存
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cacheService.set(key, data, ttl);
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };
    
    next();
  };
};
```

#### 错误处理中间件

```javascript
export const errorHandler = (error, req, res, next) => {
  // 根据错误类型设置HTTP状态码
  let status = 500;
  let message = 'Internal Server Error';
  
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
  } else if (error.name === 'NotFoundError') {
    status = 404;
    message = 'Not Found';
  }
  
  // 返回错误响应
  res.status(status).json({
    error: message,
    timestamp: new Date().toISOString(),
    path: req.path
  });
};
```

## 前端架构

### 组件设计模式

#### 1. 页面组件 (Page Components)
```typescript
// Dashboard.tsx - 仪表板页面
const Dashboard: React.FC = () => {
  const { data: overview, isLoading } = useDashboardOverview();
  const { data: market } = useMarketSummary();
  
  return (
    <div className="p-6">
      {/* 页面内容 */}
    </div>
  );
};
```

#### 2. 自定义 Hooks
```typescript
// useMarketData.ts
export const useMarketData = (symbol: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['market', symbol],
    queryFn: () => marketAPI.getRealTimeData(symbol),
    refetchInterval: 30000, // 30秒刷新
  });
  
  return { data, isLoading, error };
};
```

#### 3. API 服务层
```typescript
// marketDataService.ts
export const marketAPI = {
  getRealTimeData: (symbol: string) => 
    axios.get(`/api/market/${symbol}`),
    
  getBatchData: (symbols: string[]) =>
    axios.post('/api/market/batch', { symbols }),
    
  getETFList: () =>
    axios.get('/api/market/etf/list'),
};
```

### 状态管理

采用 React Query + Context API 进行状态管理：

```typescript
// 全局状态上下文
const AppContext = createContext<AppState | null>(null);

// 局部状态使用 React Query
const { data, isLoading } = useQuery({
  queryKey: ['customers'],
  queryFn: () => customerAPI.getAll(),
});
```

## 数据流架构

### 请求流程

```
1. 前端发起请求
   ↓
2. Vite 代理到后端
   ↓
3. Express 路由匹配
   ↓
4. 中间件处理（认证、缓存、日志）
   ↓
5. 业务逻辑处理
   ↓
6. 数据库操作
   ↓
7. 响应数据格式化
   ↓
8. 前端状态更新
```

### 数据缓存策略

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   首次请求   │───►│   数据库查询 │───►│   设置缓存   │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  返回缓存   │◄───│  缓存检查   │◄───│  后续请求   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 性能优化策略

### 1. 前端优化

#### 代码分割
```javascript
// vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      router: ['react-router-dom'],
      charts: ['recharts']
    }
  }
}
```

#### 懒加载
```typescript
const CustomerManagement = lazy(() => import('./pages/CustomerManagement'));
```

#### React Query 缓存
```typescript
const { data } = useQuery({
  queryKey: ['customers'],
  queryFn: () => customerAPI.getAll(),
  staleTime: 5 * 60 * 1000, // 5分钟
  cacheTime: 10 * 60 * 1000, // 10分钟
});
```

### 2. 后端优化

#### 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_portfolios_customer ON portfolios(customer_id);
CREATE INDEX idx_holdings_portfolio ON holdings(portfolio_id);
```

#### 缓存策略
- **市场数据**: 60秒缓存
- **客户数据**: 5分钟缓存
- **投资组合**: 2分钟缓存
- **静态数据**: 10分钟缓存

#### 连接池
```javascript
// better-sqlite3 自动管理连接池
const db = new Database(dbPath, {
  readonly: false,
  fileMustExist: false,
  timeout: 5000
});
```

### 3. 网络优化

#### Gzip 压缩
```javascript
// server.js
app.use(compression());
```

#### HTTP/2 支持
```javascript
// 生产环境启用 HTTP/2
if (process.env.NODE_ENV === 'production') {
  const http2 = require('http2');
  // HTTP/2 配置
}
```

## 安全设计

### 1. 输入验证

#### Joi 验证
```javascript
const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(120),
  risk_tolerance: Joi.string().valid('conservative', 'moderate', 'aggressive')
});
```

#### SQL注入防护
```javascript
// 使用参数化查询
const stmt = db.prepare('SELECT * FROM customers WHERE email = ?');
const result = stmt.get(email);
```

### 2. 安全头部

```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

### 3. 速率限制

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP最多100个请求
  message: 'Too many requests from this IP'
});
```

## 部署架构

### 开发环境
```
开发机器
├── Node.js 开发服务器
│   ├── 前端 (Vite + React)
│   └── 后端 (Express + SQLite)
└── 数据库文件 (SQLite)
```

### 生产环境
```
Docker 容器
├── 应用容器
│   ├── Node.js 应用
│   ├── 静态文件服务
│   └── SQLite 数据库
└── 可选外部服务
    ├── Redis (缓存)
    ├── PostgreSQL (数据库)
    └── 监控服务
```

### 容器化设计

```yaml
# docker-compose.yml
services:
  wealth-management:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    volumes:
      - ./database:/app/database  # 持久化数据
      - ./logs:/app/logs          # 日志文件
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
```

## 监控和日志

### 1. 应用日志

```javascript
// Winston 日志配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

### 2. 性能监控

```javascript
// 请求时间监控
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
};
```

### 3. 健康检查

```javascript
// 健康检查端点
app.get('/api/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  };
  
  res.json(health);
});
```

## 扩展性设计

### 1. 模块化架构

每个功能模块独立设计，便于扩展：

```
├── market-module/          # 市场数据模块
├── customer-module/        # 客户管理模块
├── portfolio-module/       # 投资组合模块
├── advice-module/          # 投资建议模块
└── report-module/          # 报告模块
```

### 2. 微服务准备

当前单体架构设计支持未来向微服务迁移：

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  前端应用    │  │  API网关    │  │  用户服务   │
└─────────────┘  └─────────────┘  └─────────────┘
                      │                  │
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 静态资源    │  │  认证服务   │  │  投资服务   │
└─────────────┘  └─────────────┘  └─────────────┘
```

### 3. 插件系统

```javascript
// 插件接口定义
interface MarketDataPlugin {
  name: string;
  version: string;
  initialize(): Promise<void>;
  getData(symbol: string): Promise<MarketData>;
}

// 插件注册
const pluginManager = {
  plugins: new Map(),
  register(plugin: MarketDataPlugin) {
    this.plugins.set(plugin.name, plugin);
  }
};
```

## 测试策略

### 1. 单元测试

```javascript
// 数据库服务测试
describe('DatabaseService', () => {
  test('should create customer successfully', async () => {
    const customerData = {
      customer_id: 'TEST_001',
      name: 'Test Customer',
      email: 'test@example.com'
    };
    
    const result = await dbService.createCustomer(customerData);
    expect(result.lastInsertRowid).toBeDefined();
  });
});
```

### 2. API 测试

```javascript
// Supertest API测试
describe('Customer API', () => {
  test('GET /api/customers should return customer list', async () => {
    const response = await request(app)
      .get('/api/customers')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

### 3. 前端测试

```typescript
// React组件测试
describe('CustomerForm', () => {
  test('should submit form successfully', async () => {
    render(<CustomerForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    
    fireEvent.click(screen.getByText(/submit/i));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe'
      });
    });
  });
});
```

## 未来发展规划

### 短期目标 (1-3个月)
- [ ] 添加用户认证和授权
- [ ] 实现实时数据推送 (WebSocket)
- [ ] 添加移动端支持 (PWA)
- [ ] 完善测试覆盖率

### 中期目标 (3-6个月)
- [ ] 微服务架构迁移
- [ ] 分布式缓存 (Redis)
- [ ] 消息队列 (RabbitMQ)
- [ ] 容器编排 (Kubernetes)

### 长期目标 (6-12个月)
- [ ] 机器学习投资建议
- [ ] 多租户支持
- [ ] 第三方API集成
- [ ] 高级分析和报告

---

**文档版本**: 1.0.0  
**最后更新**: 2025-12-12  
**维护者**: 财富管理平台开发团队