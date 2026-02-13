import {
  X,
  Phone,
  PhoneDisconnect,
  MicrophoneSlash,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import { useAppDispatch, useAppSelector } from "../redux/app/hook";
import { closeChat } from "../redux/features/chat/chatSlice";
import { useOnlineUsers } from "../hooks/useOnlineUsers";
import { socket } from "../services/socket";

const getAvatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360},70%,55%)`;
};

const ChatDrawer = () => {
  const dispatch = useAppDispatch();
  const { isOpen, selectedUser } = useAppSelector((s) => s.chat);
  const onlineUsers = useOnlineUsers();

  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [incoming, setIncoming] = useState<any>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ringRef = useRef<HTMLAudioElement | null>(null);

  const isOnline =
    !!selectedUser && onlineUsers.includes(selectedUser._id);

  /* ============ PEER ============ */
  const createPeer = (toSocketId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          toSocketId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      const audio = document.createElement("audio");
      audio.srcObject = e.streams[0];
      audio.autoplay = true;
    };

    pcRef.current = pc;
    return pc;
  };

  /* ============ SOCKET EVENTS ============ */
  useEffect(() => {
    ringRef.current = new Audio("./ringtone.mp3");
    ringRef.current.loop = true;

    socket.on("incoming-call", ({ fromSocketId, offer }) => {
      setIncoming({ fromSocketId, offer });
      ringRef.current?.play().catch(() => {});
    });

    socket.on("call-accepted", async ({ answer }) => {
      await pcRef.current?.setRemoteDescription(answer);
      ringRef.current?.pause();
      setInCall(true);
    });

    socket.on("ice-candidate", (candidate) => {
      pcRef.current?.addIceCandidate(candidate);
    });

    socket.on("call-ended", cleanup);

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, []);

  /* ============ ACTIONS ============ */

  const startCall = async () => {
    if (!selectedUser) return;

    const pc = createPeer(null as any);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", {
      to: selectedUser._id, // ✅ USER ID
      offer,
    });
  };

  const acceptCall = async () => {
    if (!incoming) return;

    const pc = createPeer(incoming.fromSocketId);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    await pc.setRemoteDescription(incoming.offer);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer-call", {
      toSocketId: incoming.fromSocketId,
      answer,
    });

    ringRef.current?.pause();
    setIncoming(null);
    setInCall(true);
  };

  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ringRef.current?.pause();
    setIncoming(null);
    setInCall(false);
    setMuted(false);
  };

  const rejectCall = () => {
    socket.emit("end-call", { toUserId: selectedUser?._id });
    cleanup();
  };

  const endCall = () => {
    socket.emit("end-call", { toUserId: selectedUser?._id });
    cleanup();
  };

  const toggleMute = () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  };

  if (!isOpen || !selectedUser) return null;

  return (
    <div className="fixed right-4 bottom-4 w-96 h-[550px] bg-white rounded-xl shadow-xl flex flex-col z-50">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 shadow-lg ">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor: getAvatarColor(selectedUser.name) }}
          >
            {selectedUser.name[0]}
          </div>
          <div>
            <div className="font-semibold">{selectedUser.name}</div>
            <div className="text-xs text-gray-400">
              {inCall ? "In call…" : isOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {!inCall && isOnline && (
            <button onClick={startCall} className="p-2 bg-green-600 text-white rounded-full">
              <Phone size={16} />
            </button>
          )}

          {inCall && (
            <>
              <button onClick={toggleMute} className="p-2 bg-gray-200 rounded-full">
                <MicrophoneSlash size={16} />
              </button>
              <button onClick={endCall} className="p-2 bg-red-600 text-white rounded-full">
                <PhoneDisconnect size={16} />
              </button>
            </>
          )}

          <button onClick={() => dispatch(closeChat())}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>

      {/* INCOMING UI */}
      {incoming && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl">
            <p className="mb-3 font-semibold">📞 Incoming Call</p>
            <div className="flex gap-3">
              <button onClick={acceptCall} className="bg-green-600 text-white px-4 py-1 rounded">Accept</button>
              <button onClick={rejectCall} className="bg-red-600 text-white px-4 py-1 rounded">Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;
