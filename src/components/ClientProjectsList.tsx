"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
// simple polling implementation (no extra deps)

interface Opp {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category?: string;
  deadline?: string;
  status: string;
  createdAt: string;
}

export default function ClientProjectsList({
  onCountChange,
}: {
  onCountChange?: (count: number) => void;
}) {
  const [projects, setProjects] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client-projects?mine=true");
      if (res.ok) {
        const data = await res.json();
        const list: Opp[] = Array.isArray(data) ? data : data?.projects || [];
        setProjects(list);
        if (onCountChange) onCountChange(list.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  }, [onCountChange]);

  useEffect(() => {
    let mounted = true;
    const onCreated = () => {
      if (mounted) fetchMyProjects();
    };
    fetchMyProjects();
    window.addEventListener(
      "clientProject:created",
      onCreated as EventListener
    );

    return () => {
      mounted = false;
      window.removeEventListener(
        "clientProject:created",
        onCreated as EventListener
      );
    };
  }, [fetchMyProjects]);

  if (loading) return <div>Loading your projects...</div>;

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="text-gray-500">
          You haven&apos;t posted any projects yet.
        </div>
      ) : (
        projects.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{p.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  {p.category} • Budget: {p.budget}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="text-sm text-gray-500">Status: {p.status}</div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/client/projects/${p._id}/applications`}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    View applications
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
