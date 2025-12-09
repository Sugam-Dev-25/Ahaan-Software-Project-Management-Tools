const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Profile = require('../models/Profile');



router.get('/vidyaru-dashboard', adminAuth, async (req, res) => {
  try {
    const pendingProfiles = await Profile.find({ status: 'under_review' }).populate('user', 'name email');
    const approvedCount = await Profile.countDocuments({ status: 'approved' });
    const rejectedCount = await Profile.countDocuments({ status: 'rejected' });
    const pendingCount = pendingProfiles.length;

    // Send JSON to React
    res.json({
      pendingProfiles,
      approvedCount,
      rejectedCount,
      pendingCount
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ message: 'Error loading dashboard' });
  }
});

router.get('/pending-profiles', adminAuth, async (req, res) => {
  try {
    const profiles = await Profile.find({ status: 'under_review' })
      .populate('user', 'name email');
    const approvedCount = await Profile.countDocuments({ status: 'approved' });
    const rejectedCount = await Profile.countDocuments({ status: 'rejected' });

    res.json({
      profiles,
      approvedCount,
      rejectedCount,
      pendingCount: profiles.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profiles' });
  }
});

// GET /admin/all-profiles
router.get('/all-profiles', adminAuth, async (req, res) => {
  try {
    const profiles = await Profile.find({})
      .populate('user', 'name email');

    res.json({ profiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profiles' });
  }
});


// ✅ Admin updates profile status
router.post('/profile/:id/status', adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected', 'under_review'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const profile = await Profile.findById(id).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.status = status;
    await profile.save();

    res.status(200).json({ message: `Profile ${status} successfully`, profile });
  } catch (err) {
    console.error('Admin status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
