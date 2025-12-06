const activityModel = require('../models/activityModel');

const activityController = {
    // Show user activity log
    showUserActivity: async (req, res) => {
        try {
            const userId = req.user.account_id;
            const activities = await activityModel.getUserActivities(userId, 20);
            
            res.render('account/activity-log', {
                title: 'Your Activity Log',
                user: req.user,
                activities: activities,
                error: null
            });
        } catch (error) {
            console.error('Activity log error:', error);
            res.status(500).render('error', {
                message: 'Failed to load activity log',
                user: req.user
            });
        }
    },

    // Show all activities (admin only)
    showAllActivity: async (req, res) => {
        try {
            // Check if user is admin
            if (req.user.account_type !== 'Admin') {
                return res.redirect('/account/activity-log');
            }
            
            const activities = await activityModel.getAllActivities(50);
            
            res.render('account/admin-activity-log', {
                title: 'Admin Activity Log',
                user: req.user,
                activities: activities,
                error: null
            });
        } catch (error) {
            console.error('Admin activity log error:', error);
            res.status(500).render('error', {
                message: 'Failed to load admin activity log',
                user: req.user
            });
        }
    },

    // Log activity middleware (to use in other controllers)
    logActivityMiddleware: (activityType, getDetails = () => '') => {
        return async (req, res, next) => {
            try {
                if (req.user && req.user.account_id) {
                    const details = typeof getDetails === 'function' 
                        ? getDetails(req) 
                        : getDetails;
                        
                    await activityModel.logActivity(
                        req.user.account_id,
                        activityType,
                        details,
                        req.ip,
                        req.headers['user-agent']
                    );
                }
                next();
            } catch (error) {
                console.error('Activity logging middleware error:', error);
                next(); // Don't stop the request if logging fails
            }
        };
    }
};

module.exports = activityController;
