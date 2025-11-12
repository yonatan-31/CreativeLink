"use client";

import { useRouter } from "next/navigation";

interface MessageButtonProps {
  designerId?: string;
  clientId?: string;
}

export default function MessageButton({ designerId, clientId }: MessageButtonProps) {
  const router = useRouter();

  // Decide which URL to navigate to
  const url = designerId
    ? `/messages?designerId=${designerId}`
    : clientId
    ? `/messages?clientId=${clientId}`
    : "#";

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
