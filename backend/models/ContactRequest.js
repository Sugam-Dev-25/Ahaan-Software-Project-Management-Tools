// models/ContactRequest.js
const mongoose = require('mongoose');

const contactRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactRequest', contactRequestSchema);
