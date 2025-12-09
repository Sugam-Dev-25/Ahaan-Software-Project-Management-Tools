// models/Review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // User who wrote the review (Student)
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },

    // The profile (Teacher/Institution) being reviewed
    profile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile', 
        required: true 
    },

    // The review text
    review: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 500
    },

    // Rating given (1 to 5)
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }

}, { timestamps: true });

// ENFORCE UNIQUE CONSTRAINT: 
// A user can only create one review for a specific profile
reviewSchema.index({ user: 1, profile: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);