import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";
import { useGetMessagesQuery } from "../redux/features/chat/chatApi";
import { useAppSelector } from "../redux/app/hook";
import type { Message } from "../redux/features/chat/chatType";
import ChatInput from "./ChatInput";

const FILE_BASE_URL = "http://localhost:5000"; // 🔥 IMPORTANT

const MessageList = () => {
  const { conversationId } = useAppSelector((s) => s.chat);
  const { user } = useAppSelector((s) => s.login);

  const { data } = useGetMessagesQuery(conversationId!, {
    skip: !conversationId,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* JOIN ROOM */
  useEffect(() => {
    if (!conversationId) return;
    socket.emit("join-chat", conversationId);
  }, [conversationId]);

  /* LOAD API */
  useEffect(() => {
    if (data) setMessages(data);
  }, [data]);

  /* SOCKET RECEIVE */
  useEffect(() => {
    if (!conversationId) return;

    const handler = (msg: Message) => {
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) =>
        prev.some((m) => m._id === msg._id) ? prev : [...prev, msg],
      );
    };

    socket.on("message-received", handler);
    return () => {
      socket.off("message-received", handler);
    };
  }, [conversationId]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.sender._id === user?._id;

          return (
            <div
              key={msg._id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-sm
                ${
                  isMine
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {/* TEXT */}
                {msg.text && (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}

                {/* 🔥 FILE / IMAGE */}
                {msg.file && (
                  <div className={msg.text ? "mt-2" : ""}>
                    {msg.file.type.startsWith("image/") ? (
                      <img
                        src={
                          msg.file.url.startsWith("blob:")
                            ? msg.file.url
                            : `${FILE_BASE_URL}${msg.file.url}`
                        }
                        alt={msg.file.name}
                        className="max-w-[220px] rounded-lg "
                      />
                    ) : (
                      <a
                        href={
                          msg.file.url.startsWith("blob:")
                            ? msg.file.url
                            : `${FILE_BASE_URL}${msg.file.url}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="underline text-sm"
                      >
                        📎 {msg.file.name}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <ChatInput onLocalMessage={(m) => setMessages((p) => [...p, m])} />
    </div>
  );
};

export default MessageList;
