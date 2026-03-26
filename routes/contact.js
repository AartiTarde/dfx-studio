const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, eventDate, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      service,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      message,
    });

    // Send notification email to studio (optional, won't fail if email not configured)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `New Inquiry from ${name} - DFX Studio`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #c9a84c;">New Client Inquiry - DFX Studio</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${phone || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${service}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Event Date:</td><td style="padding: 8px;">${eventDate || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td style="padding: 8px;">${message}</td></tr>
            </table>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Email notification failed (non-critical):', emailError.message);
    }

    // Send auto-reply to client
    try {
      await transporter.sendMail({
        from: `"DFX Studio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Thank you for contacting DFX Studio!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px;">
            <h1 style="color: #c9a84c; text-align: center;">DFX Studio</h1>
            <h2 style="color: #fff;">Thank you, ${name}!</h2>
            <p style="color: #ccc; line-height: 1.6;">We have received your inquiry for <strong style="color: #c9a84c;">${service}</strong>. Our team will get back to you within 24 hours.</p>
            <p style="color: #ccc;">We look forward to capturing your special moments!</p>
            <hr style="border-color: #333; margin: 30px 0;">
            <p style="color: #888; font-size: 12px; text-align: center;">DFX Studio | Professional Photography & Videography</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Auto-reply email failed (non-critical):', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! We will contact you within 24 hours.',
      id: contact._id,
    });

  } catch (error) {
    console.error('Contact form error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// GET /api/contact - Get all contacts (admin)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/contact/:id/status - Update contact status (admin)
router.patch('/:id/status', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
