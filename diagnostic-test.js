// diagnostic-test.js
const utilities = require('./utilities');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function runDiagnostic() {
    console.log('🔍 DIAGNOSTIC TEST - Login System\n');
    console.log('=' .repeat(50));
    
    try {
        // 1. Test Database Connection
        console.log('1. Testing Database Connection...');
        try {
            const dbTest = await utilities.query('SELECT NOW() as time, version() as version');
            console.log('   ✅ Database Connected!');
            console.log('   Time:', dbTest.rows[0].time);
            console.log('   PostgreSQL:', dbTest.rows[0].version.split(',')[0]);
        } catch (dbError) {
            console.log('   ❌ Database Connection FAILED:', dbError.message);
            return;
        }
        
        // 2. Check account table structure
        console.log('\n2. Checking Account Table Structure...');
        try {
            const tableInfo = await utilities.query(
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'account'
            );
            
            if (tableInfo.rows.length > 0) {
                console.log('   ✅ Account table exists with columns:');
                tableInfo.rows.forEach(col => {
                    console.log(      -  ());
                });
            } else {
                console.log('   ❌ Account table has no columns or does not exist');
            }
        } catch (tableError) {
            console.log('   ❌ Error checking table:', tableError.message);
        }
        
        // 3. Check for test account
        console.log('\n3. Checking Test Account...');
        try {
            const testAccount = await utilities.query(
                'SELECT account_id, account_email, account_type FROM account WHERE account_email = ',
                ['test@example.com']
            );
            
            if (testAccount.rows.length > 0) {
                console.log('   ✅ Test account exists:');
                console.log('      ID:', testAccount.rows[0].account_id);
                console.log('      Email:', testAccount.rows[0].account_email);
                console.log('      Type:', testAccount.rows[0].account_type);
                
                // Check password
                const passwordCheck = await utilities.query(
                    'SELECT account_password FROM account WHERE account_email = ',
                    ['test@example.com']
                );
                
                if (passwordCheck.rows[0]?.account_password) {
                    console.log('   ✅ Password hash exists');
                    
                    // Test password verification
                    const hash = passwordCheck.rows[0].account_password;
                    const isMatch = await bcrypt.compare('Test123!', hash);
                    console.log('   ✅ Password verification:', isMatch ? 'PASS' : 'FAIL');
                } else {
                    console.log('   ❌ No password hash found');
                }
            } else {
                console.log('   ⚠️ Test account does not exist');
                console.log('   Creating test account...');
                
                const hashedPassword = await bcrypt.hash('Test123!', 10);
                await utilities.query(
                    'INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES (, , , , )',
                    ['Test', 'User', 'test@example.com', hashedPassword, 'Client']
                );
                console.log('   ✅ Test account created successfully!');
            }
        } catch (accountError) {
            console.log('   ❌ Error with test account:', accountError.message);
        }
        
        // 4. Test JWT
        console.log('\n4. Testing JWT System...');
        try {
            const testPayload = { user_id: 1, email: 'test@example.com' };
            const token = jwt.sign(testPayload, process.env.JWT_SECRET || 'fallback', { expiresIn: '1h' });
            console.log('   ✅ JWT Token created:', token.substring(0, 50) + '...');
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback');
            console.log('   ✅ JWT Verification successful');
            console.log('      Decoded payload:', JSON.stringify(decoded, null, 2));
        } catch (jwtError) {
            console.log('   ❌ JWT Error:', jwtError.message);
        }
        
        // 5. Test routes
        console.log('\n5. Testing Route Files...');
        const fs = require('fs');
        const routes = [
            'routes/accountRoutes.js',
            'controllers/accountsController.js',
            'middleware/authMiddleware.js'
        ];
        
        routes.forEach(route => {
            if (fs.existsSync(route)) {
                console.log(   ✅  exists);
            } else {
                console.log(   ❌  MISSING!);
            }
        });
        
        // 6. Test views
        console.log('\n6. Testing View Files...');
        const views = [
            'views/account/login.ejs',
            'views/account/registration.ejs',
            'views/account/management.ejs',
            'views/account/update.ejs',
            'views/partials/header.ejs'
        ];
        
        views.forEach(view => {
            if (fs.existsSync(view)) {
                console.log(   ✅  exists);
            } else {
                console.log(   ❌  MISSING!);
            }
        });
        
        console.log('\n' + '=' .repeat(50));
        console.log('\n🎯 DIAGNOSTIC COMPLETE');
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Start server: npm run dev');
        console.log('2. Test login: http://localhost:3000/account/login');
        console.log('3. Create test account if needed: http://localhost:3000/account/test-data');
        console.log('4. Check browser console for JavaScript errors');
        console.log('5. Check terminal for server errors');
        
    } catch (error) {
        console.error('FATAL ERROR:', error.message);
        console.error(error.stack);
    }
}

runDiagnostic();
