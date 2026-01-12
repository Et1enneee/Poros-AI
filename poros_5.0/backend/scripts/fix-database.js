import DatabaseService from '../services/database.js';

// 1. 定义所有缺失的表创建函数（命名统一，避免笔误）
async function createCommunicationPlansTable(dbService) {
  await dbService.run(`
    CREATE TABLE IF NOT EXISTS communication_plans (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      template_id INT NULL,
      schedule_time DATETIME NULL,
      status ENUM('draft', 'active', 'completed') DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ communication_plans 表已创建/存在');
}

async function createCommunicationRecordsTable(dbService) {
  await dbService.run(`
    CREATE TABLE IF NOT EXISTS communication_records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plan_id INT NULL,
      customer_id VARCHAR(50) NULL,
      send_time DATETIME NULL,
      status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
      content TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ communication_records 表已创建/存在');
}

async function createCommunicationRemindersTable(dbService) {
  await dbService.run(`
    CREATE TABLE IF NOT EXISTS communication_reminders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      record_id INT NULL,
      reminder_time DATETIME NULL,
      is_sent BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ communication_reminders 表已创建/存在');
}

async function createCommunicationTemplatesTable(dbService) {
  await dbService.run(`
    CREATE TABLE IF NOT EXISTS communication_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type ENUM('email', 'sms', 'push') DEFAULT 'email',
      content TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ communication_templates 表已创建/存在');
}

async function createCommunicationTeamTable(dbService) {
  await dbService.run(`
    CREATE TABLE IF NOT EXISTS communication_team (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      member_ids TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log('✅ communication_team 表已创建/存在');
}

// 2. 核心修复函数（修正 teamTable 调用错误）
async function fixAndSeedDatabase() {
  const dbService = new DatabaseService();
  try {
    await dbService.initialize(); 
    console.log('🔧 数据库连接已就绪，开始修复...');

    // 先创建所有缺失的表（关键：调用正确的函数名）
    await createCommunicationPlansTable(dbService);
    await createCommunicationRecordsTable(dbService);
    await createCommunicationRemindersTable(dbService);
    await createCommunicationTemplatesTable(dbService);
    await createCommunicationTeamTable(dbService); // ✅ 修正：这里之前写成了 teamTable

    // 清空数据（兼容表不存在的情况）
    const tablesToClear = [
      'communication_reminders',
      'communication_records',
      'communication_plans',
      'communication_templates',
      'communication_team'
    ];
    console.log('🧹 清空现有数据...');
    for (const table of tablesToClear) {
      // 先检查表是否存在（避免 DELETE 不存在的表报错）
      const [existsResult] = await dbService.run(`
        SELECT COUNT(*) AS count FROM information_schema.tables 
        WHERE table_schema = ? AND table_name = ?
      `, [dbService.config.database, table]);
      const tableExists = existsResult.count > 0;

      if (!tableExists) {
        console.warn(`⚠️ ${table} table not found, skip DELETE`);
        continue;
      }
      await dbService.run(`DELETE FROM ${table}`);
      console.log(`✅ ${table} 数据已清空`);
    }

    // 检查表结构
    console.log('🔧 检查communication_plans表结构...');
    try {
      const [columns] = await dbService.run(`SHOW COLUMNS FROM communication_plans`);
      const requiredColumns = ['id', 'name', 'template_id', 'schedule_time'];
      const missingColumns = requiredColumns.filter(col => 
        !columns.some(c => c.Field === col)
      );
      if (missingColumns.length > 0) {
        console.warn(`⚠️ communication_plans 缺少字段: ${missingColumns.join(', ')}`);
      } else {
        console.log('✅ communication_plans表结构正常');
      }
    } catch (error) {
      console.error('❌ communication_plans表结构检查失败:', error.message);
    }

    console.log('🔧 检查communication_records表结构...');
    try {
      const [columns] = await dbService.run(`SHOW COLUMNS FROM communication_records`);
      const requiredColumns = ['id', 'plan_id', 'customer_id', 'send_time'];
      const missingColumns = requiredColumns.filter(col => 
        !columns.some(c => c.Field === col)
      );
      if (missingColumns.length > 0) {
        console.warn(`⚠️ communication_records 缺少字段: ${missingColumns.join(', ')}`);
      } else {
        console.log('✅ communication_records表结构正常');
      }
    } catch (error) {
      console.error('❌ communication_records表结构检查失败:', error.message);
    }

    console.log('✅ 数据库修复完成');

  } catch (error) {
    console.error('❌ 数据库修复失败:', error);
    throw error; // 抛出错误让上层捕获
  } finally {
    await dbService.close(); // 异步关闭连接（必须加 await）
  }
}

// 导出函数供 server.js 调用
export default fixAndSeedDatabase;

// 允许直接运行该脚本测试
if (import.meta.url === `file://${process.argv[1]}`) {
  fixAndSeedDatabase().catch(err => {
    console.error('❌ 数据库修复脚本执行失败:', err);
    process.exit(1);
  });
}