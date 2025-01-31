const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: { type: Date }
});

TaskSchema.index({ status: 1 });
TaskSchema.index({ createdBy: 1, assignedTo: 1 });

module.exports = mongoose.model("Task", TaskSchema);
