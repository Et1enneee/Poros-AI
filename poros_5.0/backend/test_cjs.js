const Database = require('better-sqlite3');

try {
  const db = new Database('/workspace/poros_4.1/database/poros.db');
  
  console.log('数据库连接成功');
  
  // 测试插入
  const stmt = db.prepare('INSERT INTO communication_records (customer_id, contact_type, summary) VALUES (?, ?, ?)');
  const result = stmt.run('CUST_001', '测试', 'CommonJS测试记录');
  
  console.log('插入结果:', result);
  
  // 查询
  const record = db.prepare('SELECT * FROM communication_records WHERE id = ?').get(result.lastInsertRowid);
  console.log('查询结果:', record);
  
  db.close();
  
} catch (error) {
  console.error('错误:', error);
}