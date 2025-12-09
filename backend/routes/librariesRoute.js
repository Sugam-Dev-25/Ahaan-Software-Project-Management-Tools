const express = require('express');
const router = express.Router();
const multer = require('multer');
const Libraries = require('../models/Libraries');

const userAuth = require('../middleware/userAuth');


// 📦 Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 👨‍🏫 Upload PDF (Teachers Only)
router.post('/upload', userAuth, upload.single('pdf'), async (req, res) => {
  try {
    const { title, description, type, category } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const item = new Libraries({
      title,
      description,
      type,
      category,
      fileUrl,
      uploadedBy: req.user.id
    });

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📚 Get all library items
router.get('/', async (req, res) => {
  try {
    const items = await Libraries.find().populate('uploadedBy', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Download file
router.get('/download/:filename', (req, res) => {
  const filePath = `uploads/${req.params.filename}`;
  res.download(filePath);
});

// 📌 GET libraries uploaded by logged-in user
router.get('/my', userAuth, async (req, res) => {
  try {
    const items = await Libraries.find({ uploadedBy: req.user.id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
