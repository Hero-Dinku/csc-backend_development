const bcrypt = require('bcryptjs');

async function testLogin() {
    console.log('Testing login credentials...');
    
    // Test the correct password
    const testPassword = 'Test123!';
    const wrongPassword = 'Test1231';
    
    // Hash the correct password
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    console.log('✅ Hashed password:', hashedPassword.substring(0, 30) + '...');
    
    // Test comparison
    const test1 = await bcrypt.compare(testPassword, hashedPassword);
    console.log('Testing "Test123!":', test1 ? '✅ Correct' : '❌ Wrong');
    
    const test2 = await bcrypt.compare(wrongPassword, hashedPassword);
    console.log('Testing "Test1231":', test2 ? '✅ Correct' : '❌ Wrong');
    
    console.log('\n🔑 IMPORTANT: Use "Test123!" (with exclamation mark)');
}

testLogin();
