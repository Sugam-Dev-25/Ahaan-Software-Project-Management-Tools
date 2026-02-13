import { useState } from "react";
import { socket } from "../services/socket";
import { useSendMessageMutation } from "../redux/features/chat/chatApi";
import { useAppSelector } from "../redux/app/hook";
import type { Message } from "../redux/features/chat/chatType";
import { Paperclip } from "@phosphor-icons/react";


const MAX_SIZE = 3 * 1024 * 1024; // 3MB

const ChatInput = ({
  onLocalMessage,
}: {
  onLocalMessage: (m: Message) => void;
}) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { conversationId } = useAppSelector((s) => s.chat);
  const { user } = useAppSelector((s) => s.login);
  const [sendMessage] = useSendMessageMutation();

  /* FILE SELECT */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE) {
      alert("❌ File must be less than 3MB");
      e.target.value = "";
      return;
    }

    setFile(selected);
  };

  /* SEND MESSAGE */
  const handleSend = async () => {
    if (!conversationId || (!text.trim() && !file) || !user) return;

    // 🔥 OPTIMISTIC MESSAGE
    const optimistic: Message = {
      _id: crypto.randomUUID(),
      conversationId,
      text,
      sender: {
        _id: user._id,
        name: user.name,
      },
      createdAt: new Date().toISOString(),
      seen: false,
      file: file
        ? {
            name: file.name,
            url: URL.createObjectURL(file), // 🔥 PREVIEW
            type: file.type,
            size: file.size,
          }
        : undefined,
    };

    onLocalMessage(optimistic);
    setText("");
    setFile(null);

    try {
      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("text", text || "");
      if (file) formData.append("file", file);

      const saved = await sendMessage(formData as any).unwrap();

      socket.emit("new-message", {
        chatId: conversationId,
        message: saved,
      });
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  return (
    <div className="bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">

      {/* 🔥 FILE PREVIEW */}
      {file && (
        <div className="flex items-center gap-3 mb-2">
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              className="w-16 h-16 object-cover rounded-lg border"
            />
          ) : (
            <span className="text-sm">📎 {file.name}</span>
          )}

          <button
            onClick={() => setFile(null)}
            className="text-xs text-red-500"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="file"
          id="fileUpload"
          onChange={handleFile}
          className="hidden"
        />

<label
  htmlFor="fileUpload"
  className="cursor-pointer flex items-center justify-center text-gray-500 hover:text-black transition"
>
  <Paperclip size={22} weight="bold" color="#000" />
</label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border rounded-full px-4 py-2 text-sm"
        />

        <button
          onClick={handleSend}
          className="bg-black text-white px-4 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
