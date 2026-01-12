
import DatabaseService from '../services/database.js';

async function initializeDatabase() {
  console.log('🚀 Initializing database...');
  
  const dbService = new DatabaseService();
  
  try {
    await dbService.initialize();
    console.log('✅ Database initialized successfully');

    // 先创建 system_config 表（避免插入时表不存在）
    await dbService.run(`
      CREATE TABLE IF NOT EXISTS system_config (
        \`key\` VARCHAR(100) PRIMARY KEY,
        \`value\` TEXT NOT NULL,
        description TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    
    // 插入默认配置
    const defaultConfig = [
      { key: 'system_name', value: 'Poros Wealth Management Platform', description: 'System display name' },
      { key: 'market_data_update_interval', value: '30', description: 'Market data update interval in seconds' },
      { key: 'cache_ttl_default', value: '300', description: 'Default cache time-to-live in seconds' },
      { key: 'max_portfolios_per_customer', value: '10', description: 'Maximum number of portfolios per customer' },
      { key: 'api_rate_limit', value: '100', description: 'API rate limit per 15 minutes' }
    ];

    for (const config of defaultConfig) {
      try {
        // ✅ 修复1：MySQL 用 REPLACE INTO 替代 INSERT OR REPLACE
        // ✅ 修复2：用 ? 占位符替代 @参数（MySQL 不支持 @ 命名参数）
        await dbService.run(`
          REPLACE INTO system_config (\`key\`, \`value\`, description)
          VALUES (?, ?, ?)
        `, [config.key, config.value, config.description]);
      } catch (error) {
        console.warn(`⚠️ Failed to insert config ${config.key}:`, error.message);
      }
    }

    console.log('✅ Default configuration inserted');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    // ✅ 修复3：close 是异步函数，必须加 await
    await dbService.close();
  }
}

// 修复 Windows 兼容的入口判断
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  initializeDatabase().catch(err => {
    console.error('❌ 初始化脚本执行失败:', err);
    process.exit(1);
  });
}