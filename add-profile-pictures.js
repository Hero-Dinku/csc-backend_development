const { Pool } = require('pg');

async function addProfilePictureFeature() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🛠️ Adding profile picture enhancement...');
        
        // Check if column exists
        const checkResult = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='account' AND column_name='profile_picture_url'
        `);
        
        if (checkResult.rows.length === 0) {
            console.log('➕ Adding profile_picture_url column...');
            await pool.query(`
                ALTER TABLE account 
                ADD COLUMN profile_picture_url VARCHAR(255) DEFAULT NULL
            `);
            console.log('✅ Added profile_picture_url column');
        } else {
            console.log('✅ profile_picture_url column already exists');
        }
        
        console.log('\n🎉 Database enhancement complete!');
        console.log('Users can now upload profile pictures.');
        
    } catch (error) {
        console.error('❌ Enhancement failed:', error.message);
    } finally {
        await pool.end();
    }
}

addProfilePictureFeature();
