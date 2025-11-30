Write-Host "Setting up Vehicle Management System..." -ForegroundColor Green

# 1. Create .env file
@"
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-super-secret-session-key-change-in-production

# Render PostgreSQL Database Configuration  
DB_HOST=pg-d4aj6ss9c44c738itvng-a.virginia-postgres.render.com
DB_PORT=5432
DB_NAME=my_vehicles
DB_USER=my_vehicles
DB_PASSWORD=LMTHGhDZghnVreRhZrmQm3YKzKkZlFlZ

# SSL is required for Render PostgreSQL
DB_SSL=true

# JWT Secret
JWT_SECRET=your-jwt-secret-key-change-in-production
"@ | Out-File -FilePath ".env" -Encoding UTF8
Write-Host "✓ Created .env file" -ForegroundColor Green

# 2. Create package.json
@"
{
  "name": "csc-backend-development",
  "version": "1.0.0",
  "description": "Vehicle Management System with Account Management",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "ejs": "^3.1.9",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cookie-parser": "^1.4.6",
    "express-session": "^1.17.3",
    "connect-flash": "^0.1.1",
    "dotenv": "^16.3.1"
  },
  "keywords": ["nodejs", "express", "postgresql", "authentication"],
  "author": "Hero Dinku",
  "license": "MIT"
}
"@ | Out-File -FilePath "package.json" -Encoding UTF8
Write-Host "✓ Created package.json" -ForegroundColor Green

# 3. Create app.js
@"
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Flash messages
app.use(flash());

// Authentication middleware
const { jwtAuth } = require('./middleware/authMiddleware');
app.use(jwtAuth);

// Make flash messages and account data available to all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.loggedin = req.loggedin || false;
  if (req.account) {
    res.locals.account_firstname = req.account.account_firstname;
    res.locals.account_type = req.account.account_type;
    res.locals.account_id = req.account.account_id;
  }
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/account', require('./routes/accountRoutes'));
app.use('/inv', require('./routes/inventoryRoutes'));

// Home route - Amazing Homepage
app.get('/', async (req, res) => {
  try {
    const utilities = require('./utilities');
    let nav = await utilities.getNav();
    
    res.render('index', { 
      title: 'Premium Vehicle Management',
      nav,
      loggedin: req.loggedin,
      account: req.account
    });
  } catch (error) {
    console.error('Home route error:', error);
    res.render('index', { 
      title: 'Premium Vehicle Management',
      nav: [],
      loggedin: false
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Server Error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;
"@ | Out-File -FilePath "app.js" -Encoding UTF8
Write-Host "✓ Created app.js" -ForegroundColor Green

# 4. Create utilities/index.js
@"
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Database connection test
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Utility functions
const utilities = {
  query: (text, params) => pool.query(text, params),
  
  // Get navigation data
  async getNav() {
    try {
      const data = await pool.query(\`
        SELECT classification_id, classification_name 
        FROM classification 
        ORDER BY classification_name
      \`);
      return data.rows;
    } catch (error) {
      console.error('getNav error:', error);
      return [];
    }
  },
  
  // Build classification view
  async buildClassificationGrid(classification_id) {
    try {
      const data = await pool.query(\`
        SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = \$1
      \`, [classification_id]);
      
      return data.rows;
    } catch (error) {
      console.error('buildClassificationGrid error:', error);
      return [];
    }
  }
};

module.exports = utilities;
"@ | Out-File -FilePath "utilities/index.js" -Encoding UTF8
Write-Host "✓ Created utilities/index.js" -ForegroundColor Green

Write-Host "Setup completed! Run 'npm install' to install dependencies." -ForegroundColor Yellow
