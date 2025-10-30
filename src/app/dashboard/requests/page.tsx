"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";

interface ProjectRequest {
  _id: string;
  clientId: {
    name: string;
    email: string;
  };
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
}

export default function RequestsDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    fetchProjectRequests();
  }, [session, status, router]);

  const fetchProjectRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects/requests");
      if (response.ok) {
        const data = await response.json();
        setProjectRequests(data);
      }
    } catch (error) {
      console.error("Error fetching project requests:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Creative Link
          </Link>
          <nav className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Incoming Project Requests
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your incoming project requests
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {projectRequests.length > 0 ? (
            projectRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-md p-6 "
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {request.title}
                </h2>
                <p className="mt-2 text-gray-600">{request.description}</p>
                <p className="mt-2 text-gray-500">Budget: ${request.budget}</p>
                <p className="mt-2 text-gray-500"></p>
                <p className="mt-2 text-gray-500">
                  Client: {request.clientId.name}
                </p>
                <p className="mt-2 text-gray-500">
                    Date: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-gray-500">
                  Email:{" "}
                  <a
                    href={`mailto:${request.clientId?.email}`}
                    className=" text-indigo-600 hover:underline"
                  >
                    {request.clientId?.email}
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No incoming requests.</p>
          )}
        </div>
      </main>
    </div>
  );
}
