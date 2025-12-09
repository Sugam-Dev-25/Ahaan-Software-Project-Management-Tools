import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Plus, MagnifyingGlass, X, DotsThreeVertical, PencilSimple, Trash } from '@phosphor-icons/react';
import axiosClient from '../../../api/axiosClient';
import type { Subject, User } from '../profile';

// --- CONSTANTS & STYLES ---
const PRIMARY_COLOR = '#014063'; // Dark Navy
const SECONDARY_COLOR = '#1A9A7D'; // Teal Green
const BUTTON_TEXT_COLOR = 'white';

// List of all days for multi-select
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Define the component interface (using type Subject from the context)
interface SubjectManagerProps {
  user?: User;
  subjects?: Subject[];
}

const SubjectManager: React.FC<SubjectManagerProps> = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null); // State for Kebab menu
 
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    category: '',
    level: 'beginner',
    location: '',
    availability: { days: [], timeSlots: [] },
  });

  const dropdownRef=useRef<HTMLDivElement | null>(null);

  // --- API Handlers ---

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/api/subjects/my', { withCredentials: true });
      setSubjects(res.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(()=>{
    const handleClickOutside=(e: MouseEvent)=>{
      if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)){
       setActiveMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return ()=>  document.removeEventListener("mousedown",handleClickOutside)
  }, [])

  // Reset form state
  const resetForm = () => {
    setNewSubject({
      name: '',
      category: '',
      level: 'beginner',
      location: '',
      availability: { days: [], timeSlots: [] },
    });
    setIsEditing(false);
    setShowForm(false);
  };

  // Handle form submission for creating/updating a subject
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && newSubject._id) {
        // Update existing subject
        const res = await axiosClient.put(`/api/subjects/${newSubject._id}`, newSubject, { withCredentials: true });
        setSubjects(prev => prev.map(s => (s._id === res.data._id ? res.data : s)));
      } else {
        // Create new subject
        const res = await axiosClient.post('/api/subjects', newSubject, { withCredentials: true });
        // Use the returned Subject object, ensuring it's of type Subject before adding
        setSubjects(prev => [...prev, res.data as Subject]);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving subject:', err);
    }
  };

  // Delete subject
  const handleDelete = async (id: string) => {
    // Close the menu first
    setActiveMenuId(null); 
    if (!window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) return;

    try {
      await axiosClient.delete(`/api/subjects/${id}`, { withCredentials: true });
      setSubjects(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Error deleting subject:', err);
    }
  };

  // Edit subject
  const handleEdit = (subject: Subject) => {
    setActiveMenuId(null); // Close the menu
    setIsEditing(true);
    setNewSubject(subject);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  // Handle day selection change
  const handleDayChange = (day: string, checked: boolean) => {
    const currentDays = newSubject.availability?.days || [];
    const updatedDays = checked
      ? [...currentDays, day]
      : currentDays.filter(d => d !== day);

    setNewSubject({
      ...newSubject,
      availability: {
        ...(newSubject.availability || { days: [], timeSlots: [] }),
        days: updatedDays,
      },
    });
  };

  // --- Filtering Logic ---
  const filteredSubjects = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return subjects;
    
    return subjects.filter(subject => 
      subject.name.toLowerCase().includes(term) ||
      (subject.category || '').toLowerCase().includes(term) ||
      (subject.location || '').toLowerCase().includes(term)
    );
  }, [subjects, searchTerm]);

  // --- Components ---

  // Action Menu Dropdown
  const ActionMenu: React.FC<{ subject: Subject }> = ({ subject }) => (
    <div className="relative inline-block text-left">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveMenuId(activeMenuId === subject._id ? null : subject._id);
        }}
        className="p-1 rounded-full hover:bg-gray-200 transition"
        style={{ color: PRIMARY_COLOR }}
      >
        <DotsThreeVertical size={24} weight="bold" />
      </button>

      {activeMenuId === subject._id &&  (
        <div 
         ref={dropdownRef}
          className="absolute right-[20px] top-[-25px] mt-2 w-30 bg-white border border-gray-200 rounded-lg shadow-xl z-10"
          onBlur={() => setActiveMenuId(null)} // Close menu if focus is lost
        >
          <button
            onClick={() => handleEdit(subject)}
            className="flex items-center w-full px-[10px] py-[5px] text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
          >
            <PencilSimple size={18} className="mr-2" style={{ color: PRIMARY_COLOR }} />
            Edit
          </button>
          <button
            onClick={() => handleDelete(subject._id)}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
          >
            <Trash size={18} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );

  // --- Render ---

  if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading subjects...</div>;

  return (
    <div className="subject-dashboard max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8" style={{ backgroundColor: 'white' }}>
      
      {/* --- Top Action Bar --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Search Bar (Left) */}
        <div className="relative w-full sm:w-1/3 min-w-[200px] shadow-sm">
            <MagnifyingGlass 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
                size={20} 
            />
            <input
                type="text"
                placeholder="Search by subject name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current focus:border-transparent transition"
                style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
            />
        </div>

        {/* Create Subject Button (Right) */}
        <button
          className={`flex items-center gap-2 px-5 py-3 text-${BUTTON_TEXT_COLOR} font-bold rounded-lg transition-all shadow-md w-full sm:w-auto`}
          style={{ backgroundColor: showForm ? '#dc2626' : PRIMARY_COLOR, color: BUTTON_TEXT_COLOR }}
          onClick={() => {
            if (showForm) {
                resetForm();
            } else {
                resetForm();
                setShowForm(true);
            }
          }}
        >
          {showForm ? <X size={20} weight="bold" /> : <Plus size={20} weight="bold" />}
          {showForm ? 'Cancel Creation' : 'Create New Subject'}
        </button>
      </div>
      
      <hr className="border-gray-200" />
      
      {/* --- Subject Form --- */}
      {showForm && (
        <div className="form-container bg-gray-50 p-8 rounded-xl shadow-inner border-t-4" style={{ borderColor: SECONDARY_COLOR }}>
          <form onSubmit={handleSave} className="space-y-6">
            <h3 className={`text-2xl font-extrabold`} style={{ color: PRIMARY_COLOR }}>
              {isEditing ? 'Edit Subject Details' : 'Define New Subject'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Name */}
                <input
                    type="text"
                    placeholder="Subject Name (e.g., Organic Chemistry)"
                    value={newSubject.name || ''}
                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                />
                
                {/* Category */}
                <input
                    type="text"
                    placeholder="Category (e.g., Science, Math)"
                    value={newSubject.category || ''}
                    onChange={e => setNewSubject({ ...newSubject, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                />
                
                {/* Level */}
                <select
                    value={newSubject.level || 'beginner'}
                    onChange={e => setNewSubject({ ...newSubject, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition bg-white"
                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                >
                    <option value="beginner">Beginner Level</option>
                    <option value="intermediate">Intermediate Level</option>
                    <option value="advanced">Advanced Level</option>
                </select>

                {/* Location */}
                <input
                    type="text"
                    placeholder="Location (e.g., Online, New Delhi)"
                    value={newSubject.location || ''}
                    onChange={e => setNewSubject({ ...newSubject, location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                />
            </div>
            
            {/* Availability Form Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="lg:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Available Days</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {ALL_DAYS.map(day => (
                            <label key={day} className="flex items-center space-x-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(newSubject.availability?.days || []).includes(day)}
                                    onChange={(e) => handleDayChange(day, e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-current focus:ring-current"
                                    style={{ color: SECONDARY_COLOR, '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                                />
                                <span>{day.slice(0, 3)}</span>
                            </label>
                        ))}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: PRIMARY_COLOR }}>Time Slots (comma-separated)</label>
                    <input
                        type="text"
                        placeholder="e.g., 9:00-11:00 AM, 4:00-6:00 PM"
                        value={(newSubject.availability?.timeSlots || []).join(', ')}
                        onChange={e => setNewSubject({ 
                            ...newSubject, 
                            availability: { 
                                ...(newSubject.availability || { days: [], timeSlots: [] }),
                                timeSlots: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                            } 
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                        style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                    />
                </div>
            </div>
            
            <button
              type="submit"
              className={`px-6 py-3 text-${BUTTON_TEXT_COLOR} font-semibold rounded-lg transition-colors shadow-md`}
              style={{ backgroundColor: isEditing ? SECONDARY_COLOR : PRIMARY_COLOR, color: BUTTON_TEXT_COLOR }}
            >
              {isEditing ? 'Update Subject' : 'Create Subject'}
            </button>
            <button
                type="button"
                onClick={resetForm}
                className="ml-4 px-6 py-3 text-gray-700 bg-gray-200 font-semibold rounded-lg transition-colors hover:bg-gray-300 shadow-md"
            >
                Cancel
            </button>
          </form>
        </div>
      )}

      {/* --- Subjects List --- */}
      <h2 className={`text-xl font-bold mt-8`} style={{ color: PRIMARY_COLOR }}>
        {searchTerm ? `Found ${filteredSubjects.length} Subjects` : `All Your Subjects (${subjects.length})`}
      </h2>
      
      {filteredSubjects.length === 0 && !loading && (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-dashed mt-4">
              <p className="text-gray-500 font-medium">
                  {searchTerm 
                    ? `No subjects match your search for "${searchTerm}".`
                    : "You haven't created any subjects yet. Click 'Create New Subject' to begin."
                  }
              </p>
          </div>
      )}

      {filteredSubjects.length > 0 && (
        <div className="overflow-x-auto shadow-xl rounded-xl">
          <table className="subject-table w-full bg-white">
            <thead className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
              <tr>
                <th className="p-4 text-left rounded-tl-xl">ID</th>
                <th className="p-4 text-left">Subject Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Level</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Availability</th>
                <th className="p-4 text-center w-20 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject._id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  <td className="p-4 text-sm font-semibold" style={{ color: SECONDARY_COLOR }}>#{subject._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 font-medium text-gray-800">{subject.name}</td>
                  <td className="p-4 text-gray-600">{subject.category || 'N/A'}</td>
                  <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          subject.level === 'beginner' ? 'bg-green-100 text-green-800' :
                          subject.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                          {subject.level.charAt(0).toUpperCase() + subject.level.slice(1)}
                      </span>
                  </td>
                  <td className="p-4 text-gray-600">{subject.location || 'N/A'}</td>
                  <td className="p-4 text-sm text-gray-600">
                      {subject.availability.days.length > 0 ? (
                          <>
                              <span className="font-semibold">{subject.availability.days.map(d => d.slice(0, 3)).join(', ')}</span>
                              <p className="text-xs italic mt-1">{subject.availability.timeSlots.join(' / ')}</p>
                          </>
                      ) : (
                          'Not Set'
                      )}
                  </td>
                  <td className="p-4 text-center">
                    <ActionMenu subject={subject} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubjectManager;