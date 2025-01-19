const Task = require("../models/task.js");
const cacheService = require("../services/cacheService.js");

const getTaskAnalytics = async(requestAnimationFrame, res) => {
    const cacheKey = "task-analytics";
    try {
        // Check if analytics are cached
        const cachedAnalytics = await cacheService.get(cacheKey);
        if(cachedAnalytics) {
            return res.json(JSON.parse(cachedAnalytics));
        }

        // Compute analytics
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: "completed" });
        const pendingTasks = await Task.countDocuments({ status: "pending" });
        const inProgressTasks = totalTasks - completedTasks - pendingTasks;

        const analytics = { 
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            completionRate: (completedTasks / totalTasks) * 100 || 0
        };

        // Cache the results for 1 hour
        await cacheService.set(cacheKey, JSON.stringify(analytics), 3600);
        res.json(analytics);
    } catch(error) {
        res.status(500).send("Server error while computing analytics!!");
    }
};

module.exports = {
    getTaskAnalytics
};