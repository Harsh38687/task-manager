const Task = require("../models/task.js");

// page (default: 1): Specifies the page number for pagination.
// limit (default: 10): Specifies the maximum number of tasks to return per page.
const getFilteredTasks = async (filters, page = 1, limit = 10) => {
  const query = {};
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.assignedTo) {
    query.assignedTo = filters.assignedTo;
  }

  const tasks = await Task.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  const totalTasks = await Task.countDocuments(query);
  return { tasks, totalTasks };
};

module.exports = {
  getFilteredTasks,
};