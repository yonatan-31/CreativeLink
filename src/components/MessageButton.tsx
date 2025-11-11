"use client";

import { useRouter } from "next/navigation";

interface MessageButtonProps {
  designerId?: string;
  projectId?: string;
  clientId?: string;
}

export default function MessageButton({ designerId, projectId, clientId }: MessageButtonProps) {
  const router = useRouter();

  // Decide which URL to navigate to
  const url = designerId
    ? `/messages?designerId=${designerId}`
    : projectId
    ? `/messages?projectId=${projectId}`
    : clientId
    ? `/messages?clientId=${clientId}`
    : "#"; // fallback

  // Decide button text
  const text = designerId ? "Message Designer" : "Message Client";

  return (
    <button
      onClick={() => router.push(url)}
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
    >
      {text}
    </button>
  );
}
