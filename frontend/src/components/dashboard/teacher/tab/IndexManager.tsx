import React, { useEffect, useState} from "react";
import axiosClient from "../../../api/axiosClient";
// --- Updated Icons from @phosphor-icons/react ---
import { 
   
    Star, 
    Clock, 
    BookOpen, 
    FileText, 
    Question, 
    CheckCircle, 
    PencilSimple,
    GraduationCap,
    Flask
} from "@phosphor-icons/react";

// --- Design Colors ---
const PRIMARY_COLOR = "#014063"; // Dark Teal/Navy
const SECONDARY_COLOR = "#1A9A7D"; // Teal Green

// --- Utility function to simulate data that isn't directly fetched ---
// NOTE: The actual logic for calculating total hours and library breakdown 
// has been moved into the useEffect hook for better data handling based on API responses.
const simulateData = () => {
  return { noteCount: 0, questionCount: 0, solutionCount: 0, totalWorkingHours: 0 };
};


const IndexManager: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [libraryCount, setLibraryCount] = useState(0);
  const [libraryBreakdown, setLibraryBreakdown] = useState(simulateData());
  const [subjectsStats, setSubjectsStats] = useState(simulateData());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1) Fetch Profile
        const pResponse = await axiosClient.get("/api/profiles/me", { withCredentials: true });
        const fetchedProfile = pResponse.data.profile;
        setProfile(fetchedProfile);

        // 2) Fetch Subjects Count & Data
        const sResponse = await axiosClient.get("/api/subjects/my", { withCredentials: true });
        const fetchedSubjects = sResponse.data;
        setSubjectsCount(fetchedSubjects.length);
        
        // Calculating total working hours based on fetched subjects
        // Placeholder logic: assume 2 hours per listed day for each subject
        const totalHours = fetchedSubjects.reduce((acc: number, subject: any) => {
            const daysCount = subject.availability?.days?.length || 0;
            const timeSlotsCount = subject.availability?.timeSlots?.length || 0;
            // A slightly better placeholder: 2 hours per day * the number of time slots listed
            return acc + (daysCount * timeSlotsCount * 2); 
        }, 0);
        setSubjectsStats({ ...subjectsStats, totalWorkingHours: totalHours });
        
        // 3) Fetch Libraries Count & Data
        const lResponse = await axiosClient.get("/api/libraries/my", { withCredentials: true });
        const fetchedLibraries = lResponse.data;
        setLibraryCount(fetchedLibraries.length);

        // Calculating library item breakdown
        const notes = fetchedLibraries.filter((item: any) => item.type === 'note').length;
        const questions = fetchedLibraries.filter((item: any) => item.type === 'question').length;
        const solutions = fetchedLibraries.filter((item: any) => item.type === 'solution').length;
        setLibraryBreakdown({
            noteCount: notes,
            questionCount: questions,
            solutionCount: solutions,
            totalWorkingHours: 0 // Not relevant here
        });

      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '32px' }}>
      <p className="p-8 text-lg font-semibold">Loading dashboard…</p>
    </div>
  );

  // Fallback for profile data if fetching failed but loading is false
  const safeProfile = profile || { 
    user: { name: 'N/A', email: 'N/A' }, 
    type: 'N/A', 
    rating: 0, 
    profileImage: 'https://via.placeholder.com/120' 
  };
  
  // Use a card component structure for repeated elements
  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="rounded-2xl p-6 shadow-xl transition-transform transform hover:scale-[1.02] cursor-pointer" style={{ backgroundColor: color, color: 'white' }}>
      <div className="flex justify-between items-start">
        <div className="text-4xl font-extrabold">{value}</div>
        <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>{icon}</div>
      </div>
      <h3 className="text-sm font-light mt-4 opacity-80">{title}</h3>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <div className="p-8 space-y-10 max-w-7xl mx-auto">

        {/* --- Profile Section --- */}
        <div className="relative bg-white shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border-t-8" style={{ borderColor: PRIMARY_COLOR }}>
          
          <img
            src={safeProfile.profileImage || "https://via.placeholder.com/144"}
            alt="User Profile"
            className="w-36 h-36 rounded-full border-4 object-cover shadow-lg"
            style={{ borderColor: SECONDARY_COLOR }}
          />

          <div className="flex-1">
            <h2 className="text-4xl font-extrabold" style={{ color: PRIMARY_COLOR }}>{safeProfile.user.name}</h2>
            <p className="text-lg text-gray-600 mb-4">{safeProfile.user.email}</p>

            <div className="flex space-x-6">
              <div className="flex items-center text-gray-700">
                <GraduationCap weight="fill" className="w-6 h-6 mr-2" style={{ color: SECONDARY_COLOR }} />
                <span className="font-semibold"></span> {safeProfile.type.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
              </div>
              <div className="flex items-center text-gray-700">
                <Star weight="fill" className="w-6 h-6 mr-2 text-yellow-500" />
                <span className="font-semibold"></span> {safeProfile.rating} / 5
              </div>
            </div>
          </div>
          
          {/* Update Profile Symbol */}
          <button 
            className="absolute top-6 right-6 p-3 rounded-full transition-colors hover:opacity-80 shadow-md" 
            style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}
            title="Update Profile"
          >
            <PencilSimple weight="bold" className="w-6 h-6" />
          </button>
        </div>
        
        <hr className="border-gray-300" />

        {/* --- Stats Section --- */}
        <h2 className="text-2xl font-bold" style={{ color: PRIMARY_COLOR }}>Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Subjects Count */}
          <StatCard 
            title="Total Subjects Managed" 
            value={subjectsCount} 
            icon={<BookOpen weight="bold" className="w-7 h-7" />}
            color={PRIMARY_COLOR}
          />
          
          {/* Total Working Hours */}
          <StatCard 
            title="Estimated Teaching Hours" 
            value={`${subjectsStats.totalWorkingHours} hrs`} 
            icon={<Clock weight="bold" className="w-7 h-7" />}
            color={SECONDARY_COLOR}
          />

          {/* Library Count */}
          <StatCard 
            title="Total Learning Materials" 
            value={libraryCount} 
            icon={<Flask weight="bold" className="w-7 h-7" />}
            color={PRIMARY_COLOR}
          />

          {/* Library Breakdown Card */}
          <div className="rounded-2xl p-6 shadow-xl border-4 bg-white transition-transform transform hover:scale-[1.02] cursor-pointer" style={{ borderColor: SECONDARY_COLOR }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: PRIMARY_COLOR }}>Library Breakdown</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center"><FileText weight="fill" className="w-5 h-5 mr-2" style={{ color: SECONDARY_COLOR }} />Notes</span>
                    <span className="font-bold text-xl">{libraryBreakdown.noteCount}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center"><Question weight="fill" className="w-5 h-5 mr-2" style={{ color: SECONDARY_COLOR }} />Questions</span>
                    <span className="font-bold text-xl">{libraryBreakdown.questionCount}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                    <span className="flex items-center"><CheckCircle weight="fill" className="w-5 h-5 mr-2" style={{ color: SECONDARY_COLOR }} />Solutions</span>
                    <span className="font-bold text-xl">{libraryBreakdown.solutionCount}</span>
                </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default IndexManager;