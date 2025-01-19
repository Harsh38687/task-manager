const mongoose = require("mongoose");

const TaskVersionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  changes: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TaskVersion", TaskVersionSchema);