import React, { useState } from 'react';

// Interfaces imported from useSampleData.ts (simplified here)
interface User { name: string; }
interface Profile {
  type?: string;
  location?: string;
  experience?: number;
  description?: string;
  contactInfo?: string;
  profileImage?: string;
  status: string;
}

interface TutorProfileProps {
  user: User;
  profile?: Profile;
}

const TutorProfile: React.FC<TutorProfileProps> = ({ user, profile }) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate API call
    setStatusMessage(`✅ Profile ${profile ? 'Updated' : 'Created'} and is now under review!`);
    setShowProfileForm(false);
    // In a real app, you would send a POST/PUT request here.
  };

  const checkStatus = () => {
    setStatusMessage(`📌 Profile Status: ${profile?.status || 'No profile found'}`);
  };

  return (
    <div className="dashboard-container bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h1>

      <div className="button-group mt-6 flex gap-4">
        <button
          onClick={() => setShowProfileForm(true)}
          className="flex items-center px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          ✏️ {profile ? 'Edit Profile' : 'Create Profile'}
        </button>
        <button
          onClick={checkStatus}
          className="flex items-center px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          📋 Check Profile Status
        </button>
      </div>

      {statusMessage && (
        <div className="status-message mt-4 p-3 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md">
          {statusMessage}
        </div>
      )}

      {showProfileForm && (
        <form onSubmit={handleSubmit} className="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {profile ? 'Edit' : 'Create'} Your Teaching Profile
          </h3>

          <label className="block">Type:</label>
          <select name="type" defaultValue={profile?.type} required className="w-full p-2 border rounded-md">
            <option value="">Select</option>
            <option value="private_tutor">Private Tutor</option>
            <option value="coaching_center">Coaching Center</option>
            <option value="small_institute">Small Institute</option>
          </select>
          {/* ... other form fields follow similar pattern ... */}
          
          <button type="submit" className="mt-4 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default TutorProfile;