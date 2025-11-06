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

  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  const updateRequestStatus = async (id: string, status: string) => {
    if (updatingIds.includes(id)) return;
    setUpdatingIds((s) => [...s, id]);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to update status");
      }
      // update local list to reflect new status
      setProjectRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error updating request status:", err);
      alert((err as any)?.message || "Failed to update status");
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  const requestReview = async (projectId: string) => {
    try {
      const res = await fetch(`/api/reviews/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to request review");
      }
      alert("Review requested successfully");
    } catch (error) {
      console.error("Error requesting review:", error);
      alert((error as any)?.message || "Failed to request review");
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
                className="bg-white rounded-2xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {request.title}
                </h2>
                <p className="mt-2 text-gray-600">{request.description}</p>
                <p className="mt-2 text-gray-500">Budget: ${request.budget}</p>
                <p className="mt-2 text-gray-500">
                  Client: {request.clientId?.name}
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

                {/* Actions for designer */}
                <div className="mt-4 flex items-center justify-end gap-2">
                  {request.status === "pending" && (
                    <>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Accept this project request and notify the client?"
                            )
                          )
                            updateRequestStatus(request._id, "accepted");
                        }}
                        disabled={updatingIds.includes(request._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingIds.includes(request._id)
                          ? "Processing..."
                          : "Accept"}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Decline this project request?"))
                            updateRequestStatus(request._id, "declined");
                        }}
                        disabled={updatingIds.includes(request._id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 disabled:opacity-50"
                      >
                        {updatingIds.includes(request._id)
                          ? "Processing..."
                          : "Decline"}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/messages?projectId=${request._id}`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Message Client
                  </button>

                  {request.status === "accepted" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (confirm("Mark this project as completed?"))
                            updateRequestStatus(request._id, "completed");
                        }}
                        disabled={updatingIds.includes(request._id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {updatingIds.includes(request._id)
                          ? "Processing..."
                          : "Mark Completed"}
                      </button>
                    </div>
                  )}

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : request.status === "declined"
                        ? "bg-red-100 text-red-800"
                        : request.status === "completed"
                        ? "bg-green-800 text-white"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
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
