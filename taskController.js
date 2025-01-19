const Task = require("../models/task.js");
const User = require("../models/user.js");
const TaskVersion = require("../models/TaskVersion.js");
const notificationService = require("../services/notificationService.js");

const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  const task = new Task({
    title,
    description,
    assignedTo,
    createdBy: req.user._id,
  });
  try {
    const savedTask = await task.save();
    const user = await User.findById(assignedTo); // Send notification
    await notificationService.sendNotification(
      user.email,
      `Task "${title}" has been assigned to you!!`
    );
    res.status(201).send(savedTask);
  } catch (err) {
    res.status(500).send("Server error while creating task");
  }
};

const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).send("Task not found");

    const changes = {};
    Object.keys(updates).forEach((key) => {
      if (task[key] !== updates[key]) {
        changes[key] = updates[key];
      }
    });

    await new TaskVersion({
      taskId: id,
      updatedBy: req.user._id,
      changes,
    }).save();

    Object.assign(task, updates);
    const updatedTask = await task.save();
    res.send(updatedTask);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    // .populate() is used to retrieve related documents from referenced collections.
    res.json(tasks);
  } catch (error) {
    res.status(500).send("Server error!!");
  }
};

module.exports = { createTask, getTasks, updateTaskStatus };