module.exports = function socketHandler(io) {
  const onlineUsers = new Map(); // userId -> socketId

  // 🟢 NEW: user status store (userId -> status)
  const userStatusMap = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    /* ================= USER SETUP ================= */
    socket.on("setup", (userId) => {
      socket.userId = userId;
      onlineUsers.set(userId, socket.id);

      // online users update
      io.emit("online-users", Array.from(onlineUsers.keys()));

      // 🟢 SEND ALL CURRENT STATUSES TO THIS USER
      socket.emit(
        "all-status",
        Array.from(userStatusMap.entries()).map(
          ([uid, status]) => ({ userId: uid, status })
        )
      );
    });

    /* ================= USER STATUS ================= */

    // SET / UPDATE STATUS
    socket.on("set-status", ({ userId, status }) => {
      console.log("📌 Status update:", userId, status);

      if (status) {
        userStatusMap.set(userId, status);
      } else {
        userStatusMap.delete(userId);
      }

      // 🔥 broadcast to everyone
      io.emit("status-updated", {
        userId,
        status,
      });
    });

    /* ================= AUDIO CALL ================= */

    // CALLER → CALLEE
    socket.on("call-user", ({ to, offer }) => {
      const targetSocket = onlineUsers.get(to);
      if (!targetSocket) return;

      io.to(targetSocket).emit("incoming-call", {
        fromUserId: socket.userId,
        fromSocketId: socket.id,
        offer,
      });
    });

    // CALLEE → CALLER
    socket.on("answer-call", ({ toSocketId, answer }) => {
      io.to(toSocketId).emit("call-accepted", { answer });
    });

    // ICE
    socket.on("ice-candidate", ({ toSocketId, candidate }) => {
      io.to(toSocketId).emit("ice-candidate", candidate);
    });

    // END
    socket.on("end-call", ({ toUserId }) => {
      const targetSocket = onlineUsers.get(toUserId);
      if (targetSocket) {
        io.to(targetSocket).emit("call-ended");
      }
    });

    /* ================= DISCONNECT ================= */
    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        // online users update
        io.emit("online-users", Array.from(onlineUsers.keys()));

        // (optional) status clear on disconnect
        // userStatusMap.delete(socket.userId);
        // io.emit("status-updated", { userId: socket.userId, status: null });
      }

      console.log("🔴 Disconnected:", socket.id);
    });
  });
};
