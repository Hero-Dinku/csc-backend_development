const { Pool } = require('pg');
require('dotenv').config();

async function verifyTables() {
    console.log('🔍 Verifying database tables...');
    
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        const client = await pool.connect();
        
        // Check all tables
        const tables = await client.query(
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        );
        
        console.log('📋 Tables in database:');
        tables.rows.forEach(table => {
            console.log('   ✅', table.table_name);
        });
        
        // Check row counts
        const accountCount = await client.query('SELECT COUNT(*) as count FROM account');
        const classificationCount = await client.query('SELECT COUNT(*) as count FROM classification');
        const inventoryCount = await client.query('SELECT COUNT(*) as count FROM inventory');
        
        console.log('\n📊 Table row counts:');
        console.log('   👥 Accounts:', accountCount.rows[0].count);
        console.log('   🏷️  Classifications:', classificationCount.rows[0].count);
        console.log('   🚗 Inventory:', inventoryCount.rows[0].count);
        
        client.release();
        await pool.end();
        
        console.log('\n🎉 Database is ready to use!');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

verifyTables();
