"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/Loader";

interface ProjectRequest {
  _id: string;
  designerId: {
    _id: string;
    name: string;
  };
  title: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  reviewed: boolean;
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewById, setShowReviewById] = useState<Record<string, boolean>>(
    {}
  );
  const [ratingById, setRatingById] = useState<Record<string, number>>({});
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [submittingIds, setSubmittingIds] = useState<string[]>([]);

  console.log("Project Requests:", projectRequests);
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
      const response = await fetch("/api/projects/client-requests");
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

  const toggleReview = (projectId: string) => {
    setShowReviewById((s) => ({ ...s, [projectId]: !s[projectId] }));
  };

  const setRatingFor = (projectId: string, rating: number) => {
    setRatingById((s) => ({ ...s, [projectId]: rating }));
  };

  const setCommentFor = (projectId: string, comment: string) => {
    setCommentById((s) => ({ ...s, [projectId]: comment }));
  };

  const submitReview = async (projectId: string) => {
    if (submittingIds.includes(projectId)) return;
    const rating = ratingById[projectId] || 0;
    const comment = commentById[projectId] || "";
    if (rating <= 0) {
      alert("Please select a star rating");
      return;
    }

    setSubmittingIds((s) => [...s, projectId]);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, rating, comment }),
      });
      if (res.ok) {
        alert("Review submitted");
        // close form and refresh
        setShowReviewById((s) => ({ ...s, [projectId]: false }));
        // clear rating/comment
        setRatingById((s) => ({ ...s, [projectId]: 0 }));
        setCommentById((s) => ({ ...s, [projectId]: "" }));

        await fetchProjectRequests();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.message || "Failed to submit review");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setSubmittingIds((s) => s.filter((id) => id !== projectId));
    }
  };

  if (status === "loading" || loading) {
    return <Loader />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Client Dashboard
            </h1>
            <p className="mt-2 text-gray-600">Manage your project requests</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/designers"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors block text-center"
                  >
                    Find Designers
                  </Link>
                  <Link
                    href="/dashboard/messagesList"
                    className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors block text-center"
                  >
                    View Messages
                  </Link>
                </div>
              </div>
            </div>

            {/* Project Requests */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Your Project Requests
                </h2>

                {projectRequests.length > 0 ? (
                  <div className="space-y-4">
                    {projectRequests.map((request) => (
                      <div key={request._id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {request.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : request.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {request.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-gray-500">
                            <p>Designer: {request.designerId.name}</p>
                            <p>Budget: Birr {request.budget}</p>
                            <p>
                              Sent:{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {request.status === "accepted" && (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/messages?projectId=${request._id}`
                                  )
                                }
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Message Designer
                              </button>
                            )}
                            {request.status === "completed" &&
                              !request.reviewed && (
                                <button
                                  onClick={() => toggleReview(request._id)}
                                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
                                >
                                  Leave Review
                                </button>
                              )}
                          </div>
                        </div>

                        {showReviewById[request._id] && (
                          <div className="mt-3 bg-white p-4 rounded-lg shadow-lg">
                            <h4 className="font-medium mb-2">
                              Leave a review for {request.designerId.name}
                            </h4>
                            <div className="flex items-center gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setRatingFor(request._id, n)}
                                  className={`text-2xl ${
                                    ratingById[request._id] >= n
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  aria-label={`${n} star`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>

                            <textarea
                              value={commentById[request._id] || ""}
                              onChange={(e) =>
                                setCommentFor(request._id, e.target.value)
                              }
                              className="w-full border rounded-md p-2 mb-3 outline-none focus:ring-1 focus:ring-indigo-400"
                              placeholder="Write a short review..."
                              rows={3}
                            />

                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() =>
                                  setShowReviewById((s) => ({
                                    ...s,
                                    [request._id]: false,
                                  }))
                                }
                                className="px-3 py-1 border rounded-md hover:bg-gray-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => submitReview(request._id)}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                                disabled={submittingIds.includes(request._id)}
                              >
                                {submittingIds.includes(request._id)
                                  ? "Sending..."
                                  : "Submit Review"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      No project requests yet.
                    </p>
                    <Link
                      href="/designers"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Find Designers
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
