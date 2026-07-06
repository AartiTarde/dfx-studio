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

/**
 * Utility: Normalize date (remove time part)
 */
const normalizeDate = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};


// ==============================
// POST /api/contact (BOOKING)
// ==============================
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, eventDate, message } = req.body;

    // ❗ Validate required fields
    if (!name || !email || !service || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, service, and event date are required',
      });
    }

    const selectedDate = normalizeDate(eventDate);

    // ❗ Check if date already booked
    const existingBooking = await Contact.findOne({
      eventDate: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This date is already booked. Please choose another date.',
      });
    }

    // ✅ Save booking
    const contact = await Contact.create({
      name,
      email,
      phone,
      service,
      eventDate: selectedDate,
      message,
    });

    // ==============================
    // Send notification email
    // ==============================
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO,
        subject: `New Inquiry from ${name} - DFX Studio`,
        html: `
          <h2>New Booking</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone || 'N/A'}</p>
          <p><b>Service:</b> ${service}</p>
          <p><b>Date:</b> ${selectedDate.toDateString()}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      });
    } catch (err) {
      console.log('Email failed:', err.message);
    }

    // ==============================
    // Send auto-reply
    // ==============================
    try {
      await transporter.sendMail({
        from: `"DFX Studio" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Booking Received - DFX Studio',
        html: `
          <h2>Thank you ${name}</h2>
          <p>Your booking for <b>${service}</b> on <b>${selectedDate.toDateString()}</b> is received.</p>
          <p>We will contact you shortly.</p>
        `,
      });
    } catch (err) {
      console.log('Auto-reply failed:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking successful',
      id: contact._id,
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


// ==============================
// GET /api/contact/booked-dates
// ==============================
router.get('/booked-dates', async (req, res) => {
  try {
    const bookings = await Contact.find({}, { eventDate: 1, _id: 0 });

    const dates = bookings.map(b => normalizeDate(b.eventDate));

    res.json({
      success: true,
      dates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==============================
// GET /api/contact (ADMIN)
// ==============================
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==============================
// PATCH /api/contact/:id/status
// ==============================
router.patch('/:id/status', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      data: contact,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;