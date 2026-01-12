---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 3046022100dba2ced5f6562309aefd5474879d77952cc2fbd2f5ea0513c51330812b83cccd022100e82596787c454ec9f5dd0a3e22a9f140c44e7b5e75d389281f9efd6eb716dbfc
    ReservedCode2: 3045022100afaf9ec6bcdd953a911749476db89af822dfd7a75254776a9dc8a76d4913be86022052c466eac3996072b754d48c866a3651f3f5eb1f767e0cbf601e3dfdbb3077f2
---

# 财富管理平台 - 故障排除指南

## 概述

本指南提供了财富管理平台部署和运行过程中常见问题的解决方案。

## 快速诊断

### 系统要求检查

```bash
# 检查 Node.js 版本 (需要 16+)
node --version

# 检查 npm 版本
npm --version

# 检查操作系统信息
# Windows
systeminfo | findstr /C:"OS Name" /C:"OS Version"

# Mac/Linux
uname -a
```

### 服务状态检查

```bash
# 检查端口占用
# Windows
netstat -an | findstr :3001
netstat -an | findstr :5173

# Mac/Linux
lsof -i :3001
lsof -i :5173

# 检查进程
# Windows
tasklist | findstr node

# Mac/Linux
ps aux | grep node
```

## 常见问题及解决方案

### 1. 安装和依赖问题

#### 问题：npm install 失败

**症状**：
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方案**：
```bash
# 1. 清理 npm 缓存
npm cache clean --force

# 2. 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json  # Mac/Linux
# 或 Windows
rmdir /s node_modules
del package-lock.json

# 3. 重新安装依赖
npm install

# 4. 如果仍有问题，尝试使用yarn
npm install -g yarn
yarn install
```

#### 问题：权限错误

**症状**：
```
Error: EACCES: permission denied
```

**解决方案**：
```bash
# Mac/Linux: 修复 npm 权限
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# 或使用 nvm 管理 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### 问题：Python 编译错误

**症状**：
```
gyp ERR! find Python
```

**解决方案**：
```bash
# Windows: 安装 Python
# 下载并安装 Python 3.7+ from python.org

# Mac: 安装 Xcode 命令行工具
xcode-select --install

# Ubuntu/Debian
sudo apt-get install python3 build-essential

# 使用 node-gyp 的替代方案
npm install --ignore-scripts
```

### 2. 数据库问题

#### 问题：数据库文件无法创建

**症状**：
```
Error: SQLITE_CANTOPEN: unable to open database file
```

**解决方案**：
```bash
# 1. 检查目录权限
ls -la database/

# 2. 创建目录
mkdir -p database

# 3. 修复权限
chmod 755 database/

# 4. 检查磁盘空间
df -h

# 5. 手动初始化数据库
cd backend
node scripts/init-database.js
```

#### 问题：数据库锁定

**症状**：
```
Error: SQLITE_BUSY: database is locked
```

**解决方案**：
```bash
# 1. 检查是否有其他进程使用数据库
lsof database/wealth_management.db

# 2. 重启应用
# 停止所有相关进程后重新启动

# 3. 删除锁定文件 (谨慎操作)
rm database/wealth_management.db-wal
rm database/wealth_management.db-shm

# 4. 重新初始化数据库
node scripts/init-database.js
node scripts/seed-database.js
```

#### 问题：数据损坏

**症状**：
```
Error: SQLITE_CORRUPT: database disk image is malformed
```

**解决方案**：
```bash
# 1. 备份现有数据
cp database/wealth_management.db database/backup_corrupted.db

# 2. 尝试修复
sqlite3 database/wealth_management.db ".dump" > backup.sql

# 3. 重新创建数据库
rm database/wealth_management.db
node scripts/init-database.js

# 4. 恢复数据 (如果可能)
sqlite3 database/wealth_management.db < backup.sql
```

### 3. 网络和连接问题

#### 问题：端口被占用

**症状**：
```
Error: listen EADDRINUSE: address already in use :::3001
```

**解决方案**：
```bash
# 1. 查找占用端口的进程
# Windows
netstat -ano | findstr :3001
tasklist | findstr [PID号]

# Mac/Linux
lsof -i :3001

# 2. 终止进程
# Windows
taskkill /PID [PID号] /F

# Mac/Linux
kill -9 [PID号]

# 3. 修改端口 (临时解决方案)
# 编辑 backend/.env
PORT=3002
```

#### 问题：前端无法连接后端

**症状**：
- 前端页面显示空白
- 网络请求失败
- CORS 错误

**解决方案**：
```bash
# 1. 检查后端是否运行
curl http://localhost:3001/api/health

# 2. 检查防火墙设置
# Windows 防火墙
netsh advfirewall firewall show rule name="Node.js"

# 3. 验证代理配置
# 检查 frontend/vite.config.ts 中的 proxy 配置
# 确保目标地址正确

# 4. 检查 CORS 设置
# 检查后端 CORS 配置是否正确
```

#### 问题：代理配置无效

**症状**：
```
[HPM] Error occurred while trying to proxy request /api/customers from localhost:5173 to http://localhost:3001
```

**解决方案**：
```typescript
// 检查 vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        // 添加日志
        logLevel: 'debug'
      },
    },
  },
})
```

### 4. 内存和性能问题

#### 问题：内存不足

**症状**：
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed
```

**解决方案**：
```bash
# 1. 增加 Node.js 内存限制
# Mac/Linux
export NODE_OPTIONS="--max-old-space-size=4096"

# Windows
set NODE_OPTIONS="--max-old-space-size=4096"

# 2. 检查内存使用
# Mac/Linux
top -o MEM

# Windows
tasklist /fi "imagename eq node.exe"

# 3. 优化应用
# 减少并发请求
# 增加缓存时间
# 优化数据库查询
```

#### 问题：CPU 使用率过高

**症状**：
- 系统响应缓慢
- 风扇噪音大
- 电池消耗快

**解决方案**：
```javascript
// 1. 检查是否有无限循环
// 2. 优化缓存策略
// 3. 减少轮询频率
// 4. 使用防抖/节流

// 示例：防抖函数
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
```

### 5. 构建和部署问题

#### 问题：前端构建失败

**症状**：
```
TypeError: Cannot read properties of undefined (reading 'map')
```

**解决方案**：
```bash
# 1. 检查 TypeScript 错误
cd frontend
npm run type-check

# 2. 清理构建缓存
rm -rf dist node_modules/.vite

# 3. 重新安装依赖
npm install

# 4. 检查环境变量
# 确保所有必需的环境变量已设置
```

#### 问题：Docker 容器无法启动

**症状**：
```
docker: Cannot connect to the Docker daemon
```

**解决方案**：
```bash
# 1. 检查 Docker 服务状态
# Windows/Mac
docker info

# Linux
sudo systemctl status docker

# 2. 启动 Docker 服务
# Linux
sudo systemctl start docker

# 3. 添加用户到 docker 组
sudo usermod -aG docker $USER
newgrp docker

# 4. 重启 Docker Desktop (如果使用)
```

#### 问题：Docker 构建失败

**症状**：
```
ERROR: failed to solve: process "/bin/sh -c npm install" did not complete successfully
```

**解决方案**：
```dockerfile
# 1. 使用缓存层优化
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 2. 修复权限问题
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 3. 检查网络连接
# 在 Dockerfile 中添加网络测试
RUN ping -c 3 registry.npmjs.org
```

### 6. 数据和配置问题

#### 问题：环境变量未生效

**症状**：
```
undefined is not an object (evaluating 'process.env.NODE_ENV')
```

**解决方案**：
```bash
# 1. 检查 .env 文件位置
# 确保在 backend/ 目录下
ls -la backend/.env

# 2. 检查文件格式
# 确保没有多余的空格或特殊字符
cat backend/.env

# 3. 重新加载环境变量
# 重启应用程序

# 4. 手动设置环境变量
NODE_ENV=production node server.js
```

#### 问题：数据不同步

**症状**：
- 前端显示旧数据
- 市场数据不更新
- 缓存问题

**解决方案**：
```javascript
// 1. 清理浏览器缓存
// 开发者工具 -> Application -> Storage -> Clear storage

// 2. 强制刷新
// Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)

// 3. 清除服务端缓存
// 调用清除缓存的 API 端点
fetch('/api/admin/clear-cache', { method: 'POST' })

// 4. 重启应用服务
```

### 7. 第三方服务问题

#### 问题：Yahoo Finance API 限制

**症状**：
```
Error: 429 Too Many Requests
```

**解决方案**：
```javascript
// 1. 增加请求间隔
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. 使用缓存减少请求
// 3. 实现请求重试机制
const retryRequest = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(1000 * Math.pow(2, i));
    }
  }
};

// 4. 使用备用数据源
```

#### 问题：网络连接不稳定

**症状**：
```
Error: request timeout
Error: ENOTFOUND
```

**解决方案**：
```javascript
// 1. 实现超时控制
const axios = require('axios');

const api = axios.create({
  timeout: 5000,
  retries: 3
});

// 2. 添加重试机制
api.interceptors.response.use(undefined, async (error) => {
  const { config } = error;
  if (!config || !config.retries) return Promise.reject(error);
  
  config.__retryCount = config.__retryCount || 0;
  
  if (config.__retryCount >= config.retries) {
    return Promise.reject(error);
  }
  
  config.__retryCount += 1;
  
  return new Promise(resolve => {
    setTimeout(() => resolve(axios(config)), 1000);
  });
});
```

## 调试工具和方法

### 1. 日志分析

#### 启用详细日志

```bash
# 后端调试模式
cd backend
DEBUG=* npm start

# 或设置特定模块
DEBUG=wealth-management:* npm start
```

#### 分析日志文件

```bash
# 查看错误日志
tail -f logs/error.log

# 搜索特定错误
grep "ERROR" logs/combined.log

# 分析性能日志
grep "duration" logs/combined.log | tail -20
```

### 2. 网络调试

#### 使用浏览器开发者工具

1. **Network 面板**：检查 API 请求
2. **Console 面板**：查看 JavaScript 错误
3. **Application 面板**：检查本地存储和缓存

#### 使用 cURL 测试 API

```bash
# 测试健康检查
curl -v http://localhost:3001/api/health

# 测试市场数据
curl -v http://localhost:3001/api/market/AAPL

# 测试错误响应
curl -v http://localhost:3001/api/nonexistent
```

### 3. 数据库调试

#### 使用 SQLite 命令行

```bash
# 连接到数据库
sqlite3 database/wealth_management.db

# 查看表结构
.schema

# 查看数据
SELECT * FROM customers LIMIT 5;

# 分析查询性能
EXPLAIN QUERY PLAN SELECT * FROM customers WHERE email = 'test@example.com';
```

#### 数据库性能分析

```sql
-- 检查索引使用情况
EXPLAIN QUERY PLAN SELECT * FROM customers WHERE email = 'john@example.com';

-- 查看表统计信息
SELECT name, sql FROM sqlite_master WHERE type='index';

-- 检查数据库大小
SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();
```

### 4. 性能分析

#### Node.js 性能分析

```bash
# 启用性能监控
node --prof server.js
node --prof-process isolate-*.log > profile.txt

# 内存使用分析
node --max-old-space-size=4096 --inspect server.js
```

#### 前端性能分析

```javascript
// 性能标记
console.time('API Call');
// API 调用
console.timeEnd('API Call');

// 内存使用监控
console.log(performance.memory);
```

## 应急处理

### 1. 服务完全无法启动

#### 紧急恢复步骤

```bash
# 1. 停止所有进程
pkill -f node  # Mac/Linux
taskkill /IM node.exe /F  # Windows

# 2. 清理临时文件
rm -rf node_modules/.cache
rm -rf frontend/node_modules/.vite

# 3. 重新安装依赖
npm install

# 4. 重新初始化数据库
cd backend
node scripts/init-database.js

# 5. 重启服务
npm start
```

### 2. 数据丢失恢复

```bash
# 1. 检查备份文件
ls -la database/backup_*

# 2. 恢复最新备份
cp database/backup_20251212_120000.db database/wealth_management.db

# 3. 验证数据完整性
sqlite3 database/wealth_management.db "PRAGMA integrity_check;"

# 4. 重启服务
```

### 3. 系统资源耗尽

```bash
# 1. 强制清理缓存
echo 3 > /proc/sys/vm/drop_caches  # Linux (需要root权限)

# 2. 重启相关服务
systemctl restart docker  # 如果使用Docker

# 3. 监控资源使用
top
htop
```

## 预防措施

### 1. 定期维护

```bash
# 每周执行
# 清理日志文件
find logs/ -name "*.log" -mtime +7 -delete

# 更新依赖
npm audit
npm update

# 数据库优化
sqlite3 database/wealth_management.db "VACUUM;"
```

### 2. 监控设置

```bash
# 设置磁盘空间监控
df -h | awk '$5 > 80 {print "Warning: Disk usage is " $5}'

# 设置内存监控
free -m | awk 'NR==2{printf "Memory Usage: %s/%sMB (%.2f%%)\n", $3,$2,$3*100/$2 }'

# 设置进程监控
ps aux | grep node | awk '{if($3>80) print "High CPU: " $11 " " $3"%"}'
```

### 3. 备份策略

```bash
# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
cp database/wealth_management.db $BACKUP_DIR/backup_$DATE.db

# 备份配置文件
cp backend/.env $BACKUP_DIR/env_$DATE.backup

# 清理旧备份 (保留最近7天)
find $BACKUP_DIR -name "backup_*.db" -mtime +7 -delete
find $BACKUP_DIR -name "env_*.backup" -mtime +7 -delete
```

## 获取帮助

### 1. 日志收集

当遇到问题时，请收集以下信息：

```bash
# 系统信息
node --version
npm --version
npm list --depth=0

# 错误日志
tail -50 logs/error.log
tail -50 logs/combined.log

# 进程信息
ps aux | grep node

# 端口占用
netstat -tlnp | grep node
```

### 2. 问题报告模板

```markdown
## 问题描述
简要描述遇到的问题

## 环境信息
- 操作系统: 
- Node.js 版本:
- npm 版本:
- 浏览器版本:

## 复现步骤
1. 执行的步骤
2. 遇到的具体错误

## 错误信息
```
错误日志或截图
```

## 尝试的解决方案
已尝试的解决方法

## 附加信息
其他相关信息
```

### 3. 联系方式

- **项目 Issues**: GitHub Issues 页面
- **技术支持**: 查看 README.md 中的联系信息
- **社区支持**: 相关技术社区论坛

---

**文档版本**: 1.0.0  
**最后更新**: 2025-12-12  
**适用范围**: 财富管理平台 v1.0.0