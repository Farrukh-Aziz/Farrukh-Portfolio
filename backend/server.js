const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/request-access", async (req, res) => {
  const { email } = req.body;

  try {
    // Set up the transporter
    let transporter = nodemailer.createTransport({
      service: "gmail", // Or any service you are using
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the email
    let info = await transporter.sendMail({
      from: '"Access Request" <youremail@gmail.com>', // Sender's email
      to: "mrfarrukhaziz@gmail.com", // Send to your email
      subject: "Resume Access Request",
      text: `User with email: ${email} has requested access to your resume.`,
      html: `<b>User with email: ${email} has requested access to your resume.</b>`,
    });

    res.status(200).json({ message: "Request received. You'll be notified once approved." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send request. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
