// Simple notification middleware
const notifications = (req, res, next) => {
    // Just pass through for now - we'll use query parameters
    next();
};

module.exports = notifications;
