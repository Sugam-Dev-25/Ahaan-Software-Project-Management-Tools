import { useUsers } from "../hooks/useUsers";
import { useOnlineUsers } from "../hooks/useOnlineUsers";
import { getAvatarColor } from "../utils/avatarColor";
import { STATUS_META } from "../utils/userStatus";

import type { User } from "../types/allType";

/* ROLE STYLE */
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

/* DATE FORMAT */
const formatDateTime = (date?: string) => {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleString();
};

const Teams = () => {
  const { data, isLoading, error } = useUsers();
  const onlineUsers = useOnlineUsers();

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading team members…</div>;
  }

  if (error instanceof Error) {
    return <div className="p-6 text-red-500">{error.message}</div>;
  }

  if (!data?.users?.length) {
    return <div className="p-6 text-gray-400">No team members found</div>;
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <span className="text-gray-500">Total: {data.total}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-4 text-left">Member</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-center">Role</th>
              <th className="px-6 py-4 text-center"> Phone</th>
              <th className="px-6 py-4 text-center">Created</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.users.map((user: User, index: number) => {
              const isOnline = onlineUsers.includes(user._id);

              /* SAFE STATUS ACCESS */
              const statusMeta = user.status && STATUS_META[user.status];

              return (
                <tr
                  key={user._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  {/* MEMBER */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{
                          backgroundColor: getAvatarColor(user.name),
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{user.name}</span>

                          {/* ONLINE DOT */}
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

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>

                  {/* ROLE */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full capitalize text-xs ${getRoleStyle(
                        user.role,
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-4 text-center text-gray-600">
                    {user.phone || "—"}
                  </td>

                  {/* CREATED */}
                  <td className="px-6 py-4 text-center text-gray-500">
                    {formatDateTime(user.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {statusMeta ? (
                      <span className="flex items-center justify-center">
                        {(() => {
                          const Icon = statusMeta.icon;
                          return (
                            <svg width="24" height="24">
                              <defs>
                                <linearGradient
                                  id="rainbow"
                                  x1="0%"
                                  y1="12%"
                                  x2="100%"
                                  y2="36%"
                                >
                                  <stop offset="50%" stopColor="#e69200" />
                                  <stop offset="100%" stopColor="#f9d056" />
                                </linearGradient>
                              </defs>

                              <foreignObject width="24" height="24">
                                <Icon
                                  size={24}
                                  weight="fill"
                                  style={{ fill: "url(#rainbow)" }}
                                />
                              </foreignObject>
                            </svg>
                          );
                        })()}
                      </span>
                    ) : (
                      <b className="text-xs text-green-700 ">---</b>
                    )}
                  </td>
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
