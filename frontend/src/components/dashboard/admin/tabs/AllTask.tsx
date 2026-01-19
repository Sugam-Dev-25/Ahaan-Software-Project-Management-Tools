import React, { useEffect } from 'react';
import { fetchAllTasks } from '../../../redux/features/Task/taskSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook';
// Phosphor Icons
import { 
    Clock, 
    WarningCircle, 
    Users, 
    ChartBar, 
    CalendarBlank, 
    Tray,
    CheckCircle 
} from '@phosphor-icons/react';

export const AllTask = () => {
    const dispatch = useAppDispatch();
    
    const { task: tasks, loading, error } = useAppSelector((state) => state.task);

    useEffect(() => {
        dispatch(fetchAllTasks());
    }, [dispatch]);

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="animate-spin text-indigo-600">
                    <Clock size={32} weight="bold" />
                </div>
                <span className="text-gray-500 font-medium">Syncing Global Tasks...</span>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Tray size={28} weight="duotone" className="text-indigo-600" />
                        Global Task Overview
                    </h1>
                    <p className="text-gray-500 text-sm">Monitoring workload across all organizational boards.</p>
                </div>
                
                <div className="flex gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <ChartBar size={24} weight="fill" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Volume</p>
                            <p className="text-xl font-black text-gray-800 leading-none">{tasks.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Identify</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Context</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Team</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Urgency</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Completion</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks.map((t: any) => (
                                <tr key={t._id} className="hover:bg-indigo-50/20 transition-all duration-200 group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                {t.title}
                                            </span>
                                            <span className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                                                {t.description || 'No context provided'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase">
                                                {(t.board as any)?.name || 'Internal'}
                                            </span>
                                            <span className="text-xs font-semibold text-indigo-500">
                                                {typeof t.column === 'object' ? (t.column as any).name : 'Unassigned'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {t.assignedTo && t.assignedTo.length > 0 ? (
                                                t.assignedTo.map((user: any) => (
                                                    <div 
                                                        key={user._id} 
                                                        className="h-8 w-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm"
                                                        title={user.name}
                                                    >
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                ))
                                            ) : (
                                                <Users size={20} weight="light" className="text-gray-300" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${getPriorityStyle(t.priority)}`}>
                                            {t.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-[80px]">
                                                <div 
                                                    className={`h-1.5 rounded-full transition-all duration-700 ease-out ${t.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${t.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500">{t.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <CalendarBlank size={16} weight="regular" />
                                            <span className="text-xs font-medium">
                                                {t.dueDate ? new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Flexible'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {tasks.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
                            <WarningCircle className="text-gray-300" size={48} weight="thin" />
                        </div>
                        <p className="text-gray-400 font-medium">The workspace is currently clear.</p>
                    </div>
                )}
            </div>
        </div>
    );
};