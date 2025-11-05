import { CheckCircleIcon, Search, StarIcon, UserIcon } from "lucide-react";
import { MessageCircleMore, FolderOpenDot } from "lucide-react";
import type { ReactNode } from "react";

export interface Card {
  title: string;
  link: string;
  description: string;
  icon: ReactNode;
  color: string;
}

// Designer-specific cards
export const designerCards: Card[] = [
  {
    title: "Designer Profile",
    link: "/dashboard/freelancer",
    description: "Manage your profile",
    icon: <UserIcon className="w-5 h-5 text-white" />,
    color: "bg-indigo-500",
  },
  {
    title: "Project Requests",
    link: "/dashboard/requests",
    description: "View incoming requests",
    icon: <CheckCircleIcon className="w-5 h-5 text-white" />,
    color: "bg-green-500",
  },
  {
    title: "Reviews",
    link: "/dashboard/reviews",
    description: "View your ratings",
    icon: <StarIcon className="w-5 h-5 text-white" />,
    color: "bg-yellow-500",
  },
    {
    title: "Messages",
    link: "/dashboard/messagesList",
    description: "View your messages",
    icon: <MessageCircleMore className="text-white" size={20} />,
    color: "bg-green-500",
  }
];

// Client/other cards
export const clientCards: Card[] = [
  {
    title: "Find Designers",
    link: "/designers",
    description: "Browse designers",
    icon: <Search className="text-white" size={20} />,
    color: "bg-indigo-500",
  },
  {
    title: "Messages",
    link: "/dashboard/messagesList",
    description: "View your messages",
    icon: <MessageCircleMore className="text-white" size={20} />,
    color: "bg-green-500",
  },
  {
    title: "Projects",
    link: "/dashboard/client",
    description: "Manage your projects",
    icon: <FolderOpenDot className="text-white" size={20} />,
    color: "bg-yellow-500",
  },
];
