#!/usr/bin/env node

/**
 * Poros 3.6 - 完整功能测试脚本
 * 测试所有API端点和功能按钮
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, status, message = '') {
  const result = { name, status, message, timestamp: new Date().toISOString() };
  testResults.tests.push(result);
  
  if (status === 'PASS') {
    testResults.passed++;
    console.log(`✅ ${name}: ${message}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${name}: ${message}`);
  }
}

async function testAPI(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: 10000,
      validateStatus: () => true // 接受所有状态码
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: response.status < 400, status: response.status, data: response.data };
  } catch (error) {
    return { success: false, status: 0, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 开始Poros 3.6功能测试...\n');

  // 1. 健康检查
  console.log('=== 基础服务测试 ===');
  const healthTest = await testAPI('/health');
  if (healthTest.success && healthTest.status === 200) {
    logTest('服务器健康检查', 'PASS', '服务器正常运行');
  } else {
    logTest('服务器健康检查', 'FAIL', `状态码: ${healthTest.status}`);
  }

  // 2. 客户管理测试
  console.log('\n=== 客户管理测试 ===');
  
  // 获取客户列表
  const customersTest = await testAPI('/customers');
  if (customersTest.success && customersTest.status === 200) {
    logTest('获取客户列表', 'PASS', `找到 ${customersTest.data.length || 0} 个客户`);
  } else {
    logTest('获取客户列表', 'FAIL', `状态码: ${customersTest.status}`);
  }

  // 3. 通讯管理测试
  console.log('\n=== 通讯管理测试 ===');
  
  // 获取通讯计划
  const plansTest = await testAPI('/communications/plans');
  if (plansTest.success && plansTest.status === 200) {
    logTest('获取通讯计划', 'PASS', `找到 ${plansTest.data.length || 0} 个计划`);
  } else {
    logTest('获取通讯计划', 'FAIL', `状态码: ${plansTest.status}, 错误: ${plansTest.data?.error || '未知错误'}`);
  }

  // 获取通讯记录
  const recordsTest = await testAPI('/communications/records');
  if (recordsTest.success && recordsTest.status === 200) {
    logTest('获取通讯记录', 'PASS', `找到 ${recordsTest.data.length || 0} 条记录`);
  } else {
    logTest('获取通讯记录', 'FAIL', `状态码: ${recordsTest.status}, 错误: ${recordsTest.data?.error || '未知错误'}`);
  }

  // 获取通讯仪表板数据（关键测试）
  const dashboardTest = await testAPI('/communications/dashboard');
  if (dashboardTest.success && dashboardTest.status === 200) {
    logTest('通讯仪表板数据', 'PASS', `仪表板数据正常返回`);
    console.log('  📊 仪表板统计:', {
      total_plans: dashboardTest.data.total_plans?.count || 0,
      pending_reminders: dashboardTest.data.pending_reminders?.count || 0,
      today_contacts: dashboardTest.data.today_contacts?.count || 0,
      upcoming_contacts: dashboardTest.data.upcoming_contacts?.count || 0
    });
  } else {
    logTest('通讯仪表板数据', 'FAIL', `状态码: ${dashboardTest.status}, 错误: ${dashboardTest.data?.error || '未知错误'}`);
  }

  // 4. 创建新通讯计划测试（关键功能）
  console.log('\n=== 创建功能测试 ===');
  
  const newPlanData = {
    customer_id: 'CUST_001',
    manager_id: 'manager_001',
    plan_name: '测试计划',
    plan_type: '测试类型',
    frequency: 'monthly',
    next_contact_date: '2026-02-01',
    target_date: '2026-02-15',
    status: 'active',
    agenda: '测试议程',
    objectives: '测试目标',
    notes: '这是一个测试计划'
  };

  const createPlanTest = await testAPI('/communications/plans', 'POST', newPlanData);
  if (createPlanTest.success && createPlanTest.status === 201) {
    logTest('创建通讯计划', 'PASS', '计划创建成功');
    
    // 如果创建成功，测试更新功能
    if (createPlanTest.data.id) {
      const updateData = { ...newPlanData, plan_name: '更新后的测试计划' };
      const updateTest = await testAPI(`/communications/plans/${createPlanTest.data.id}`, 'PUT', updateData);
      if (updateTest.success && updateTest.status === 200) {
        logTest('更新通讯计划', 'PASS', '计划更新成功');
      } else {
        logTest('更新通讯计划', 'FAIL', `状态码: ${updateTest.status}`);
      }
    }
  } else {
    logTest('创建通讯计划', 'FAIL', `状态码: ${createPlanTest.status}, 错误: ${createPlanTest.data?.error || JSON.stringify(createPlanTest.data)}`);
  }

  // 5. 投资组合测试
  console.log('\n=== 投资组合测试 ===');
  
  const portfolioTest = await testAPI('/portfolio/CUST_001');
  if (portfolioTest.success && portfolioTest.status === 200) {
    logTest('获取投资组合', 'PASS', '投资组合数据正常');
  } else {
    logTest('获取投资组合', 'FAIL', `状态码: ${portfolioTest.status}`);
  }

  // 6. 市场数据测试
  console.log('\n=== 市场数据测试 ===');
  
  const marketTest = await testAPI('/market');
  if (marketTest.success && marketTest.status === 200) {
    logTest('获取市场数据', 'PASS', '市场数据正常');
  } else {
    logTest('获取市场数据', 'FAIL', `状态码: ${marketTest.status}`);
  }

  // 7. 仪表板数据测试
  console.log('\n=== 仪表板测试 ===');
  
  const mainDashboardTest = await testAPI('/dashboard');
  if (mainDashboardTest.success && mainDashboardTest.status === 200) {
    logTest('主仪表板数据', 'PASS', '仪表板数据正常');
  } else {
    logTest('主仪表板数据', 'FAIL', `状态码: ${mainDashboardTest.status}`);
  }

  // 生成测试报告
  console.log('\n' + '='.repeat(60));
  console.log('📊 Poros 3.6 测试报告');
  console.log('='.repeat(60));
  console.log(`✅ 通过测试: ${testResults.passed}`);
  console.log(`❌ 失败测试: ${testResults.failed}`);
  console.log(`📈 成功率: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ 失败的测试:');
    testResults.tests
      .filter(test => test.status === 'FAIL')
      .forEach(test => {
        console.log(`  - ${test.name}: ${test.message}`);
      });
  }

  console.log('\n🎯 关键功能状态:');
  console.log(`  - 通讯仪表板: ${testResults.tests.find(t => t.name === '通讯仪表板数据')?.status === 'PASS' ? '✅' : '❌'}`);
  console.log(`  - 创建通讯计划: ${testResults.tests.find(t => t.name === '创建通讯计划')?.status === 'PASS' ? '✅' : '❌'}`);
  console.log(`  - 更新通讯计划: ${testResults.tests.find(t => t.name === '更新通讯计划')?.status === 'PASS' ? '✅' : '❌'}`);
  console.log(`  - 获取客户数据: ${testResults.tests.find(t => t.name === '获取客户列表')?.status === 'PASS' ? '✅' : '❌'}`);

  const criticalTests = ['通讯仪表板数据', '创建通讯计划', '获取客户列表'];
  const criticalPassed = criticalTests.every(testName => 
    testResults.tests.find(t => t.name === testName)?.status === 'PASS'
  );

  if (criticalPassed) {
    console.log('\n🎉 Poros 3.6 所有关键功能测试通过！');
    console.log('💡 建议: 所有按钮功能应该都能正常工作了。');
  } else {
    console.log('\n⚠️ Poros 3.6 仍有关键功能需要修复。');
  }

  console.log('\n📋 测试完成时间:', new Date().toISOString());
  
  return {
    success: testResults.failed === 0,
    passed: testResults.passed,
    failed: testResults.failed,
    total: testResults.passed + testResults.failed
  };
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('❌ 测试执行失败:', error);
    process.exit(1);
  });
}

export { runTests };
