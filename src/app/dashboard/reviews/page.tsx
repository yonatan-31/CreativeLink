"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Image from "next/image";

interface Review {
  _id: string;
  clientId: { name: string; avatarUrl?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function DesignerReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const designerId = session?.user?.id;
      if (!designerId) return;
      const res = await fetch(`/api/reviews?designerId=${designerId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data || []);
      } else {
        console.error("Failed to load reviews");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  if (status === "loading" || loading) return <Loader />;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Your ratings</h2>
              <p className="text-sm text-gray-500">
                Average rating and recent reviews from clients.
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">
                {avgRating ? avgRating.toFixed(1) : "—"}
              </div>
              <div className="text-sm text-gray-500">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
              No reviews yet.
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {r.clientId?.avatarUrl ? (
                          <Image
                            src={r.clientId.avatarUrl}
                            alt={r.clientId.name || "Client Avatar"}
                            width={40} // same as h-10
                            height={40}
                            className="rounded-full object-cover"
                            unoptimized // optional: keep if URL is external and you don't want Next.js optimization
                          />
                        ) : (
                          r.clientId?.name?.[0] || "U"
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {r.clientId?.name || "Client"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="flex items-center justify-end">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < r.rating ? "text-yellow-400" : "text-gray-300"
                          } text-xl`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {r.comment && (
                  <div className="mt-3 text-gray-700">{r.comment}</div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
