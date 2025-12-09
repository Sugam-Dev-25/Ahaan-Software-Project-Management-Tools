// src/components/dashboard/admin/tab/AllProfiles.tsx
import React, { useEffect, useState } from 'react';
import axiosClient from '../../../api/axiosClient';
import type { Profile } from '../profile';

const AllProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axiosClient.get('/admin/all-profiles');
        setProfiles(res.data.profiles ?? []);
      } catch (err) {
        console.error(err);
        setError('Failed to load profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) return <p>Loading profiles...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (profiles.length === 0)
    return <p className="italic text-gray-500">No profiles found.</p>;

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
          </tr>
        </thead>
        <tbody>
          {profiles.map(profile => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllProfiles;
