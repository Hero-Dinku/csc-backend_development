const utilities = require('./utilities');

async function testDatabase() {
    try {
        console.log('Testing database connection and tables...');
        
        // Test connection
        const nav = await utilities.getNav();
        console.log('✅ Database connection successful');
        console.log('📊 Found classifications:', nav.length);
        
        // Test account functionality
        const testAccount = await utilities.query(
            'SELECT COUNT(*) as count FROM account'
        );
        console.log('👤 Total accounts:', testAccount.rows[0].count);
        
        // Test inventory
        const testInventory = await utilities.query(
            'SELECT COUNT(*) as count FROM inventory'
        );
        console.log('🚗 Total inventory items:', testInventory.rows[0].count);
        
        console.log('🎉 All database tests passed!');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
    }
}

testDatabase();
