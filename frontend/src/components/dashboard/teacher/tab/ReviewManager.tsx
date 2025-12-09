// src/components/TeacherDashboard/tab/ReviewManager.tsx (Merged)

import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';

// --- 1. Assumed Types (Replace with actual imports if defined elsewhere) ---

// Define the basic structure for a Review object
interface Review {
    _id: string;
    user: { 
        _id: string; 
        name: string; // Populated from 'User' model
        profilePicture?: string; 
    };
    profile: string; // The ID of the profile reviewed
    review: string;
    rating: number; // 1 to 5
    createdAt: string;
}

// Define the basic structure for a Profile object
interface Profile {
    _id: string;
    user: string | { name: string }; // The ID of the associated User
    rating?: number; // The calculated average rating
    // other profile fields...
}

// Extend Profile type to ensure populated user info for the component's title
interface TeacherProfile extends Profile {
    user: { name: string };
}

// --- 2. ReviewCard Component (Mocked for completeness) ---

interface ReviewCardProps {
    review: Review;
}

/**
 * A simple component to display a single review.
 */
const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <div className="bg-white p-4 shadow-md rounded-lg border border-gray-100">
            <div className="flex justify-between items-start">
                {/* Display reviewer's name */}
                <p className="font-semibold text-lg">{review.user.name}</p>
                
                {/* Display rating as stars */}
                <p className="text-amber-500 font-bold text-xl">{'⭐'.repeat(review.rating)}</p>
            </div>
            
            {/* Display review text */}
            <p className="text-gray-600 mt-2 italic">"{review.review}"</p>
            
            {/* Display date */}
            <p className="text-sm text-gray-400 mt-1 text-right">
                Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

// --- 3. ReviewManager Component (The main logic) ---

interface ReviewManagerProps {
    profile: TeacherProfile | null;
}

const ReviewManager: React.FC<ReviewManagerProps> = ({ profile }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Exit early if profile data or ID is missing
        if (!profile?._id) {
            setLoading(false);
            return;
        }

        const fetchReviews = async () => {
            try {
                // Call the backend endpoint: GET /api/reviews/:profileId
                const res = await axiosClient.get(`/api/reviews/${profile._id}`);
                // The backend response is expected to be { reviews: [...] }
                setReviews(res.data.reviews || []);
            } catch (err: any) {
                console.error('Error fetching reviews:', err);
                // Handle 404/400 errors from the backend gracefully
                setError(err.response?.data?.message || 'Failed to load reviews. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [profile?._id]); // Dependency array ensures refetch when profile changes

    if (loading) {
        return <div className="p-6 text-gray-600">Loading reviews...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-600">❌ Error: {error}</div>;
    }
    
    // Fallback if profile is somehow null despite the initial check
    if (!profile) {
        return <div className="p-6 text-red-600">Profile data is missing. Cannot fetch reviews.</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
                ⭐ Reviews for {profile.user.name} 
                {/* Display the calculated average rating if available */}
                {profile.rating !== undefined && (
                    <span className="ml-4 text-2xl font-semibold text-amber-600">
                        {profile.rating.toFixed(1)} / 5.0 Average
                    </span>
                )}
            </h2>
            
            {reviews.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-500 font-medium">👋 No reviews have been submitted for your profile yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back later or encourage your students to share their feedback!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewManager;