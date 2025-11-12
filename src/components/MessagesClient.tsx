"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

interface Message {
  _id: string;
  sender: { _id: string; name: string; avatarUrl?: string };
  text: string;
  createdAt: string;
}

export default function MessagesPage() {
  const search = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const conversation_id = search.get("conversationId");
  const clientId = search.get("clientId");
  const designerId = search.get("designerId");


  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
      // create or get conversation
      (async () => {
        setLoading(true);
        try {
          const q = new URLSearchParams();
          if (conversation_id) {
              setConversationId(conversation_id);
              fetchMessages(conversation_id);
              startPolling(conversation_id);
    
          } else if (designerId) {
            q.set("designerId", designerId);
            const res = await fetch(
              `/api/messages/conversation?${q.toString()}`
            );
            if (res.ok) {
              const data = await res.json();
              setConversationId(data.conversationId);
              fetchMessages(data.conversationId);
              startPolling(data.conversationId);
            } else {
              console.error("Failed to get/create conversation");
            }
          }else if (clientId) {
            q.set("clientId", clientId);
            const res = await fetch(
              `/api/messages/conversation?${q.toString()}`
            );
            if (res.ok) {
              const data = await res.json();
              setConversationId(data.conversationId);
              fetchMessages(data.conversationId);
              startPolling(data.conversationId);
            }
          }else {
            console.error("projectId or designerId required");
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    

    return () => stopPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  const startPolling = (convoId: string) => {
    stopPolling();
    // poll every 3s
    pollingRef.current = window.setInterval(() => fetchMessages(convoId), 3000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const fetchMessages = async (convoId: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${convoId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
        // scroll to bottom
        setTimeout(() => {
          if (listRef.current)
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }, 50);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!conversationId || !text.trim()) return;
    const payload = { conversationId, text: text.trim() };
    try {
      const res = await fetch(`/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const newMsg = await res.json();
        setMessages((s) => [...s, newMsg]);
        setText("");
        setTimeout(() => {
          if (listRef.current)
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }, 50);
      } else {
        console.error("Failed to send message");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md h-[70vh] flex flex-col overflow-hidden">
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                No messages yet. Say hello 👋
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${
                    m.sender._id === session?.user?.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      m.sender._id === session?.user?.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">
                      {m.sender.name}
                    </div>
                    <div>{m.text}</div>
                    <div className="text-xs text-gray-400 mt-1 text-right">
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t p-3">
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Write a message..."
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
