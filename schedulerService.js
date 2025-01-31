const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Task = require("../models/task.js");
const User = require("../models/user.js");

const sendReminder = async () => {
  try {
    const tasks = await Task.find({
      status: "pending",
      $or: [
        { dueDate: { $lte: new Date() } }, // Matches documents with dueDate <= now
        { dueDate: { $exists: false } }, // Matches documents with no dueDate key
      ],
    }).populate("assignedTo", "email");
    for (const task of tasks) {
      const email = task.assignedTo.email;
      const message = `Reminder: Task ${task.title} is due soon!`;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: "Gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Task reminder",
        text: message,
      });
    }
  } catch (err) {
    console.log("Error obtained = ", err);
  }
};

cron.schedule("30 15 15 * *", sendReminder); // 15th of every month at 3:30 PM
module.exports = { sendReminder };