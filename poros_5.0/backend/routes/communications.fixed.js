// backend/routes/communications.js 完整可运行版本
import express from 'express';
import DatabaseService from '../services/database.js';

// 1. 初始化数据库实例（全局唯一）
const dbService = new DatabaseService();
const router = express.Router();

// ==================== 修复 GET /dashboard 接口 ====================
router.get('/dashboard', async (req, res) => {
  try {
    const dashboardData = await dbService.run(`
      SELECT 
        COUNT(*) AS total_plans,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_plans,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_plans,
        COUNT(CASE WHEN schedule_time > NOW() THEN 1 END) AS pending_plans
      FROM communication_plans;
    `);
    res.status(200).json({
      success: true,
      data: dashboardData[0] || { total_plans: 0, active_plans: 0, completed_plans: 0, pending_plans: 0 }
    });
  } catch (error) {
    console.error('Error fetching communication dashboard:', error);
    res.status(500).json({
      success: false,
      message: '获取仪表盘数据失败',
      error: error.message
    });
  }
});

// ==================== 修复 GET /plans 接口（LIMIT 参数终极修复） ====================
router.get('/plans', async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNum = Number(req.query.pageNum) || 1;
    const offset = (pageNum - 1) * pageSize;
    const safeOffset = Math.max(offset, 0);
    const safePageSize = Math.max(pageSize, 1);
    const plans = await dbService.run(`
      SELECT * FROM communication_plans 
      ORDER BY created_at DESC 
      LIMIT ?, ?;
    `, [safeOffset, safePageSize]);
    res.status(200).json({
      success: true,
      data: plans,
      pagination: {
        pageNum,
        pageSize,
        total: plans.length
      }
    });
  } catch (error) {
    console.error('Error fetching communication plans:', error);
    res.status(500).json({
      success: false,
      message: '获取沟通计划失败',
      error: error.message
    });
  }
});

// ==================== 修复 POST /plans 接口 ====================
router.post('/plans', async (req, res) => {
  try {
    const { name, template_id, schedule_time, status } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '计划名称不能为空'
      });
    }
    const result = await dbService.run(`
      INSERT INTO communication_plans 
        (name, template_id, schedule_time, status, created_at, updated_at)
      VALUES 
        (?, ?, ?, ?, NOW(), NOW());
    `, [
      name.trim(),
      template_id || null,
      schedule_time || null,
      status || 'draft'
    ]);
    res.status(201).json({
      success: true,
      message: '沟通计划创建成功',
      data: {
        id: result.insertId,
        name,
        template_id,
        schedule_time,
        status: status || 'draft'
      }
    });
  } catch (error) {
    console.error('POST /plans 报错详情：', error);
    res.status(400).json({
      success: false,
      message: '创建沟通计划失败',
      error: error.message
    });
  }
});

// 导出路由
export default router;
