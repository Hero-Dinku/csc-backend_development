const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
    const pool = new Pool({
        host: process.env.DB_HOST || 'pg-d4aj6ss9c44c738itvng-a.virginia-postgres.render.com',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'my_vehicles',
        user: process.env.DB_USER || 'my_vehicles',
        password: process.env.DB_PASSWORD || 'LMTHGhDZghnVreRhZrmQm3YKzKkZlFlZ',
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔄 Setting up database...');
        
        // Check if account_type column exists
        const checkColumn = await pool.query(\
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='account' AND column_name='account_type'
        \);
        
        if (checkColumn.rows.length === 0) {
            console.log('➕ Adding account_type column...');
            await pool.query(\
                ALTER TABLE account 
                ADD COLUMN account_type VARCHAR(50) DEFAULT 'Client' 
                CHECK (account_type IN ('Client', 'Employee', 'Admin'))
            \);
            console.log('✅ Added account_type column');
        } else {
            console.log('✅ account_type column already exists');
        }
        
        // Hash password for test accounts
        const hashedPassword = await bcrypt.hash('Test123!', 10);
        
        // Create test accounts
        const testAccounts = [
            ['Admin', 'User', 'admin@test.com', hashedPassword, 'Admin'],
            ['Employee', 'User', 'employee@test.com', hashedPassword, 'Employee'],
            ['Client', 'User', 'client@test.com', hashedPassword, 'Client']
        ];
        
        for (const account of testAccounts) {
            const result = await pool.query(\
                INSERT INTO account 
                (account_firstname, account_lastname, account_email, account_password, account_type)
                VALUES (\, \, \, \, \)
                ON CONFLICT (account_email) DO NOTHING
                RETURNING account_email
            \, account);
            
            if (result.rows[0]) {
                console.log(\✅ Created account: \ (\)\);
            } else {
                console.log(\⚠️  Account already exists: \\);
            }
        }
        
        // Show all accounts
        const accounts = await pool.query(\
            SELECT 
                account_id,
                account_firstname || ' ' || account_lastname as full_name,
                account_email,
                account_type
            FROM account 
            ORDER BY account_type
        \);
        
        console.log('\n📋 All accounts in database:');
        accounts.rows.forEach(acc => {
            console.log(\  \. \ (\) - \\);
        });
        
        console.log('\n🎉 Database setup complete!');
        console.log('\n🔑 Test accounts (password: Test123!):');
        console.log('   - Admin: admin@test.com');
        console.log('   - Employee: employee@test.com');
        console.log('   - Client: client@test.com');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    } finally {
        await pool.end();
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };
