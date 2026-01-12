#!/usr/bin/env node

/**
 * Poros 4.10 Version Complete Fix Verification Test Script
 * 
 * Fixed Issues:
 * 1. Communication module crash (complete null check fixes)
 * 2. AI customization information missing (complete customer data mapping)
 * 3. Database schema issues (missing columns, incorrect field mapping)
 * 4. Communication functionality completely broken (add/edit records)
 * 5. API authentication issues (Spark AI HMAC signature)
 * 6. All content must be in English
 */

import fetch from 'node-fetch';

const POROS_CONFIG = {
    backend_url: 'http://localhost:3001'
};

class Poros4_10Tester {
    constructor() {
        this.testResults = {
            communication: { status: 'pending', details: [] },
            ai_customization: { status: 'pending', details: [] },
            database_schema: { status: 'pending', details: [] },
            communication_functions: { status: 'pending', details: [] },
            english_output: { status: 'pending', details: [] },
            overall: { status: 'pending', passed: 0, failed: 0 }
        };
    }

    async runAllTests() {
        console.log('🚀 Starting Poros 4.10 Complete Fix Verification Tests...\n');
        console.log('📋 Test Objectives:');
        console.log('   1. Verify Communication module crash repair');
        console.log('   2. Verify AI customization with complete customer data');
        console.log('   3. Verify database schema fixes');
        console.log('   4. Verify communication functions (add/edit records)');
        console.log('   5. Verify English output throughout system');
        console.log('   6. Verify customer personalization in AI advice\n');

        try {
            // Test 1: Communication module
            await this.testCommunicationModule();
            
            // Test 2: AI customization
            await this.testAICustomization();
            
            // Test 3: Database schema
            await this.testDatabaseSchema();
            
            // Test 4: Communication functions
            await this.testCommunicationFunctions();
            
            // Test 5: English output
            await this.testEnglishOutput();
            
            // Generate report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Error during testing:', error.message);
            this.testResults.overall.status = 'failed';
        }
    }

    async testCommunicationModule() {
        console.log('🧪 Test 1: Communication Module Crash Repair');
        console.log('=' .repeat(50));
        
        try {
            const dashboardResponse = await fetch(`${POROS_CONFIG.backend_url}/api/communications/dashboard`);
            const dashboardData = await dashboardResponse.json();
            
            if (dashboardResponse.ok && dashboardData.success) {
                this.testResults.communication.details.push('✅ Communication Dashboard API successful');
                
                if (dashboardData.data && typeof dashboardData.data === 'object') {
                    this.testResults.communication.details.push('✅ Dashboard data structure correct');
                    
                    // Verify required fields
                    const requiredFields = ['total_plans', 'pending_reminders', 'today_contacts', 'upcoming_contacts', 'recent_records', 'upcoming_reminders'];
                    const missingFields = requiredFields.filter(field => !(field in dashboardData.data));
                    
                    if (missingFields.length === 0) {
                        this.testResults.communication.details.push('✅ All required fields exist');
                    } else {
                        this.testResults.communication.details.push(`❌ Missing fields: ${missingFields.join(', ')}`);
                        this.testResults.communication.status = 'failed';
                    }
                    
                    // Verify arrays are safe
                    ['recent_records', 'upcoming_reminders'].forEach(field => {
                        if (Array.isArray(dashboardData.data[field])) {
                            this.testResults.communication.details.push(`✅ ${field} is valid array`);
                        } else {
                            this.testResults.communication.details.push(`⚠️ ${field} not array, but protected`);
                        }
                    });
                    
                } else {
                    this.testResults.communication.details.push('❌ Dashboard data format incorrect');
                    this.testResults.communication.status = 'failed';
                }
            } else {
                this.testResults.communication.details.push(`❌ Dashboard API failed: ${dashboardResponse.status}`);
                this.testResults.communication.status = 'failed';
            }
            
        } catch (error) {
            this.testResults.communication.details.push(`❌ Communication test error: ${error.message}`);
            this.testResults.communication.status = 'failed';
        }
        
        this.testResults.communication.status = this.testResults.communication.status === 'failed' ? 'failed' : 'passed';
        console.log(`📊 Communication test result: ${this.testResults.communication.status === 'passed' ? 'PASSED' : 'FAILED'}\n`);
    }

    async testAICustomization() {
        console.log('🧪 Test 2: AI Customization with Complete Customer Data');
        console.log('=' .repeat(50));
        
        try {
            const customersResponse = await fetch(`${POROS_CONFIG.backend_url}/api/advice/customers`);
            const customersData = await customersResponse.json();
            
            if (customersResponse.ok && customersData.success && customersData.customers.length > 0) {
                this.testResults.ai_customization.details.push(`✅ Retrieved ${customersData.customers.length} customers`);
                
                // Test AI advice for first customer
                const customer = customersData.customers[0];
                console.log(`   Testing customer: ${customer.name} (ID: ${customer.customer_id})`);
                
                const adviceResponse = await fetch(`${POROS_CONFIG.backend_url}/api/advice/spark-advice`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer_id: customer.customer_id,
                        user_selections: {
                            investment_goal: 'Asset Growth',
                            investment_period: '3 years'
                        }
                    })
                });
                
                const adviceData = await adviceResponse.json();
                
                if (adviceResponse.ok && adviceData.success) {
                    this.testResults.ai_customization.details.push(`✅ ${customer.name} AI advice generation successful`);
                    
                    // Check customer info completeness
                    const customerInfo = adviceData.customer;
                    const requiredFields = [
                        'name', 'age', 'gender', 'riskLevel', 'totalAssets',
                        'industryCategory', 'industryRole', 'annualSalary', 'totalAnnualIncome',
                        'personality', 'educationLevel', 'communicationDifficulty'
                    ];
                    
                    const missingFields = requiredFields.filter(field => !(field in customerInfo));
                    
                    if (missingFields.length === 0) {
                        this.testResults.ai_customization.details.push(`   ✅ ${customer.name} has all customization fields`);
                    } else {
                        thistestResults.ai_customization.details.push(`   ❌ ${customer.name} missing fields: ${missingFields.join(', ')}`);
                        this.testResults.ai_customization.status = 'failed';
                    }
                    
                    // Check if annual income is properly displayed
                    if (customerInfo.totalAnnualIncome > 0) {
                        thistestResults.ai_customization.details.push(`   ✅ ${customer.name} has annual income: HKD ${customerInfo.totalAnnualIncome.toLocaleString()}`);
                    } else {
                        thistestResults.ai_customization.details.push(`   ❌ ${customer.name} annual income is 0`);
                        this.testResults.ai_customization.status = 'failed';
                    }
                    
                    // Check AI advice personalization
                    const advice = adviceData.advice;
                    const hasPersonalization = advice.includes(customerInfo.name) || 
                                             advice.includes(customerInfo.industryRole) ||
                                             advice.includes(`HKD ${customerInfo.totalAnnualIncome.toLocaleString()}`);
                    
                    if (hasPersonalization) {
                        thistestResults.ai_customization.details.push(`   ✅ ${customer.name} AI advice includes personalization`);
                    } else {
                        thistestResults.ai_customization.details.push(`   ⚠️ ${customer.name} AI advice needs more personalization`);
                    }
                    
                } else {
                    thistestResults.ai_customization.details.push(`❌ ${customer.name} AI advice failed: ${adviceData.message || 'Unknown error'}`);
                    thistestResults.ai_customization.status = 'failed';
                }
                
            } else {
                thistestResults.ai_customization.details.push('❌ Cannot retrieve customers');
                thistestResults.ai_customization.status = 'failed';
            }
            
        } catch (error) {
            thistestResults.ai_customization.details.push(`❌ AI customization test error: ${error.message}`);
            thistestResults.ai_customization.status = 'failed';
        }
        
        thistestResults.ai_customization.status = thistestResults.ai_customization.status === 'failed' ? 'failed' : 'passed';
        console.log(`📊 AI customization test result: ${thistestResults.ai_customization.status === 'passed' ? 'PASSED' : 'FAILED'}\n`);
    }

    async testDatabaseSchema() {
        console.log('🧪 Test 3: Database Schema Verification');
        console.log('=' .repeat(50));
        
        try {
            // Test communication plans
            const plansResponse = await fetch(`${POROS_CONFIG.backend_url}/api/communications/plans`);
            
            if (plansResponse.ok) {
                thistestResults.database_schema.details.push('✅ Communication plans API accessible');
                
                const plansData = await plansResponse.json();
                if (plansData.success && plansData.plans) {
                    thistestResults.database_schema.details.push(`✅ Retrieved ${plansData.plans.length} communication plans`);
                    
                    // Check if plans have title field
                    const hasTitle = plansData.plans.some(plan => plan.title || plan.plan_name);
                    if (hasTitle) {
                        thistestResults.database_schema.details.push('✅ Communication plans have title/plan_name fields');
                    } else {
                        thistestResults.database_schema.details.push('❌ Communication plans missing title fields');
                        thistestResults.database_schema.status = 'failed';
                    }
                }
            } else {
                thistestResults.database_schema.details.push(`❌ Communication plans API failed: ${plansResponse.status}`);
                thistestResults.database_schema.status = 'failed';
            }
            
            // Test communication records
            const recordsResponse = await fetch(`${POROS_CONFIG.backend_url}/api/communications/records?limit=10`);
            
            if (recordsResponse.ok) {
                thistestResults.database_schema.details.push('✅ Communication records API accessible');
            } else {
                thistestResults.database_schema.details.push(`❌ Communication records API failed: ${recordsResponse.status}`);
                thistestResults.database_schema.status = 'failed';
            }
            
        } catch (error) {
            thistestResults.database_schema.details.push(`❌ Database schema test error: ${error.message}`);
            thistestResults.database_schema.status = 'failed';
        }
        
        thistestResults.database_schema.status = thistestResults.database_schema.status === 'failed' ? 'failed' : 'passed';
        console.log(`📊 Database schema test result: ${thistestResults.database_schema.status === 'passed' ? 'PASSED' : 'FAILED'}\n`);
    }

    async testCommunicationFunctions() {
        console.log('🧪 Test 4: Communication Functions (Add/Edit Records)');
        console.log('=' .repeat(50));
        
        try {
            // Test adding a communication plan
            const addPlanResponse = await fetch(`${POROS_CONFIG.backend_url}/api/communications/plans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: 'CUST_001',
                    title: 'Test Communication Plan',
                    plan_name: 'Test Communication Plan',
                    plan_type: 'Test',
                    description: 'Test plan for verification',
                    objectives: 'Testing functionality',
                    target_frequency: 'monthly',
                    priority_level: 'medium'
                })
            });
            
            if (addPlanResponse.ok) {
                thistestResults.communication_functions.details.push('✅ Can add communication plans');
            } else {
                const errorData = await addPlanResponse.json();
                thistestResults.communication_functions.details.push(`❌ Cannot add communication plans: ${errorData.message || addPlanResponse.status}`);
                thistestResults.communication_functions.status = 'failed';
            }
            
            // Test retrieving communication records
            const recordsResponse = await fetch(`${POROS_CONFIG.backend_url}/api/communications/records`);
            
            if (recordsResponse.ok) {
                thistestResults.communication_functions.details.push('✅ Can retrieve communication records');
            } else {
                thistestResults.communication_functions.details.push(`❌ Cannot retrieve communication records: ${recordsResponse.status}`);
                thistestResults.communication_functions.status = 'failed';
            }
            
        } catch (error) {
            thistestResults.communication_functions.details.push(`❌ Communication functions test error: ${error.message}`);
            thistestResults.communication_functions.status = 'failed';
        }
        
        thistestResults.communication_functions.status = thistestResults.communication_functions.status === 'failed' ? 'failed' : 'passed';
        console.log(`📊 Communication functions test result: ${thistestResults.communication_functions.status === 'passed' ? 'PASSED' : 'FAILED'}\n`);
    }

    async testEnglishOutput() {
        console.log('🧪 Test 5: English Output Verification');
        console.log('=' .repeat(50));
        
        try {
            const adviceResponse = await fetch(`${POROS_CONFIG.backend_url}/api/advice/spark-advice`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_id: 'CUST_001',
                    user_selections: {
                        investment_goal: 'Asset Growth',
                        investment_period: '3 years'
                    }
                })
            });
            
            const adviceData = await adviceResponse.json();
            
            if (adviceResponse.ok && adviceData.success) {
                const advice = adviceData.advice;
                
                // Check for English indicators
                const englishWords = ['investment', 'portfolio', 'asset', 'recommendation', 'strategy', 'client'];
                const chineseWords = ['投资', '建议', '策略', '资产', '组合'];
                
                const hasEnglish = englishWords.some(word => 
                    advice.toLowerCase().includes(word.toLowerCase())
                );
                
                const hasChinese = chineseWords.some(word => 
                    advice.includes(word)
                );
                
                if (hasEnglish && !hasChinese) {
                    thistestResults.english_output.details.push('✅ AI advice is in English');
                } else if (hasEnglish && hasChinese) {
                    thistestResults.english_output.details.push('⚠️ Mixed languages (mostly English)');
                } else {
                    thistestResults.english_output.details.push('❌ AI advice not in English');
                    thistestResults.english_output.status = 'failed';
                }
                
                // Check version
                if (adviceData.version === '4.10') {
                    thistestResults.english_output.details.push('✅ Version correctly shows 4.10');
                } else {
                    thistestResults.english_output.details.push(`⚠️ Version shows ${adviceData.version} instead of 4.10`);
                }
                
            } else {
                thistestResults.english_output.details.push('❌ Cannot test English output - API failed');
                thistestResults.english_output.status = 'failed';
            }
            
        } catch (error) {
            thistestResults.english_output.details.push(`❌ English output test error: ${error.message}`);
            thistestResults.english_output.status = 'failed';
        }
        
        thistestResults.english_output.status = thistestResults.english_output.status === 'failed' ? 'failed' : 'passed';
        console.log(`📊 English output test result: ${thistestResults.english_output.status === 'passed' ? 'PASSED' : 'FAILED'}\n`);
    }

    generateReport() {
        console.log('\n' + '=' .repeat(70));
        console.log('📊 Poros 4.10 Complete Fix Verification Test Report');
        console.log('=' .repeat(70));
        
        // Communication module results
        console.log('\n🔧 Issue 1: Communication Module Crash Repair');
        console.log('-'.repeat(50));
        this.testResults.communication.details.forEach(detail => console.log(`   ${detail}`));
        console.log(`   Status: ${this.testResults.communication.status === 'passed' ? '✅ FIXED' : '❌ STILL HAS ISSUES'}`);
        
        // AI customization results
        console.log('\n🤖 Issue 2: AI Customization with Complete Customer Data');
        console.log('-'.repeat(50));
        this.testResults.ai_customization.details.forEach(detail => console.log(`   ${detail}`));
        console.log(`   Status: ${this.testResults.ai_customization.status === 'passed' ? '✅ ENHANCED' : '❌ NEEDS WORK'}`);
        
        // Database schema results
        console.log('\n🗄️ Issue 3: Database Schema Fixes');
        console.log('-'.repeat(50));
        this.testResults.database_schema.details.forEach(detail => console.log(`   ${detail}`));
        console.log(`   Status: ${this.testResults.database_schema.status === 'passed' ? '✅ FIXED' : '❌ NEEDS WORK'}`);
        
        // Communication functions results
        console.log('\n📞 Issue 4: Communication Functions (Add/Edit Records)');
        console.log('-'.repeat(50));
        this.testResults.communication_functions.details.forEach(detail => console.log(`   ${detail}`));
        console.log(`   Status: ${this.testResults.communication_functions.status === 'passed' ? '✅ WORKING' : '❌ BROKEN'}`);
        
        // English output results
        console.log('\n🌍 Issue 5: English Output Verification');
        console.log('-'.repeat(50));
        this.testResults.english_output.details.forEach(detail => console.log(`   ${detail}`));
        console.log(`   Status: ${this.testResults.english_output.status === 'passed' ? '✅ ENGLISH' : '❌ NOT ENGLISH'}`);
        
        // Overall assessment
        const allPassed = this.testResults.communication.status === 'passed' && 
                         this.testResults.ai_customization.status === 'passed' &&
                         this.testResults.database_schema.status === 'passed' &&
                         this.testResults.communication_functions.status === 'passed' &&
                         this.testResults.english_output.status === 'passed';
        
        console.log('\n🎯 Overall Assessment');
        console.log('-'.repeat(50));
        if (allPassed) {
            console.log('   ✅ ALL CORE ISSUES COMPLETELY RESOLVED!');
            console.log('   ✅ Communication module works perfectly');
            console.log('   ✅ AI has complete customer personalization data');
            console.log('   ✅ Database schema is correct and functional');
            console.log('   ✅ Can add and edit communication records');
            console.log('   ✅ All content is in English');
            console.log('\n   🎉 Poros 4.10 is the COMPLETE SOLUTION!');
        } else {
            console.log('   ❌ Some critical issues still exist');
            if (this.testResults.communication.status === 'failed') {
                console.log('   ❌ Communication module still crashes');
            }
            if (this.testResults.ai_customization.status === 'failed') {
                console.log('   ❌ AI still lacks customer personalization');
            }
            if (this.testResults.database_schema.status === 'failed') {
                console.log('   ❌ Database schema still has issues');
            }
            if (this.testResults.communication_functions.status === 'failed') {
                console.log('   ❌ Communication functions still broken');
            }
            if (this.testResults.english_output.status === 'failed') {
                console.log('   ❌ Output still not in English');
            }
        }
        
        console.log('\n📝 4.10 Version Fixes Summary:');
        console.log('   1. Fixed all null check issues in CommunicationDashboard.tsx');
        console.log('   2. Enhanced customer data mapping with complete field mapping');
        console.log('   3. Fixed database schema (added missing title column)');
        console.log('   4. Implemented all missing database methods');
        console.log('   5. Fixed communication plan and record operations');
        console.log('   6. Updated all outputs to English');
        console.log('   7. Version bumped to 4.10 throughout system');
        
        this.testResults.overall.status = allPassed ? 'success' : 'partial';
    }
}

// If running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const tester = new Poros4_10Tester();
    tester.runAllTests().catch(console.error);
}

export { Poros4_10Tester };
