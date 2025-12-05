// diagnostic-test-fixed.js
const utilities = require('./utilities');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function runDiagnostic() {
    console.log('🔍 DIAGNOSTIC TEST - Login System\n');
    console.log('='.repeat(50));
    
    try {
        // 1. Test Database Connection
        console.log('1. Testing Database Connection...');
        try {
            const dbTest = await utilities.query('SELECT NOW() as time');
            console.log('   ✅ Database Connected!');
            console.log('   Time:', dbTest.rows[0].time);
        } catch (dbError) {
            console.log('   ❌ Database Connection FAILED:', dbError.message);
            console.log('   Make sure your .env file has correct database credentials');
            return;
        }
        
        // 2. Check account table
        console.log('\n2. Checking Account Table...');
        try {
            const accounts = await utilities.query('SELECT * FROM account LIMIT 5');
            console.log('   ✅ Account table accessible');
            console.log('   Found', accounts.rows.length, 'accounts');
            
            if (accounts.rows.length > 0) {
                console.log('   First account:', accounts.rows[0].account_email);
            }
        } catch (tableError) {
            console.log('   ❌ Error accessing account table:', tableError.message);
            console.log('   You may need to run the database setup');
        }
        
        // 3. Create/Check test account
        console.log('\n3. Checking/Creating Test Account...');
        try {
            const testAccount = await utilities.query(
                'SELECT account_id, account_email, account_type FROM account WHERE account_email = ',
                ['test@example.com']
            );
            
            if (testAccount.rows.length > 0) {
                console.log('   ✅ Test account exists');
                console.log('      Email:', testAccount.rows[0].account_email);
                console.log('      Type:', testAccount.rows[0].account_type);
            } else {
                console.log('   Creating test account...');
                const hashedPassword = await bcrypt.hash('Test123!', 10);
                await utilities.query(
                    'INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES (, , , , )',
                    ['Test', 'User', 'test@example.com', hashedPassword, 'Client']
                );
                console.log('   ✅ Test account created!');
            }
        } catch (accountError) {
            console.log('   ❌ Error with test account:', accountError.message);
        }
        
        // 4. Test password verification
        console.log('\n4. Testing Password System...');
        try {
            const passwordCheck = await utilities.query(
                'SELECT account_password FROM account WHERE account_email = ',
                ['test@example.com']
            );
            
            if (passwordCheck.rows[0]?.account_password) {
                const hash = passwordCheck.rows[0].account_password;
                const isMatch = await bcrypt.compare('Test123!', hash);
                console.log('   ✅ Password verification:', isMatch ? 'PASS' : 'FAIL');
            } else {
                console.log('   ❌ No password found for test account');
            }
        } catch (pwError) {
            console.log('   ❌ Password test error:', pwError.message);
        }
        
        // 5. Test JWT
        console.log('\n5. Testing JWT System...');
        try {
            const testPayload = { user_id: 1, email: 'test@example.com' };
            const token = jwt.sign(testPayload, process.env.JWT_SECRET || 'fallback', { expiresIn: '1h' });
            console.log('   ✅ JWT Token created');
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback');
            console.log('   ✅ JWT Verification successful');
        } catch (jwtError) {
            console.log('   ❌ JWT Error:', jwtError.message);
        }
        
        // 6. Check required files
        console.log('\n6. Checking Required Files...');
        const fs = require('fs');
        const files = [
            'routes/accountRoutes.js',
            'controllers/accountsController.js',
            'middleware/authMiddleware.js',
            'utilities/index.js',
            'views/account/login.ejs',
            'views/account/registration.ejs',
            'views/account/management.ejs',
            'views/account/update.ejs'
        ];
        
        let missingFiles = [];
        files.forEach(file => {
            if (fs.existsSync(file)) {
                console.log(   ✅ );
            } else {
                console.log(   ❌  - MISSING);
                missingFiles.push(file);
            }
        });
        
        if (missingFiles.length > 0) {
            console.log('\n   ⚠️  Missing files:', missingFiles.length);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('\n🎯 DIAGNOSTIC COMPLETE');
        
        if (missingFiles.length === 0) {
            console.log('\n✅ All files present!');
        } else {
            console.log(\n⚠️  Missing  files. You may need to create them.);
        }
        
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Start server: npm run dev');
        console.log('2. Open: http://localhost:3000/test-direct');
        console.log('3. Test login with: test@example.com / Test123!');
        console.log('4. Check terminal for any errors');
        
    } catch (error) {
        console.error('FATAL ERROR:', error.message);
        console.error(error.stack);
    }
}

runDiagnostic();
