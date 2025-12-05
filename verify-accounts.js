const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function verifyAndFixAccounts() {
    const pool = new Pool({
        host: 'pg-d4aj6ss9c44c738itvng-a.virginia-postgres.render.com',
        port: 5432,
        database: 'my_vehicles',
        user: 'my_vehicles',
        password: 'LMTHGhDZghnVreRhZrmQm3YKzKkZlFlZ',
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔍 Verifying test accounts...');
        
        // Check all accounts
        const accounts = await pool.query(`
            SELECT account_id, account_firstname, account_lastname, 
                   account_email, account_type, account_password
            FROM account 
            ORDER BY account_type
        `);
        
        console.log('\n📋 Found accounts:');
        accounts.rows.forEach(acc => {
            console.log(`  ${acc.account_id}. ${acc.account_firstname} ${acc.account_lastname} (${acc.account_email}) - ${acc.account_type}`);
        });
        
        // Test each account password
        console.log('\n🔑 Testing passwords...');
        const testPassword = 'Test123!';
        
        for (const acc of accounts.rows) {
            const valid = await bcrypt.compare(testPassword, acc.account_password);
            console.log(`  ${acc.account_email}: ${valid ? '✅ Correct password' : '❌ Wrong password'}`);
            
            if (!valid) {
                console.log(`    Fixing password for ${acc.email}...`);
                const hashedPassword = await bcrypt.hash(testPassword, 10);
                await pool.query(
                    'UPDATE account SET account_password = $1 WHERE account_id = $2',
                    [hashedPassword, acc.account_id]
                );
                console.log(`    ✅ Password updated`);
            }
        }
        
        // Create missing accounts
        console.log('\n➕ Creating missing accounts...');
        const requiredAccounts = [
            { firstname: 'Admin', lastname: 'User', email: 'admin@test.com', type: 'Admin' },
            { firstname: 'Employee', lastname: 'User', email: 'employee@test.com', type: 'Employee' },
            { firstname: 'Client', lastname: 'User', email: 'client@test.com', type: 'Client' }
        ];
        
        const hashedPassword = await bcrypt.hash('Test123!', 10);
        
        for (const reqAcc of requiredAccounts) {
            const exists = accounts.rows.find(a => a.account_email === reqAcc.email);
            
            if (!exists) {
                console.log(`  Creating ${reqAcc.email}...`);
                await pool.query(
                    `INSERT INTO account 
                    (account_firstname, account_lastname, account_email, account_password, account_type)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [reqAcc.firstname, reqAcc.lastname, reqAcc.email, hashedPassword, reqAcc.type]
                );
                console.log(`  ✅ Created ${reqAcc.email}`);
            }
        }
        
        // Final verification
        console.log('\n✅ Final account list:');
        const finalAccounts = await pool.query(`
            SELECT account_id, account_firstname, account_lastname, 
                   account_email, account_type 
            FROM account 
            ORDER BY account_type
        `);
        
        finalAccounts.rows.forEach(acc => {
            console.log(`  ${acc.account_id}. ${acc.account_firstname} ${acc.account_lastname} (${acc.account_email}) - ${acc.account_type}`);
        });
        
        console.log('\n🎉 Verification complete!');
        console.log('\n📝 Login credentials:');
        console.log('   Email: admin@test.com / employee@test.com / client@test.com');
        console.log('   Password: Test123!');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        await pool.end();
    }
}

verifyAndFixAccounts();
