// app.js - Render entry point
require('dotenv').config();

console.log('🚀 Starting Account Management System on Render...');

// Check environment variables
console.log('📋 Environment check:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 3000);
console.log('- DB_HOST:', process.env.DB_HOST ? 'Set' : 'Missing');
console.log('- DB_NAME:', process.env.DB_NAME ? 'Set' : 'Missing');

// Import the Express app from server.js
const app = require('./server.js');

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server started on port ${PORT}`);
    console.log(`🌐 Application is live!`);
    console.log(`🔗 Database status: http://localhost:${PORT}/database-status`);
    console.log(`👤 Login: http://localhost:${PORT}/login`);
});
