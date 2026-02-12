import { useContext, useEffect, useRef, useState } from "react";
import type { Task, Column } from "../../types/allType";
import TaskView from "../../redux/features/Task/taskView";
import { ArrowRight, CalendarBlank, ChatCircle, Check, Clock, Flag, Paperclip, Play, Plus, X } from "@phosphor-icons/react";
import { TaskDetails } from "./TaskDetails";
import { useAppSelector } from "../../redux/app/hook";
import { BoardContext } from "../../context/BoardContext";

const BOARD_COLORS = [
  { header: "bg-blue-600", bg: "bg-blue-50" },
  { header: "bg-green-600", bg: "bg-green-50" },
  { header: "bg-yellow-500", bg: "bg-yellow-50" },
  { header: "bg-purple-600", bg: "bg-purple-50" },
  { header: "bg-pink-600", bg: "bg-pink-50" },
  { header: "bg-indigo-600", bg: "bg-indigo-50" },
];

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return { backgroundColor: `hsl(${hue}, 70%, 55%)` };
};

export const DashBoardBody = () => {
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openMenuColumn, setOpenMenuColumn] = useState<string | null>(null);
  const [popupColumnId, setPopupColumnId] = useState<string | null>(null);
  
  const columnMenuRef = useRef<HTMLDivElement | null>(null);
  const columnInputRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const columns = useAppSelector(state => state.column.columns);
  const boardDetails = useContext(BoardContext);

  // Handle outside clicks for menus and inputs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!columnInputRef.current?.contains(e.target as Node) && 
          !columnMenuRef.current?.contains(e.target as Node)) {
        setShowColumnInput(false);
        setOpenMenuColumn(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Horizontal Scroll with Mouse Wheel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  if (!boardDetails || !boardDetails.board) return null;
  const { board, addColumn, deleteColumn, moveTask, task } = boardDetails;
  const currentColumns: Column[] = columns[board._id] || [];

  const taskStatus = (t: Task) => {
    const colId = typeof t.column === 'object' ? t.column?._id : t.column;
    return currentColumns.find(c => c._id === colId)?.name || null;
  };

  return (
    <div className="relative h-full">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mt-2 items-start">
        {currentColumns.map((c, colIndex) => {
          const color = BOARD_COLORS[colIndex % BOARD_COLORS.length];
          
          // Robust filtering logic from your "working" file
          const tasksInColumn = task
            .filter((t) => {
              const taskColumnId = typeof t.column === 'object' ? t.column?._id : t.column;
              return taskColumnId?.toString() === c._id?.toString();
            })
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

          return (
            <div
              key={c._id}
              className={`min-w-[320px] max-w-[320px] rounded-xl p-3 ${color.bg} transition-all`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const data = JSON.parse(e.dataTransfer.getData("application/json"));
                moveTask(data.taskId, c._id, tasksInColumn.length);
              }}
            >
              {/* COLUMN HEADER */}
              <div className="flex justify-between items-center mb-3">
                <div className={`flex items-center gap-2 px-2 py-1 rounded text-white text-[10px] font-bold uppercase ${color.header}`}>
                  <span className="w-2 h-2 border-2 border-white rounded-full" />
                  {c.name}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full shadow-sm">
                    {tasksInColumn.length}
                  </span>
                  <div className="relative">
                    <button 
                      className="text-gray-400 hover:text-gray-600 cursor-pointer font-bold px-1"
                      onClick={() => setOpenMenuColumn(openMenuColumn === c._id ? null : c._id)}
                    >
                      ···
                    </button>
                    {openMenuColumn === c._id && (
                      <div ref={columnMenuRef} className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden">
                        <button
                          className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => {
                            deleteColumn(c._id);
                            setOpenMenuColumn(null);
                          }}>
                          Delete Column
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* TASK CARDS */}
              <div className="space-y-3 min-h-[50px]">
                {tasksInColumn.map((t, index) => (
                  <div
                    key={t._id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("application/json", JSON.stringify({
                        taskId: t._id,
                        fromColumnId: c._id,
                        fromIndex: index,
                      }))
                    }
                    onClick={() => setSelectedTask(t)}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 transition-all cursor-pointer group"
                  >
                    <p className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </p>

                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      {t.assignedTo?.length > 0 && (
                        <div className="flex -space-x-2">
                          {t.assignedTo.slice(0, 3).map((u) => (
                            <div
                              key={u._id}
                              title={u.name}
                              style={getAvatarColor(u.name)}
                              className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white"
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 ml-auto">
                        <CalendarBlank size={12} />
                        {new Date(t.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${
                        t.priority === "High" ? "text-red-500" : t.priority === "Medium" ? "text-yellow-500" : "text-green-500"
                      }`}>
                        <Flag size={12} weight="fill" />
                        {t.priority}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-400 font-medium">
                       <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1"><ChatCircle size={14} /> {t.comments?.length || 0}</div>
                          <div className="flex items-center gap-1"><Paperclip size={14} /> {t.attachments?.length || 0}</div>
                       </div>
                       <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                          <Clock size={12} /> {t.timeManagement?.totalLoggedTime || 0}h
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPopupColumnId(c._id)}
                className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg border-2 border-dashed border-gray-200 transition-all"
              >
                <Plus size={14} weight="bold" /> Create task
              </button>
            </div>
          );
        })}

        {/* ADD COLUMN SECTION */}
        <div className="min-w-[280px]">
          {!showColumnInput ? (
            <button
              onClick={() => setShowColumnInput(true)}
              className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <Plus size={24} weight="bold" />
            </button>
          ) : (
            <div ref={columnInputRef} className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Column</p>
              <select
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Status</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Delay">Delay</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (columnName) {
                      addColumn(columnName);
                      setColumnName("");
                      setShowColumnInput(false);
                    }
                  }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-600"
                >
                  Add
                </button>
                <button onClick={() => setShowColumnInput(false)} className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: CREATE TASK */}
      {popupColumnId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setPopupColumnId(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b">
               <h3 className="font-bold text-gray-700">Create New Task</h3>
               <button onClick={() => setPopupColumnId(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} weight="bold" />
               </button>
            </div>
            <div className="p-6">
               <TaskView boardId={board._id} columnId={popupColumnId} />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TASK DETAILS */}
      {selectedTask && (
        <TaskDetails
          status={taskStatus(selectedTask)}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};