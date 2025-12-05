const { Pool } = require('pg');

console.log('Testing database connection...');

const pool = new Pool({
    host: 'pg-d4aj6ss9c44c738itvng-a.virginia-postgres.render.com',
    port: 5432,
    database: 'my_vehicles',
    user: 'my_vehicles',
    password: 'LMTHGhDZghnVreRhZrmQm3YKzKkZlFlZ',
    ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
    } else {
        console.log('✅ Connected! Server time:', res.rows[0].now);
    }
    pool.end();
});
