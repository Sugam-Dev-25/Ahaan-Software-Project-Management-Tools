// src/components/dashboard/admin/tab/PendingProfiles.tsx
import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import type { Profile } from '../profile';

interface PendingProfilesProps {
  initialProfiles?: Profile[];
}

const PendingProfiles: React.FC<PendingProfilesProps> = ({ initialProfiles = [] }) => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles ?? []);
  const [loading, setLoading] = useState(initialProfiles?.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      const res = await axiosClient.get('/admin/pending-profiles', {
        withCredentials: true,
      });
      setProfiles(res.data.profiles ?? []);
    } catch (err) {
      console.error('Error fetching pending profiles:', err);
      setError('Failed to load pending profiles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProfiles?.length === 0) fetchProfiles();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await axiosClient.post(
        `/admin/profile/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setProfiles(prev =>
        prev.map(profile => (profile._id === id ? { ...profile, status } : profile))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  if (loading) return <p>Loading pending profiles...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if ((profiles ?? []).length === 0)
    return <p className="italic text-gray-500">No profiles pending review.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(profiles ?? []).map(profile => (
            <tr key={profile._id} className="border-b">
              <td className="py-3 px-6">{profile.user.name}</td>
              <td className="py-3 px-6">{profile.user.email}</td>
              <td className="py-3 px-6">{profile.type || '-'}</td>
              <td className="py-3 px-6">{profile.contactInfo?.phone || '-'}</td>
              <td className="py-3 px-6">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    profile.status === 'under_review'
                      ? 'bg-yellow-100 text-yellow-600'
                      : profile.status === 'approved'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {profile.status.replace('_', ' ')}
                </span>
              </td>
              <td className="py-3 px-6 space-x-2">
                {profile.status === 'under_review' && (
                  <>
                    <button
                      onClick={() => updateStatus(profile._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(profile._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingProfiles;
