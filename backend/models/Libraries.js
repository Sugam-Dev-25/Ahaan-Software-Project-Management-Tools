const mongoose = require('mongoose');

const libraryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['question', 'solution', 'note'],
    required: true,
  },
  category: String, // e.g., "Class 10 Science"
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Library', libraryItemSchema);
