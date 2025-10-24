"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import DashboardCards from "@/components/DashboardCards";
import { designerCards, clientCards, Card } from "@/data/DashboardCardsData";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/auth/signin");
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  const userRole = (session.user as { role?: string })?.role || "client";
  const cardsToShow: Card[] = userRole === "designer" ? designerCards : clientCards;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            <Link href="/" className="text-2xl font-bold text-indigo-600">Creative Link</Link>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-gray-700">
                Welcome, {session.user?.name}
              </span>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-500 hover:text-gray-700">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl pt-24 py-6 sm:px-6 lg:px-8 mx-auto">
        <div className="px-4 py-6 sm:px-0 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to your Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            You are logged in as a <span className="font-semibold text-indigo-600">{userRole}</span>
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
