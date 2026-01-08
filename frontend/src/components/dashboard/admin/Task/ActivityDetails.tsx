import { At, Paperclip, PaperPlaneRight } from "@phosphor-icons/react"
import type { Task } from "../../../types/allType"

interface ActivityDetailsProps {
  editedTask: Partial<Task>
}


export const ActivityDetails = ({editedTask}:ActivityDetailsProps) => {
    return (
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
    )
}
