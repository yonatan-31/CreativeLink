"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { sl } from "zod/locales";

export default function FeaturedDesigners() {
  const [designers, setDesigners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/designers/featured?size=6");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (mounted) setDesigners(data || []);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFeatured();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <div className="py-8 text-center text-gray-500">Loading featured designers…</div>
    );

  if (error)
    return <div className="py-8 text-center text-red-500">{error}</div>;

  if (!designers.length)
    return (
      <div className="py-8 text-center text-gray-500">No featured designers found</div>
    );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Featured Designs</h2>
        <Link href="/designers" className="text-sm text-indigo-600 hover:underline">Browse all</Link>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {designers.map((d) => {
          const name = d.user?.name || d.title || "Designer";
          const slug = d.user?._id;
          const key = d.user?._id + Math.random();
          const cover = d.portfolio ? d.portfolio.url : "/bg-home.jpg";

          return (
            <article key={key} className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-44 w-full bg-gray-100 overflow-hidden">
                <img src={cover} alt={name} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {d.user?.avatarUrl ? (
                      <img src={d.user.avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">{(name || "?").charAt(0)}</div>
                    )}

                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{name}</h3>
                      <p className="text-xs text-gray-500">{d.title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold text-indigo-600">Birr{d.rate ?? "—"}/hr</div>
                    <div className="text-xs text-gray-400">{d.reviewsCount ?? 0} reviews</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {(d.skills || []).slice(0, 4).map((s: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">{s}</span>
                    ))}
                  </div>

                  <Link href={`/designers/${slug}`} className="inline-flex items-center gap-2 text-indigo-600 text-sm font-medium hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
