"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";

interface Opp {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category?: string;
  deadline?: string;
  createdAt: string;
}

export default function OpenProjectsList() {
  const [projects, setProjects] = useState<Opp[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/client-projects?status=open");
      if (res.ok) {
        const data = await res.json();
        // API returns an array of projects
        setProjects(Array.isArray(data) ? data : data.projects || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // fetch ids of projects the current user already applied to
  const fetchAppliedIds = async () => {
    try {
      const res = await fetch("/api/applications/mine");
      if (res.ok) {
        const data = await res.json();
        const ids: string[] = data?.appliedProjectIds || [];
        setAppliedIds(new Set(ids));
      }
    } catch (err) {
      console.error("Failed to fetch applied projects", err);
    }
  };

  useEffect(() => {
    (() => {
      fetchProjects();
      fetchAppliedIds();
    })();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="mt-8 max-w-7xl mx-auto">
      <div className=" p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Open Projects
        </h2>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="text-gray-500">No open projects found.</div>
          ) : (
            projects.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-lg shadow p-6 max-w-xl"
              >
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{p.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="text-xs text-gray-400 mt-2">
                      {p.category} • Budget: {p.budget} Birr
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="text-sm text-gray-500">
                      Posted {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                    {appliedIds.has(p._id) ? (
                      <div className="text-sm text-gray-600 font-medium">
                        Applied
                      </div>
                    ) : (
                      <Link
                        href={`/designers/project/${p._id}`}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        View / Apply
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
