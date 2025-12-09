const express = require('express');
const router = express.Router();
const ContactRequest = require('../models/ContactRequest');
const Profile = require('../models/Profile');
const userAuth = require('../middleware/userAuth');

// ✅ 1. Send contact request (only students)
router.post('/', userAuth, async (req, res) => {
  const { profileId, message } = req.body;

  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can send contact requests' });
  }

  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const request = new ContactRequest({
      student: req.user.id,
      profile: profileId,
      message
    });

    await request.save();
    res.status(201).json({ message: 'Contact request sent successfully', request });
  } catch (err) {
    console.error('Error sending contact request:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ 2. View contact requests sent by the logged-in student
router.get('/my-requests', userAuth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view their requests' });
  }

  try {
    const requests = await ContactRequest.find({ student: req.user.id })
      .populate('profile')
      .populate({ path: 'profile', populate: { path: 'user', select: 'name email role' } });

    res.status(200).json({ requests });
  } catch (err) {
    console.error('Error fetching requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ 3. View all contact requests received by a tutor/institute (based on profile)
router.get('/received', userAuth, async (req, res) => {
  if (!['tutor', 'institute'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Only tutors/institutes can view received requests' });
  }

  try {
    // Find profiles owned by this user
    const profiles = await Profile.find({ user: req.user.id }).select('_id');
    const profileIds = profiles.map(p => p._id);

    const requests = await ContactRequest.find({ profile: { $in: profileIds } })
      .populate('student', 'name email')
      .populate('profile');

    res.status(200).json({ requests });
  } catch (err) {
    console.error('Error fetching received requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ 4. Update contact request status (accept/reject)
router.put('/:id/status', userAuth, async (req, res) => {
  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const request = await ContactRequest.findById(req.params.id).populate('profile');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if current user is the owner of the profile
    if (String(request.profile.user) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You are not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.status(200).json({ message: `Request ${status}`, request });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
