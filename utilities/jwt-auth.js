// Simple JWT auth for testing
const jwtAuth = (req, res, next) => {
    // For testing, set some dummy user data
    res.locals.loggedin = false;
    res.locals.user = null;
    
    console.log('JWT auth - running in test mode');
    next();
};

module.exports = jwtAuth;
