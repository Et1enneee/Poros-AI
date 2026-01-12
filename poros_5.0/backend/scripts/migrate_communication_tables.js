import { DatabaseService } from '../services/database.js';

async function migrateCommunicationTables() {
  console.log('🔄 Starting communication tables migration...');
  
  const dbService = new DatabaseService();
  
  try {
    await dbService.initialize();
    
    // Check if tables already exist
    const existingPlans = dbService.get('SELECT name FROM sqlite_master WHERE type="table" AND name="communication_plans"', []);
    const existingRecords = dbService.get('SELECT name FROM sqlite_master WHERE type="table" AND name="communication_records"', []);
    const existingReminders = dbService.get('SELECT name FROM sqlite_master WHERE type="table" AND name="communication_reminders"', []);
    const existingTemplates = dbService.get('SELECT name FROM sqlite_master WHERE type="table" AND name="communication_templates"', []);
    const existingTeam = dbService.get('SELECT name FROM sqlite_master WHERE type="table" AND name="communication_team"', []);
    
    // Create tables if they don't exist
    if (!existingPlans) {
      dbService.run(`
        CREATE TABLE communication_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id TEXT NOT NULL,
          manager_id TEXT,
          plan_name TEXT NOT NULL,
          plan_type TEXT NOT NULL,
          frequency TEXT NOT NULL,
          next_contact_date DATE,
          target_date DATE,
          status TEXT DEFAULT 'active',
          agenda TEXT,
          objectives TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        )
      `);
      console.log('✅ Created communication_plans table');
    }
    
    if (!existingRecords) {
      dbService.run(`
        CREATE TABLE communication_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id TEXT NOT NULL,
          plan_id INTEGER,
          manager_id TEXT,
          contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          contact_type TEXT NOT NULL,
          duration_minutes INTEGER,
          location TEXT,
          summary TEXT NOT NULL,
          key_discussions TEXT,
          decisions_made TEXT,
          commitments TEXT,
          action_items TEXT,
          satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
          follow_up_required BOOLEAN DEFAULT FALSE,
          follow_up_date DATE,
          documents TEXT,
          next_contact_scheduled BOOLEAN DEFAULT FALSE,
          next_contact_date DATE,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
          FOREIGN KEY (plan_id) REFERENCES communication_plans (id)
        )
      `);
      console.log('✅ Created communication_records table');
    }
    
    if (!existingReminders) {
      dbService.run(`
        CREATE TABLE communication_reminders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
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
          completed_at TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
          FOREIGN KEY (plan_id) REFERENCES communication_plans (id),
          FOREIGN KEY (record_id) REFERENCES communication_records (id)
        )
      `);
      console.log('✅ Created communication_reminders table');
    }
    
    if (!existingTemplates) {
      dbService.run(`
        CREATE TABLE communication_templates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          subject TEXT,
          content TEXT NOT NULL,
          variables TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          usage_count INTEGER DEFAULT 0,
          created_by TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Created communication_templates table');
    }
    
    if (!existingTeam) {
      dbService.run(`
        CREATE TABLE communication_team (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          role TEXT NOT NULL,
          permissions TEXT,
          added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          added_by TEXT,
          FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
        )
      `);
      console.log('✅ Created communication_team table');
    }
    
    // Insert some default templates
    const defaultTemplates = [
      {
        name: '季度投资组合回顾',
        category: 'investment_review',
        subject: 'Q4 投资组合表现回顾会议',
        content: '尊敬的客户，\n\n我们将为您安排一次季度投资组合回顾会议，讨论您近期的投资表现和未来策略。\n\n会议将涵盖：\n- 投资组合表现分析\n- 市场趋势解读\n- 资产配置建议\n- 风险评估更新\n\n请回复确认您方便的会议时间。\n\n此致\n财富管理团队',
        variables: JSON.stringify(['customer_name', 'quarter', 'performance_summary']),
        created_by: 'system'
      },
      {
        name: '客户生日祝福',
        category: 'birthday',
        subject: '生日快乐！',
        content: '亲爱的 {customer_name}，\n\n今天是您的生日，我们祝您生日快乐！\n\n感谢您对我们财富管理服务的信任。在您生日这个特殊的日子里，我们为您准备了小礼品...\n\n愿您在新的一岁里，投资顺利，财富增长！\n\n此致\n财富管理团队',
        variables: JSON.stringify(['customer_name']),
        created_by: 'system'
      },
      {
        name: '投资建议跟进',
        category: 'follow_up',
        subject: '投资建议执行情况跟进',
        content: '尊敬的客户，\n\n我们想跟进一下上次会议中提到的投资建议执行情况：\n\n建议内容：{recommendation}\n建议日期：{recommendation_date}\n执行状态：{status}\n\n如果您需要任何帮助，请随时联系我们。\n\n此致\n财富管理团队',
        variables: JSON.stringify(['customer_name', 'recommendation', 'recommendation_date', 'status']),
        created_by: 'system'
      }
    ];
    
    for (const template of defaultTemplates) {
      try {
        dbService.createCommunicationTemplate(template);
        console.log(`✅ Inserted default template: ${template.name}`);
      } catch (error) {
        console.warn(`⚠️ Failed to insert template ${template.name}:`, error.message);
      }
    }
    
    console.log('✅ Communication tables migration completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    dbService.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateCommunicationTables();
}

export default migrateCommunicationTables;