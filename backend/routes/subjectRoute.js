const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const userAuth = require('../middleware/userAuth'); // Make sure this middleware is implemented

// 📌 CREATE a new subject (only authenticated users)
router.post('/', userAuth, async (req, res) => {
  try {
    const { name, category, level, location, availability } = req.body;

    const subject = new Subject({
      name,
      category,
      level,
      location,
      availability,
      user: req.user.id // 🔗 Link subject to the authenticated user
    });

    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📌 GET all subjects (public)
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().populate('user', 'name email');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 GET subjects created by the logged-in user
router.get('/my', userAuth, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 GET a single subject by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('user', 'name email');

    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 UPDATE a subject by ID (only owner can update)
router.put('/:id', userAuth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    // Check ownership
    if (subject.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const { name, category, level, location, availability } = req.body;
    subject.name = name || subject.name;
    subject.category = category || subject.category;
    subject.level = level || subject.level;
    subject.location = location || subject.location;
    subject.availability = availability || subject.availability;

    await subject.save();
    res.json(subject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📌 DELETE a subject by ID (only owner can delete)
router.delete('/:id', userAuth, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    // Check ownership
    if (subject.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await subject.deleteOne();
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Render subject dashboard page
router.get('/dashboard', userAuth, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });

    res.render('teacher-institute/Tabs/course', {
      user: req.user,
      subjects,
      editMode: false // you can set this dynamically later
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
