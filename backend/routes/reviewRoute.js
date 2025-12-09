// routes/reviews.js

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Profile = require('../models/Profile');
const userAuth = require('../middleware/userAuth'); 

// --- Helper Function: Recalculate Average Rating ---

/**
 * Calculates the average rating for a profile and updates the Profile model.
 * @param {string} profileId - The ID of the Profile to update.
 * @returns {number} The new average rating.
 */
const updateProfileRating = async (profileId) => {
    const profile = await Profile.findById(profileId).select('reviews');
    if (!profile) return 0;

    // Use MongoDB aggregation to calculate the average rating efficiently
    const result = await Review.aggregate([
        { $match: { profile: profile._id } },
        {
            $group: {
                _id: '$profile',
                averageRating: { $avg: '$rating' },
            }
        }
    ]);

    let newAvgRating = 0;
    
    if (result.length > 0) {
        // Round to one decimal place
        newAvgRating = parseFloat(result[0].averageRating.toFixed(1));
    }

    // Update the Profile's 'rating' field
    await Profile.findByIdAndUpdate(profileId, { rating: newAvgRating });
    
    return newAvgRating;
};

// ----------------------------------------------------

// ✅ 1. POST /api/reviews - Create a new review
// Only allowed for 'student' role.
router.post('/', userAuth, async (req, res) => {
    const userId = req.user.id;
    const { profileId, review, rating } = req.body;

    // --- AUTHORIZATION CHECK ---
    if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Only students are authorized to submit reviews.' });
    }
    // --- END AUTHORIZATION ---

    // --- VALIDATION ---
    if (!profileId || !review || !rating) {
        return res.status(400).json({ message: 'Please provide profileId, review, and rating.' });
    }
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    // --- END VALIDATION ---

    try {
        const profileExists = await Profile.findById(profileId);
        if (!profileExists) {
            return res.status(404).json({ message: 'Profile (teacher/institution) not found.' });
        }
        
        // Prevent duplicate review using the unique index set on the Review model
        const existingReview = await Review.findOne({ user: userId, profile: profileId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this profile.' });
        }

        const newReview = new Review({
            user: userId,
            profile: profileId,
            review,
            rating
        });

        await newReview.save();

        // Update the Profile document: link the review and recalculate the average rating
        await Profile.findByIdAndUpdate(profileId, {
            $push: { reviews: newReview._id }
        });
        
        const newAvgRating = await updateProfileRating(profileId);

        res.status(201).json({ 
            message: 'Review submitted successfully', 
            review: newReview,
            newAvgRating
        });

    } catch (err) {
        console.error('Error submitting review:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'You have already reviewed this profile.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// ------------------------------------------------------------------
// ✅ 2. GET /api/reviews - Get ALL reviews (Paginated - for general listing)
// ------------------------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalReviews = await Review.countDocuments();

        const reviews = await Review.find()
            .skip(skip)
            .limit(limit)
            // Populate reviewer (student) details
            .populate('user', 'name profilePicture') 
            // Populate profile details (teacher/institute)
            .populate({
                path: 'profile',
                select: 'user rating', 
                populate: {
                    path: 'user',
                    select: 'name' 
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            reviews,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit),
            totalReviews
        });

    } catch (err) {
        console.error('Error fetching all reviews:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ------------------------------------------------------------------
// ✅ 3. GET /api/reviews/:profileId - Get reviews for a SPECIFIC profile
// (For displaying reviews on a teacher's profile page)
// ------------------------------------------------------------------
router.get('/:profileId', async (req, res) => {
    try {
        const { profileId } = req.params;

        // Fetch reviews for the given profile ID
        const reviews = await Review.find({ profile: profileId })
            .populate('user', 'name profilePicture')
            .sort({ createdAt: -1 });

        if (reviews.length === 0) {
             // If no reviews are found, check if the profile exists to return a meaningful 404/200.
             const profile = await Profile.findById(profileId);
             if (!profile) {
                return res.status(404).json({ message: 'Profile not found.' });
             }
             // Profile exists but has no reviews
             return res.status(200).json({ reviews: [], message: 'No reviews found for this profile yet.' });
        }

        res.status(200).json({ reviews });

    } catch (err) {
        console.error('Error fetching specific reviews:', err);
        // This often catches an invalid ObjectId format
        if (err.kind === 'ObjectId') {
             return res.status(400).json({ message: 'Invalid profile ID format.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;