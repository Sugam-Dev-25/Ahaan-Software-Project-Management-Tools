// models/Subject.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String }, // e.g., "Science", "Mathematics", "Languages"
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },

  // 📍 Location specific to this subject (optional, override profile's location if needed)
  location: { type: String },

  // 🕒 Availability specific to this subject
  availability: {
    days: [String], // e.g., ['Monday', 'Tuesday']
    timeSlots: [String] // e.g., ['10:00 AM - 12:00 PM']
  },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to the user who created this subject

}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
