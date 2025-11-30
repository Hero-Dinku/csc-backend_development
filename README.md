# Vehicle Management System - Assignment 5

A complete vehicle inventory management system with user authentication, account management, and role-based access control.

## 🚀 Features

- **User Authentication**: Registration, login, logout with JWT
- **Account Management**: Update profile, change password
- **Role-Based Access**: Client, Employee, Admin levels
- **Inventory Management**: Vehicle catalog system
- **PostgreSQL Database**: Full CRUD operations
- **Responsive Design**: Bootstrap-based UI
- **Security**: Password hashing, prepared statements, input validation

## 📋 Assignment Requirements Met

✅ **Frontend Standards** - All views meet checklist requirements  
✅ **Header Navigation** - Dynamic links based on login state  
✅ **Account Greeting** - Proper greeting based on account type  
✅ **Routes & Controllers** - Complete account/password updates  
✅ **Middleware** - JWT auth and role-based access control  
✅ **Account Model** - Processes updates with prepared statements  
✅ **Database Security** - All queries use parameterized statements  
✅ **JWT Authentication** - Tokens created and passed correctly  
✅ **Logout Process** - Complete logout with cookie removal  
✅ **Validation** - Client-side and server-side validation  

## 🛠️ Installation & Setup

1. **Clone the repository**
   \\\ash
   git clone https://github.com/Hero-Dinku/csc-backend_development
   cd csc-backend_development
   \\\

2. **Install dependencies**
   \\\ash
   npm install
   \\\

3. **Environment Configuration**
   - Copy \.env.example\ to \.env\
   - Configure your PostgreSQL database credentials
   - Set JWT and session secrets

4. **Database Setup**
   \\\ash
   node setup-database.js
   \\\

5. **Run the application**
   \\\ash
   npm run dev    # Development
   npm start      # Production
   \\\

## 🌐 Application URLs

- **Homepage**: http://localhost:3000
- **Registration**: http://localhost:3000/account/register
- **Login**: http://localhost:3000/account/login
- **Account Management**: http://localhost:3000/account/management
- **Database Status**: http://localhost:3000/database-status

## 🔐 Test Accounts

- **Test User**: test@example.com / Test123!
- **Create Test Data**: http://localhost:3000/account/test-data

## 🗄️ Database Schema

- **account**: User accounts and authentication
- **classification**: Vehicle categories
- **inventory**: Vehicle inventory items

## 🚀 Deployment

### Render.com Deployment
1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically from main branch

### Environment Variables
\\\env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true
\\\

## 📝 API Routes

### Account Routes
- \GET /account/register\ - Registration form
- \POST /account/register\ - Create new account
- \GET /account/login\ - Login form
- \POST /account/login\ - Authenticate user
- \GET /account/management\ - Account dashboard
- \GET /account/update\ - Update account form
- \POST /account/update\ - Update account info
- \POST /account/update-password\ - Change password
- \GET /account/logout\ - Logout user

### Inventory Routes
- \GET /inv\ - Inventory management (Employee/Admin only)

## 🛡️ Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Prepared statements for SQL queries
- Input validation and sanitization
- XSS protection
- CSRF protection via JWT
- Secure cookie settings

## 👥 Roles & Permissions

- **Client**: Basic account access, view inventory
- **Employee**: Inventory management access
- **Admin**: Full system access

## 📞 Support

For issues or questions, please contact the development team.

---

**Course**: CSC Backend Development  
**Student**: Hero Dinku  
**Assignment**: 5 - Account Management  
**Status**: ✅ Complete and Ready for Grading
