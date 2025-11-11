"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import ApplicationCard from "@/components/ApplicationCard";

interface Project {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  budget?: number;
  clientId?: string;
}

interface AppItem {
  _id: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  clientProjectId?: Project | null;
}

export default function Page() {
  const [apps, setApps] = useState<AppItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications/mine-details");
      if (res.ok) {
        const data = await res.json();
        setApps(data || []);
      } else {
        setApps([]);
      }
    } catch (err) {
      console.error(err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemoved = (id: string) => {
    setApps((s) => (s ? s.filter((a) => a._id !== id) : s));
  };

  const handleUpdated = (updated: AppItem) => {
    setApps((s) =>
      s ? s.map((a) => (a._id === updated._id ? updated : a)) : s
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  if (!apps || apps.length === 0)
    return (
      <div className="min-h-screen p-6">
        <div className="bg-white p-6 rounded shadow text-center text-gray-600">
          You haven't applied to any projects yet.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Projects you applied to</h1>
        <p className="text-sm text-gray-500 mb-6">
          A list of client projects you've applied to. Track status and follow
          up.
        </p>
        <div className="space-y-4">
          {apps.map(
            (a) => (
              (
                <ApplicationCard
                  key={a._id}
                  app={a}
                  onRemoved={() => handleRemoved(a._id)}
                  onUpdated={handleUpdated}
                />
              )
            )
          )}
        </div>
      </main>
    </div>
  );
}
