const express = require("express");
const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController.js");
const authenticateToken = require("../middleware/authMiddleware.js");
const authorizeRole = require("../middleware/roleMiddleware.js");

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeRole(["admin", "manager"]),
  createTask
);

router.get("/", authenticateToken, getTasks);

router.get("/filter", authenticateToken, async (req, res) => {
  const filters = req.query;
  const { page, limit } = req.query;
  const taskService = require("../services/taskService.js");
  try {
    const result = await taskService.getFilteredTasks(filters, page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).send("Error fetching tasks!!");
  }
});

router.put(
  "/:id",
  authenticateToken,
  authorizeRole(["admin", "manager", "employee"]),
  updateTaskStatus
);

module.exports = router;