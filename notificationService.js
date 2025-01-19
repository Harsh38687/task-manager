const Queue = require("bull");
const nodemailer = require("nodemailer");
const notificationQueue = new Queue("notifications");
require("dotenv").config();

notificationQueue.process(async (job) => {
  const { userEmail, message } = job.data;
  try {
    // Configure the transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // port 587 for TLS
      secure: false, // false for STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password
      },
      debug: true,
      logger: true
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Notification",
      text: message
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}: ${message}`);
  } catch (error) {
    console.error(`Failed to send email to ${userEmail}:`, error);
  }
});

// Logging Redis connections to ensure Bull is properly connected:
notificationQueue.on("error", (err) => {
  console.error("Queue error:", err);
})

// Queue diagnostics: Adding event listeners to monitor the queue:
notificationQueue.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

notificationQueue.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed`);
})

notificationQueue.on("active", (job, jobPromise) => {
  console.log(`Job ${job.id} is now active`);
})

notificationQueue.on("waiting", (jobId) => {
  console.log(`Job ${jobId} is waiting to be processed`)
})

const sendNotification = async (userEmail, message) => {
  try {
  await notificationQueue.add({ userEmail, message }, { timeout: 5000 }); // Fail after 5 seconds
  } catch(err) {
    console.error("Error adding job to queue:", err);
  }
};

module.exports = {
  sendNotification,
};