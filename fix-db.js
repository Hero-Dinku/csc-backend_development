const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function fixDatabase() {
    const pool = new Pool({
        host: 'pg-d4aj6ss9c44c738itvng-a.virginia-postgres.render.com',
        port: 5432,
        database: 'my_vehicles',
        user: 'my_vehicles',
        password: 'LMTHGhDZghnVreRhZrmQm3YKzKkZlFlZ',
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔧 Fixing database setup...');
        
        // 1. Check if account_type column exists
        console.log('Checking account_type column...');
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
            console.log('✅ account_type column exists');
        }
        
        // 2. Check if email is unique, if not add constraint
        console.log('Checking email uniqueness...');
        try {
            const uniqueCheck = await pool.query(`
                SELECT COUNT(DISTINCT account_email) as distinct_emails, 
                       COUNT(*) as total_accounts 
                FROM account
            `);
            
            if (uniqueCheck.rows[0].distinct_emails < uniqueCheck.rows[0].total_accounts) {
                console.log('⚠️  Duplicate emails found - fixing...');
                // Remove duplicates
                await pool.query(`
                    DELETE FROM account a 
                    WHERE a.ctid NOT IN (
                        SELECT MIN(b.ctid) 
                        FROM account b 
                        GROUP BY b.account_email
                    )
                `);
                console.log('✅ Removed duplicate emails');
            }
            
            // Add unique constraint if it doesn't exist
            await pool.query(`
                ALTER TABLE account 
                ADD CONSTRAINT unique_account_email UNIQUE (account_email)
            `);
            console.log('✅ Added unique constraint on email');
        } catch (err) {
            console.log('⚠️  Unique constraint may already exist');
        }
        
        // 3. Create or update test accounts (simpler approach)
        console.log('\nSetting up test accounts...');
        const hashedPassword = await bcrypt.hash('Test123!', 10);
        
        const accounts = [
            { firstname: 'Admin', lastname: 'User', email: 'admin@test.com', type: 'Admin' },
            { firstname: 'Employee', lastname: 'User', email: 'employee@test.com', type: 'Employee' },
            { firstname: 'Client', lastname: 'User', email: 'client@test.com', type: 'Client' }
        ];
        
        for (const acc of accounts) {
            // First, delete if exists (to avoid conflict)
            await pool.query(
                'DELETE FROM account WHERE account_email = $1',
                [acc.email]
            );
            
            // Then insert
            await pool.query(
                `INSERT INTO account 
                (account_firstname, account_lastname, account_email, account_password, account_type)
                VALUES ($1, $2, $3, $4, $5)`,
                [acc.firstname, acc.lastname, acc.email, hashedPassword, acc.type]
            );
            
            console.log(`✅ Created: ${acc.email} (${acc.type})`);
        }
        
        // 4. Show all accounts
        console.log('\n📋 All accounts in database:');
        const allAccounts = await pool.query(`
            SELECT account_id, account_firstname, account_lastname, 
                   account_email, account_type 
            FROM account 
            ORDER BY account_type
        `);
        
        allAccounts.rows.forEach(acc => {
            console.log(`  ${acc.account_id}. ${acc.account_firstname} ${acc.account_lastname} (${acc.account_email}) - ${acc.account_type}`);
        });
        
        console.log('\n🎉 Database fix complete!');
        console.log('\n🔑 Test accounts (password: Test123!):');
        console.log('   - Admin: admin@test.com (Admin)');
        console.log('   - Employee: employee@test.com (Employee)');
        console.log('   - Client: client@test.com (Client)');
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await pool.end();
    }
}

fixDatabase();
