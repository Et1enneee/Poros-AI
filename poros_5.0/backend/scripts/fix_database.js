import { DatabaseService } from '../services/database.js';

async function fixDatabaseIssues() {
  console.log('🔧 Starting database fix...');
  
  const dbService = new DatabaseService();
  
  try {
    await dbService.initialize();
    
    console.log('✅ Database connection established');
    
    // Check and fix communication_team table
    try {
      dbService.run(`
        ALTER TABLE communication_team 
        ADD COLUMN status TEXT DEFAULT 'active'
      `);
      console.log('✅ Added status column to communication_team');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('✅ status column already exists in communication_team');
      } else {
        console.log('⚠️ Could not add status column to communication_team:', error.message);
      }
    }
    
    // Ensure all necessary tables exist
    const tables = [
      'customers',
      'portfolios', 
      'holdings',
      'transactions',
      'market_data',
      'investment_advice',
      'system_config',
      'communication_plans',
      'communication_records', 
      'communication_reminders',
      'communication_templates',
      'communication_team'
    ];
    
    for (const table of tables) {
      const exists = dbService.get(`SELECT name FROM sqlite_master WHERE type="table" AND name="${table}"`, []);
      if (!exists) {
        console.log(`❌ Table ${table} does not exist`);
      } else {
        console.log(`✅ Table ${table} exists`);
      }
    }
    
    console.log('✅ Database fix completed successfully');
    
  } catch (error) {
    console.error('❌ Database fix failed:', error);
    throw error;
  } finally {
    if (dbService.db) {
      dbService.close();
    }
  }
}

// Run the fix
fixDatabaseIssues()
  .then(() => {
    console.log('🎉 Database fix completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Database fix failed:', error);
    process.exit(1);
  });
