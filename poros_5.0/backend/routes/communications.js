// communications.js - 修复版，使用SQLite数据库
import express from 'express';
import DatabaseService from '../services/database.js'; // 导入SQLite数据库服务
const dbService = new DatabaseService(); // 实例化（全局可用）

const router = express.Router();
import CacheService from '../services/cache.js';

const cacheService = new CacheService();
let cacheReady = false;
(async () => {
  try {
    await cacheService.initialize();
    cacheReady = true;
    console.log('CacheService 初始化完成');
  } catch (e) {
    console.error('CacheService 初始化失败:', e);
    cacheReady = false;
  }
})();

// Communication Plans Routes
router.get('/plans', async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize || 10); // 每页数量
    const pageNum = parseInt(req.query.pageNum || 1); // 页码
    const customerId = req.query.customer_id; // 可选参数
    
    const offset = (pageNum - 1) * pageSize; // 偏移量
    
    let plans;
    if (customerId) {
      plans = await dbService.getCommunicationPlans(customerId, pageSize);
    } else {
      plans = await dbService.getCommunicationPlans(null, pageSize);
    }

    res.status(200).json({
      success: true,
      data: plans,
      total: plans.length
    });
  } catch (error) {
    console.error('Error fetching communication plans:', error);
    res.status(500).json({
      success: false,
      message: '获取计划失败',
      error: error.message
    });
  }
});

router.get('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await dbService.getCommunicationPlanById(id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'Communication plan not found'
      });
    }
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error fetching communication plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch communication plan',
      message: error.message
    });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const reqBody = req.body || {};
    const allowedFrequencies = ['monthly', 'weekly', 'daily', 'quarterly', 'yearly'];
    
    // 修复trim逻辑：兼容空值，避免空字符串触发校验
    const planData = {
      customer_id: reqBody.customer_id ? reqBody.customer_id.trim() : '1', // 兜底给1
      plan_name: reqBody.plan_name ? reqBody.plan_name.trim() : '默认计划', // 兜底给名称
      communication_type: reqBody.communication_type ? reqBody.communication_type.trim() : 'online', // 兜底给online
      frequency: reqBody.frequency ? reqBody.frequency.trim() : 'monthly',
      start_date: reqBody.start_date ? reqBody.start_date.trim() : '2026-01-01', // 兜底给日期
      end_date: reqBody.end_date ? reqBody.end_date.trim() : null,
      status: reqBody.status ? reqBody.status.trim() : 'active'
    };

    // 调用数据库服务创建计划
    const plan = await dbService.createCommunicationPlan(planData);
    res.status(201).json({
      success: true,
      message: "沟通计划创建成功！",
      data: plan
    });
  } catch (err) {
    // 打印具体错误到控制台
    console.error("POST /plans 报错详情：", err.message);
    res.status(400).json({
      success: false,
      error: "创建计划失败！",
      detail: err.message
    });
  }
});

router.put('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const planData = {
      plan_name: req.body.plan_name,
      frequency: req.body.frequency,
      status: req.body.status,
      end_date: req.body.end_date
    };
    
    // 过滤空值
    Object.keys(planData).forEach(key => {
      if (planData[key] === undefined || planData[key] === '') {
        delete planData[key];
      }
    });
    
    const result = await dbService.updateCommunicationPlan(id, planData);
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Communication plan not found'
      });
    }
    if (cacheReady) {
      cacheService.deletePattern('plans:*');
      cacheService.deletePattern('dashboard:*');
    }
    res.json({
      success: true,
      message: 'Communication plan updated successfully'
    });
  } catch (error) {
    console.error('Error updating communication plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update communication plan',
      message: error.message
    });
  }
});

// Communication Records Routes
router.get('/records', async (req, res) => {
  try {
    const { customer_id, limit = 50 } = req.query;
    const records = await dbService.getCommunicationRecords(customer_id, parseInt(limit));
    res.json({
      success: true,
      data: records,
      total: records.length
    });
  } catch (error) {
    console.error('Error fetching communication records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch communication records',
      message: error.message
    });
  }
});

router.get('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await dbService.getCommunicationRecordById(id);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Communication record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error fetching communication record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch communication record',
      message: error.message
    });
  }
});

router.post('/records', async (req, res) => {
  try {
    // 严格的数据类型转换，确保所有值都是SQLite可接受的类型
    const recordData = {
      customer_id: String(req.body.customer_id),
      plan_id: req.body.plan_id !== null && req.body.plan_id !== undefined && req.body.plan_id !== '' ? Number(req.body.plan_id) : null,
      manager_id: String(req.body.manager_id || 'current_user'),
      contact_date: String(req.body.contact_date || new Date().toISOString()),
      contact_type: String(req.body.contact_type),
      duration_minutes: req.body.duration_minutes !== null && req.body.duration_minutes !== undefined && req.body.duration_minutes !== '' ? Number(req.body.duration_minutes) : null,
      location: req.body.location !== null && req.body.location !== undefined ? String(req.body.location) : null,
      summary: String(req.body.summary),
      key_discussions: req.body.key_discussions !== null && req.body.key_discussions !== undefined ? String(req.body.key_discussions) : null,
      decisions_made: req.body.decisions_made !== null && req.body.decisions_made !== undefined ? String(req.body.decisions_made) : null,
      commitments: req.body.commitments !== null && req.body.commitments !== undefined ? String(req.body.commitments) : null,
      action_items: req.body.action_items !== null && req.body.action_items !== undefined ? String(req.body.action_items) : null,
      satisfaction_rating: req.body.satisfaction_rating !== null && req.body.satisfaction_rating !== undefined && req.body.satisfaction_rating !== '' ? Number(req.body.satisfaction_rating) : null,
      follow_up_required: Boolean(req.body.follow_up_required),
      follow_up_date: req.body.follow_up_date !== null && req.body.follow_up_date !== undefined ? String(req.body.follow_up_date) : null,
      // 字段映射到数据库表中的字段
      outcome: req.body.outcome || req.body.decisions_made, // 映射到数据库的outcome字段
      next_action: req.body.next_action || req.body.action_items, // 映射到数据库的next_action字段  
      notes: req.body.notes || req.body.summary // 映射到数据库的notes字段
    };

    // Validate required fields
    if (!recordData.customer_id || !recordData.contact_type || !recordData.summary) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customer_id, contact_type, summary'
      });
    }

    // 添加调试日志
    console.log('Creating communication record with data:', recordData);
    console.log('Data types:', Object.fromEntries(Object.entries(recordData).map(([k, v]) => [k, typeof v])));
    
    const result = await dbService.createCommunicationRecord(recordData);
    
    // Update customer's last_contact date (如果有customers表的话)
    try {
      await dbService.run(`
        UPDATE customers SET last_contact = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE customer_id = ?
      `, [recordData.contact_date, recordData.customer_id]);
    } catch (updateError) {
      console.warn('Warning: Could not update customer last_contact:', updateError.message);
    }
    
    // Clear related cache
    if (cacheReady) {
      cacheService.delete('records:*');
      cacheService.delete('dashboard:*');
    }
    
    res.status(201).json({
      success: true,
      data: { id: result.lastID, ...recordData },
      message: 'Communication record created successfully'
    });
  } catch (error) {
    console.error('Error creating communication record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create communication record',
      message: error.message
    });
  }
});

router.delete('/records/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbService.run('DELETE FROM communication_records WHERE record_id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Communication record not found'
      });
    }
    
    // Clear related cache
    if (cacheReady) {
      cacheService.delete('records:*');
      cacheService.delete('dashboard:*');
    }
    
    res.json({
      success: true,
      message: 'Communication record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting communication record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete communication record',
      message: error.message
    });
  }
});

// Reminders Routes
router.get('/reminders', async (req, res) => {
  try {
    const { customer_id, status = 'pending' } = req.query;
    const reminders = await dbService.getCommunicationReminders(customer_id, status);
    
    res.json({
      success: true,
      data: reminders,
      total: reminders.length
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reminders',
      message: error.message
    });
  }
});

router.post('/reminders', async (req, res) => {
  try {
    const reminderData = {
      customer_id: req.body.customer_id,
      plan_id: req.body.plan_id || null,
      record_id: req.body.record_id || null,
      reminder_type: req.body.reminder_type,
      title: req.body.title,
      description: req.body.description || null,
      due_date: req.body.due_date || null,
      priority: req.body.priority || 'medium',
      status: req.body.status || 'pending',
      assigned_to: req.body.assigned_to || null
    };

    // Validate required fields
    if (!reminderData.customer_id || !reminderData.reminder_type || !reminderData.title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customer_id, reminder_type, title'
      });
    }

    const result = await dbService.createCommunicationReminder(reminderData);
    
    // Clear related cache
    if (cacheReady) {
      cacheService.delete('reminders:*');
      cacheService.delete('dashboard:*');
    }
    
    res.status(201).json({
      success: true,
      data: { id: result.lastID, ...reminderData },
      message: 'Reminder created successfully'
    });
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create reminder',
      message: error.message
    });
  }
});

router.put('/reminders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reminderData = {
      title: req.body.title,
      description: req.body.description || null,
      due_date: req.body.due_date,
      priority: req.body.priority,
      status: req.body.status,
      assigned_to: req.body.assigned_to || null
    };
    
    // 过滤空值
    Object.keys(reminderData).forEach(key => {
      if (reminderData[key] === undefined) {
        delete reminderData[key];
      }
    });

    const result = await dbService.updateCommunicationReminder(id, reminderData);
    
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Reminder not found'
      });
    }
    
    // Clear related cache
    if (cacheReady) {
      cacheService.delete('reminders:*');
      cacheService.delete('dashboard:*');
    }
    
    res.json({
      success: true,
      message: 'Reminder updated successfully'
    });
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update reminder',
      message: error.message
    });
  }
});

// Analytics and Dashboard Routes
router.get('/dashboard', async (req, res) => {
  try {
    const cacheKey = 'dashboard:communications';
    let dashboard = cacheReady ? cacheService.get(cacheKey) : null;
    
    if (!dashboard) {
      dashboard = await dbService.getCommunicationDashboard();
      if (cacheReady) {
        cacheService.set(cacheKey, dashboard, 60); // 1 minute cache
      }
    }
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Error fetching communication dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch communication dashboard',
      message: error.message
    });
  }
});

// Timeline route for customer communication history
router.get('/timeline/:customer_id', async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { limit = 20 } = req.query;
    
    // Get communication records and plans for timeline
    const records = await dbService.getCommunicationRecords(customer_id, parseInt(limit));
    const plans = await dbService.getCommunicationPlans(customer_id, parseInt(limit));
    
    // Combine and sort by date
    const timeline = [
      ...records.map(record => ({
        type: 'record',
        date: record.contact_date,
        data: record,
        title: `${record.contact_type} - ${record.customer_name}`,
        description: record.summary
      })),
      ...plans.map(plan => ({
        type: 'plan',
        date: plan.start_date,
        data: plan,
        title: `Plan: ${plan.plan_name}`,
        description: `Start Date: ${plan.start_date}`
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: timeline,
      total: timeline.length
    });
  } catch (error) {
    console.error('Error fetching communication timeline:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch communication timeline',
      message: error.message
    });
  }
});

export default router;