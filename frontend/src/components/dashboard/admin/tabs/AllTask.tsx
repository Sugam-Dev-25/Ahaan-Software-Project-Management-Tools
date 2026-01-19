import React, { useEffect } from 'react';
import { fetchAllTasks } from '../../../redux/features/Task/taskSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/app/hook';
import {
    Clock,
    WarningCircle,
    Users,
    ChartBar,
    CalendarBlank,
    Tray,
    Hourglass,
    SealCheck
} from '@phosphor-icons/react';

export const AllTask = () => {
    const dispatch = useAppDispatch();
    const { task: tasks, loading } = useAppSelector((state) => state.task);

    useEffect(() => {
        dispatch(fetchAllTasks());
    }, [dispatch]);

    const msToHours = (ms: number = 0) => (ms / 3600000).toFixed(1);

    const calculateProgress = (timeManagement: any) => {
        const goalMs = (timeManagement?.estimatedTime || 0) * 3600000;
        const loggedMs = timeManagement?.totalLoggedTime || 0;
        const percent = goalMs > 0 ? Math.min((loggedMs / goalMs) * 100, 100) : 0;
        const isOvertime = loggedMs > goalMs && goalMs > 0;
        const overtimeMs = isOvertime ? loggedMs - goalMs : 0;

        return { percent, isOvertime, overtimeHours: msToHours(overtimeMs) };
    };

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
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <Tray size={28} weight="duotone" className="text-indigo-600" />
                        Global Task Overview
                    </h1>
                    <p className="text-gray-500 text-sm">Real-time resource and time tracking across all boards.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
                    <ChartBar size={20} weight="fill" className="text-indigo-500" />
                    <span className="text-sm font-bold text-gray-700">{tasks?.length || 0} Active Tasks</span>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Identify</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Team</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Urgency</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Time Progress</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tasks.map((t: any) => {
                                // These variables are now used in the UI below
                                const { percent, isOvertime, overtimeHours } = calculateProgress(t.timeManagement);

                                return (
                                    <tr key={t._id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-800">{t.title}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] font-black text-indigo-500 uppercase">{t.board?.name || "No Board"}</span>
                                                    <span className="text-gray-300 text-[10px]">•</span>
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 py-0.5 bg-slate-100 rounded">{t.column?.name || "No Status"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {t.assignedTo?.length > 0 ? (
                                                    t.assignedTo.map((user: any) => (
                                                        <div key={user._id} title={user.name} className="h-7 w-7 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-white font-bold text-[9px]">
                                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                    ))
                                                ) : <Users size={18} className="text-gray-300" />}
                                            </div>
                                        </td>
                                        
                                        {/* URGENCY CELL */}
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black border uppercase ${getPriorityStyle(t.priority)}`}>
                                                {t.priority}
                                            </span>
                                        </td>

                                        {/* TIME PROGRESS CELL (Uses percent, isOvertime, and overtimeHours) */}
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                                                        <Hourglass size={12} /> {msToHours(t.timeManagement?.totalLoggedTime)}h / {t.timeManagement?.estimatedTime || 0}h
                                                    </span>
                                                    {isOvertime ? (
                                                        <span className="text-[9px] font-black text-rose-500 flex items-center gap-1 uppercase">
                                                            <WarningCircle weight="fill" size={12} className="animate-pulse" />
                                                            +{overtimeHours}h Over
                                                        </span>
                                                    ) : percent === 100 ? (
                                                        <SealCheck weight="fill" size={14} className="text-emerald-500" />
                                                    ) : null}
                                                </div>
                                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden relative">
                                                    <div
                                                        className={`h-full transition-all duration-1000 ${isOvertime ? 'bg-rose-500' : 'bg-indigo-500'}`}
                                                        style={{ width: `${percent}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <CalendarBlank size={14} />
                                                <span className="text-xs font-medium">
                                                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'No Date'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};