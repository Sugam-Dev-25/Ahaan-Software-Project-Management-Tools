import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/app/hook";
import { 
  fetchNotifications, 
  markAllNotificationsAsRead, 
  markAsRead 
} from "../redux/features/notifications/notificationSlice";
import {
  MagnifyingGlass,
  Bell,
  Chats,
  Gear,
  UserCircle,
} from "@phosphor-icons/react";

export const Topbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.login.user);
  const { notifications, unreadCount } = useAppSelector((state) => state.notification);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    
    if (isToday) return `Today at ${date.toLocaleTimeString([], timeOptions)}`;
    if (isYesterday) return `Yesterday at ${date.toLocaleTimeString([], timeOptions)}`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...timeOptions });
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-3 w-[420px] max-w-full">
        <MagnifyingGlass size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search boards, tasks, docs..."
          className="w-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-gray-500 hover:text-black transition">
          <Chats size={20} />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative text-gray-500 hover:text-black transition p-1"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-150">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-sm text-gray-800">Notifications</h3>
                <button 
                  className="text-[11px] text-blue-600 font-semibold hover:text-blue-800 transition"
                  onClick={() => dispatch(markAllNotificationsAsRead())}
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-[380px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => handleNotificationClick(n._id, n.isRead)}
                      className={`p-4 border-b border-gray-50 cursor-pointer transition flex gap-3 items-start ${
                        !n.isRead ? "bg-blue-50/30 hover:bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Avatar Circle: Always shows actual name first letter */}
                      <div className="h-9 w-9 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-200">
                        {n.sender?.name?.charAt(0) || "U"}
                      </div>

                      <div className="flex flex-col gap-0.5 flex-1">
                        <p className="text-xs text-gray-800 leading-normal">
                          <span className="font-bold text-black">
                            {/* Logic: Show "You" if it's the logged-in user, else the Name */}
                            {n.sender?._id === user?._id ? "You" : n.sender?.name}
                          </span> {n.action}
                        </p>
                        {n.task && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <div className="w-1 h-1 rounded-full bg-gray-300" />
                             <p className="text-[11px] text-gray-500 font-medium truncate max-w-[180px]">
                               {n.task.title}
                             </p>
                          </div>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {formatNotificationDate(n.createdAt)}
                        </p>
                      </div>

                      {!n.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 px-4 text-center">
                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">All caught up!</p>
                  </div>
                )}
              </div>
              
              <button className="w-full p-3 text-center border-t border-gray-50 text-xs text-gray-500 hover:text-indigo-600 hover:bg-gray-50 font-semibold transition">
                View All Activity
              </button>
            </div>
          )}
        </div>

        <button className="text-gray-500 hover:text-black transition">
          <Gear size={20} />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer group">
          <UserCircle size={28} className="text-gray-400 group-hover:text-black transition" />
          <div className="text-sm leading-tight hidden sm:block">
            <p className="font-bold text-black group-hover:text-indigo-600 transition">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-gray-500 font-medium capitalize">
              {user?.role || "member"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};