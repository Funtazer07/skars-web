const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/contact', async (req, res) => {
  const { name, email, phone, details } = req.body;

  try {
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'vassil@skarsphotography.com', 
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${details}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Redirect back to the contact page with success status
    res.redirect('/contact.html?status=success');
  } catch (error) {
    console.error('Error sending email:', error);
    // Redirect back to the contact page with error status
    res.redirect('/contact.html?status=error');
  }
});

module.exports = router; 