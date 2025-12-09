import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Sidebar from './tab/Sidebar';
import TutorProfile from './tab/TutorProfile';
import SubjectManager from './tab/SubjectManager';
import LibraryManager from './tab/LibraryManager';
import IndexManager from './tab/IndexManager'
import axiosClient from '../../api/axiosClient';
import type { Subject,  User } from './profile';
import ReviewManager from './tab/ReviewManager';

const TeacherDashboard: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get('/api/profiles/me', { withCredentials: true });
        setProfile(res.data.profile);
        setUser(res.data.profile?.user || { name: 'Teacher' });
        if (res.data.profile?.status === 'approved') {
        const subjectsRes = await axiosClient.get('/api/subjects', { withCredentials: true });
        setSubjects(subjectsRes.data);
      }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);



  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex max-w-8xl mx-auto">
      <Sidebar currentPath={window.location.pathname} userId={userId!} profileStatus={profile?.status} />
      <main className="flex-1">
        {profile?.status !== 'approved' ? (
          user ? <TutorProfile user={user} profile={profile} /> : <p>Loading user...</p>
        ) : (
          user && (
            <Routes>
              <Route path='' element={<IndexManager />} />
              <Route path="course" element={<SubjectManager user={user} subjects={subjects} />} />
              <Route path="libraries" element={<LibraryManager />} />
              <Route path="review" element={<ReviewManager profile={profile}/>} />
              <Route path="application" element={<p>Application tab content</p>} />
              <Route path="*" element={<p>Page not found</p>} />
            </Routes>
          )
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
