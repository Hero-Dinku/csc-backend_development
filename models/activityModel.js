const pool = require("../config/database");

const activityModel = {
    logActivity: async (accountId, activityType, details = "", ip = "", userAgent = "") => {
        try {
            const sql = "INSERT INTO activity_log (account_id, activity_type, activity_details, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5) RETURNING log_id";
            const result = await pool.query(sql, [accountId, activityType, details, ip, userAgent]);
            return result.rows[0];
        } catch (error) {
            console.error("Error logging activity:", error);
            throw error;
        }
    },

    getUserActivities: async (accountId, limit = 10) => {
        try {
            const sql = "SELECT activity_type, activity_details, created_at FROM activity_log WHERE account_id = $1 ORDER BY created_at DESC LIMIT $2";
            const result = await pool.query(sql, [accountId, limit]);
            return result.rows;
        } catch (error) {
            console.error("Error getting activities:", error);
            throw error;
        }
    }
};

module.exports = activityModel;
