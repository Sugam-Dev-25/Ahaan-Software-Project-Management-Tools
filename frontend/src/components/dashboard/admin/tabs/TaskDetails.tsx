import { useState } from "react"
import type { Task, User } from "../../../types/allType"
import {
    Pencil, X, Check, Calendar, Clock, Tag, User as UserIcon, ListChecks, ChatCircleText, ChartBar, Paperclip, ClipboardText, List, UsersIcon, Flag, At, PaperPlaneRight, Folder,
    CaretRight,
    Plus,
    ArrowSquareOut,
    Star,
    CornersOut,
    DotsThree,
    Sparkle
} from "@phosphor-icons/react"
import UserSearchInput from "../../common/UserSearchInput"


interface TaskDetailsProps {
    task: Task,
    onClose: () => void,
    onSave: (upDatedTask: Partial<Task>) => void,
    status: string | null
}

export const TaskDetails = ({ task, onClose, onSave, status }: TaskDetailsProps) => {
    // track which field is currently being edited
    const [activeField, setActiveField] = useState<keyof Task | null>(null);
    const [editedTask, setEditedTask] = useState<Partial<Task>>({ ...task });
    const [isdropdown, setIsdropdown] = useState(false)

    const handleChange = (field: keyof Task, value: any) => {
        setEditedTask(prev => ({ ...prev, [field]: value }));
    }

    const handleFieldSave = () => {
        onSave(editedTask);
        setActiveField(null);
    }

    const handleFieldCancel = () => {
        setEditedTask({ ...task });
        setActiveField(null);
    }

    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
    };
    const priorityColors = {
        Low: "text-blue-500",
        Medium: "text-green-500",
        High: "text-yellow-500",
        Critical: "text-red-500",
    };

    // reusable row for the sidebar fields
    const EditableRow = ({ field, label, icon, children, editComponent }: any) => {
        const isEditingThis = activeField === field;
        return (
            <div className="group flex items-center py-2">
                <div className="w-8 flex-shrink-0  text-gray-600 pt-1">{icon}</div>
                <div className="flex justify-center items-center">
                    <p className="w-32 text-sm font-bold text-gray-600 tracking-wider">{label}</p>
                    <div className="mt-1">{isEditingThis ? editComponent : children}</div>
                </div>
                <div className="flex items-center ml-2">
                    {isEditingThis ? (
                        <div className="flex gap-1">
                            <button onClick={handleFieldSave} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={20} weight="bold" /></button>
                            <button onClick={handleFieldCancel} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={20} weight="bold" /></button>
                        </div>
                    ) : (
                        <button onClick={() => setActiveField(field)} className="p-1 text-gray-600 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all"><Pencil size={18} /></button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl shadow-2xl">

                {/* HEADER SECTION */}
                {/* HEADER SECTION */}
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
                    {/* Left Side: Breadcrumbs and Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Folder size={18} />
                            <span className="hover:underline cursor-pointer">Projects</span>
                            <span className="text-gray-300">/</span>
                            <ListChecks size={18} weight="bold" className="text-gray-700" />
                            <span className="font-semibold text-gray-800 uppercase tracking-tight">BOSS AUTOMOTIVE</span>
                        </div>

                        <div className="flex items-center gap-1 ml-2 border-l pl-3 border-gray-200">
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                <Plus size={20} />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-500">
                                <ArrowSquareOut size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Meta Info and Global Actions */}
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-400">
                            Created Apr 21
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-md text-gray-600 text-sm font-medium">
                                <Sparkle size={18} className="text-purple-500" weight="fill" />
                                Ask AI
                            </button>

                            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 rounded-md text-gray-600 text-sm font-medium">
                                <UsersIcon size={18} />
                                Share
                            </button>

                            <div className="flex items-center gap-0.5 ml-2 border-l pl-2 border-gray-200">
                                <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
                                    <DotsThree size={20} weight="bold" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
                                    <Star size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
                                    <ArrowSquareOut size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
                                    <CornersOut size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                                >
                                    <X size={20} weight="bold" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto grid md:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Main Content */}
                    <div className="md:col-span-2">
                        <div className="flex-grow">
                            {activeField === 'title' ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        className="text-2xl font-semibold border-b-2 border-blue-500 outline-none w-full"
                                        value={editedTask.title || ''}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={handleFieldSave} className="text-green-600"><Check size={24} /></button>
                                    <button onClick={handleFieldCancel} className="text-red-600"><X size={24} /></button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group">
                                    <h2 className="text-2xl font-semibold text-gray-800">{editedTask.title}</h2>
                                    <button onClick={() => setActiveField('title')} className="opacity-0 group-hover:opacity-100 text-gray-400"><Pencil size={18} /></button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center py-2 gap-3 font-bold text-gray-400">
                            <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex  items-center justify-center">
                                <div className="w-[10px] h-[10px] rounded-full border-2 border-gray-500" ></div>
                            </div>

                            <div className="w-32 text-sm text-gray-600">Status</div>
                            <span className="bg-[#2D9B71] text-white text-[11px] font-bold px-3 py-1 rounded  tracking-wider">
                                {status || 'OPEN'}
                            </span>
                        </div>

                        <EditableRow field="assignedTo" label="Assignes" icon={<UserIcon size={20} />} editComponent={<UserSearchInput onUserSelect={(selectedUser) => {
                            const currentAssigned = Array.isArray(editedTask.assignedTo) ? editedTask.assignedTo : []
                            if (!currentAssigned.some(u => u._id === selectedUser._id)) {
                                handleChange('assignedTo', [...currentAssigned, selectedUser])

                            }

                        }} excludeUserIds={Array.isArray(editedTask.assignedTo) ? editedTask.assignedTo.map(u => u._id) : []} />}>
                            <div className="flex -space-x-2">
                                {Array.isArray(editedTask.assignedTo) && editedTask.assignedTo.map((u: any) => (
                                    <div key={u._id} title={u.name} className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold cursor-pointer">
                                        {u.name?.trim()[0]?.toUpperCase()}
                                    </div>
                                ))}
                                {(!editedTask.assignedTo || editedTask.assignedTo.length === 0) && <span className="text-gray-400 italic">None</span>}
                            </div>

                        </EditableRow>
                        <EditableRow field="dates" label="Dates" icon={<Calendar size={20} />}
                            editComponent={
                                <div className="flex gap-2">
                                    <input type="date" className="text-xs border p-1 rounded" onChange={(e) => handleChange('startDate', e.target.value)} />
                                    <input type="date" className="text-xs border p-1 rounded" onChange={(e) => handleChange('dueDate', e.target.value)} />
                                </div>
                            }
                        >
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>{formatDate(editedTask.startDate)}</span>
                                <span className="text-gray-400">→</span>
                                <span className="text-green-700 font-medium">{formatDate(editedTask.dueDate)}</span>
                            </div>
                        </EditableRow>
                        <EditableRow field="priority" label="Priority" icon={<Flag size={20} />}
                            editComponent={
                                <div className="relative w-32">
                                    <div className="flex items-center gap-2 border p-1 rounded cursor-pointer" onClick={() => setIsdropdown(!isdropdown)}>
                                        <Flag
                                            size={14}
                                            weight="fill"
                                            className={priorityColors[editedTask.priority]}
                                        />{editedTask.priority}
                                    </div>
                                    {isdropdown && (
                                        <div className="absolute mt-1 w-full border rounded bg-white shadow">
                                            {["Low", "Medium", "High", "Critical"].map(priority => (
                                                <div
                                                    key={priority}
                                                    className="flex items-center gap-1 p-1 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => {
                                                        handleChange("priority", priority);
                                                        setIsdropdown(false)
                                                    }
                                                    }
                                                >
                                                    <Flag weight="fill" size={14} className={priorityColors[priority]} />
                                                    <span>{priority}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>


                            }
                        >
                            <div className="flex items-center gap-1.5">
                                <Flag weight="fill" size={14} className={priorityColors[editedTask.priority]} />

                                <span className="font-sm text-sm">{editedTask.priority}</span>
                            </div>
                        </EditableRow>

                        {/* DESCRIPTION */}
                        <section>
                            <div className="flex justify-between items-center mb-2 border-b pb-1">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><ListChecks size={20} /> Description</h3>
                                {activeField !== 'description' && (
                                    <button onClick={() => setActiveField('description')} className="text-gray-400 hover:text-blue-600"><Pencil size={18} /></button>
                                )}
                            </div>
                            {activeField === 'description' ? (
                                <div className="space-y-2">
                                    <textarea
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={4}
                                        value={editedTask.description} onChange={(e) => handleChange('description', e.target.value)}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleFieldCancel} className="px-3 py-1 text-sm border rounded">Cancel</button>
                                        <button onClick={handleFieldSave} className="px-3 py-1 text-sm bg-gray-800 text-white rounded">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg min-h-[100px]">{editedTask.description || "No description."}</p>
                            )}
                        </section>

                        {/* SUBTASKS */}
                        <section>
                            <div className="flex justify-between items-center mb-2 border-b pb-1">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><List size={20} /> Subtasks</h3>
                                {activeField !== 'subtasks' && (
                                    <button onClick={() => setActiveField('subtasks')} className="text-gray-400 hover:text-blue-600"><Pencil size={18} /></button>
                                )}
                            </div>
                            {activeField === 'subtasks' ? (
                                <div className="space-y-2">
                                    <input
                                        type="text" className="w-full border p-2 rounded" placeholder="Comma separated subtasks..."
                                        value={Array.isArray(editedTask.subtasks) ? editedTask.subtasks.map((s: any) => s.title).join(', ') : ''}
                                        onChange={(e) => handleChange('subtasks', e.target.value.split(',').map(t => ({ title: t.trim(), isCompleted: false })))}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button onClick={handleFieldCancel} className="text-xs border px-2 py-1 rounded">Cancel</button>
                                        <button onClick={handleFieldSave} className="text-xs bg-gray-800 text-white px-2 py-1 rounded">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-2">
                                    {Array.isArray(editedTask.subtasks) && editedTask.subtasks.map((sub: any, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                                            <ClipboardText size={16} /> {sub.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <div className="py-3 flex items-start">
                            <div className="w-8 text-gray-400"><Paperclip size={20} /></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Attachments</p>
                                <p className="text-sm text-gray-700 mt-1">{editedTask.attachment?.length || 0} Files</p>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar Details */}
                    <div className="bg-white border-l border-gray-200 shadow-sm space-y-1 h-full">
                        <h3 className="font-medium text-gray-400 mb-4  p-3 border-b border-gray-200">Activity</h3>

                        <div className="flex flex-col  bg-white overflow-hidden max-w-2xl">
                            {/* 1. Activity & Comments Feed Area */}
                            <div className="p-4 h-64 overflow-y-auto space-y-4 bg-white">
                                {/* Activity Logs (e.g., Priority changes) */}
                                {editedTask.activityLog?.map((a, i) => (
                                    <div key={i} className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="text-gray-400">•</span>
                                        <span>{a.action}</span>
                                        <span className="ml-auto text-gray-400">20 mins</span>
                                    </div>
                                ))}

                                {/* User Comments */}
                                {editedTask.comments?.map((c, i) => (
                                    <div key={i} className="flex flex-col text-sm border-l-2 border-gray-100 pl-3 py-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-gray-700">{c.user[0]?.name}</span>
                                            <span className="text-[10px] text-gray-400">Apr 21, 4:12 pm</span>
                                        </div>
                                        <p className="text-gray-600">{c.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* 2. Custom Input Area */}
                            <div className="border-t border-gray-200 p-3 bg-white">
                                <div className="border border-gray-200 rounded-md ">
                                    <textarea
                                        className="w-full p-3 text-sm outline-none resize-none"
                                        placeholder="Write a comment..."
                                        rows={2}
                                    />

                                    <div className="flex items-center justify-between p-2 border-t border-gray-200 bg-gray-50/50">
                                        <div className="flex items-center gap-1">
                                            {/* Action Buttons */}
                                            <button className="p-2 hover:bg-gray-200 rounded text-gray-500 transition-colors">
                                                <Paperclip size={18} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-200 rounded text-gray-500 transition-colors">
                                                <At size={18} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button className="text-gray-300 hover:text-blue-500 transition-colors">
                                                <PaperPlaneRight size={20} weight="fill" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div >
    )
}