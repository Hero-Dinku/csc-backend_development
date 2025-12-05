Write-Host "🚀 Starting Account Management Setup..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# 1. Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install pg bcryptjs express ejs jsonwebtoken dotenv cookie-parser

# 2. Create config directory
if (!(Test-Path "config")) {
    New-Item -ItemType Directory -Path "config" -Force | Out-Null
    Write-Host "✅ Created config directory" -ForegroundColor Green
}

# 3. Create database.js
Write-Host "`n🗄️ Creating database configuration..." -ForegroundColor Cyan
$dbConfig = @"
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
"@

$dbConfig | Out-File -FilePath "config/database.js" -Encoding UTF8
Write-Host "✅ Created config/database.js" -ForegroundColor Green

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext: Run the database setup:" -ForegroundColor Yellow
Write-Host "node setup-db.js" -ForegroundColor White
