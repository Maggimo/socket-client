import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// const socket = io("https://magchat-back.onrender.com");
const socket = io("http://localhost:3000");

interface ChatMessage {
  text: string;
  userName: string;
  isMine: boolean;
}

interface QueryParams {
  name: string;
  room: string;
  password?: string;
}

export const ChatRoom = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState<QueryParams>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [userCount, setUserCount] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const searchParams = Object.fromEntries(
      new URLSearchParams(search),
    ) as unknown as QueryParams;
    setParams(searchParams);
    socket.emit("join", {
      userName: searchParams.name,
      roomName: searchParams.room,
      password: searchParams.password || "",
    });

    return () => {
      socket.emit("leave", {
        userName: searchParams.name,
        roomName: searchParams.room,
      });
    };
  }, [search]);

  useEffect(() => {
    socket.on("getUsersCount", ({ data }) => {
      setUserCount(data.usersCount);
    });
    return () => {
      socket.off("getUsersCount");
    };
  }, []);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setMessages((prev) => [
        ...prev,
        {
          text: data.message,
          userName: data.userName,
          isMine: data.userName === params?.name,
        },
      ]);
    });
    return () => {
      socket.off("message");
    };
  }, [params?.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const leftRoom = () => {
    socket.emit("leave", { params });
    navigate("/");
  };

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const formSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("sendMessage", {
      userName: params?.name,
      roomName: params?.room,
      message,
    });
    setMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="mx-auto max-w-2xl h-screen flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-300 bg-white/70 backdrop-blur sticky top-0">
          <div className="font-semibold text-slate-800">
            Room: {params?.room || "-"}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">online: {userCount}</div>
            <button
              onClick={leftRoom}
              className="text-sm px-3 py-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700"
            >
              Leave
            </button>
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {messages.map((m, i) => {
            const isMine = m.isMine;
            const isAdmin = m.userName === "Admin";
            if (isAdmin) {
              return (
                <div key={i} className="w-full flex justify-center">
                  <div className="text-xs text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full">
                    {m.text}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={i}
                className={`w-full flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                  }`}
                >
                  {!isMine && m.userName && (
                    <div className="text-[10px] text-slate-400 mb-0.5">
                      {m.userName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        {/* Input */}
        <form
          onSubmit={formSubmit}
          className="px-3 py-3 border-t border-slate-300 bg-white/80 backdrop-blur sticky bottom-0"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="message"
              value={message}
              placeholder="Type a message"
              className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              onChange={inputChangeHandler}
              autoComplete="off"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={!message.trim()}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
