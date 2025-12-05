const pool = require('./config/database');

async function test() {
    try {
        console.log('Testing database connection...');
        
        // Test 1: Check connection
        const result1 = await pool.query('SELECT NOW() as time');
        console.log('✅ Connection test passed:', result1.rows[0].time);
        
        // Test 2: Check accounts table
        try {
            const result2 = await pool.query('SELECT COUNT(*) as count FROM account');
            console.log('✅ Accounts table exists. Total accounts:', result2.rows[0].count);
        } catch (err) {
            console.log('⚠️  Accounts table may not exist yet');
        }
        
        // Test 3: Check for account_type column
        try {
            const result3 = await pool.query(\
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='account' AND column_name='account_type'
            \);
            if (result3.rows.length > 0) {
                console.log('✅ account_type column exists');
            } else {
                console.log('❌ account_type column missing - you need to add it');
                console.log('Run the SQL in setup.sql to add it');
            }
        } catch (err) {
            console.log('⚠️  Could not check account_type column:', err.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        pool.end();
    }
}

test();
