// test-mysql.js（ES模块版，测试你的MySQL连接）
import mysql from 'mysql2/promise';

async function testMySQLConnection() {
  try {
    // 用你的密码+本地配置测试连接
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'root', // 默认用户名，如果你改了请替换
      password: '123456Tyj', // 你的密码（注意大小写）
      database: 'poros_db'
    });

    console.log("✅ MySQL连接成功！");
    // 测试查询（验证连通性）
    const [rows] = await connection.execute('SELECT 1 + 1 AS test');
    console.log("📌 测试查询结果：", rows);

    await connection.end(); // 关闭连接
  } catch (error) {
    console.error("❌ MySQL连接失败：", error.code, error.message);
    // 常见错误提示
    if (error.code === 'ECONNREFUSED') {
      console.log("👉 原因：MySQL服务未启动（Win+R输入services.msc，启动MySQL）");
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("👉 原因：用户名/密码错误（检查密码是否是123456Tyj）");
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log("👉 原因：poros_db数据库不存在（先执行init-tables.js创建）");
    }
  }
}

// 执行测试
testMySQLConnection();