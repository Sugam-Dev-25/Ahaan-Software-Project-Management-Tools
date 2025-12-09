import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
    UploadSimple, DownloadSimple, MagnifyingGlass, X, FileText, Question, CheckCircle, PencilSimple, TrashSimple, DotsThreeVertical
} from '@phosphor-icons/react';
// Assuming axiosClient is correctly set up for your backend endpoints
import axiosClient from '../../../api/axiosClient'; 
import type { LibraryItem } from '../profile';

interface NewResourceFormState {
    title: string;
    description: string;
    type: 'question' | 'solution' | 'note';
    category: string;
    file: File | null;
}

// --- CONSTANTS & STYLES ---
const PRIMARY_COLOR = '#014063'; // Dark Navy
const SECONDARY_COLOR = '#1A9A7D'; // Teal Green
const BUTTON_TEXT_COLOR = 'white';

const ITEM_TYPES: ('question' | 'solution' | 'note')[] = ['note', 'question', 'solution'];
const initialResourceState: NewResourceFormState = {
    title: '',
    description: '',
    type: 'note',
    category: '',
    file: null,
};

// =======================================================
// --- 1. REUSABLE ACTION MENU COMPONENT 🛠️ ---
// =======================================================

interface ActionMenuProps {
    item: LibraryItem;
    activeMenuId: string | null;
    setActiveMenuId: (id: string | null) => void;
    handleEdit: (item: LibraryItem) => void;
    handleDelete: (id: string) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ item, activeMenuId, setActiveMenuId, handleEdit, handleDelete }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // This hook manages closing the dropdown if the user clicks anywhere outside of it.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeMenuId === item._id && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Check if the click was NOT on the menu button itself to avoid immediate re-close
                if (!(event.target as HTMLElement).closest('.action-menu-button')) {
                    setActiveMenuId(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeMenuId, item._id, setActiveMenuId]);


    const isMenuOpen = activeMenuId === item._id;

    return (
        <div className="relative inline-block text-left">
            <button
                // Use a class name to easily exclude this button from the 'click outside' logic
                className="action-menu-button p-1 rounded-full hover:bg-gray-200 transition"
                style={{ color: PRIMARY_COLOR }}
                onClick={(e) => {
                    // Prevent row click event from propagating
                    e.stopPropagation();
                    // Toggle the menu for the current item
                    setActiveMenuId(isMenuOpen ? null : item._id);
                }}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                title="Resource Actions"
            >
                <DotsThreeVertical size={24} weight="bold" />
            </button>

            {isMenuOpen && (
                <div 
                    ref={dropdownRef}
                    // Position the menu slightly above and to the left of the button
                    className="absolute right-[24px] top-[-10px] mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-10 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                >
                    {/* Download Link */}
                    <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full px-[10px] py-[8px] text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                        onClick={() => setActiveMenuId(null)} // Close after action
                        role="menuitem"
                    >
                        <DownloadSimple size={18} className="mr-2" style={{ color: SECONDARY_COLOR }} />
                        Download
                    </a>

                    {/* Edit Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                            setActiveMenuId(null); // Close after action
                        }}
                        className="flex items-center w-full px-[10px] py-[8px] text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                    >
                        <PencilSimple size={18} className="mr-2" style={{ color: PRIMARY_COLOR }} />
                        Edit
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                            setActiveMenuId(null); // Close after action
                        }}
                        className="flex items-center w-full px-[10px] py-[8px] text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                        role="menuitem"
                    >
                        <TrashSimple size={18} className="mr-2" />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// =======================================================
// --- 2. MAIN LIBRARY MANAGER COMPONENT (UPDATED) 🚀 ---
// =======================================================

const LibraryManager: React.FC = () => {
    const [libraries, setLibraries] = useState<LibraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newResource, setNewResource] = useState<NewResourceFormState>(initialResourceState);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null); // State to track which menu is open

    // --- API Handlers (Simplified for brevity, but all functions are here) ---

    const fetchLibraries = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/api/libraries/my', { withCredentials: true }); 
            setLibraries(res.data);
        } catch (err) {
            console.error('Error fetching library items:', err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchLibraries(); }, []);

    const resetForm = () => { 
        setNewResource(initialResourceState);
        setEditingItem(null);
        setShowUploadForm(false);
    };

    const handleEdit = (item: LibraryItem) => {
        setEditingItem(item);
        setNewResource({
            title: item.title,
            description: item.description || '',
            type: item.type,
            category: item.category,
            file: null,
        });
        setShowUploadForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this resource? This action cannot be undone.")) return;
        try {
            console.log(`Simulating DELETE for resource ID: ${id}`);
            // Optimistically update the UI
            setLibraries(prev => prev.filter(item => item._id !== id));
            alert('Resource deleted successfully!');
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Failed to delete resource. Please check the console.');
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!newResource.file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('title', newResource.title);
        formData.append('description', newResource.description);
        formData.append('type', newResource.type);
        formData.append('category', newResource.category);
        formData.append('pdf', newResource.file); // 'pdf' matches the multer field name in the backend

        try {
            // Assuming the backend endpoint is /api/libraries/upload
            const res = await axiosClient.post('/api/libraries/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            
            // Add the newly uploaded item to the list and reset
            setLibraries(prev => [...prev, res.data as LibraryItem]);
            resetForm();
            alert('Resource uploaded successfully!');
        } catch (error) {
            console.error('Error uploading resource:', error);
            alert('Failed to upload resource. Please check the console.');
        }
    };

    // --- Filtering Logic ---
   const filteredLibraries = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return libraries;
        
        return libraries.filter(item => 
            item.title.toLowerCase().includes(term) ||
            item.description?.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            item.type.toLowerCase().includes(term)
        );
    }, [libraries, searchTerm]);

    // Function to get icon based on item type
    const getTypeIcon = (type: LibraryItem['type']) => {
        switch (type) {
            case 'note': return <FileText size={20} weight="bold" style={{ color: PRIMARY_COLOR }} />;
            case 'question': return <Question size={20} weight="bold" style={{ color: SECONDARY_COLOR }} />;
            case 'solution': return <CheckCircle size={20} weight="bold" style={{ color: SECONDARY_COLOR }} />;
            default: return <FileText size={20} weight="bold" style={{ color: PRIMARY_COLOR }} />;
        }
    };

    // --- Render ---

    if (loading) return <div className="p-8 text-center text-xl font-semibold">Loading Library...</div>;

    return (
        <div className="library-dashboard max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8" style={{ backgroundColor: 'white' }}>
            
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
                        placeholder="Search by title, category, or type..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current focus:border-transparent transition"
                        style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                    />
                </div>

                {/* Upload/Cancel Button (Right) */}
                <button
                    className={`flex items-center gap-2 px-5 py-3 text-${BUTTON_TEXT_COLOR} font-bold rounded-lg transition-all shadow-md w-full sm:w-auto`}
                    style={{ backgroundColor: showUploadForm ? '#dc2626' : PRIMARY_COLOR, color: BUTTON_TEXT_COLOR }}
                    onClick={() => {
                        resetForm(); 
                        setShowUploadForm(!showUploadForm);
                    }}
                >
                    {showUploadForm ? <X size={20} weight="bold" /> : <UploadSimple size={20} weight="bold" />}
                    {showUploadForm ? 'Cancel' : 'Upload New Resource'}
                </button>
            </div>
            
            <hr className="border-gray-200" />

            {/* --- Upload/Edit Form (Unified) --- */}
            {showUploadForm && (
                <div className="form-container bg-gray-50 p-8 rounded-xl shadow-inner border-t-4" style={{ borderColor: SECONDARY_COLOR }}>
                    <form onSubmit={handleUploadSubmit} className="space-y-6">
                        <h3 className={`text-2xl font-extrabold`} style={{ color: PRIMARY_COLOR }}>
                            {editingItem ? 'Edit Resource' : 'Upload New Learning Resource'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: PRIMARY_COLOR }}>Resource Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newResource.title}
                                    onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                    required
                                    placeholder="e.g., Chapter 5 Quantum Physics Notes"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: PRIMARY_COLOR }}>Category/Topic</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={newResource.category}
                                    onChange={e => setNewResource({ ...newResource, category: e.target.value })}
                                    required
                                    placeholder="e.g., Class 12 Physics"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                                />
                            </div>

                            {/* Resource Type */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: PRIMARY_COLOR }}>Resource Type</label>
                                <select
                                    name="type"
                                    value={newResource.type}
                                    onChange={e => setNewResource({ ...newResource, type: e.target.value as LibraryItem['type'] })}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition bg-white"
                                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                                >
                                    {ITEM_TYPES.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload - Conditional label/requirement */}
                            <div>
                                <label className="block text-sm font-bold mb-1" style={{ color: PRIMARY_COLOR }}>
                                    {editingItem ? 'Replace PDF File (Optional)' : 'Upload PDF File'}
                                </label>
                                <input
                                    type="file"
                                    name="pdf"
                                    accept=".pdf"
                                    onChange={e => setNewResource({ ...newResource, file: e.target.files ? e.target.files[0] : null })}
                                    required={!editingItem} // Only required for new uploads
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition bg-white"
                                    style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold mb-1" style={{ color: PRIMARY_COLOR }}>Description (Optional)</label>
                            <textarea
                                name="description"
                                value={newResource.description}
                                onChange={e => setNewResource({ ...newResource, description: e.target.value })}
                                rows={3}
                                placeholder="Briefly describe the content of this resource."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-current transition"
                                style={{ '--tw-ring-color': SECONDARY_COLOR } as React.CSSProperties}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`px-6 py-3 text-${BUTTON_TEXT_COLOR} font-semibold rounded-lg transition-colors shadow-md`}
                            style={{ backgroundColor: SECONDARY_COLOR, color: BUTTON_TEXT_COLOR }}
                        >
                            {editingItem ? 'Save Changes' : 'Upload Resource'}
                        </button>
                    </form>
                </div>
            )}

            <hr className="border-gray-200" />
            
            {/* --- Library List --- */}
            <h2 className={`text-xl font-bold mt-8`} style={{ color: PRIMARY_COLOR }}>
                {searchTerm ? `Found ${filteredLibraries.length} Resources` : `Total Uploaded Resources (${libraries.length})`}
            </h2>

            {filteredLibraries.length === 0 && !loading && (
                <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-dashed mt-4">
                    <p className="text-gray-500 font-medium">
                        {searchTerm 
                            ? `No resources match your search for "${searchTerm}".`
                            : "Your library is empty. Click 'Upload New Resource' to add learning materials."
                        }
                    </p>
                </div>
            )}

            {filteredLibraries.length > 0 && (
                <div className="overflow-x-auto shadow-xl rounded-xl">
                    <table className="w-full bg-white">
                        <thead className="text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
                            <tr>
                                <th className="p-4 text-left rounded-tl-xl">ID</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Type</th>
                                <th className="p-4 text-left">Uploaded By</th>
                                <th className="p-4 text-center w-24 rounded-tr-xl">Actions</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLibraries.map((item) => (
                                <tr key={item._id} className={`border-b last:border-b-0 hover:bg-gray-50 transition ${editingItem?._id === item._id ? 'bg-yellow-50/50' : ''}`}>
                                    <td className="p-4 text-sm font-semibold" style={{ color: SECONDARY_COLOR }}>#{item._id.slice(-6).toUpperCase()}</td>
                                    <td className="p-4 font-medium text-gray-800">{item.title}</td>
                                    <td className="p-4 text-gray-600">{item.category || 'N/A'}</td>
                                    <td className="p-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(item.type)}
                                            <span className="font-semibold">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{item.uploadedBy?.name || 'Unknown'}</td>
                                    <td className="p-4 text-center">
                                        {/* 🛑 Replaced individual buttons with ActionMenu 🛑 */}
                                        <ActionMenu
                                            item={item}
                                            activeMenuId={activeMenuId}
                                            setActiveMenuId={setActiveMenuId}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />
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

export default LibraryManager;