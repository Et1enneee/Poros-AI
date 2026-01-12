// database.js - SQLite版本的完整数据库服务
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseService {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '..', 'database.sqlite');
  }

  // 初始化SQLite数据库连接
  async initialize() {
    if (!this.db) {
      try {
        this.db = await open({
          filename: this.dbPath,
          driver: sqlite3.Database
        });
        console.log('✅ SQLite数据库连接成功建立');
        
        // 启用外键约束
        await this.run('PRAGMA foreign_keys = ON');
        
        // 创建表结构
        await this.createTables();
        
      } catch (error) {
        console.error('❌ SQLite数据库连接失败:', error.message);
        throw error;
      }
    }
    return this.db;
  }

  // 创建必要的表结构
  async createTables() {
    // Communication Plans 表
    await this.run(`
      CREATE TABLE IF NOT EXISTS communication_plans (
        plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        communication_type TEXT DEFAULT 'online',
        frequency TEXT DEFAULT 'monthly',
        start_date DATE NOT NULL,
        end_date DATE,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Communication Records 表
    await this.run(`
      CREATE TABLE IF NOT EXISTS communication_records (
        record_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        plan_id INTEGER,
        manager_id TEXT DEFAULT 'current_user',
        contact_date DATETIME NOT NULL,
        contact_type TEXT NOT NULL,
        duration_minutes INTEGER,
        location TEXT,
        summary TEXT NOT NULL,
        key_discussions TEXT,
        decisions_made TEXT,
        commitments TEXT,
        action_items TEXT,
        satisfaction_rating INTEGER,
        follow_up_required BOOLEAN DEFAULT FALSE,
        follow_up_date DATE,
        outcome TEXT,
        next_action TEXT,
        notes TEXT,
        status TEXT DEFAULT 'completed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES communication_plans (plan_id)
      )
    `);

    // Communication Reminders 表
    await this.run(`
      CREATE TABLE IF NOT EXISTS communication_reminders (
        reminder_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id TEXT NOT NULL,
        plan_id INTEGER,
        record_id INTEGER,
        reminder_type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE,
        priority TEXT DEFAULT 'medium',
        status TEXT DEFAULT 'pending',
        assigned_to TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES communication_plans (plan_id),
        FOREIGN KEY (record_id) REFERENCES communication_records (record_id)
      )
    `);

    // Communication Templates 表
    await this.run(`
      CREATE TABLE IF NOT EXISTS communication_templates (
        template_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        subject TEXT,
        content TEXT NOT NULL,
        variables TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_by TEXT DEFAULT 'current_user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ 数据库表结构创建完成');
  }

  // 通用SQL执行方法
  async run(sql, params = []) {
    if (!this.db) {
      await this.initialize();
    }
    try {
      const result = await this.db.run(sql, params);
      return result;
    } catch (error) {
      console.error(`❌ SQL执行失败 [${sql.slice(0, 50)}...]:`, error.message);
      throw error;
    }
  }

  // 查询单条记录
  async get(sql, params = []) {
    if (!this.db) {
      await this.initialize();
    }
    try {
      const result = await this.db.get(sql, params);
      return result;
    } catch (error) {
      console.error(`❌ SQL查询失败 [${sql.slice(0, 50)}...]:`, error.message);
      throw error;
    }
  }

  // 查询多条记录
  async all(sql, params = []) {
    if (!this.db) {
      await this.initialize();
    }
    try {
      const result = await this.db.all(sql, params);
      return result;
    } catch (error) {
      console.error(`❌ SQL查询失败 [${sql.slice(0, 50)}...]:`, error.message);
      throw error;
    }
  }

  // Communication Plans 相关方法
  async getCommunicationPlans(customerId = null, limit = 50) {
    let sql = 'SELECT * FROM communication_plans';
    let params = [];
    
    if (customerId) {
      sql += ' WHERE customer_id = ?';
      params.push(customerId);
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    return await this.all(sql, params);
  }

  async getCommunicationPlanById(id) {
    return await this.get(
      'SELECT * FROM communication_plans WHERE plan_id = ?',
      [id]
    );
  }

  async createCommunicationPlan(planData) {
    const sql = `
      INSERT INTO communication_plans (
        customer_id, plan_name, communication_type, frequency, 
        start_date, end_date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      planData.customer_id,
      planData.plan_name,
      planData.communication_type || 'online',
      planData.frequency || 'monthly',
      planData.start_date,
      planData.end_date,
      planData.status || 'active'
    ];
    
    const result = await this.run(sql, params);
    return await this.getCommunicationPlanById(result.lastID);
  }

  async updateCommunicationPlan(id, planData) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(planData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    params.push(id);
    
    const sql = `
      UPDATE communication_plans 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE plan_id = ?
    `;
    
    return await this.run(sql, params);
  }

  // Communication Records 相关方法
  async getCommunicationRecords(customerId = null, limit = 50) {
    let sql = `
      SELECT cr.*, cp.plan_name, c.name as customer_name 
      FROM communication_records cr
      LEFT JOIN communication_plans cp ON cr.plan_id = cp.plan_id
      LEFT JOIN customers c ON cr.customer_id = c.customer_id
    `;
    let params = [];
    
    if (customerId) {
      sql += ' WHERE cr.customer_id = ?';
      params.push(customerId);
    }
    
    sql += ' ORDER BY cr.contact_date DESC LIMIT ?';
    params.push(limit);
    
    return await this.all(sql, params);
  }

  async getCommunicationRecordById(id) {
    return await this.get(
      'SELECT * FROM communication_records WHERE record_id = ?',
      [id]
    );
  }

  async createCommunicationRecord(recordData) {
    const sql = `
      INSERT INTO communication_records (
        customer_id, plan_id, manager_id, contact_date, contact_type,
        duration_minutes, location, summary, key_discussions, decisions_made,
        commitments, action_items, satisfaction_rating, follow_up_required,
        follow_up_date, outcome, next_action, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      recordData.customer_id,
      recordData.plan_id,
      recordData.manager_id || 'current_user',
      recordData.contact_date,
      recordData.contact_type,
      recordData.duration_minutes,
      recordData.location,
      recordData.summary,
      recordData.key_discussions,
      recordData.decisions_made,
      recordData.commitments,
      recordData.action_items,
      recordData.satisfaction_rating,
      recordData.follow_up_required,
      recordData.follow_up_date,
      recordData.outcome,
      recordData.next_action,
      recordData.notes,
      recordData.status || 'completed'
    ];
    
    return await this.run(sql, params);
  }

  // Communication Reminders 相关方法
  async getCommunicationReminders(customerId = null, status = 'pending') {
    let sql = 'SELECT * FROM communication_reminders';
    let params = [];
    
    const conditions = [];
    if (customerId) {
      conditions.push('customer_id = ?');
      params.push(customerId);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' ORDER BY due_date ASC';
    
    return await this.all(sql, params);
  }

  async createCommunicationReminder(reminderData) {
    const sql = `
      INSERT INTO communication_reminders (
        customer_id, plan_id, record_id, reminder_type, title,
        description, due_date, priority, status, assigned_to
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      reminderData.customer_id,
      reminderData.plan_id,
      reminderData.record_id,
      reminderData.reminder_type,
      reminderData.title,
      reminderData.description,
      reminderData.due_date,
      reminderData.priority || 'medium',
      reminderData.status || 'pending',
      reminderData.assigned_to
    ];
    
    return await this.run(sql, params);
  }

  async updateCommunicationReminder(id, reminderData) {
    const fields = [];
    const params = [];
    
    for (const [key, value] of Object.entries(reminderData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    params.push(id);
    
    const sql = `
      UPDATE communication_reminders 
      SET ${fields.join(', ')} 
      WHERE reminder_id = ?
    `;
    
    return await this.run(sql, params);
  }

  // Dashboard 数据
  async getCommunicationDashboard() {
    const totalPlans = await this.get('SELECT COUNT(*) as count FROM communication_plans WHERE status = "active"');
    const pendingReminders = await this.get('SELECT COUNT(*) as count FROM communication_reminders WHERE status = "pending"');
    const todayContacts = await this.get('SELECT COUNT(*) as count FROM communication_records WHERE DATE(contact_date) = DATE("now")');
    const upcomingContacts = await this.get('SELECT COUNT(*) as count FROM communication_records WHERE DATE(contact_date) BETWEEN DATE("now") AND DATE("now", "+7 days")');
    
    return {
      total_plans: totalPlans,
      pending_reminders: pendingReminders,
      today_contacts: todayContacts,
      upcoming_contacts: upcomingContacts
    };
  }

  // 关闭数据库连接
  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('✅ SQLite数据库连接已关闭');
    }
  }

  // 兼容性方法
  async query(sql, params = []) {
    return this.run(sql, params);
  }
}

export default DatabaseService;