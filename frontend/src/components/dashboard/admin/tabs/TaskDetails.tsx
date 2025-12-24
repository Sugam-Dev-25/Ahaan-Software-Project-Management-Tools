import { useState } from "react"
import type { Task, User } from "../../../types/allType"
import { Pencil, X, Check, Calendar, Clock, Tag, User as UserIcon, ListChecks, ChatCircleText, ChartBar, Paperclip, ClipboardText, List } from "@phosphor-icons/react"


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

    // reusable row for the sidebar fields
    const EditableRow = ({ field, label, icon, children, editComponent }: any) => {
        const isEditingThis = activeField === field;
        return (
            <div className="group flex items-start py-3 border-b border-gray-100 last:border-b-0">
                <div className="w-8 flex-shrink-0 text-gray-400 pt-1">{icon}</div>
                <div className="flex-grow">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                    <div className="mt-1">{isEditingThis ? editComponent : children}</div>
                </div>
                <div className="flex items-center ml-2">
                    {isEditingThis ? (
                        <div className="flex gap-1">
                            <button onClick={handleFieldSave} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check size={20} weight="bold" /></button>
                            <button onClick={handleFieldCancel} className="p-1 text-red-600 hover:bg-red-50 rounded"><X size={20} weight="bold" /></button>
                        </div>
                    ) : (
                        <button onClick={() => setActiveField(field)} className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-all"><Pencil size={18} /></button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl shadow-2xl">
                
                {/* HEADER SECTION */}
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex-grow">
                        {activeField === 'title' ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    className="text-2xl font-semibold border-b-2 border-blue-500 outline-none w-full"
                                    value={editedTask.title || ''}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    autoFocus
                                />
                                <button onClick={handleFieldSave} className="text-green-600"><Check size={24}/></button>
                                <button onClick={handleFieldCancel} className="text-red-600"><X size={24}/></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 group">
                                <h2 className="text-2xl font-semibold text-gray-800">{editedTask.title}</h2>
                                <button onClick={() => setActiveField('title')} className="opacity-0 group-hover:opacity-100 text-gray-400"><Pencil size={18}/></button>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                </div>

                <div className="overflow-y-auto p-6 grid md:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <div><p className="text-sm font-medium text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full">Status: {status}</p></div>

                        {/* DESCRIPTION */}
                        <section>
                            <div className="flex justify-between items-center mb-2 border-b pb-1">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><ListChecks size={20}/> Description</h3>
                                {activeField !== 'description' && (
                                    <button onClick={() => setActiveField('description')} className="text-gray-400 hover:text-blue-600"><Pencil size={18}/></button>
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
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><List size={20}/> Subtasks</h3>
                                {activeField !== 'subtasks' && (
                                    <button onClick={() => setActiveField('subtasks')} className="text-gray-400 hover:text-blue-600"><Pencil size={18}/></button>
                                )}
                            </div>
                            {activeField === 'subtasks' ? (
                                <div className="space-y-2">
                                    <input 
                                        type="text" className="w-full border p-2 rounded" placeholder="Comma separated subtasks..."
                                        value={Array.isArray(editedTask.subtasks) ? editedTask.subtasks.map((s:any) => s.title).join(', ') : ''}
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
                                            <ClipboardText size={16}/> {sub.title}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* COMMENTS & ACTIVITY (VIEW ONLY) */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <section>
                                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><ChatCircleText size={20}/> Comments</h3>
                                <div className="bg-gray-50 p-3 rounded-lg h-40 overflow-y-auto text-sm border">
                                    {editedTask.comments?.map((c: any, i) => <p key={i} className="mb-2 border-b pb-1"><strong>{c.user[0]?.name}:</strong> {c.text}</p>)}
                                </div>
                            </section>
                            <section>
                                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><ChartBar size={20}/> Activity</h3>
                                <div className="bg-gray-50 p-3 rounded-lg h-40 overflow-y-auto text-xs border">
                                    {editedTask.activityLog?.map((a: any, i) => <p key={i} className="text-gray-500 mb-1">• {a.action}</p>)}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar Details */}
                    <div className="bg-white border rounded-xl p-4 shadow-sm space-y-1 h-fit">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Details</h3>

                        <EditableRow field="priority" label="Priority" icon={<ChartBar size={20} />}
                            editComponent={
                                <select className="w-full border rounded p-1" value={editedTask.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                                    <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical</option>
                                </select>
                            }
                        >
                            <span className="text-gray-700 font-medium">{editedTask.priority}</span>
                        </EditableRow>

                        <EditableRow field="startDate" label="Start Date" icon={<Clock size={20} />}
                            editComponent={<input type="date" className="w-full border rounded p-1" value={formatDate(editedTask.startDate)} onChange={(e) => handleChange('startDate', e.target.value)}/>}
                        >
                            <span className="text-gray-700">{editedTask.startDate ? formatDate(editedTask.startDate) : 'Not set'}</span>
                        </EditableRow>

                        <EditableRow field="dueDate" label="Due Date" icon={<Calendar size={20} />}
                            editComponent={<input type="date" className="w-full border rounded p-1" value={formatDate(editedTask.dueDate)} onChange={(e) => handleChange('dueDate', e.target.value)}/>}
                        >
                            <span className="text-gray-700">{editedTask.dueDate ? formatDate(editedTask.dueDate) : 'Not set'}</span>
                        </EditableRow>

                        <EditableRow field="assignedTo" label="Assigned To" icon={<UserIcon size={20} />}
                            editComponent={<input type="text" className="w-full border rounded p-1" value={Array.isArray(editedTask.assignedTo) ? editedTask.assignedTo.map((u:any)=>u.name).join(', ') : ''} onChange={(e) => handleChange('assignedTo', e.target.value)}/>}
                        >
                            <span className="text-gray-700">{Array.isArray(editedTask.assignedTo) ? editedTask.assignedTo.map((u:any)=>u.name).join(', ') : 'Unassigned'}</span>
                        </EditableRow>

                        <div className="py-3 flex items-start">
                            <div className="w-8 text-gray-400"><Paperclip size={20}/></div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Attachments</p>
                                <p className="text-sm text-gray-700 mt-1">{editedTask.attachment?.length || 0} Files</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}