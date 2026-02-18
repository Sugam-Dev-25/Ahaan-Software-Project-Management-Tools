
import { useUsers } from "../hooks/useUsers";
import { useOnlineUsers } from "../hooks/useOnlineUsers";
import { useAccessChatMutation } from "../redux/features/chat/chatApi";
// import { openChat, setConversation } from "../redux/features/chat/chatSlice";
import { useAppDispatch } from "../redux/app/hook";
import { useEffect } from "react";

/* ================= AVATAR COLOR HELPER ================= */
const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

/* ================= ROLE COLOR HELPER ================= */
const getRoleStyle = (role: string) => {
  switch (role.toLowerCase()) {
    case "super-admin":
      return "bg-violet-100 text-violet-700";
    case "admin":
      return "bg-blue-100 text-blue-700";
    case "developer":
      return "bg-green-100 text-green-700";
    case "designer":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-cyan-100 text-cyan-700";
  }
};

const Teams = () => {
  const { data, isLoading, error } = useUsers();
  const onlineUsers = useOnlineUsers();

  /* ================= DEBUG LOGS ================= */
  useEffect(() => {
    // console.log("🟡 isLoading:", isLoading);
    // console.log("🟢 error:", error);
    // console.log("🔵 RAW data from useUsers:", data);

    // if (data) {
    //   console.log("📦 data.users:", data.users);
    //   console.log("📊 data.total:", data.total);
    // }

    // console.log("🟣 onlineUsers:", onlineUsers);
  }, [data, isLoading, error, onlineUsers]);

  // const handleOpenChat = async (user: any) => {
  //   console.log("💬 Open chat with:", user);

  //   dispatch(openChat(user));
  //   dispatch(setConversation(null));

  //   try {
  //     const conversation = await accessChat({
  //       userId: user._id,
  //     }).unwrap();

  //     console.log("✅ conversation response:", conversation);

  //     dispatch(setConversation(conversation._id));
  //   } catch (err) {
  //     console.error("❌ accessChat error:", err);
  //   }
  // };

  if (isLoading) {
    // console.log("⏳ Loading state active");
    return <div className="p-6 text-gray-500">Loading team members…</div>;
  }

  if (error instanceof Error) {
    console.error("❌ Error object:", error);
    return <div className="p-6 text-red-500">{error.message}</div>;
  }

  if (!data || !data.users || data.users.length === 0) {
    console.warn("⚠️ No users found");
    return (
      <div className="p-6 text-gray-400">
        No team members found
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Team Members
        </h1>
        <span className="text-md text-gray-500">
          Total: {data.total}
        </span>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-black text-white uppercase">
            <tr>
              <th className="px-6 py-4 text-left font-medium">Member</th>
              <th className="px-6 py-4 text-left font-medium">Email</th>
              <th className="px-6 py-4 text-center font-medium">Role</th>
              <th className="px-6 py-4 text-left font-medium">Phone</th>
              {/* <th className="px-6 py-4 text-left font-medium">Chat</th> */}
            </tr>
          </thead>

          <tbody>
            {data.users.map((user, index) => {
              const isOnline = onlineUsers.includes(user._id);

              // console.log("👤 Rendering user:", user._id, user.name);

              return (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-100"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center
                                   text-white font-semibold text-sm"
                        style={{ backgroundColor: getAvatarColor(user.name) }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {user.name}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                        </div>

                        <span className="text-xs text-gray-400">
                          ID: {user._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.phone || "—"}
                  </td>

                  {/* <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleOpenChat(user)}
                      className="w-9 h-9 rounded-full bg-black text-white
                                 hover:text-gray-400 flex items-center
                                 justify-center transition"
                    >
                      <ChatCenteredDots size={18} />
                    </button>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teams;
