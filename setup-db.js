const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
    const pool = new Pool({
        host: 'pg-d4aj6ss9c44c738itvng-a.virginia-postgres.render.com',
        port: 5432,
        database: 'my_vehicles',
        user: 'my_vehicles',
        password: 'LMTHGhDZghnVreRhZrmQm3YKzKkZlFlZ',
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔄 Setting up database...');
        
        // 1. Add account_type column if it doesn't exist
        console.log('Checking for account_type column...');
        const columnCheck = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='account' AND column_name='account_type'
        `);
        
        if (columnCheck.rows.length === 0) {
            console.log('Adding account_type column...');
            await pool.query(`
                ALTER TABLE account 
                ADD COLUMN account_type VARCHAR(50) DEFAULT 'Client' 
                CHECK (account_type IN ('Client', 'Employee', 'Admin'))
            `);
            console.log('✅ Added account_type column');
        } else {
            console.log('✅ account_type column already exists');
        }
        
        // 2. Create test accounts
        console.log('\nCreating test accounts...');
        const hashedPassword = await bcrypt.hash('Test123!', 10);
        
        const accounts = [
            { firstname: 'Admin', lastname: 'User', email: 'admin@test.com', type: 'Admin' },
            { firstname: 'Employee', lastname: 'User', email: 'employee@test.com', type: 'Employee' },
            { firstname: 'Client', lastname: 'User', email: 'client@test.com', type: 'Client' }
        ];
        
        for (const acc of accounts) {
            const result = await pool.query(`
                INSERT INTO account 
                (account_firstname, account_lastname, account_email, account_password, account_type)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (account_email) DO NOTHING
                RETURNING account_email
            `, [acc.firstname, acc.lastname, acc.email, hashedPassword, acc.type]);
            
            if (result.rows[0]) {
                console.log(`✅ Created: ${acc.email} (${acc.type})`);
            } else {
                console.log(`⚠️  Exists: ${acc.email}`);
            }
        }
        
        // 3. Show all accounts
        console.log('\n📋 All accounts:');
        const allAccounts = await pool.query(`
            SELECT account_id, account_firstname, account_lastname, 
                   account_email, account_type 
            FROM account 
            ORDER BY account_type
        `);
        
        allAccounts.rows.forEach(acc => {
            console.log(`  ${acc.account_id}. ${acc.account_firstname} ${acc.account_lastname} (${acc.account_email}) - ${acc.account_type}`);
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

setupDatabase();
