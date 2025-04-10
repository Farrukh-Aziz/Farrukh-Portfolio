const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// In-memory store for requests (replace with database later)
let accessRequests = [];

// Handle POST request for submitting access request
router.post("/request-access", (req, res) => {
  const { email } = req.body;

  if (email) {
    accessRequests.push({ email, status: "pending" });
    res.status(200).send({ message: "Access request submitted. You will be notified once approved." });
    sendNotificationToAdmin(email);
  } else {
    res.status(400).send({ message: "Email is required" });
  }
});

// Handle POST request for approving access
router.post("/approve-access", (req, res) => {
  const { email } = req.body;
  const request = accessRequests.find((r) => r.email === email);

  if (request) {
    request.status = "approved";
    sendResumeToUser(email);
    res.status(200).send({ message: "Access approved and email sent!" });
  } else {
    res.status(404).send({ message: "Request not found." });
  }
});

// Function to send a notification to the admin when an access request is submitted
function sendNotificationToAdmin(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mrfarrukhaziz@gmail.com", // Replace with your email
      pass: "aziz9876@H"    // Replace with your email password
    }
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: "mrfarrukhaziz@gmail.com",  // Replace with your admin email
    subject: "New Resume Access Request",
    text: `A new request has been made for access to the resume by ${email}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending notification:", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Function to send the resume to the user (once approved)
function sendResumeToUser(email) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mrfarrukhaziz@gmail.com", // Replace with your email
      pass: "aziz9876@H"    // Replace with your email password
    }
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Your Resume Access",
    text: "Congratulations, your access to the resume has been approved. You can download it from the link below:",
    attachments: [
      {
        filename: "Resume.pdf",
        path: "../src/Assets/Farrukh Aziz-full stack-ASE.pdf"  // Replace with the correct path to your resume
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending resume:", error);
    } else {
      console.log("Resume sent: " + info.response);
    }
  });
}

module.exports = router;