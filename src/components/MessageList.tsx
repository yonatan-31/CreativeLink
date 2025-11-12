"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

interface ConversationCard {
  _id: string;
  lastMessage: string;
  updatedAt: string;
  otherParticipant: { _id: string; name: string; avatarUrl?: string };
  unread: boolean;
}

export default function MessageList() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) return;
    fetchConversations();
  }, [status, session]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <Loader />;
  if (!session) return null;

  return (
    <div className="space-y-3">
      {conversations.length === 0 ? (
        <div className="text-gray-500">You have no conversations yet.</div>
      ) : (
        conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => {
             router.push(`/messages?conversationId=${c._id}`);
            }}
            className="w-full text-left bg-white p-4 rounded-lg shadow-sm hover:shadow-md flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {c.otherParticipant?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.otherParticipant.avatarUrl} alt={c.otherParticipant.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-indigo-600 font-semibold">{c.otherParticipant.name?.[0] || "U"}</div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="font-medium text-gray-900">{c.otherParticipant.name}</div>
                <div className="text-xs text-gray-400">{new Date(c.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="text-sm text-gray-600 truncate">{c.lastMessage || "No messages yet"}</div>
            </div>

            {c.unread && (
              <div className="ml-2">
                <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-red-600 text-white text-xs">New</span>
              </div>
            )}
          </button>
        ))
      )}
    </div>
  );
}
