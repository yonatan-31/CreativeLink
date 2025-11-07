"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardCards from "@/components/DashboardCards";
import { designerCards, clientCards, Card } from "@/data/DashboardCardsData";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const userRole = (session.user as { role?: string })?.role || "client";
  const cardsToShow: Card[] =
    userRole === "designer" ? designerCards : clientCards;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="max-w-7xl pt-24 pb-6 sm:px-6 lg:px-8 mx-auto">
        <div className="px-4 py-6 sm:px-0 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to your Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            You are logged in as a{" "}
            <span className="font-semibold text-indigo-600">{userRole}</span>
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
            {cardsToShow.map((card) => (
              <DashboardCards key={card.title} {...card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
