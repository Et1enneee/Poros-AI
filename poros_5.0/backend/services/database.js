// database.js - 修正版，导出类本身，并添加 async initialize 方法

import mysql from 'mysql2/promise';

class DatabaseService {
  constructor() {
    this.connection = null;
    this.config = {
      host: 'localhost',
      user: 'root',
      password: '123456Tyj',
      database: 'poros_db',
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
  }

  // 初始化数据库连接（确保返回可用的 connection）
  async initialize() {
    if (!this.connection) {
      try {
        this.connection = await mysql.createConnection(this.config);
        console.log('✅ 数据库连接成功建立');
      } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        throw error;
      }
    }
    return this.connection;
  }

  // 兼容 fix-database.js 里的 query 调用（映射到 run）
  async query(sql, params = []) {
    return this.run(sql, params);
  }

  // 核心执行方法（原 run 方法，确保异步 + 传参正确）
  async run(sql, params = []) {
    if (!this.connection) {
      // 如果连接未初始化，自动初始化
      await this.initialize();
    }
    try {
      const [results] = await this.connection.execute(sql, params);
      return results;
    } catch (error) {
      console.error(`❌ SQL执行失败 [${sql.slice(0, 50)}...]:`, error.message);
      throw error;
    }
  }

  // 修复 close 方法（必须异步，避免连接未关闭）
  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('✅ 数据库连接已关闭');
    }
  }

  // 新增：检查表是否存在（解决“表不存在”的提示）
  async tableExists(tableName) {
    const result = await this.run(
      `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
      [this.config.database, tableName]
    );
    return result[0].count > 0;
  }
}

export default DatabaseService;
